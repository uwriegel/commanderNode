<template>
    <div class="commander" @keydown=onKeyDown>
        <splitter-grid class="content"
            :isVertical=true :isSecondInvisible="!showViewer" @splitter-position-changed="viewerHeightChanged">
            <template v-slot:first>
                <splitter-grid>
                    <template v-slot:first>
                        <folder :eventBus="modelLeft.folderEventBus" class="folder" id="left" @focus-in=onLeftFocus @on-processor=onLeftProcessor
                        @selection-changed=onLeftSelectionChanged @selected-items-changed=onLeftSelectedItemsChanged @item-count-changed=onLeftItemCountChanged  
                        @drop-files="leftDropFiles"></folder>
                    </template>
                    <template v-slot:second>
                        <folder :eventBus="modelRight.folderEventBus" class="folder" id="right" @focus-in=onRightFocus @on-processor=onRightProcessor
                        @selection-changed=onRightSelectionChanged @selected-items-changed=onRightSelectedItemsChanged @item-count-changed=onRightItemCountChanged 
                        @drop-files="rightDropFiles"></folder>
                    </template>
                </splitter-grid>
            </template>
            <template v-slot:second>
                <viewer class="viewer" :src=model.selectedItem.path></viewer>
            </template>
        </splitter-grid>
        <div class="status">
            <span>{{ model.selectedItem.path }}</span>    
            <span class="space"/>
            <span>{{ model.selectedItems.length }}</span>    
            <span>/</span>
            <span>{{ model.itemCount }}</span>    
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import SplitterGrid from './controls/SplitterGrid.vue'
import Folder, { SelectedItem } from './controls/Folder.vue'
import Viewer from './controls/Viewer.vue'
import MainDialog from './controls/MainDialog.vue'
import { mapState } from 'vuex'
import { createProcessor, FolderItem, Processor, getDefaultProcessor } from '../processors/processor'
const electron = window.require('electron')

interface Model {
    folderEventBus: Vue
    processor: Processor
    selectedItem: SelectedItem
    selectedItems: FolderItem[]
    itemCount: number
}

// TODO: Rename with copy
// TODO: Status displays alternativly # selected items
export default Vue.extend({
    data() {
        return {
            leftHasFocus: true,
            modelLeft: { 
                folderEventBus: new Vue(),
                processor: getDefaultProcessor(),   
                selectedItem: { item: undefined, path: undefined } as SelectedItem,
                selectedItems: [] as FolderItem[],
                itemCount: 0
            },
            modelRight: { 
                folderEventBus: new Vue(),
                processor: getDefaultProcessor(),   
                selectedItem: { item: undefined, path: undefined } as SelectedItem,
                selectedItems: [] as FolderItem[],
                itemCount: 0
            },
            dialogOpen: false,
        }
    },
    components: {
        SplitterGrid,
        Folder,
        Viewer,
        MainDialog
    },
    computed: {
        model(): Model {
            return this.leftHasFocus ? this.modelLeft : this.modelRight
        },
        // mix this into the outer object with the object spread operator
        ...mapState(['showViewer'])
    },
    mounted() {
        this.modelLeft.folderEventBus.$emit('focus')
        electron.ipcRenderer.on("REFRESH", (event: any , data: any) => this.refresh())
        electron.ipcRenderer.on("ADAPT_PATH", (event: any , data: any) => this.openSameFolder())
        electron.ipcRenderer.on("CREATE_FOLDER", async (event: any , data: any) => this.createFolder())
        electron.ipcRenderer.on("DELETE_FILES", async (event: any , data: any) => this.deleteItems())
    },
    methods: {
        refresh() {
            this.model.folderEventBus.$emit('refresh')
        },
        getInactiveModel(): Model {
            return this.leftHasFocus ? this.modelRight : this.modelLeft
        },
        properties() { electron.ipcRenderer.send("showInfo", this.model.selectedItem) },
        openAs() { electron.ipcRenderer.send("openAs", this.model.selectedItem) },
        viewerHeightChanged() {
            this.modelLeft.folderEventBus.$emit('resize')
            this.modelRight.folderEventBus.$emit('resize')
        },
        onKeyDown(evt: KeyboardEvent) {
            if (evt.which == 9 && !evt.shiftKey && (evt.target as HTMLInputElement).tagName != "INPUT") {
                this.getInactiveModel().folderEventBus.$emit("focus");
                evt.preventDefault()
            }
        },
        onLeftFocus() { 
            console.log("leftHasFocus = true ")
            this.leftHasFocus = true 
        },
        onRightFocus() { 
            console.log("leftHasFocus = false ")
            this.leftHasFocus = false 
        },
        onLeftProcessor(processor: Processor) {
            this.modelLeft.processor = processor
        },
        onRightProcessor(processor: Processor) {
            this.modelRight.processor = processor
        },
        onLeftSelectionChanged(newItem: SelectedItem) {
            this.modelLeft.selectedItem = newItem
        },
        onRightSelectionChanged(newItem: SelectedItem) {
            this.modelRight.selectedItem = newItem
        },
        onLeftSelectedItemsChanged(selectedItems: FolderItem[]) { 
            this.modelLeft.selectedItems = selectedItems 
        },
        onRightSelectedItemsChanged(selectedItems: FolderItem[]) { 
            this.modelRight.selectedItems = selectedItems 
        },
        onLeftItemCountChanged(count: number) {
            this.modelLeft.itemCount = count
        },
        onRightItemCountChanged(count: number) {
            this.modelRight.itemCount = count
        },
        async createFolder() {
             if (this.model.processor.canCreateFolder()) {
                const proposalName = 
                    this.model.selectedItem.item && this.model.selectedItem.item.isDirectory && this.model.selectedItem.item.name != ".."
                    ? this.model.selectedItem.item.name 
                    : ""
                console.log("CreateFolder", proposalName)
                 

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
            }
        },
        openSameFolder() {
            this.getInactiveModel().folderEventBus.$emit("change-folder", this.model.processor.path)
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
        async copyItems(move: boolean) {
            // const sourceFolder = this.getActiveFolder()
            // const sourceProcessor = sourceFolder.getProcessor()
            // const targetFolder = this.getInactiveFolder()
            // const selectedItems = sourceFolder.getSelectedItems()
            // await this.doCopyItems(sourceProcessor, sourceFolder, targetFolder, selectedItems, move)
        },
        async deleteItems() {
            const items = this.getItemsToProcess()
                if (items.length > 0) {
                    console.log("delete")
                }
            // TODO: DeleteItems
        //     if (folder.canDeleteItems()) 
        //         await folder.deleteItems(this.$refs.dialog)
        },
        leftDropFiles(param: any) {
        //     this.dropFiles(this.$refs.leftFolder, param)
        },
        rightDropFiles(param: any) {
        //     this.dropFiles(this.$refs.rightFolder, param)
        },
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
        getItemsToProcess() {
            return this.model.selectedItems.length > 0 
                ? this.model.selectedItems
                : this.model.selectedItem.item  && this.model.selectedItem.item.name != ".."            
                    ? [ this.model.selectedItem.item ]
                    : []
        }
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
.folder {
    flex-grow: 1;
}
.viewer {
    flex-grow: 1;
}
.status {
    padding: 2px 2px 1px 5px;
    height: var(--status-height); 
    color: var(--selected-color);
    background-color: var(--selected-background-color);
}
.space {
    margin-left: 10px;
}
</style>
