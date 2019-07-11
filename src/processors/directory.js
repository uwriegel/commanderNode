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
            n.isExifDate = false
            n.version = ""
        })
        privates.path = path
        return refresh(values, true)
    }
    function refresh(values, withExtendedInfos) {
        let dirs = values.filter(n => n.isDirectory)
        let files = values.filter(n => !n.isDirectory)

        getExtendedInfos()

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

        async function getVersion(fileItem, file) {
            const version = await extFs.getFileVersion(file) 
            if (version.major != 0 || version.minor != 0 || version.build != 0 || version.patch != 0)
                fileItem.version = version
        }

        async function getExif(fileItem, file) {
            const exifDate = await extFs.getExifDate(file)
            if (exifDate) {
                fileItem.time = exifDate
                fileItem.isExifDate = true
            }
        }

        async function getExtendedInfos() {
            for (let i = 0; i < files.length; i++) {        
                const fileItem = files[i]
                const file = privates.path + '\\' + fileItem.name
                var checkName = fileItem.name.toLowerCase()
                if (checkName.endsWith(".exe") || checkName.endsWith(".dll")) {
                    await getVersion(fileItem, file)
                }
                else if (checkName.endsWith(".jpg")) {
                    await getExif(fileItem, file)
                }
            }
        }
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