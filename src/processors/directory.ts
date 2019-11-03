//import { getNameOnly, getExtension } from '../../cache/pipes'
import { createProcessor, combinePath, ROOT, Processor, FolderColumns, FolderItem, OnActionResult, getDefaultProcessor } from './processor'
import extFs, { VersionInfo, FileItem } from '../extensionFs'
import { getNetworkShareProcessor } from './networkShare'
import { getNameOnly, getExtension } from '../pipes'
//import { sendToMain } from '../../cache/src/Connection'
//const electron = window.require('electron')

export interface FileViewItem extends FileItem, FolderItem {} 

export function compareVersions(version1?: VersionInfo, version2?: VersionInfo) {
    return !version1 && !version2 ? 1
    : version1 && !version2 ? 1
    : !version1 && version2 ? -1
    : version1!!.major != version2!!.major ? version1!!.major - version2!!.major
    : version1!!.minor != version2!!.minor ? version1!!.minor - version2!!.minor
    : version1!!.build != version2!!.build ? version1!!.build - version2!!.build
    : version1!!.patch != version2!!.patch ? version1!!.patch - version2!!.patch 
    : 0
}

const processorName = "directory"

export function getDirectoryProcessor(processor: Processor, path: string) {
    if (processor) {
        if (processor.name == processorName)
            return processor
        processor.dispose()
    }

    let privates = {
        sortIndex: null as number|null,
        sortDescending: false,
        path
    }

    function dispose() {}

    function checkPath(path: string) { return path == thisProcessor.name }

    function getColumns(recentColumns: FolderColumns) {
        return recentColumns.type == thisProcessor.name
            ? recentColumns
            : {
                type: thisProcessor.name,
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

    async function getItems(path: string, showHidden: boolean) {
        const values = 
            (await extFs.getFiles(path))
            .map((n, i) => {
                const fvi = n as FileViewItem
                fvi.index = i
                if (i == 0)
                    fvi.isSelected = true
                return fvi
            })

        privates.path = path
        return refresh(values, showHidden)
    }
    function refresh(values: FileViewItem[], showHidden: boolean) {
        if (!showHidden)
            values = values.filter(n => !n.isHidden)
        let dirs = values.filter(n => n.isDirectory)
        let files = values.filter(n => !n.isDirectory)

        //getExtendedInfos()

       if (privates.sortIndex != null) {
            const sort = 
            privates.sortIndex == 0 
            ? (a: FileViewItem, b: FileViewItem) => getNameOnly(a.name).localeCompare(getNameOnly(b.name)) :
            privates.sortIndex == 1 
            ? (a: FileViewItem, b: FileViewItem) => getExtension(a.name).localeCompare(getExtension(b.name)) :
            privates.sortIndex == 2
            ? (a: FileViewItem, b: FileViewItem) => (a.time ? a.time.getTime() : -1) - (b.time ? b.time.getTime() : -1) :
            privates.sortIndex == 3      
            ? (a: FileViewItem, b: FileViewItem) => a.size - b.size    
            : (a: FileViewItem, b: FileViewItem) => compareVersions(a.version, b.version)
    
            files = files.sort((a, b) => (privates.sortDescending ? -1 : 1) * sort(a, b))
        }
        
        if (dirs.length == 0 || dirs[0].name != "..")
            dirs = ([ {name: "..", isDirectory: true, isRoot: true, size: 0, index: 0 } as FileViewItem ]).concat(dirs)

        return dirs.concat(files)

        async function getVersion(fileItem: FileItem, file: string) {
            const version = await extFs.getFileVersion(file) 
            if (version.major != 0 || version.minor != 0 || version.build != 0 || version.patch != 0)
                fileItem.version = version
        }

        async function getExif(fileItem: FileItem, file: string) {
            const exifDate = await extFs.getExifDate(file)
            if (exifDate) {
                fileItem.time = exifDate
                fileItem.isExif = true
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

    function sort(items: FileViewItem[], index: number, descending: boolean, showHidden: boolean) {
        privates.sortIndex = index
        privates.sortDescending = descending
        return refresh(items, showHidden)
    }

    function onAction(items: FileViewItem[]): OnActionResult {
        const isDirectory = items.length == 1 && items.every(n => n.isDirectory)
        const files = items.every(n => !n.isDirectory)
        const pathes = items.map(n => combinePath(privates.path, n.name))
        if (!isDirectory && !files) {
            return { done: true }
        }
        if (isDirectory) {
            return pathes[0] != undefined
                ? (
                    pathes[0]!!.startsWith("\\\\") && pathes[0]!!.indexOf('\\', 2) == -1
                    ? {
                        done: false,
                        newProcessor: getNetworkShareProcessor(thisProcessor, pathes[0]),
                        path: pathes[0],
                        lastPath: getDirectoryName(privates.path)
                    }
                    : {
                        done: false,
                        path: pathes[0],
                        lastPath: getDirectoryName(privates.path)
                    })
                : {
                    done: false,
                    newProcessor: createProcessor(thisProcessor, ROOT),
                    path: ROOT,
                    lastPath: getDirectoryName(privates.path)
                }
        } 
        else {
            // if (pathes.length < 10)
            //     pathes.forEach(n => electron.ipcRenderer.send("open", n))
            return { done: true }
        }
    }        

    function getDirectoryName(path: string) {
        const pos = path.lastIndexOf('\\', path.length - 2)
        return pos != -1 ? path.substr(pos + 1) : path
    }

    function getItemWithPath(path: string, item: FileViewItem) {
        return combinePath(path, item.name)
    }

    function canCreateFolder() { return true }
    function canDelete() { return true }
    function canRename() { return true }
    function canExtendedRename() { return true }
    function canCopyItems() { return true }
    function canMoveItems() { return true }
    function canInsertItems() { return true }

    // async function deleteItems(folder, dialog, selectedItems) {
    //     const  dirs = selectedItems.filter( n => n.isDirectory).length
    //     const  files = selectedItems.filter( n => !n.isDirectory).length
    //     const text = 
    //         files && dirs
    //         ? "Möchtest Du die selektierten Einträge löschen?"
    //         : (files
    //         ? (files > 1
    //             ? "Möchtest Du die selektierten Dateien löschen?"
    //             : `Möchtest Du die selektierte Datei '${selectedItems[0].name}' löschen?`)
    //         : (dirs > 1
    //             ? "Möchtest Du die selektierten Verzeichnisse löschen?"
    //             : `Möchtest Du das selektierte Verzeichnis '${selectedItems[0].name}' löschen?`)
    //         )
                        
    //     const result = await dialog.show({
    //         ok: true, 
    //         cancel: true,
    //         defButton: "ok",
    //         text
    //     })
    //     folder.focus()
    //     if (result.result == 1) {
    //         const files =  selectedItems.map(n => privates.path + '\\' + n.name)
    //         await sendToMain("deleteFiles", JSON.stringify(files))
    //         folder.refresh()
    //     }
    // }

    // function getCreateFolderText() {
    //     return "Neuen Ordner anlegen"
    // }

    // async function createFolder(folderName) {
    //     await sendToMain("createDirectory", privates.path + '\\' + folderName)
    // }

    // async function renameItem(name, newName) {
    //     await sendToMain("rename", JSON.stringify({ path: privates.path, name, newName }))
    // }

    // async function copyItems(selectedItems, targetPath, move, conflictItems) {
    //     const items = selectedItems.map(n => n.name)
    //     await sendToMain(move ? "moveItems" : "copyItems", JSON.stringify({
    //         items,
    //         sourcePath: privates.path,
    //         targetPath,
    //         conflictItems
    //     }))
    // }

    // async function getConflictItems(targetPath, items) {
    //     return extFs.getConflicts(privates.path, targetPath, items)
    // }

    var thisProcessor = {
        name: processorName,
        get path() { return privates.path },
        dispose,
        checkPath,
        getColumns,
        getItems,
//        sort,
        refresh,
        onAction,
        getItemWithPath,
        canCreateFolder,
        canDelete,
        canRename,
        canExtendedRename,
        canInsertItems,
        // getCreateFolderText,
        // deleteItems,
        // createFolder,
        // renameItem,
        // copyItems,
        // canCopyItems,
        canMoveItems,
  //      getConflictItems
    }
    return thisProcessor;
}