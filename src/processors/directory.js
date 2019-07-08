export function getDirectoryProcessor() {
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
        let dirs = values.filter(n => n.isDirectory)
        let files = values.filter(n => !n.isDirectory)
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
        const sort = 
            index == 0 
                ? (a, b) => a.name.localeCompare(b.name) :
            index == 1 
                ? (a, b) => a.description.localeCompare(b.description)
                : (a, b) => a.size - b.size
                
        return items.sort((a, b) => (descending ? -1 : 1) * sort(a, b))
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
        onAction
    }
}