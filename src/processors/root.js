import { getDirectoryProcessor } from './directory'
export const name = "root"

export function getRootProcessor() {
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
                        name: "Beschreibung"
                    }, {
                        isSortable: true,
                        name: "Größe"
                    }
                ]
            }
    }

    async function getItems() {
        const items = (await extFs.getDrives()).filter(n => n.isMounted)
        return refresh(items)
    }
    function sort(items, index, descending) {
        sortIndex = index
        sortDescending = descending
        return refresh(items)
    }
    function refresh(items) {
        if (sortIndex != null) {
            const sort = 
            sortIndex == 0 
                    ? (a, b) => a.name.localeCompare(b.name) :
                    sortIndex == 1 
                    ? (a, b) => a.description.localeCompare(b.description)
                    : (a, b) => a.size - b.size
                    
            return items.sort((a, b) => (sortDescending ? -1 : 1) * sort(a, b))
        }
        else 
            return items
    }    

    function onAction(item) {
        return {
            done: false,
            newProcessor: getDirectoryProcessor(), 
            path: item.name
        }
    }        

    return {
        name,
        path: name,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        onAction
    }
}