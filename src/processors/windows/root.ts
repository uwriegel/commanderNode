import { ROOT, SERVICES, SHARES, Processor, FolderColumns, FolderItem, OnActionResult } from '../processor'
import addon, { RootType, DriveItem } from '../../extensionFs'
import { getDirectoryProcessor } from '../directory'
// import { getDirectoryProcessor } from '../directory'
//import { getServicesProcessor, SERVICES_NAME } from '../services'
//import { getNetworkSharesProcessor, SHARES_NAME } from '../networkShares'

const processorName = "root"

export function getRootProcessor(processor: Processor): Processor {
    if (processor) {
        if (processor.name == processorName)
            return processor
        processor.dispose()
    }
    // let sortIndex = null
    // let sortDescending = false
    
    // function checkPath(path) { return path == ROOT }

    function getColumns(recentColumns: FolderColumns) {
        return recentColumns.type == ROOT 
            ? recentColumns
            : {
                type: ROOT,
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

    function dispose() {}

    async function getItems() {
        const items = (await addon.getDrives()).filter(n => n.isMounted)
            .concat([ 
                // TODO
                { name: "SHARES_NAME", type: RootType.SHARES, isSelected: false },
                { name: "SERVICES_NAME", type: RootType.SERVICES, isSelected: false }
            ])
        items.forEach(n => n.isSelected = false)
        return refresh(items)
    }
    // function sort(items, index, descending) {
    //     sortIndex = index
    //     sortDescending = descending
    //     return refresh(items)
    // }
    function refresh(items: FolderItem[]) {
    //     if (sortIndex != null) {
    //         const sort = 
    //         sortIndex == 0 
    //                 ? (a, b) => a.name.localeCompare(b.name) :
    //                 sortIndex == 1 
    //                 ? (a, b) => a.description.localeCompare(b.description)
    //                 : (a, b) => a.size - b.size
                    
    //         return items.sort((a, b) => (sortDescending ? -1 : 1) * sort(a, b))
    //     }
    //     else 
        return items
    }    

    function onAction(items: FolderItem[]): OnActionResult {
        const driveItems = items as DriveItem[]
        if (items.length == 1)
            return {
               done: false,
               newProcessor: /*driveItems[0].type == RootType.SERVICES 
                    ? getServicesProcessor(thisProcessor) 
                    : (driveItems[0].type == RootType.SHARES 
                        ? getNetworkSharesProcessor(thisProcessor) 
                        : */getDirectoryProcessor(thisProcessor, driveItems[0].name),//), 
                path: driveItems[0].type == RootType.SERVICES
                    ? SERVICES 
                    : (driveItems[0].type == RootType.SHARES
                        ? SHARES
                        :driveItems[0].name)
            }
        else
            return { done: false }
    }    
    
    // function getItemWithPath(path, item) { return item.name }

    // function canCreateFolder() { return false }
    // function canDelete() { return false }
    // function canRename() { return false }
    // function canExtendedRename() { return false }
    // function canCopyItems() { return false }
    // function canMoveItems() { return false }
    // function canInsertItems() { return false }

    var thisProcessor = {
        name: processorName,
        path: ROOT,
        dispose,
        // checkPath,
        getColumns,
        getItems,
        // sort,
        refresh,
        onAction,
        // getItemWithPath,
        // canCreateFolder,
        // canDelete,
        // canRename,
        // canExtendedRename,
        // canCopyItems,
        // canMoveItems,        
        // canInsertItems
    }
    return thisProcessor
}