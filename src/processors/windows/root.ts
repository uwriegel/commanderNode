import { ROOT, SERVICES, SHARES, Processor, FolderColumns, FolderItem, OnActionResult } from '../processor'
import extFs, { DriveItem, RootType } from '../../extensionFs'
import { getDirectoryProcessor } from '../directory'
import { getServicesProcessor, SERVICES_NAME } from '../services'
import { getNetworkSharesProcessor, SHARES_NAME } from '../networkShares'

const processorName = "root"

interface DriveViewItem extends FolderItem, DriveItem {} 

export function getRootProcessor(processor: Processor): Processor {
    if (processor) {
        if (processor.name == processorName)
            return processor
        processor.dispose()
    }
    let sortIndex = null as number|null
    let sortDescending = false
    
    function checkPath(path: string) { return path == ROOT }

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

    async function getItems(path?: string, showHidden?: boolean) {
        const items = (await extFs.getDrives()).filter(n => n.isMounted)
            .concat([ 
                { name: SHARES_NAME, type: RootType.SHARES, size: 0 },
                { name: SERVICES_NAME, type: RootType.SERVICES, size: 0 }
            ])
        return refresh(items as DriveViewItem[])
    }

    function sort(items: FolderItem[], index: number, descending: boolean) {
        sortIndex = index
        sortDescending = descending
        return refresh(items)
    }

    function refresh(items: FolderItem[]) {
        if (sortIndex != null) {
            const sort = 
            sortIndex == 0 
                    ? (a: FolderItem, b: FolderItem) => a.name!!.localeCompare(b.name!!) :
                    sortIndex == 1 
                    ? (a: DriveViewItem, b: DriveViewItem) => a.description!!.localeCompare(b.description!!)
                    : (a: DriveViewItem, b: DriveViewItem) => a.size!! - b.size!!
                    
            return items.sort((a: FolderItem, b: FolderItem) => (sortDescending ? -1 : 1) * sort(a as DriveViewItem, b as DriveViewItem))
        }
        else 
            return items
    }    

    function onAction(items: FolderItem[]): OnActionResult {
        const driveItems = items as DriveViewItem[]
        if (items.length == 1)
            return {
               done: false,
               newProcessor: driveItems[0].type == RootType.SERVICES 
                    ? getServicesProcessor(thisProcessor) 
                    : (driveItems[0].type == RootType.SHARES 
                        ? getNetworkSharesProcessor(thisProcessor) 
                        : getDirectoryProcessor(thisProcessor, driveItems[0].name)), 
                path: driveItems[0].type == RootType.SERVICES
                    ? SERVICES 
                    : (driveItems[0].type == RootType.SHARES
                        ? SHARES
                        :driveItems[0].name)
            }
        else
            return { done: false }
    }    
    
    function getItemWithPath(path: string, item: DriveViewItem) { return item.name }

     function canCreateFolder() { return false }
     function canDelete() { return false }
     function canRename() { return false }
     function canExtendedRename() { return false }
     function canCopyItems() { return false }
     function canMoveItems() { return false }
     function canInsertItems() { return false }

    var thisProcessor = {
        name: processorName,
        path: ROOT,
        dispose,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        onAction,
        getItemWithPath,
        canCreateFolder,
        canDelete,
        canRename,
        canExtendedRename,
        canCopyItems,
        canMoveItems,        
        canInsertItems, 
        getCreateFolderText : () => ""
    }
    return thisProcessor
}