import { ROOT, SERVICES, SHARES, Processor, FolderColumns, FolderType } from '../processor'
// import { getDirectoryProcessor } from '../directory'
// import { getServicesProcessor, SERVICES_NAME } from '../services'
// import { getNetworkSharesProcessor, SHARES_NAME } from '../networkShares'

const processorName = "root"

/*
enum class Drive_type
{
	UNKNOWN,
	HARDDRIVE,
	ROM,
	REMOVABLE,
    NETWORK,
    
    Services,
    NetworkShares
};

struct Drive_item {
	const std::wstring name;
	const std::wstring description;
	const uint64_t size;
	const Drive_type type;
	const bool is_mounted;
};
*/

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
        return recentColumns.type == FolderType.ROOT 
            ? recentColumns
            : {
                type: FolderType.ROOT,
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

    // async function getItems() {
    //     const items = (await extFs.getDrives()).filter(n => n.isMounted)
    //         .concat([ 
    //             { name: SHARES_NAME, type: 6 },
    //             { name: SERVICES_NAME, type: 5 }
    //         ])
    //     items.forEach(n => {
    //         n.isSelected = false
    //         n.isExif = false
    //         n.version = ""
    //     })
    //     return refresh(items)
    // }
    // function sort(items, index, descending) {
    //     sortIndex = index
    //     sortDescending = descending
    //     return refresh(items)
    // }
    // function refresh(items) {
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
    //         return items
    // }    

    // function onAction(items) {
    //     if (items.length == 1)
    //         return {
    //             done: false,
    //             newProcessor: items[0].type == 5 
    //                     ? getServicesProcessor(thisProcessor) 
    //                     : (items[0].type == 6 
    //                         ? getNetworkSharesProcessor(thisProcessor) 
    //                         : getDirectoryProcessor(thisProcessor, items[0].name)), 
    //             path: items[0].type == 5 
    //                 ? SERVICES 
    //                 : (items[0].type == 6 
    //                     ? SHARES
    //                     :items[0].name)
    //         }
    // }    
    
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
        getColumns
        // getItems,
        // sort,
        // refresh,
        // onAction,
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