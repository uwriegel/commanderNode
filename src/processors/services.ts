import { createProcessor, ROOT, SERVICES, Processor, FolderColumns, OnActionResult, FolderItem } from './processor'
import addon, { Service, ServiceStatus } from '../extensionFs'

export const SERVICES_NAME = "Dienste"

interface ServiceItem extends FolderItem, Service {} 

const processorName = "services"

export function getServicesProcessor(processor: Processor): Processor {
    if (processor) {
        if (processor.name == processorName)
            return processor
        processor.dispose()
    }

    // let sortIndex = null
    // let sortDescending = false
    let items: ServiceItem[] = []
    let eventHandle = addon.registerServiceEvents(changedServices => {
        changedServices.forEach(n => {
            let item = items.find(i => i.name == n.name)
            if (item)
                item.status = n.status
        })
    })

    function dispose() {
        if (eventHandle) {
            console.log("Unregistering Service events")
            addon.unregisterServiceEvents(eventHandle)
        }
    }

    function checkPath(path: string) { return path == SERVICES }

    function getColumns(columns: FolderColumns) {
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
    async function getItems(_?: string, __?: boolean) {
        items = [{ name: "..", displayName: "", isDirectory: true, status: ServiceStatus.DEFAULT } as Service]
                    .concat(await addon.getServices())
                    .map((n, i) => {
                        const si = n as ServiceItem
                        si.isSelected = false
                        return si
                    })
        return refresh(items)
    }

    // function sort(items, index, descending) {
    //     sortIndex = index
    //     sortDescending = descending
    //     return refresh(items)
    // }

    function refresh(items: ServiceItem[]) {
        let parent = items.filter(n => n.name == "..")
        let services = items.filter(n => n.name != "..")

        // if (sortIndex != null) {
        //     const sort = 
        //     sortIndex == 0 
        //             ? (a, b) => a.name.localeCompare(b.name) 
        //             : (a, b) => a.displayName.localeCompare(b.displayName)
                    
        //     return parent.concat(services.sort((a, b) => (sortDescending ? -1 : 1) * sort(a, b)))
        // }
        // else 
            return items
    }    

    function getItemWithPath(path: string, item: Service) { return item.name }

    function onAction(items: FolderItem[]): OnActionResult {
        if (items.length == 1 && items[0].name == "..")
            return {
                done: false,
                newProcessor: createProcessor(thisProcessor, ROOT),
                path: ROOT,
                lastPath: SERVICES_NAME
            }
        else {
            try {
                items.forEach(n => addon.startService(n.name))
                return { done: true }
            } catch (ex) {
                addon.startElevated()
                window.close()
                return { done: true }
            }
        }
    }    

    function canDelete() { return true }

    // async function deleteItems(folder, dialog, selectedItems) {
    //     try {
    //         selectedItems.forEach(n => extFs.stopService(n.name))
    //     } catch (ex) {
    //         extFs.startElevated()
    //         window.close()
    //     }
    // }

    var thisProcessor = {
        name: processorName,
        path: SERVICES,
        dispose,
        checkPath,
        getColumns,
        getItemWithPath,
        getItems,
//        sort,
        refresh,
        onAction,
        canDelete,
  //      deleteItems
    }
    return thisProcessor
}

