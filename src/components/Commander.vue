<template>
    <div class="commander" @keydown=onKeyDown>
        <splitter-grid :isVertical=true :isSecondInvisible="!showViewer" @splitter-position-changed="viewerHeightChanged">
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
        <main-dialog ref="dialog"></main-dialog>
    </div>
</template>

<script>
import SplitterGrid from './controls/SplitterGrid'
import Folder from './controls/Folder'
import Viewer from './controls/Viewer'
import MainDialog from './controls/MainDialog'
import { mapState } from 'vuex'
const electron = window.require('electron')

// TODO: Status displays alternativly# selected items
// TODO: Detect dark theme: Computer\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize
export default {
    data() {
        return {
            leftHasFocus: true,
            selectedItem: ""
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
        async rename() { },
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
        async createFolder() {
            const folder = this.getActiveFolder()
            if (folder.canCreateFolder()) {
                const selectedItem = folder.getSelectedItem().name
                const result = await this.$refs.dialog.show({
                    ok: true, 
                    cancel : true,
                    simpleDialog: { text: "Neuen Ordner anlegen", input: true }
                })
                this.getActiveFolder().focus()
            }
        },
        onLeftDelete() {
            this.deleteItems(this.$refs.leftFolder)
        },
        onRightDelete() {
            this.deleteItems(this.$refs.rightFolder)
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
                    cancel : true,
                    simpleDialog: { text }
                })
                this.getActiveFolder().focus()
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
