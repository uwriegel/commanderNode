import { getNameOnly, getExtension } from '../pipes'
import { createProcessor } from './processor'
import { name as rootName } from './root'

export function getDirectoryProcessor() {
    let privates = {
        sortIndex: null,
        sortDescending: false,
        path: ""
    }

    function getProcessor(path) { 
        return path != rootName ? null : createProcessor(rootName)
    }

    function checkPath(path) { return path == name }

    function getColumns(columns) {
        return columns && columns.type == name
            ? columns
            : {
                type: name,
                values: [{
                        isSortable: true,
                        name: "Name"
                    }, {
                        isSortable: true,
                        name: "Erw."
                    }, {
                        isSortable: true,
                        name: "Datum"
                    }, {
                        isSortable: true,
                        name: "Größe"
                    }, {
                        isSortable: true,
                        name: "Version"
                    }
                ]
            }
    }

    async function getItems(path) {
        const values = (await extFs.getFiles(path))
        values.forEach(n => {
            n.isSelected = false
            n.isExif = false
            n.version = ""
        })
        privates.path = path
        return refresh(values)
    }
    function refresh(values) {
        let dirs = values.filter(n => n.isDirectory)
        let files = values.filter(n => !n.isDirectory)
        if (privates.sortIndex != null) {
            const sort = 
            privates.sortIndex == 0 
                ? (a, b) => getNameOnly(a.name).localeCompare(getNameOnly(b.name)) :
                privates.sortIndex == 1 
                ? (a, b) => getExtension(a.name).localeCompare(getExtension(b.name)) :
                privates.sortIndex == 2
                ? (a, b) => a.time - b.time 
                : (a, b) => a.size - b.size
    
            files = files.sort((a, b) => (privates.sortDescending ? -1 : 1) * sort(a, b))
        }
        
        if (dirs.length == 0 || dirs[0].name != "..")
            dirs = [ {name: "..", isDirectory: true, isRoot: true  }].concat(dirs)
        return dirs.concat(files)
    }
    function sort(items, index, descending) {
        privates.sortIndex = index
        privates.sortDescending = descending
        return refresh(items)
    }

    function onAction(item) {
        if (item.isDirectory) {
            const path = combinePath(privates.path, item.name)
            return path
                ? {
                    done: false,
                    newProcessor: null,
                    path: path,
                    lastPath: getDirectoryName(privates.path)
                }
                : {
                    done: false,
                    newProcessor: createProcessor(rootName),
                    path: rootName,
                    lastPath: getDirectoryName(privates.path)
                }
        }
    }        

    function getDirectoryName(path) {
        const pos = path.lastIndexOf('\\', path.length - 2)
        return pos != -1 ? path.substr(pos + 1) : path
    }

    function combinePath(path1, path2) {
        if (path2 == "..") {
            let pos = path1.lastIndexOf('\\', path1.length - 2)
            if (path1[pos - 1] == ':')
                pos += 1
            return pos != -1 ? path1.substr(0, pos) : null
        }
        return path1.endsWith('\\') ? path1 + path2 : path1 + '\\' + path2
    }

    return {
        name: "directory",
        get path() { return privates.path },
        getProcessor,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        onAction
    }
}