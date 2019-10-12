import { createProcessor, SHARES } from './processor'

export function getNetworkShareProcessor(processor, path) {
    if (processor)
        processor.dispose()

    let privates = {
        sortIndex: null,
        sortDescending: false,
        path
    }        

    function getProcessor(path) { 
        return path == privates.path ? null : createProcessor(thisProcessor, path)
    }

    function dispose() {}

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
                        isSortable: false,
                        name: "Beschreibung"
                    }
                ]
            }
    }
    async function getItems() {
        var shares = await extFs.getNetShares(privates.path)
        var sharesItems = shares.map(n => {
            return { name: n.name, description: n.description, isDirectory: true }})
        const items = [{ name: "..", isDirectory: true }].concat(sharesItems)
        items.forEach(n => {
            n.isSelected = false
        })
        return refresh(items)
    }

    function sort(items, index, descending) {
        privates.sortIndex = index
        privates.sortDescending = descending
        return refresh(items)
    }

    function refresh(items) {
        let parent = items.filter(n => n.name == "..")
        let services = items.filter(n => n.name != "..")

        const sort = (a, b) => a.name.localeCompare(b.name) 
        return parent.concat(services.sort((a, b) => (privates.sortDescending ? -1 : 1) * sort(a, b)))
    }    

    function getItemWithPath(path, item) { return item.name }

    function onAction(items) {
        if (items.length == 1)
            if (items[0].name == "..") 
                return {
                    done: false,
                    newProcessor: createProcessor(thisProcessor, SHARES),
                    path: SHARES,
                    lastPath: ""
                }
    }    

    function canCreateFolder() { return false }
    function canDelete() { return false }

    var thisProcessor = {
        name: "share",
        get path() { return privates.path },
        getProcessor,
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

