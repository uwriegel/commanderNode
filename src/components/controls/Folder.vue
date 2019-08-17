<template>
    <div tabindex="1" class="root" v-stream:keydown='keyDown$' @focus=focus @focusin=onfocusIn 
            @dragenter='onDragEnter' @dragleave='onDragLeave' @dragover='onDragOver' @drop='onDrop'> 
        <input ref="input" v-selectall @keydown='onInputKeyDown' :value="path">
        <table-view ref="table" :columns='tableViewColumns' :items='items' :itemHeight='18' :class="{isDragging: isDragging}"
                @column-click='onSort' 
                @columns-widths-changed='onColumnsWidthChanged' @action='onAction' @selection-changed=onSelectionChanged @delete='onDelete'>
            <template v-slot=row>
                <tr v-if='processor.name == "directory" && row.item.isDirectory ' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden, 'isSelected': row.item.isSelected }">
                    <td class="icon-name">
                        <folder-icon class=icon></folder-icon>
                        {{ row.item.name }}
                    </td>  
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-if='processor.name == "directory" && !row.item.isDirectory ' 
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
                    <td class="icon-name">
                        <drive-icon class=icon></drive-icon>
                        {{ row.item.name }}
                    </td>
                    <td>{{ row.item.description }}</td>
                    <td class="size">{{ row.item.size | size }}</td>
                </tr>
            </template>
        </table-view>
        <transition name="slide">
            <input class="restrictor" disabled v-show="restrictValue.length" :value="restrictValue">
        </transition>
    </div>
</template>

<script>
import { getDefaultProcessor, combinePath } from '../../processors/processor'
import TableView from './TableView'
import DriveIcon from '../../icons/DriveIcon'
import FolderIcon from '../../icons/FolderIcon'
import { Observable, map, pipe, filter } from "rxjs/operators"
import { mapState } from 'vuex'

export default {
    components: {
        TableView,
        DriveIcon,
        FolderIcon
    },
    data() {
        return {
            columns: [],
            items: [],
            processor: getDefaultProcessor(),
            path: "",
            restrictValue: "",
            isDragging: false
        }
    },
    props: [
        "id"
    ],
    watch: {
        path(newVal) {
            if (this.processor.path != newVal)
                this.changePath(newVal, null, true)
        },
        showHidden() {
            this.changePath(this.path)
        }
    },
    domStreams: ["keyDown$"],
    created() {
        const path = localStorage[`${this.id}-path`] || "root"
        this.changePath(path, null, true)
    },
    mounted() {
        const shiftTabs$ = this.keyDown$.pipe(filter(n => n.event.which == 9 && n.event.shiftKey))
        const inputChars$ = this.keyDown$.pipe(filter(n => !n.event.altKey && !n.event.ctrlKey && !n.event.shiftKey && n.event.key.length > 0 && n.event.key.length < 2 
                                && n.event.target != this.$refs.input))
        const backSpaces$ = this.keyDown$.pipe(filter(n => n.event.which == 8))
        const escapes$ = this.keyDown$.pipe(filter(n => n.event.which == 27))

        this.$subscribeTo(shiftTabs$, n => {
            this.$refs.input.focus()
            n.event.preventDefault()
        })
        this.$subscribeTo(inputChars$, evt => this.restrictTo(evt.event))
        this.$subscribeTo(backSpaces$, () => this.restrictBack())
        this.$subscribeTo(escapes$, () => this.restrictClose())

        this.initializeSelection()        
    },
    computed: {
        tableViewColumns() { 
            return this.columns.values 
        },
        // mix this into the outer object with the object spread operator
        ...mapState(['showHidden'])
    },
    methods: {
        focus() { this.$refs.table.focus() },
        onfocusIn() { this.$emit("focus-in") },
        refresh() {
            this.changePath(this.path, this.path, false)
        },
        changeFolder(path) { 
            this.changePath(path, path, true)
        },
        onInputKeyDown(evt) {
            switch (evt.which) {
                case 9: // TAB
                    this.focus()
                    break
                case 13: // enter
                    this.path = this.$refs.input.value
                    this.focus()
                    break
                default:
                    return // exit this handler for other keys
            }
            evt.preventDefault() // prevent the default action (scroll / move caret)
        },
        onColumnsWidthChanged(widths) {
            localStorage[this.getStorageColumnsWidthName()] = JSON.stringify(widths)
        },
        onDelete() {
            this.$emit("delete")
        },
        onDragEnter(evt) {
            if (this.$refs.table.$el.contains(evt.target)) 
                this.isDragging = true
        },
        onDragLeave(evt) {
            if (!(evt.fromElement && this.$refs.table.$el.contains(evt.fromElement)))
                this.isDragging = false
        },
        onDrop(evt) {
            this.isDragging = false
            console.log(evt)
            for (const f of evt.dataTransfer.files) {
                console.log('File(s) you dragged here: ', f.path)
            }            
            return false
        },
        onDragOver(evt) {
            if (this.isDragging) {
                evt.dataTransfer.dropEffect = 
                    evt.dataTransfer.allowedEffect == "move" 
                    || evt.dataTransfer.effectAllowed == "copyMove"
                    || evt.dataTransfer.effectAllowed == "linkMove"
                    || evt.dataTransfer.effectAllowed == "all"
                    ? "move" 
                    : (evt.dataTransfer.allowedEffect == "copy" 
                        || evt.dataTransfer.effectAllowed == "copyMove"
                        || evt.dataTransfer.effectAllowed == "copyLink"
                        || evt.dataTransfer.effectAllowed == "all"
                        ? "copy"
                        : none)
                if (evt.ctrlKey && evt.dataTransfer.dropEffect == "move" && (evt.dataTransfer.allowedEffect == "copy" 
                        || evt.dataTransfer.effectAllowed == "copyMove"
                        || evt.dataTransfer.effectAllowed == "copyLink"
                        || evt.dataTransfer.effectAllowed == "all"))
                    evt.dataTransfer.dropEffect = "copy"
                    
                evt.preventDefault(); // Necessary. Allows us to drop.
            }
            else
                evt.dataTransfer.dropEffect = "none"
        },
        async changePath(path, lastPath, checkProcessor) {
            this.restrictClose(true)
            if (checkProcessor) 
                this.changeProcessor(this.processor.getProcessor(path))
            this.items = await this.processor.getItems(path, this.showHidden)
            this.path = path
            localStorage[`${this.id}-path`] = path
            if (lastPath) {
                const newPos = this.items.findIndex(n => n.name == lastPath)
                if (newPos != -1) 
                    setTimeout(() => this.$refs.table.setCurrentIndex(newPos))
            }
        },
        onResize() { this.$refs.table.onResize() },
        onSort(index, descending) {
            const selected = this.items[this.$refs.table.index]
            this.items = this.processor.sort(this.items, index, descending, this.showHidden)
            const newPos = this.items.findIndex(n => n == selected)
            setTimeout(() => this.$refs.table.setCurrentIndex(newPos))
        },
        onAction(item) {
            const result = this.processor.onAction(item)
            if (!result.done) {
                if (result.newProcessor)
                    this.changeProcessor(result.newProcessor)
                this.changePath(result.path, result.lastPath)
            }
        },
        onSelectionChanged(newIndex) { this.$emit('selection-changed', this.getSelectedItem(newIndex)) },
        getSelectedItem(selectedIndex) { 
            return this.$refs.table && this.path
                ? this.processor.getItemWithPath(this.path, this.items[selectedIndex || this.$refs.table.index]) 
                : ""
        },
        getSelectedItems() {
            const items = this.items.filter(n => n.isSelected)
            return items.length > 0 
            ? items 
            : (this.items[this.$refs.table.index].name != ".." 
                ? [ this.items[this.$refs.table.index] ] 
                : [])
        },
        canDeleteItems() { return this.processor.canDelete() },
        canCreateFolder() { return this.processor.canCreateFolder() },
        canCopyItems() { return this.processor.canCopyItems() },
        canMoveItems() { return this.processor.canMoveItems() },
        canInsertItems() { return this.processor.canInsertItems() },
        canRename() { return this.processor.canRename() },
        async getConflictItems(targetPath, selectedItems) {
            return this.processor.getConflictItems(targetPath, selectedItems.map(n => n.name))
        },
        getStorageColumnsWidthName() { return this.id + '-' + this.processor.name + '-columnsWidths'},
        changeProcessor(processor) {
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
        restrictTo(evt) {
            const items = this.items.filter(n => n.name.toLowerCase().startsWith(this.restrictValue + evt.key))
            if (items.length > 0) {
                if (!this.originalItems)
                    this.originalItems = this.items
                this.restrictValue += evt.key      
                this.items = items      
            }
        },
        restrictClose(leaveItems) {
            this.restrictValue = ""
            if (this.originalItems && !leaveItems)
                this.items = this.originalItems
            this.originalItems = null
        },
        restrictBack() {
            if (this.restrictValue.length > 0) {
                this.restrictValue = this.restrictValue.substr(0, this.restrictValue.length - 1);
                if (this.restrictValue.length == 0)
                    this.restrictClose()
                else 
                    this.items = this.originalItems.filter(n => n.name.toLowerCase().startsWith(this.restrictValue))
            }
        },
        deleteFiles(itemsToDelete) {
            return this.processor.deleteFiles(itemsToDelete)
        },
        createFolder(folderName) {
            return this.processor.createFolder(folderName)
        },
        renameItem(name, newName) {
            return this.processor.renameItem(name, newName)
        },
        copyItems(selectedItems, targetPath, move, conflictItems) {
            return this.processor.copyItems(selectedItems, targetPath, move, conflictItems)
        },
        initializeSelection() {
            const ends$ = this.keyDown$.pipe(filter(n => n.event.which == 35 && n.event.shiftKey))
            const homes$ = this.keyDown$.pipe(filter(n => n.event.which == 36 && n.event.shiftKey))
            const inserts$ = this.keyDown$.pipe(filter(n => n.event.which == 45))
            const pluses$ = this.keyDown$.pipe(filter(n => n.event.which == 107))
            const minuses$ = this.keyDown$.pipe(filter(n => n.event.which == 109))

            const toggleSelection = () => {
                const item = this.items[this.$refs.table.index]
                if (item.isSelected != undefined)
                    item.isSelected = !item.isSelected
            }

            this.$subscribeTo(inserts$, () => {
                toggleSelection()
                if (this.$refs.table.index < this.items.length - 1) 
                    this.$refs.table.setCurrentIndex(this.$refs.table.index + 1)
            })
            this.$subscribeTo(pluses$, () => this.items.forEach(n => {
                if (n.isSelected != undefined)
                    n.isSelected = true
            }))
            this.$subscribeTo(minuses$, () => this.items.forEach(n => {
                if (n.isSelected != undefined)
                    n.isSelected = false
            }))
            this.$subscribeTo(homes$, () => this.items.forEach((n, i) => {
                if (n.isSelected != undefined) 
                    n.isSelected = i <= this.$refs.table.index
            }))
            this.$subscribeTo(ends$, () => this.items.forEach((n, i) => {
                if (n.isSelected != undefined)
                    n.isSelected = i >= this.$refs.table.index
            }))
        }
    }
}
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
