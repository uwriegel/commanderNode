<template>
    <div class="commander" @keydown=onKeyDown>
        <splitter-grid class="content" :class="{dialogOpen: dialogOpen}"
            :isVertical=true :isSecondInvisible="!showViewer" @splitter-position-changed="viewerHeightChanged">
            <template v-slot:first>
                <splitter-grid>
                    <template v-slot:first>
                        <folder :eventBus="leftFolderEventBus" ref="leftFolder" @delete='onLeftDelete' class="folder" id="left" @focus-in=onLeftFocus 
                        @selection-changed=onSelectionChanged @drop-files="leftDropFiles"></folder>
                    </template>
                    <template v-slot:second>
                        <folder :eventBus="rightFolderEventBus" ref="rightFolder" @delete='onRightDelete' class="folder" id="right" @focus-in=onRightFocus 
                        @selection-changed=onSelectionChanged @drop-files="rightDropFiles"></folder>
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

<script lang="ts">
import Vue, { PropType } from 'vue'
import SplitterGrid from './controls/SplitterGrid.vue'
import Folder from './controls/Folder.vue'
import Viewer from './controls/Viewer.vue'
// import MainDialog from './controls/MainDialog.vue'
import { mapState } from 'vuex'
import { createProcessor } from '../processors/processor'
const electron = window.require('electron')

// TODO: Rename with copy
// TODO: Status displays alternativly # selected items
export default Vue.extend({
    data() {
        return {
            leftFolderEventBus: new Vue(),
            rightFolderEventBus: new Vue(),
            leftHasFocus: true,
            selectedItem: "",
            dialogOpen: false
        }
    },
    components: {
        SplitterGrid,
        Folder,
        Viewer,
        //MainDialog
    },
    computed: {
        status(): string {
            return this.selectedItem
        },
        // mix this into the outer object with the object spread operator
        ...mapState(['showViewer'])
    },
    mounted() {
        this.leftFolderEventBus.$emit('focus')
        this.eventBus.$on('refresh', this.refresh)
    },
    props: {
        eventBus: Object as PropType<Vue>,
    },
    methods: {
        refresh() {
            this.getActiveFolderEventBus().$emit('refresh')
        },
        properties() { electron.ipcRenderer.send("showInfo", this.selectedItem) },
        openAs() { electron.ipcRenderer.send("openAs", this.selectedItem) },
        viewerHeightChanged() {
            // TODO:
            //this.$refs.leftFolder.onResize()
            //this.$refs.rightFolder.onResize()
        },
        onKeyDown(evt: KeyboardEvent) {
            if (evt.which == 9 && !evt.shiftKey && (evt.target as HTMLInputElement).tagName != "INPUT") {
                this.getInactiveFolderEventBus().$emit("focus");
                evt.preventDefault()
            }
        },
        onLeftFocus() { 
            this.leftHasFocus = true 
        },
        onRightFocus() { 
            this.leftHasFocus = false 
        },
        onSelectionChanged(newItem: string) {
            this.selectedItem = newItem
        },
        onDialogStateChanged(isShowing: boolean) { this.dialogOpen = isShowing },
        async createFolder() {
            // const folder = this.getActiveFolder()
            // if (folder.canCreateFolder()) {
            //     const selectedItems = folder.getSelectedItems()
            //     const proposalName = 
            //         selectedItems.length == 1 && selectedItems[0].isDirectory 
            //         ? selectedItems[0].name 
            //         : ""

            //     // const result = await this.$refs.dialog.show({
            //     //     ok: true, 
            //     //     cancel : true,
            //     //     defButton: "ok",
            //     //     text: folder.getCreateFolderText(), 
            //     //     simpleDialog: { 
            //     //         input: true, 
            //     //         inputText: proposalName
            //     //     }
            //     // })
            //     // folder.focus()
            //     // if (result.result == 1) {
            //     //     await folder.createFolder(result.inputText)
            //     //     folder.refresh()                    
            //     // }
            // }
        },
        openSameFolder() {
            // TODO:
            //this.getInactiveFolderEventBus().changeFolder(this.getActiveFolder().path)
        },
        async rename() { 
            // const folder = this.getActiveFolder()
            // if (!folder.getExtendedRename()) {
            //     if (folder.canRename()) {
            //         const selectedItems = folder.getSelectedItems()
            //         if (selectedItems.length == 1) {
            //             const proposalName = selectedItems[0].name
            //             const result = await this.$refs.dialog.show({
            //                 ok: true, 
            //                 cancel : true,
            //                 defButton: "ok",
            //                 text: `${(selectedItems[0].isDirectory ? "Verzeichnis" : "Datei")} umbenennen`, 
            //                 simpleDialog: { 
            //                     input: true, 
            //                     inputText: proposalName,
            //                     selectOnlyNameInInput: true
            //                 }
            //             })
            //             folder.focus()
            //             if (result.result == 1) {
            //                 await folder.renameItem(proposalName, result.inputText)
            //                 folder.refresh()                    
            //             }
            //         }
            //     }            
            // } else {
            //     if (!(await folder.renameExtended())) {
            //         await this.$refs.dialog.show({
            //             ok: true, 
            //             text: 'Konnte nicht umbenennen', 
            //         })
            //        folder.focus()
            //     }
            //     folder.refresh()                    
            // }
        },
        async extendedRename() {
            // const folder = this.getActiveFolder()
            // if (folder.canExtendedRename()) {
            //     const param = { isEnabled: folder.getExtendedRename() }
            //     const result = await this.$refs.dialog.show({
            //         ok: true, 
            //         cancel : true,
            //         defButton: "ok",
            //         extendedRename: param
            //     })
            //     folder.focus()
            //     if (result.result == 1) 
            //         folder.setExtendedRename(param.isEnabled) 
            // }
        },
        onLeftDelete() {
//            this.deleteItems(this.$refs.leftFolder)
        },
        onRightDelete() {
//            this.deleteItems(this.$refs.rightFolder)
        },
        async copyItems(move: boolean) {
            // const sourceFolder = this.getActiveFolder()
            // const sourceProcessor = sourceFolder.getProcessor()
            // const targetFolder = this.getInactiveFolder()
            // const selectedItems = sourceFolder.getSelectedItems()
            // await this.doCopyItems(sourceProcessor, sourceFolder, targetFolder, selectedItems, move)
        },
        // async deleteItems(folder) {
        //     if (!folder)
        //         folder = this.getActiveFolder()
        //     if (folder.canDeleteItems()) 
        //         await folder.deleteItems(this.$refs.dialog)
        // },
        getActiveFolderEventBus(): Vue {
            return this.leftHasFocus ? this.leftFolderEventBus : this.rightFolderEventBus
        },
        getInactiveFolderEventBus(): Vue {
            return this.leftHasFocus ? this.rightFolderEventBus : this.leftFolderEventBus
        },
        // getOtherFolder(folder) {
        //     return folder == this.$refs.leftFolder 
        //         ? this.$refs.rightFolder 
        //         : this.$refs.leftFolder
        // },
        // leftDropFiles(param) {
        //     this.dropFiles(this.$refs.leftFolder, param)
        // },
        // rightDropFiles(param) {
        //     this.dropFiles(this.$refs.rightFolder, param)
        // },
        // dropFiles(targetFolder, param) {
        //     this.doCopyItems(createProcessor(null, param.sourcePath), null, targetFolder, param.files, param.dropEffect == "move")
        // },        
        // async doCopyItems(sourceProcessor, sourceFolder, targetFolder, selectedItems, move) {
        //     if (!sourceFolder) {
        //         const candidate = this.getOtherFolder(targetFolder)
        //         if (candidate.getProcessor().path == sourceProcessor.path)
        //             sourceFolder = candidate
        //     }
        //     if (targetFolder.canInsertItems() &&  (move ? sourceProcessor.canMoveItems() : sourceProcessor.canCopyItems())) {
        //         var conflictItems = await sourceProcessor.getConflictItems(targetFolder.path, selectedItems.map(n => n.name))
        //         const action = move ? "verschieben": "kopieren"
        //         const  dirs = selectedItems.filter( n => n.isDirectory).length
        //         const  files = selectedItems.filter( n => !n.isDirectory).length
        //         const activeFolder = this.getActiveFolder()
        //         // TODO: Dont copy in the same folder or in a subfolder
        //         const text = 
        //             conflictItems == 0
        //             ? (files && dirs
        //                 ? `Möchtest Du die selektierten Einträge ${action}?`
        //                 : (files
        //                     ? (files > 1
        //                         ? `Möchtest Du die selektierten Dateien ${action}?`
        //                         : `Möchtest Du die selektierte Datei '${selectedItems[0].name}' ${action}?`)
        //                     : (dirs > 1
        //                         ? `Möchtest Du die selektierten Verzeichnisse ${action}?`
        //                         : `Möchtest Du das selektierte Verzeichnis '${selectedItems[0].name}' ${action}?`)
        //                     )
        //                 )
        //             : "Möchtest Du die Einträge überschreiben?"
        //         // const result = await this.$refs.dialog.show({
        //         //     yes: conflictItems.length > 0, 
        //         //     no: conflictItems.length > 0, 
        //         //     ok : conflictItems.length == 0,
        //         //     rightFolder: sourceFolder ? sourceFolder == this.$refs.rightFolder : null,
        //         //     leftFolder: sourceFolder ? sourceFolder == this.$refs.leftFolder : null,
        //         //     text,
        //         //     cancel: true,
        //         //     defButton: "yes",
        //         //     conflictItems: conflictItems.length > 0 ? conflictItems : null,
        //         // })
        //         // if (sourceFolder)
        //         //     sourceFolder.focus()
        //         // else if (activeFolder)
        //         //     activeFolder.focus()
        //         // else
        //         //     leftFolder.focus()
        //         // if (result.result) {
        //         //     await sourceProcessor.copyItems(selectedItems, targetFolder.path, move, 
        //         //         result.result == 3 ? conflictItems.map(n => n.name) : null)
        //         //     if (move && sourceFolder)
        //         //         sourceFolder.refresh()
        //         //     targetFolder.refresh()
        //         // }
        //     }
        // }
    }
})
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
    will-change: filter;
}
.content.dialogOpen {
    filter: blur(2px);
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
