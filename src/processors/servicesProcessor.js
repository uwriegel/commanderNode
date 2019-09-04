import { createProcessor, ROOT, SERVICES } from './processor'
import { getRootProcessor } from './root'

export function getServicesProcessor() {
    // TODO: Icon
    let sortIndex = null
    let services = null
    let sortDescending = false

    function getProcessor(path) { 
        return path == SERVICES ? null : createProcessor(path)
    }

    function checkPath(path) { return path == SERVICES }

    function getColumns(columns) {
        return columns && columns.type == SERVICES
            ? columns
            : {
                type: SERVICES,
                values: [{
                        isSortable: true,
                        name: "Name"
                    }, {
                        isSortable: true,
                        name: "Beschreibung"
                    }
                ]
            }
    }

    async function getItems() {
        services = new extFs.Services()
        const items = [{ name: "..", status: 0, displayName: "" }].concat(services.get())
        items.forEach(n => {
            n.isSelected = false
        })
        return refresh(items)
    }

    function sort(items, index, descending) {
        sortIndex = index
        sortDescending = descending
        return refresh(items)
    }

    function refresh(items) {
        let parent = items.filter(n => n.name == "..")
        let services = items.filter(n => n.name != "..")

        if (sortIndex != null) {
            const sort = 
            sortIndex == 0 
                    ? (a, b) => a.name.localeCompare(b.name) 
                    : (a, b) => a.displayName.localeCompare(b.displayName)
                    
            return parent.concat(services.sort((a, b) => (sortDescending ? -1 : 1) * sort(a, b)))
        }
        else 
            return items
    }    

    function getItemWithPath(path, item) { return item.name }

    function onAction(item) {
        if (item.name == "..")
        return {
            done: false,
            newProcessor: getRootProcessor(),
            path: ROOT
        }
    }    

    return {
        name: "services",
        path: SERVICES,
        getProcessor,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        getItemWithPath,
        onAction
    }
}

