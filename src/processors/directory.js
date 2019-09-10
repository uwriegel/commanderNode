import { getNameOnly, getExtension } from '../pipes'
import { createProcessor, combinePath, ROOT } from './processor'
import { sendToMain } from '../Connection'
const electron = window.require('electron')

export function compareVersions(version1, version2) {
    return !version1 && !version2 ? 1
    : version1 && !version2 ? 1
    : !version1 && version2 ? -1
    : version1.major != version2.major ? version1.major - version2.major
    : version1.minor != version2.minor ? version1.minor - version2.minor
    : version1.build != version2.build ? version1.build - version2.build
    : version1.patch != version2.patch ? version1.patch - version2.patch 
    : 0
}

export function getDirectoryProcessor(processor, path) {
    if (processor)
        processor.dispose()

    let privates = {
        sortIndex: null,
        sortDescending: false,
        path
    }

    function getProcessor(path) { 
        return path != ROOT ? null : createProcessor(thisProcessor, ROOT)
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
                        isSortable: true,
                        name: "Erw."
                    }, {
                        isSortable: true,
                        name: "Datum"
                    }, {
                        isSortable: true,
                        name: "Größe"
                    }, {
                        isSortable: true,
                        name: "Version"
                    }
                ]
            }
    }

    async function getItems(path, showHidden) {
        const values = (await extFs.getFiles(path))
        values.forEach(n => {
            if (n.name != "..")
                n.isSelected = false
            n.isExifDate = false
            n.version = ""
        })

        privates.path = path
        return refresh(values, showHidden, true)
    }
    function refresh(values, showHidden, withExtendedInfos) {
        if (!showHidden)
            values = values.filter(n => !n.isHidden)
        let dirs = values.filter(n => n.isDirectory)
        let files = values.filter(n => !n.isDirectory)

        getExtendedInfos()

        if (privates.sortIndex != null) {
            const sort = 
            privates.sortIndex == 0 
            ? (a, b) => getNameOnly(a.name).localeCompare(getNameOnly(b.name)) :
            privates.sortIndex == 1 
            ? (a, b) => getExtension(a.name).localeCompare(getExtension(b.name)) :
            privates.sortIndex == 2
            ? (a, b) => a.time - b.time :
            privates.sortIndex == 3      
            ? (a, b) => a.size - b.size    
            : (a, b) => compareVersions(a.version, b.version)
    
            files = files.sort((a, b) => (privates.sortDescending ? -1 : 1) * sort(a, b))
        }
        
        if (dirs.length == 0 || dirs[0].name != "..")
            dirs = [ {name: "..", isDirectory: true, isRoot: true  }].concat(dirs)

        return dirs.concat(files)

        async function getVersion(fileItem, file) {
            const version = await extFs.getFileVersion(file) 
            if (version.major != 0 || version.minor != 0 || version.build != 0 || version.patch != 0)
                fileItem.version = version
        }

        async function getExif(fileItem, file) {
            const exifDate = await extFs.getExifDate(file)
            if (exifDate) {
                fileItem.time = exifDate
                fileItem.isExifDate = true
            }
        }

        async function getExtendedInfos() {
            for (let i = 0; i < files.length; i++) {        
                const fileItem = files[i]
                const file = privates.path + '\\' + fileItem.name
                var checkName = fileItem.name.toLowerCase()
                if (checkName.endsWith(".exe") || checkName.endsWith(".dll")) {
                    await getVersion(fileItem, file)
                }
                else if (checkName.endsWith(".jpg")) {
                    await getExif(fileItem, file)
                }
            }
        }
    }

    function sort(items, index, descending, showHidden) {
        privates.sortIndex = index
        privates.sortDescending = descending
        return refresh(items, showHidden)
    }

    /**
     * 
     * @param {[]} items 
     */
    function onAction(items) {
        const isDirectory = items.length == 1 && items.every(n => n.isDirectory)
        const files = items.every(n => !n.isDirectory)
        const pathes = items.map(n => combinePath(privates.path, n.name))
        if (!isDirectory && !files) {
            return { done: true }
        }
        if (isDirectory) {
            return pathes[0]
                ? {
                    done: false,
                    newProcessor: null,
                    path: pathes[0],
                    lastPath: getDirectoryName(privates.path)
                }
                : {
                    done: false,
                    newProcessor: createProcessor(thisProcessor, ROOT),
                    path: ROOT,
                    lastPath: getDirectoryName(privates.path)
                }
        } 
        else {
            if (pathes.length < 10)
                pathes.forEach(n => electron.ipcRenderer.send("open", n))
            return { done: true }
        }
    }        

    function getDirectoryName(path) {
        const pos = path.lastIndexOf('\\', path.length - 2)
        return pos != -1 ? path.substr(pos + 1) : path
    }

    function getItemWithPath(path, item) {
        return combinePath(path, item.name)
    }

    function canCreateFolder() { return true }
    function canDelete() { return true }
    function canRename() { return true }
    function canExtendedRename() { return true }
    function canCopyItems() { return true }
    function canMoveItems() { return true }
    function canInsertItems() { return true }

    async function deleteItems(folder, dialog, selectedItems) {
        const  dirs = selectedItems.filter( n => n.isDirectory).length
        const  files = selectedItems.filter( n => !n.isDirectory).length
        const text = 
            files && dirs
            ? "Möchtest Du die selektierten Einträge löschen?"
            : (files
            ? (files > 1
                ? "Möchtest Du die selektierten Dateien löschen?"
                : `Möchtest Du die selektierte Datei '${selectedItems[0].name}' löschen?`)
            : (dirs > 1
                ? "Möchtest Du die selektierten Verzeichnisse löschen?"
                : `Möchtest Du das selektierte Verzeichnis '${selectedItems[0].name}' löschen?`)
            )
                        
        const result = await dialog.show({
            ok: true, 
            cancel: true,
            defButton: "ok",
            text
        })
        folder.focus()
        if (result.result == 1) {
            const files =  selectedItems.map(n => privates.path + '\\' + n.name)
            await sendToMain("deleteFiles", JSON.stringify(files))
            folder.refresh()
        }
    }

    async function createFolder(folderName) {
        await sendToMain("createDirectory", privates.path + '\\' + folderName)
    }

    async function renameItem(name, newName) {
        await sendToMain("rename", JSON.stringify({ path: privates.path, name, newName }))
    }

    async function copyItems(selectedItems, targetPath, move, conflictItems) {
        const items = selectedItems.map(n => n.name)
        await sendToMain(move ? "moveItems" : "copyItems", JSON.stringify({
            items,
            sourcePath: privates.path,
            targetPath,
            conflictItems
        }))
    }

    async function getConflictItems(targetPath, items) {
        return extFs.getConflicts(privates.path, targetPath, items)
    }

    var thisProcessor = {
        name: "directory",
        get path() { return privates.path },
        getProcessor,
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
        canInsertItems,
        deleteItems,
        createFolder,
        renameItem,
        copyItems,
        canCopyItems,
        canMoveItems,
        getConflictItems
    }
    return thisProcessor;
}