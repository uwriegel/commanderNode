<template>
    <div tabindex="1" class="root" @focus=focus @focusin=onfocusIn 
            @dragenter='onDragEnter' @dragleave='onDragLeave' @dragover='onDragOver' @drop='onDrop'> 
        <input ref="input" v-selectall @keydown='onInputKeyDown' :value="path">
        <table-view class='table' :eventBus="tableEventBus" :columns='tableViewColumns' :items='items' :itemHeight='18' 
                :class="{isDragging: isDragging, isDragStarted: isDragStarted, isBacktrackEnd: isBacktrackEnd}"
                @column-click='onSort' v-stream:keydown.native='keyDown$'
                @columns-widths-changed='onColumnsWidthChanged' @action='onAction' @selection-changed=onSelectionChanged @delete='onDelete'>
            <template v-slot=row>
                <tr v-if='processor.name == "directory" && row.item.isDirectory' 
                        draggable="true" @dragstart='onDragStart' @drag='onDrag' @dragend='onDragEnd'
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden, 'isSelected': row.item.isSelected }">
                    <td v-if='row.item.name == ".."' class="icon-name">
                        <parent-icon class=icon></parent-icon>
                        {{ row.item.name }}
                    </td>  
                    <td v-if='row.item.name != ".."' class="icon-name">
                        <folder-icon class=icon></folder-icon>
                        {{ row.item.name }}
                    </td>  
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-if='processor.name == "directory" && !row.item.isDirectory ' 
                        draggable="true" @dragstart='onDragStart' @drag='onDrag' @dragend='onDragEnd'
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden, 'isSelected': row.item.isSelected }">
                    <td class="icon-name">
                        <img :src='row.item.name | iconUrl(processor.path)' alt="">
                        {{ row.item.name | nameOnly }}
                    </td>
                    <td>{{ row.item.name | extension }}</td>
                    <td :class="{ 'isExif': row.item.isExifDate }">{{ row.item.time | dateTime }}</td>
                    <td class="size">{{ row.item.size | size }}</td>
                    <td>{{ row.item.version | version }}</td>
                </tr>
                <tr v-if='processor.name == "root"' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden }">
                    <td v-if='row.item.type != 5 && row.item.type != 6' class="icon-name">
                        <drive-icon class=icon></drive-icon>
                        {{ row.item.name }}
                    </td>
                    <td v-if='row.item.type == 6' class="icon-name">
                        <share-icon class=icon></share-icon>
                        {{ row.item.name }}
                    </td>
                    <td v-if='row.item.type == 5' class="icon-name">
                        <service-icon class=icon></service-icon>
                        {{ row.item.name }}
                    </td>
                    <td>{{ row.item.description }}</td>
                    <td class="size">{{ row.item.size | size }}</td>
                </tr>
                <tr v-if='processor.name == "extendedRename" && row.item.isDirectory' 
                        draggable="true" @dragstart='onDragStart' @drag='onDrag' @dragend='onDragEnd'
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden, 'isSelected': row.item.isSelected }">
                    <td v-if='row.item.name == ".."' class="icon-name">
                        <parent-icon class=icon></parent-icon>
                        {{ row.item.name }}
                    </td>  
                    <td v-if='row.item.name != ".."' class="icon-name">
                        <folder-icon class=icon></folder-icon>
                        {{ row.item.name }}
                    </td>  
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-if='processor.name == "extendedRename" && !row.item.isDirectory ' 
                        draggable="true" @dragstart='onDragStart' @drag='onDrag' @dragend='onDragEnd'
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden, 'isSelected': row.item.isSelected }">
                    <td class="icon-name">
                        <img :src='row.item.name | iconUrl(processor.path)' alt="">
                        {{ row.item.name | nameOnly }}
                    </td>
                    <td>{{ row.item.newName }}</td>
                    <td>{{ row.item.name | extension }}</td>
                    <td :class="{ 'isExif': row.item.isExifDate }">{{ row.item.time | dateTime }}</td>
                    <td class="size">{{ row.item.size | size }}</td>
                </tr>
                <tr v-if='processor.name == "services"' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 
                        'isHidden': row.item.status != 4 && row.item.name != '..', 
                        'isStarting': row.item.status == 2 && row.item.name != '..', 
                        'isStopping': row.item.status == 3 && row.item.name != '..', 
                        'isSelected': row.item.isSelected }">
                    <td v-if='row.item.name == ".."' class="icon-name">
                        <parent-icon class=icon></parent-icon>
                        {{ row.item.name }}
                    </td>
                    <td v-if='row.item.name != ".."' class="icon-name">
                        <service-icon class=icon></service-icon>
                        {{ row.item.name }}
                    </td>
                    <td>{{ row.item.displayName }}</td>
                </tr>
                <tr v-if='processor.name == "shares"' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isSelected': row.item.isSelected }">
                    <td v-if='row.item.name == ".."' class="icon-name">
                        <parent-icon class=icon></parent-icon>
                        {{ row.item.name }}
                    </td>
                    <td v-if='row.item.name != ".."' class="icon-name">
                        <share-icon class=icon></share-icon>
                        {{ row.item.name }}
                    </td>
                </tr>
                <tr v-if='processor.name == "share"' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isSelected': row.item.isSelected }">
                    <td v-if='row.item.name == ".."' class="icon-name">
                        <parent-icon class=icon></parent-icon>
                        {{ row.item.name }}
                    </td>
                    <td v-if='row.item.name != ".."' class="icon-name">
                        <share-icon class=icon></share-icon>
                        {{ row.item.name }}
                    </td>
                    <td>{{ row.item.description }}</td>
                </tr>                
            </template>
        </table-view>
        <transition name="slide">
            <input class="restrictor" disabled v-show="restrictValue.length" :value="restrictValue">
        </transition>
    </div>
</template>

<script lang="ts">
import Vue, { PropType} from 'vue'
import { getDefaultProcessor, combinePath, ROOT, createProcessor, Processor, FolderColumns, FolderType } from '../../processors/processor'
//import { create as createExtendedRename, reset as resetExtendedRename } from '../../processors/extendedRename'
import TableView from './TableView.vue'
// import ParentIcon from '../../icons/ParentIcon'
// import DriveIcon from '../../icons/DriveIcon'
// import FolderIcon from '../../icons/FolderIcon'
// import ServiceIcon from '../../icons/ServiceIcon'
// import ShareIcon from '../../icons/ShareIcon'
// import { Observable, map, pipe, filter } from "rxjs/operators"
import { mapState } from 'vuex'
import { Column } from './Columns.vue'
// import { getExtension } from '../../pipes'
// import { renameFiles } from "../../extendedRename"
// const path = window.require('path')

// TODO: drag: icon
export default Vue.extend({
    components: {
        TableView,
        // ParentIcon,
        // DriveIcon,
        // FolderIcon,
        // ServiceIcon,
        // ShareIcon
    },
    data() {
        return {
            tableEventBus: new Vue(),
            columns: {type: FolderType.DEFAULT, values: [] } as FolderColumns,
            items: [],
            processor: getDefaultProcessor(),
            path: "",
            restrictValue: "",
            isDragging: false,
            isDragStarted: false,
            isBacktrackEnd: false
        }
    },
    props: {
        eventBus: Object as PropType<Vue>,
        id: String
    },
    watch: {
        path(newVal: string) {
            // if (this.processor.path != newVal) {
            //     this.changePath(newVal, null, true)
            // }
        },
        showHidden() {
//            this.changePath(this.path)
        }
    },
    domStreams: ["keyDown$"],
    created() {
        const path = localStorage[`${this.id}-path`] || ROOT
        // this.backtrack = []
        // this.backtrackPosition = -1
        this.changePath(path, undefined, true)
    },
    mounted() {
        this.eventBus.$on('focus', this.focus)

        // const shiftTabs$ = this.keyDown$.pipe(filter(n => n.event.which == 9 && n.event.shiftKey))
        // const inputChars$ = this.keyDown$.pipe(filter(n => !n.event.altKey && !n.event.ctrlKey && !n.event.shiftKey && n.event.key.length > 0 && n.event.key.length < 2))
        // const backSpaces$ = this.keyDown$.pipe(filter(n => n.event.which == 8))
        // const escapes$ = this.keyDown$.pipe(filter(n => n.event.which == 27))

        // this.$subscribeTo(shiftTabs$, n => {
        //     this.$refs.input.focus()
        //     n.event.preventDefault()
        // })
        // this.$subscribeTo(inputChars$, evt => this.restrictTo(evt.event))
        // this.$subscribeTo(backSpaces$, evt => this.onBacktrack(evt.event))
        // this.$subscribeTo(backSpaces$, () => this.restrictBack())
        // this.$subscribeTo(escapes$, () => this.restrictClose())

        // this.initializeSelection()        
    },
    computed: {
        tableViewColumns(): Column[] { 
            return this.columns.values
        },
        // mix this into the outer object with the object spread operator
        //...mapState(['showHidden'])
    },
    methods: {
        focus() { this.tableEventBus.$emit("focus") },
        // onfocusIn() { this.$emit("focus-in") },
        // refresh() {
        //     this.changePath(this.path, this.path, false)
        // },
        // changeFolder(path) { 
        //     this.changePath(path, path, true)
        // },
        // onBacktrack(evt) {
        //     if (!this.restrictValue) 
        //         this.changePath(null, null, true, evt.ctrlKey ? 1 : -1) 
        // },
        // onInputKeyDown(evt) {
        //     switch (evt.which) {
        //         case 9: // TAB
        //             this.focus()
        //             break
        //         case 13: // enter
        //             this.path = this.$refs.input.value
        //             this.focus()
        //             break
        //         default:
        //             return // exit this handler for other keys
        //     }
        //     evt.preventDefault() // prevent the default action (scroll / move caret)
        // },
        onColumnsWidthChanged(widths: string[]) {
            localStorage[this.getStorageColumnsWidthName()] = JSON.stringify(widths)
        },
        // onDelete() {
        //     this.$emit("delete")
        // },
        // onDragStart(evt) {
        //     this.isDragStarted = true
        //     const files = this.getSelectedItems().map(n => { return {
        //                 dir: this.path, 
        //                 name: n.name,
        //                 size: n.size,
        //                 time: n.time
        //             }
        //         })
        //     evt.dataTransfer.setData("copyFiles", JSON.stringify(files));
        // },
        // onDrag(evt) {
        //     if (evt.screenX == 0 && evt.screenY == 0) {
        //         electron.ipcRenderer.send("dragStart", this.getSelectedItems().map(n => path.join(this.path, n.name)))
        //         this.isDragStarted = false
        //         evt.preventDefault()
        //     }
        // },
        // onDragEnd(evt) {
        //     this.isDragStarted = false
        // },
        // onDragEnter(evt) {
        //     if (this.$refs.table.$el.contains(evt.target) && !this.isDragStarted) 
        //         this.isDragging = true
        // },
        // onDragLeave(evt) {
        //     if (!(evt.fromElement && this.$refs.table.$el.contains(evt.fromElement)))
        //         this.isDragging = false
        // },
        // onDragOver(evt) {
        //     if (this.isDragging) {
        //         evt.dataTransfer.dropEffect = 
        //             evt.dataTransfer.allowedEffect == "move" 
        //             || evt.dataTransfer.effectAllowed == "copyMove"
        //             || evt.dataTransfer.effectAllowed == "linkMove"
        //             || evt.dataTransfer.effectAllowed == "all"
        //             ? "move" 
        //             : (evt.dataTransfer.allowedEffect == "copy" 
        //                 || evt.dataTransfer.effectAllowed == "copyMove"
        //                 || evt.dataTransfer.effectAllowed == "copyLink"
        //                 || evt.dataTransfer.effectAllowed == "all"
        //                 ? "copy"
        //                 : "none")
        //         if (evt.ctrlKey && evt.dataTransfer.dropEffect == "move" && (evt.dataTransfer.allowedEffect == "copy" 
        //                 || evt.dataTransfer.effectAllowed == "copyMove"
        //                 || evt.dataTransfer.effectAllowed == "copyLink"
        //                 || evt.dataTransfer.effectAllowed == "all"))
        //             evt.dataTransfer.dropEffect = "copy"
        //             this.dropEffect = evt.dataTransfer.dropEffect
                    
        //         evt.preventDefault(); // Necessary. Allows us to drop.
        //     }
        // },
        // onDrop(evt) {
        //     this.isDragging = false

        //     const data = evt.dataTransfer.getData("copyFiles")
        //     const pathes = 
        //         data 
        //         ? JSON.parse(data)
        //         : Array.from(evt.dataTransfer.files).map(n => { return { 
        //                 dir: path.dirname(n.path), 
        //                 name: n.name,
        //                 size: n.size,
        //                 time: n.lastModifiedDate
        //             }})
        //     if (pathes.length > 0) {
        //         var sourcePath = pathes[0].dir
        //         if (!pathes.some(n => n.dir != sourcePath)) 
        //             this.$emit("drop-files", {
        //                 dropEffect: this.dropEffect,
        //                 sourcePath,
        //                 files: pathes
        //             })
        //     }
        //     return false
        // },
        async changePath(path: string, lastPath?: string, checkProcessor?: boolean, backtrackDirection?: number) {
        //    this.restrictClose(true)

            switch (backtrackDirection) {
        //         case -1: 
        //             if (this.backtrackPosition < 1) {
        //                 this.isBacktrackEnd = true
        //                 setTimeout(() => this.isBacktrackEnd = false, 300)
        //                 return
        //             }
                        
        //             this.backtrackPosition -=  1
        //             path = this.backtrack[this.backtrackPosition]
        //             break
        //         case 1:
        //             if (this.backtrackPosition > this.backtrack.length - 2){
        //                 this.isBacktrackEnd = true
        //                 setTimeout(() => this.isBacktrackEnd = false, 300)
        //                 return
        //             }
        //             this.backtrackPosition +=  1
        //             path = this.backtrack[this.backtrackPosition]
        //             break
                default:
                    break
            }

            if (checkProcessor) 
                this.changeProcessor(createProcessor(this.processor, path))

        //     this.items = await this.processor.getItems(path, this.showHidden)
        //     const pathChanged = this.path != path
        //     this.path = path
        //     localStorage[`${this.id}-path`] = path
        //     if (!backtrackDirection && pathChanged)
        //         this.backtrackPosition = this.backtrack.push(path) -1
        //     if (lastPath) {
        //         const newPos = this.items.findIndex(n => n.name == lastPath)
        //         if (newPos != -1) 
        //             setTimeout(() => this.$refs.table.setCurrentIndex(newPos))
        //     }
        },
        // onResize() { this.$refs.table.onResize() },
        // onSort(index, descending) {
        //     const selected = this.items[this.$refs.table.index]
        //     this.items = this.processor.sort(this.items, index, descending, this.showHidden)
        //     const newPos = this.items.findIndex(n => n == selected)
        //     this.onSelectedItemsChanged()
        //     setTimeout(() => this.$refs.table.setCurrentIndex(newPos))
        // },
        // onAction(item) {
        //     const selectedItems = this.getSelectedItems()
        //     const result = this.processor.onAction(item.isDirectory ? [ item ] : selectedItems)
        //     if (!result.done) {
        //         if (result.newProcessor)
        //             this.changeProcessor(result.newProcessor)
        //         this.changePath(result.path, result.lastPath)
        //     }
        // },
        // onSelectionChanged(newIndex) { this.$emit('selection-changed', this.getSelectedItem(newIndex)) },
        // onSelectedItemsChanged() {
        //     if (this.getExtendedRename()) {
        //         const prefix = localStorage["extendedRenamePrexix"]
        //         const digits = localStorage["extendedRenameDigits"]
        //         const startIndex = Number(localStorage["extendedRenameStartIndex"])

        //         const selectedItems = this.items.filter(n => !n.isDirectory && n.isSelected)    
        //         const unSelectedItems = this.items.filter(n => !n.isSelected)    
        //         unSelectedItems.forEach(n => n.newName = "")
        //         selectedItems.forEach((n, i) => {
        //             const newNameNumber = `${i+startIndex}`
        //             const nulls = digits - newNameNumber.length
        //             n.newName = `${prefix}${(nulls > 0 ? '0'.repeat(nulls) : '')}${newNameNumber}`
        //         })
        //     }
        // },
        // getSelectedItem(selectedIndex) { 
        //     return this.$refs.table && this.path
        //         ? this.processor.getItemWithPath(this.path, this.items[selectedIndex || this.$refs.table.index]) 
        //         : ""
        // },
        // getSelectedItems() {
        //     const items = this.items.filter(n => n.isSelected)
        //     return items.length > 0 
        //     ? items 
        //     : (this.items[this.$refs.table.index].name != ".." 
        //         ? [ this.items[this.$refs.table.index] ] 
        //         : [])
        // },
        // getProcessor() { return this.processor },
        // canDeleteItems() { return this.processor.canDelete() },
        // canCreateFolder() { return this.processor.canCreateFolder() },
        // canInsertItems() { return this.processor.canInsertItems() },
        // canRename() { return this.processor.canRename() },
        // canExtendedRename() { return this.processor.canExtendedRename() },
        // async deleteItems(dialog) { 
        //     const selectedItems = this.getSelectedItems()
        //     await this.processor.deleteItems(this, dialog, selectedItems) 
        // },
        getStorageColumnsWidthName(): string { 
            return `${this.id}-${this.processor.name}-columnsWidths`
        },
        changeProcessor(processor: Processor) {
            if (processor) {
                this.processor = processor
                const columns = this.processor.getColumns(this.columns)
                const value = localStorage[this.getStorageColumnsWidthName()]
                if (value) {
                    const widths = JSON.parse(value)
                    columns.values.forEach((n, i) => n.width = widths[i])
                }
                this.columns = columns
            }
        },
        // setExtendedRename(set) {
        //     this.changeProcessor(set ? createExtendedRename(this.processor) : resetExtendedRename(this.processor))
        //     this.restrictClose(true)
        //     this.onSelectedItemsChanged()
        //     const index = this.$refs.table.index
        //     this.$nextTick(() => this.$refs.table.setCurrentIndex(index))            
        //     this.$refs.table.setCurrentIndex(0)
        // },
        // getExtendedRename() {
        //     return this.processor.name == "extendedRename"
        // },
        // async renameExtended() {
        //     try {
        //         const selectedItems = this.getSelectedItems()

        //         const getNewName = (name, newNameWithoutExtension) => {
        //             const ext = getExtension(name)
        //             return newNameWithoutExtension + (ext ? `.${ext}` : '')
        //         }
                
        //         return await renameFiles(this.processor.path, selectedItems.map(n => { 
        //             return {
        //                 name: n.name,
        //                 newName: getNewName(n.name, n.newName)
        //             }
        //         }))
        //     } catch (err) {
        //         console.error("Could not rename", err)
        //         return false
        //     }
        // },
        // restrictTo(evt) {
        //     const items = this.items.filter(n => n.name.toLowerCase().startsWith(this.restrictValue + evt.key))
        //     if (items.length > 0) {
        //         if (!this.originalItems)
        //             this.originalItems = this.items
        //         this.restrictValue += evt.key      
        //         this.items = items      
        //     }
        // },
        // restrictClose(leaveItems) {
        //     this.restrictValue = ""
        //     if (this.originalItems && !leaveItems)
        //         this.items = this.originalItems
        //     this.originalItems = null
        // },
        // restrictBack() {
        //     if (this.restrictValue.length > 0) {
        //         this.restrictValue = this.restrictValue.substr(0, this.restrictValue.length - 1);
        //         if (this.restrictValue.length == 0)
        //             this.restrictClose()
        //         else 
        //             this.items = this.originalItems.filter(n => n.name.toLowerCase().startsWith(this.restrictValue))
        //     }
        // },
        // deleteFiles(itemsToDelete) {
        //     return this.processor.deleteFiles(itemsToDelete)
        // },
        // getCreateFolderText() { return this.processor.getCreateFolderText() },
        // createFolder(folderName) {
        //     return this.processor.createFolder(folderName)
        // },
        // renameItem(name, newName) {
        //     return this.processor.renameItem(name, newName)
        // },
        // initializeSelection() {
        //     const ends$ = this.keyDown$.pipe(filter(n => n.event.which == 35 && n.event.shiftKey))
        //     const homes$ = this.keyDown$.pipe(filter(n => n.event.which == 36 && n.event.shiftKey))
        //     const inserts$ = this.keyDown$.pipe(filter(n => n.event.which == 45))
        //     const pluses$ = this.keyDown$.pipe(filter(n => n.event.which == 107))
        //     const minuses$ = this.keyDown$.pipe(filter(n => n.event.which == 109))

        //     const toggleSelection = () => {
        //         const item = this.items[this.$refs.table.index]
        //         if (item.isSelected != undefined)
        //             item.isSelected = !item.isSelected
        //     }

        //     this.$subscribeTo(inserts$, () => {
        //         toggleSelection()
        //         if (this.$refs.table.index < this.items.length - 1) 
        //             this.$refs.table.setCurrentIndex(this.$refs.table.index + 1)
        //         this.onSelectedItemsChanged()
        //     })
        //     this.$subscribeTo(pluses$, () => this.items.forEach(n => {
        //         if (n.isSelected != undefined)
        //             n.isSelected = true
        //         this.onSelectedItemsChanged()
        //     }))
        //     this.$subscribeTo(minuses$, () => this.items.forEach(n => {
        //         if (n.isSelected != undefined)
        //             n.isSelected = false
        //         this.onSelectedItemsChanged()
        //     }))
        //     this.$subscribeTo(homes$, () => this.items.forEach((n, i) => {
        //         if (n.isSelected != undefined) 
        //             n.isSelected = i <= this.$refs.table.index
        //         this.onSelectedItemsChanged()
        //     }))
        //     this.$subscribeTo(ends$, () => this.items.forEach((n, i) => {
        //         if (n.isSelected != undefined)
        //             n.isSelected = i >= this.$refs.table.index
        //         this.onSelectedItemsChanged()
        //     }))
        // }
    }
})
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    position: relative;
}
input {
    font-size: 100%;
    box-sizing: border-box;
    background-color: var(--main-background-color);
    color: var(--main-color);
    margin-left: 3px;
    margin-right: 3px;
    border-style: none;
    width: calc(100% - 6px);
    outline-width: 0px;
}
.table {
    transition: .3s filter, 0.3s background-color;
    will-change: filter;
}
.table.isDragStarted {
    filter: blur(2px);
}
.table.isBacktrackEnd {
    background-color: rgba(255, 0, 0, 0.2);
}
.isDragging {
    background-color: var(--drag-highlight);
}
.isExif {
    color: blue;
}
.icon-name {
    display: block;
}
.icon {
    margin-right: 1px;
    fill: var(--icon-color);
    vertical-align: bottom;
}
.size {
    text-align: right;
    padding-right:10px;
}
tr {
    transition: background-color 0.3s;
}
tr.isHidden {
    opacity: 0.5;
}
tr.isSelected {
    color: white;
    background-color: blue;
}
tr.isSelected .isExif {
    color: yellow;
}
tr.isStarting {
    background-color: greenyellow;
    color: black;
}
tr.isStopping {
    color: black;
    background-color: red;
}
td {
    min-height: 16px;
}
img {
    vertical-align: bottom;
}
.restrictor {
    width: 70%;
    bottom: 10px;
    height: 18px;
    position: absolute;
    left: 5px;
    box-sizing: border-box;
    border-width: 1px;
    border-radius: 5px;
    padding: 1px 3px;
    border-style: solid;
    border-color: gray;
    color: rgba(0, 0, 0, 0.75);
    background-color: white;
    box-shadow: 3px 5px 12px 3px rgba(136, 136, 136, 0.55);    
}
.slide-enter-active, .slide-leave-active {
    transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
}
.slide-enter, .slide-leave-to {
    opacity: 0;
    width: 0%;
    height: 0px;
}
</style>
