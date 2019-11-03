import { createProcessor, SHARES, Processor, FolderColumns, FolderItem, OnActionResult } from './processor'
import { getDirectoryProcessor } from './directory'
import addon from '../extensionFs'

export function getNetworkShareProcessor(processor: Processor, path: string): Processor {
    if (processor)
        processor.dispose()

    let privates = {
        sortIndex: null as number|null,
        sortDescending: false,
        path
    }        

    function dispose() {}

    function checkPath(path: string) { return path == thisProcessor.name }

    function getColumns(columns: FolderColumns) {
        return columns && columns.type == thisProcessor.name
            ? columns
            : {
                type: thisProcessor.name,
                values: [{
                        isSortable: true,
                        name: "Name"
                    }, {
                        isSortable: false,
                        name: "Beschreibung"
                    }
                ]
            }
    }
    async function getItems(path?: string, showHidden?: boolean) {
        var shares = await addon.getNetShares(privates.path)
        var sharesItems = shares.map(n => {
            return { name: n.name, description: n.description, isDirectory: true, isSelected: false }})
        const items = [{ name: "..", isDirectory: true, isSelected: false }].concat(sharesItems)
        items.forEach(n => {
            n.isSelected = false
        })
        return refresh(items)
    }

    function sort(items: FolderItem[], index: number|null, descending: boolean) {
        privates.sortIndex = index
        privates.sortDescending = descending
        return refresh(items)
    }

    function refresh(items: FolderItem[]) {
        let parent = items.filter(n => n.name == "..")
        let services = items.filter(n => n.name != "..")

        const sort = (a: FolderItem, b: FolderItem) => a.name!!.localeCompare(b.name!!) 
        return parent.concat(services.sort((a, b) => (privates.sortDescending ? -1 : 1) * sort(a, b)))
    }    

    function getItemWithPath(path: string, item: FolderItem) { return path + "\\" + item.name }

    function onAction(items: FolderItem[]): OnActionResult {
        if (items.length == 1) {
            if (items[0].name == "..") 
                return {
                    done: false,
                    newProcessor: createProcessor(thisProcessor, SHARES),
                    path: SHARES,
                    lastPath: privates.path
                }
            else {
                const path = getItemWithPath(privates.path, items[0])
                return {
                    done: false,
                    newProcessor: getDirectoryProcessor(thisProcessor, path),
                    path,
                    lastPath: privates.path
                }
            }
        } else
            return { done: true }
    }    

    function canCreateFolder() { return false }
    function canDelete() { return false }

    var thisProcessor = {
        name: "share",
        get path() { return privates.path },
        dispose,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        getItemWithPath,
        onAction,
        canCreateFolder,
        canDelete
    }
    return thisProcessor
}

