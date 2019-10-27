<template>
    <div class="root" tabindex="1" ref="list" @keydown="onKeyDown" @mousewheel="onMouseWheel">
        <table ref="table" @mousedown="onMouseDown" @dblclick='onDblClick' 
                :class="{ 'scrollbar': items.length > itemsPerPage }">
            <columns :columns='columns' @onColumnHeight='onColumnHeight'
                @on-columns-widths-changed='onColumnsWidthChanged' @on-column-click='onColumnClick'></columns>
            <tbody>
                <slot v-for="item in displayItems" :item="item"></slot>
            </tbody>
        </table>    
        <div class=scrollbar-container>
            <scrollbar :totalCount="totalCount" :itemsPerPage="itemsPerPage" :parentHeight="height" 
                v-bind:style="{height: height+'px'}" v-model="position">
            </scrollbar>
        </div>    
    </div>
</template>

<script lang="ts">
import Vue, { PropType, Component } from 'vue'
import Columns, { Column } from './Columns.vue'
import Scrollbar from './Scrollbar.vue'

export interface TableViewItem {
    isCurrent: boolean
    index?: number
}

export default Vue.extend({

    components: {
        Columns,
        Scrollbar
    },
    props: {
        eventBus: { type: Object as PropType<Vue>, default: () => new Vue() },
        columns: Array as PropType<Column[]>,
        itemHeight: Number,
        items: Array as PropType<TableViewItem[]>
    },
    data() {
        return {
            position: 0,
            height: 0,
            itemsPerPage: 0,
            startIndex: 0,
            displayItems: [] as TableViewItem[],
            index: 0,
            columnHeight: undefined as number|undefined,
        }
    },
    watch: {
        items: {
            immediate: true,
            handler(newVal: string[]) {
                if (this.items.length)
                    this.items[0].isCurrent = true
                this.items.forEach((n, i) => n.index = i)                    
                this.index = 0
                this.onResize()
            }
        },
        position(newVal) { 
            this.startIndex = newVal 
            this.setPosition()
        },
        index: {
            immediate: true,
            handler(newVal) { this.$emit("selection-changed", newVal) }
        },
    },
    computed: {
        totalCount () {
            return this.items.length
        }
    },
    methods: {
        focus() { (this.$refs.list as HTMLElement).focus() },
        onColumnHeight(height: number) { this.columnHeight = height },
        onColumnsWidthChanged(widths: string[]) {
            this.$emit('columns-widths-changed', widths)
        },
        onResize() {
            if (this.$refs.list)
                this.height = (this.$refs.list as HTMLElement).clientHeight - this.columnHeight!!
            this.itemsPerPage = Math.floor(this.height / this.itemHeight)
            this.setPosition()
        },
        onKeyDown(evt: MouseEvent) {
            switch (evt.which) {
                case 13: // return
                    this.onDblClick()
                    break
                case 33:
                    this.pageUp()
                    break
                case 34:
                    this.pageDown()
                    break                
                case 35: // End
                    if (!evt.shiftKey)
                        this.end()
                    break
                case 36: //Pos1
                    if (!evt.shiftKey)
                        this.pos1()
                    break
                case 38:
                    this.upOne()
                    break
                case 40:
                    this.downOne()
                    break
                case 46: // Delete
                    this.$emit("delete")
                    break;
                default:
                    return // exit this handler for other keys
            }
            evt.preventDefault() // prevent the default action (scroll / move caret)
        },
        onMouseDown(evt: MouseEvent) {
            const tr = (evt.target as HTMLElement).closest("tbody tr")
            if (tr) {
                const currentIndex = 
                    Array.from((this.$refs.table as HTMLTableElement).querySelectorAll("tr"))
                    .findIndex(n => n == tr)
                    + this.position -1
                if (currentIndex != -1)
                    this.setCurrentIndex(currentIndex)
            }
        },
        onMouseWheel(evt: MouseWheelEvent) {
            if (this.items.length > this.itemsPerPage) {
                var delta = evt.deltaY / Math.abs(evt.deltaY) * 3
                let newPos = this.position + delta
                if (newPos < 0)
                    newPos = 0
                if (newPos > this.items.length - this.itemsPerPage) {
                    newPos = this.items.length - this.itemsPerPage
                }
                this.position = newPos
            }
        },
        onDblClick() {
            this.$emit('action', this.items[this.index])
        },
        setPosition() {
            this.displayItems = this.items.slice(this.startIndex, this.startIndex + this.itemsPerPage + 1)
        },
        end() { this.setCurrentIndex(this.items.length - 1) },
        pos1() { this.setCurrentIndex(0) },
        upOne() { this.setCurrentIndex(this.index - 1) },
        downOne() { this.setCurrentIndex(this.index + 1) },
        pageDown() {
            this.setCurrentIndex(this.index < this.items.length - this.itemsPerPage + 1 ? this.index + this.itemsPerPage - 1: this.items.length - 1)
        },
        pageUp() { this.setCurrentIndex(this.index > this.itemsPerPage - 1 ? this.index - this.itemsPerPage + 1: 0) },
        setCurrentIndex(index: number) {
            if (index < 0)
                index = 0
            else if (index >= this.items.length)
                index = this.items.length - 1
            this.index = index;
            this.scrollIntoView()
        },
        scrollIntoView() {
            if (this.index < this.position)
                this.position = this.index
            if (this.index > this.position + this.itemsPerPage - 1)
                this.position = this.index - this.itemsPerPage + 1
        }, 
        onColumnClick(index: number, descending: boolean) {
            this.$emit('column-click', index, descending)
        }
    },
    created() {
        window.addEventListener("resize", this.onResize)
    },
    destroyed() {
        window.removeEventListener("resize", this.onResize)
    },
    mounted() {
        this.eventBus.$on('focus', this.focus)
        this.eventBus.$on('setCurrentIndex', this.setCurrentIndex)
        this.onResize()
    }
})
</script>

<style scoped>
.root {
    flex-grow: 1;    
    position: relative;
    overflow: hidden;
    outline-width: 0px;
}
table {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    table-layout: fixed;
    border-spacing: 0px;
}
td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
    transition: padding-right .4s;
}    
.scrollbar td:last-child {
    padding-right: 19px;
}
.scrollbar-container {
    top: 16px;
    position: absolute;
    right: 0px;
    width: 0px;
}
tr.isCurrent {
    outline-color: lightgray;
    outline-width: 1px;
    outline-style: solid;
    outline-offset: -1px;
}
.root:focus tr.isCurrent {
    outline-color: var(--tr-selected-color);
    outline-width: 1px;
    outline-style: solid;
    outline-offset: -1px;
}
</style>

