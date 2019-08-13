<template>
    <div class="commander" @keydown=onKeyDown>
        <splitter-grid class="content" :class="{dialogOpen: dialogOpen}"
            :isVertical=true :isSecondInvisible="!showViewer" @splitter-position-changed="viewerHeightChanged">
            <template v-slot:first>
                <splitter-grid>
                    <template v-slot:first>
                        <folder ref="leftFolder" @delete='onLeftDelete' class="folder" id="left" @focus-in=onLeftFocus @selection-changed=onSelectionChanged></folder>
                    </template>
                    <template v-slot:second>
                        <folder ref="rightFolder" @delete='onRightDelete' class="folder" id="right" @focus-in=onRightFocus @selection-changed=onSelectionChanged></folder>
                    </template>
                </splitter-grid>
            </template>
            <template v-slot:second>
                <viewer class="viewer" :src=selectedItem></viewer>
            </template>
        </splitter-grid>
        <div class="status">{{ status }}</div>
        <main-dialog ref="dialog" @state-changed=onDialogStateChanged></main-dialog>
    </div>
</template>

<script>
import SplitterGrid from './controls/SplitterGrid'
import Folder from './controls/Folder'
import Viewer from './controls/Viewer'
import MainDialog from './controls/MainDialog'
import { mapState } from 'vuex'
const electron = window.require('electron')

// TODO: Status displays alternativly # selected items
export default {
    data() {
        return {
            leftHasFocus: true,
            selectedItem: "",
            dialogOpen: false
        }
    },
    components: {
        SplitterGrid,
        Folder,
        Viewer,
        MainDialog
    },
    computed: {
        status() {
            return this.selectedItem
        },
        // mix this into the outer object with the object spread operator
        ...mapState(['showViewer'])
    },
    mounted() {
        this.$refs.leftFolder.focus()
    },
    methods: {
        refresh() {
            this.getActiveFolder().refresh()
        },
        properties() { electron.ipcRenderer.send("showInfo", this.selectedItem) },
        openAs() { electron.ipcRenderer.send("openAs", this.selectedItem) },
        viewerHeightChanged() {
            this.$refs.leftFolder.onResize()
            this.$refs.rightFolder.onResize()
        },
        onKeyDown(evt) {
            if (evt.which == 9 && !evt.shiftKey && evt.target.tagName != "INPUT") {
                this.getInactiveFolder().focus()
                evt.preventDefault()
            }
        },
        onLeftFocus() { 
            this.leftHasFocus = true 
            this.selectedItem = this.$refs.leftFolder.getSelectedItem()
        },
        onRightFocus() 
        { 
            this.leftHasFocus = false 
            this.selectedItem = this.$refs.rightFolder.getSelectedItem()
        },
        onSelectionChanged(newItem) {
            this.selectedItem = newItem
        },
        onDialogStateChanged(isShowing) { this.dialogOpen = isShowing },
        async createFolder() {
            const folder = this.getActiveFolder()
            if (folder.canCreateFolder()) {
                const selectedItems = folder.getSelectedItems()
                const proposalName = 
                    selectedItems.length == 1 && selectedItems[0].isDirectory 
                    ? selectedItems[0].name != ".." ? selectedItems[0].name : ""
                    : ""

                const result = await this.$refs.dialog.show({
                    ok: true, 
                    cancel : true,
                    defButton: "ok",
                    text: "Neuen Ordner anlegen", 
                    simpleDialog: { 
                        input: true, 
                        inputText: proposalName
                    }
                })
                folder.focus()
                if (result.result == 1) {
                    await folder.createFolder(result.inputText)
                    folder.refresh()                    
                }
            }
        },
        openSameFolder() {
            this.getInactiveFolder().changeFolder(this.getActiveFolder().path)
        },
        async rename() { 
            const folder = this.getActiveFolder()
            if (folder.canRename()) {
                const selectedItems = folder.getSelectedItems()
                if (selectedItems.length == 1 && selectedItems[0].name != "..") {
                    const proposalName = selectedItems[0].name
                    const result = await this.$refs.dialog.show({
                        ok: true, 
                        cancel : true,
                        defButton: "ok",
                        text: `${(selectedItems[0].isDirectory ? "Verzeichnis" : "Datei")} umbenennen`, 
                        simpleDialog: { 
                            input: true, 
                            inputText: proposalName,
                            selectOnlyNameInInput: true
                        }
                    })
                    folder.focus()
                    if (result.result == 1) {
                        await folder.renameItem(proposalName, result.inputText)
                        folder.refresh()                    
                    }
                }
            }            
        },
        onLeftDelete() {
            this.deleteItems(this.$refs.leftFolder)
        },
        onRightDelete() {
            this.deleteItems(this.$refs.rightFolder)
        },
        async copyItems(move) {
            const folder = this.getActiveFolder()
            const otherFolder = this.getInactiveFolder()
            if (otherFolder.canInsertItems() &&  (move ? folder.canMoveItems() : folder.canCopyItems())) {
                const selectedItems = folder.getSelectedItems()
                var conflictItems = await folder.getConflictItems(otherFolder.path, selectedItems)
                console.log("Conflicts", conflictItems)

                const action = move ? "verschieben": "kopieren"
                const  dirs = selectedItems.filter( n => n.isDirectory).length
                const  files = selectedItems.filter( n => !n.isDirectory).length

                // TODO: Dont copy in the same folder or in a subfolder
                const text = 
                    conflictItems == 0
                    ? (files && dirs
                        ? `Möchtest Du die selektierten Einträge ${action}?`
                        : (files
                            ? (files > 1
                                ? `Möchtest Du die selektierten Dateien ${action}?`
                                : `Möchtest Du die selektierte Datei '${selectedItems[0].name}' ${action}?`)
                            : (dirs > 1
                                ? `Möchtest Du die selektierten Verzeichnisse ${action}?`
                                : `Möchtest Du das selektierte Verzeichnis '${selectedItems[0].name}' ${action}?`)
                            )
                        )
                    : "Möchtest Du die Einträge überschreiben?"

                const result = await this.$refs.dialog.show({
                    yes: conflictItems.length > 0, 
                    no: conflictItems.length > 0, 
                    ok : conflictItems.length == 0,
                    rightFolder: folder == this.$refs.rightFolder,
                    leftFolder: folder == this.$refs.leftFolder,
                    text,
                    cancel: true,
                    defButton: "yes",
                    conflictItems: conflictItems.length > 0 ? conflictItems : null,
                })

                folder.focus()
                if (result.result == 1) {
//                    await folder.deleteFiles(selectedItems)
                    folder.refresh()
                }
            }
        },
        async deleteItems(folder) {
            if (!folder)
                folder = this.getActiveFolder()
            if (folder.canDeleteItems()) {
                const selectedItems = folder.getSelectedItems()
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
                    
                const result = await this.$refs.dialog.show({
                    ok: true, 
                    cancel: true,
                    defButton: "ok",
                    text
                })
                folder.focus()
                if (result.result == 1) {
                    await folder.deleteFiles(selectedItems)
                    folder.refresh()
                }
            }
        },
        getActiveFolder() {
            return this.leftHasFocus ? this.$refs.leftFolder : this.$refs.rightFolder
        },
        getInactiveFolder() {
            return this.leftHasFocus ? this.$refs.rightFolder : this.$refs.leftFolder
        }
    }
}
</script>

<style scoped> 
.commander {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
}
.content {
    transition: .3s filter;
}
.content.dialogOpen {
    filter: blur(2px);
    will-change: filter;
}
.folder {
    flex-grow: 1;
}
.viewer {
    flex-grow: 1;
}
.status {
    padding: 2px 2px 1px 5px;
    height: 14px; 
    color: var(--selected-color);
    background-color: var(--selected-background-color);
}
</style>
