import { createProcessor, ROOT, SHARES, Processor, FolderColumns, FolderItem } from './processor'
import addon, { NetShare } from '../extensionFs'
import { getNetworkShareProcessor } from './networkShare'

export const SHARES_NAME = "Freigaben"

const processorName = "shares"

export function getNetworkSharesProcessor(processor: Processor): Processor {
    if (processor) {
        if (processor.name == processorName)
            return processor
        processor.dispose()
    }

    let sortDescending = false
    let items = []

    function checkPath(path: string) { return path == SHARES }

    function getColumns(columns: FolderColumns) {
        return columns && columns.type == SHARES
            ? columns
            : {
                type: SHARES,
                values: [{
                        isSortable: true,
                        name: "Name"
                    }]
            }
    }
    async function getItems() {
        const shares = JSON.parse(localStorage["networkShares"] || "[]") as NetShare[]
        const shareItems = shares.map(n => { return { name, isDirectory: true, isSelected: false }})
        items = [{ name: "..", isDirectory: true, isSelected: false }].concat(shareItems)
        items.forEach(n => {
            n.isSelected = false
        })
        return refresh(items)
    }

    function sort(items: FolderItem[], index: number, descending: boolean) {
      //  sortIndex = index
        sortDescending = descending
        return refresh(items)
    }

    function refresh(items: FolderItem[]) {
        let parent = items.filter(n => n.name == "..")
        let services = items.filter(n => n.name != "..")

        const sort = (a: FolderItem, b: FolderItem) => a.name!!.localeCompare(b.name!!) 
        return parent.concat(services.sort((a, b) => (sortDescending ? -1 : 1) * sort(a, b)))
    }    

    function getItemWithPath(path: string, item: FolderItem) { return item.name }

    function onAction(items: FolderItem[]) {
        if (items.length == 1) {
            return {
                done: false,
                newProcessor: items[0].name == ".." ? createProcessor(thisProcessor, ROOT) : getNetworkShareProcessor(thisProcessor, items[0].name!!),
                path: items[0].name == ".." ? ROOT : items[0].name,
                lastPath: SHARES_NAME
            }
        }
    }    

    function canCreateFolder() { return true }
    function canDelete() { return true }

    function getCreateFolderText() {
        return "Name des Servers für die Freigaben"
    }

    async function createFolder(folderName: string) {
        var items = await addon.getNetShares(folderName)
        if (items.length > 0) {
            const shares = JSON.parse(localStorage["networkShares"] || "[]")
            shares.push("\\\\" + folderName) 
            localStorage["networkShares"] = JSON.stringify(shares)
        }
    }

    // async function deleteItems(folder: string, dialog, selectedItems) {
    //     const result = await dialog.show({
    //         ok: true, 
    //         cancel: true,
    //         defButton: "ok",
    //         text: "Möchtest Du die selektierten Freigaben entfernen?"
    //     })
    //     folder.focus()
    //     if (result.result == 1) {
    //         const toDeleteItems = selectedItems.map(n => n.name)
    //         const shares = JSON.parse(localStorage["networkShares"] || "[]").filter(n => !toDeleteItems.includes(n))
    //         localStorage["networkShares"] = JSON.stringify(shares)
    //         folder.refresh()
    //     }
    // }

    function dispose() {}

    var thisProcessor = {
        name: processorName,
        path: SHARES,
        dispose,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        getItemWithPath,
        onAction,
        canCreateFolder,
        canDelete,
        getCreateFolderText,
        createFolder,
//        deleteItems
    }
    return thisProcessor
}

