import { createProcessor, ROOT, SERVICES } from './processor'
import { getRootProcessor } from './root'

export function getServicesProcessor(processor) {
    if (processor)
        processor.dispose()

    let eventHandle = extFs.registerServiceEvents(n => {
        console.log("Service event", n)
    })

    let sortIndex = null
    let sortDescending = false

    function getProcessor(path) { 
        return path == SERVICES ? null : createProcessor(thisProcessor, path)
    }

    function dispose() {
        if (eventHandle) {
            console.log("Unregistering Service events")
            extFs.unregisterServiceEvents(eventHandle)
        }
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
        const items = [{ name: "..", status: 0, displayName: "" }].concat(extFs.getServices())
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
            newProcessor: getRootProcessor(thisProcessor),
            path: ROOT
        }
    }    

    var thisProcessor = {
        name: "services",
        path: SERVICES,
        getProcessor,
        dispose,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        getItemWithPath,
        onAction
    }
    return thisProcessor
}

