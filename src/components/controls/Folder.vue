<template>
    <div class="root" v-stream:keydown='keyDown$'> 
        <input ref="input" v-selectall @keydown='onInputKeyDown' v-model.lazy="path">
        <table-view ref="table" :columns='tableViewColumns' :items='items' :itemHeight='18'
                @on-column-click='onSort' @on-columns-widths-changed='onColumnsWidthChanged' @on-action='onAction' >
            <template v-slot=row>
                <tr v-if='processor.name == "directory" && row.item.isDirectory ' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden }">
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
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden }">
                    <td class="icon-name">
                        <img :src='row.item.name | iconUrl(processor.path)' alt="">
                        {{ row.item.name | nameOnly }}
                    </td>
                    <td>{{ row.item.name | extension }}</td>
                    <td>{{ row.item.time | dateTime }}</td>
                    <td class="size">{{ row.item.size | size }}</td>
                    <td>{{ row.item.version }}</td>
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
import { getDefaultProcessor } from '../../processors/processor'
import TableView from './TableView'
import DriveIcon from '../../icons/DriveIcon'
import FolderIcon from '../../icons/FolderIcon'
import { Observable, map, pipe, filter } from "rxjs/operators"

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
            restrictValue: ""
        }
    },
    props: [
        "id"
    ],
    watch: {
        path(newVal, oldVal) {
            if (this.processor.path != newVal)
                this.changePath(newVal, null, true)
        }
    },
    domStreams: ["keyDown$"],
    created() {
        const path = localStorage[`${this.id}-path`] || "root"
        this.changePath(path, null, true)
    },
    mounted() {
        const inputChars$ = this.keyDown$.pipe(filter(n => !n.event.altKey && !n.event.ctrlKey && !n.event.shiftKey && n.event.key.length > 0 && n.event.key.length < 2))
        const backSpaces$ = this.keyDown$.pipe(filter(n => n.event.which == 8))
        const escapes$ = this.keyDown$.pipe(filter(n => n.event.which == 27))

        this.$subscribeTo(inputChars$, evt => this.restrictTo(evt.event))
        this.$subscribeTo(backSpaces$, evt => this.restrictBack())
        this.$subscribeTo(escapes$, evt => this.restrictClose())
    },
    computed: {
        tableViewColumns() { return this.columns.values }
    },
    methods: {
        // TODO: versions
        // TODO: exifs
        // TODO: Selections
        // TODO: Refresh
        // TODO: Hidden items

        focus() { this.$refs.table.focus() },
        onInputKeyDown(evt) {
            switch (evt.which) {
                case 9: // TAB
                    this.focus()
                    break
                default:
                    return // exit this handler for other keys
            }
            evt.preventDefault() // prevent the default action (scroll / move caret)
        },
        onColumnsWidthChanged: function(widths) {
            localStorage[this.getStorageColumnsWidthName()] = JSON.stringify(widths)
        },
        async changePath(path, lastPath, checkProcessor) {
            this.restrictClose(true)
            if (checkProcessor) 
                this.changeProcessor(this.processor.getProcessor(path))
            this.items = await this.processor.getItems(path)
            this.path = path
            localStorage[`${this.id}-path`] = path
            if (lastPath) {
                const newPos = this.items.findIndex(n => n.name == lastPath)
                if (newPos != -1) 
                    setTimeout(() => this.$refs.table.setCurrentIndex(newPos))
            }
        },
        onSort(index, descending) {
            const selected = this.items[this.$refs.table.index]
            this.items = this.processor.sort(this.items, index, descending)
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
        onKeyDown(evt) {
            switch (evt.which) {
                case 9: // TAB
                    if (evt.shiftKey) {
                        this.$refs.input.focus()
                        evt.preventDefault() // prevent the default action (scroll / move caret)
                    }
                    return
            }
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
            }
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
    margin-left: 3px;
    margin-right: 3px;
    border-style: none;
    width: calc(100% - 6px);
    outline-width: 0px;
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
}
tr.isHidden {
    opacity: 0.5;
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
