import { getNameOnly, getExtension } from '../pipes'

export function getDirectoryProcessor() {
    let sortIndex = null
    let sortDescending = false

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
        return refresh(values)
    }
    function refresh(values) {
        let dirs = values.filter(n => n.isDirectory)
        let files = values.filter(n => !n.isDirectory)
        if (sortIndex != null) {
            const sort = 
                sortIndex == 0 
                ? (a, b) => getNameOnly(a.name).localeCompare(getNameOnly(b.name)) :
                sortIndex == 1 
                ? (a, b) => getExtension(a.name).localeCompare(getExtension(b.name)) :
                sortIndex == 2
                ? (a, b) => a.time - b.time 
                : (a, b) => a.size - b.size
    
            files = files.sort((a, b) => (sortDescending ? -1 : 1) * sort(a, b))
        }
        
        if (dirs.length == 0 || dirs[0].name != "..")
            dirs = [ {name: "..", isDirectory: true, isRoot: true  }].concat(dirs)
        const items = dirs.concat(files)

        console.log(items)
//        if (result.length > 0) {
            // if (recentPath) {
            //     const recentItem = result.find(n => n.name == recentPath)
            //     if (recentItem)
            //         recentItem.isCurrent = true
            //     else
            //         result[0].isCurrent = true
            // }
            // else
//                result[0].isCurrent = true
        return items
    }
    function sort(items, index, descending) {
        sortIndex = index
        sortDescending = descending
        return refresh(items)
    }

    function onAction(item) {
        return {
            done: false,
            newProcessor: null,
            path: item.name
        }
    }        

    return {
        name: "directory",
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        onAction
    }
}