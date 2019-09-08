import { createProcessor, ROOT, SERVICES } from './processor'
import { getRootProcessor } from './root'

export const SERVICES_NAME = "Dienste"

export function getServicesProcessor(processor) {
    if (processor)
        processor.dispose()

    let sortIndex = null
    let sortDescending = false
    let items = []
    let eventHandle = extFs.registerServiceEvents(changedServices => {
        changedServices.forEach(n => {
            let item = items.find(i => i.name == n.name)
            item.status = n.status
        })
    })

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
        items = [{ name: "..", status: 0, displayName: "", isDirectory: true }].concat(extFs.getServices())
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

    function onAction(items) {
        if (items.length == 1 && items[0].name == "..")
            return {
                done: false,
                newProcessor: createProcessor(thisProcessor, ROOT),
                path: ROOT,
                lastPath: SERVICES_NAME
            }
        else {
            items.forEach(n => extFs.startService(n.name))
            return { done: true }
        }
    }    

    function canDelete() { return true }

    async function deleteItems(folder, dialog, selectedItems) {
        selectedItems.forEach(n => extFs.stopService(n.name))
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
        onAction,
        canDelete,
        deleteItems
    }
    return thisProcessor
}

