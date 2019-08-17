import { getNameOnly, getExtension } from '../pipes'
import { createProcessor, combinePath } from './processor'
import { name as rootName } from './root'
import { sendToMain } from '../Connection'
const electron = window.require('electron')

export function getDirectoryProcessor() {
    let privates = {
        sortIndex: null,
        sortDescending: false,
        path: ""
    }

    function getProcessor(path) { 
        return path != rootName ? null : createProcessor(rootName)
    }

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
            : (a, b) => sortVersion(a, b)
    
            files = files.sort((a, b) => (privates.sortDescending ? -1 : 1) * sort(a, b))

            function sortVersion(a, b) {
                return !a.version && !b.version ? 1
                       : a.version && !b.version ? 1
                       : !a.version && b.version ? -1
                       : a.version.major != b.version.major ? a.version.major - b.version.major
                       : a.version.minor != b.version.minor ? a.version.minor - b.version.minor
                       : a.version.build != b.version.build ? a.version.build - b.version.build
                       : a.version.patch != b.version.patch ? a.version.patch - b.version.patch 
                       : 0
            }            
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

    function onAction(item) {
        const path = combinePath(privates.path, item.name)
        if (item.isDirectory) {
            return path
                ? {
                    done: false,
                    newProcessor: null,
                    path: path,
                    lastPath: getDirectoryName(privates.path)
                }
                : {
                    done: false,
                    newProcessor: createProcessor(rootName),
                    path: rootName,
                    lastPath: getDirectoryName(privates.path)
                }
        } 
        else {
            electron.ipcRenderer.send("open", path)
            return {
                done: true
            }
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
    function canCopyItems() { return true }
    function canMoveItems() { return true }
    function canInsertItems() { return true }

    async function deleteFiles(itemsToDelete) {
        const files =  itemsToDelete.map(n => privates.path + '\\' + n.name)
        await sendToMain("deleteFiles", JSON.stringify(files))
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

    return {
        name: "directory",
        get path() { return privates.path },
        getProcessor,
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
        canInsertItems,
        deleteFiles,
        createFolder,
        renameItem,
        copyItems,
        canCopyItems,
        canMoveItems,
        getConflictItems
    }
}