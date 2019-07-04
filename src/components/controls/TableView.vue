<template>
    <div class="root" ref="list" @keydown="onKeyDown" @mousewheel="onMouseWheel">
        <table ref="table" tabindex="1" @mousedown="onMouseDown">
            <columns ref="column" :columns='columns' @on-columns-widths-changed='onColumnsWidthChanged'></columns>
            <tbody>
                <slot v-for="item in displayItems" :item="item"></slot>
            </tbody>
        </table>    
        <div class=scrollbar-container>
            <scrollbar :totalCount="totalCount" :itemsPerPage="itemsPerPage" :parentHeight="height" 
                v-bind:style="{height: height+'px'}" v-model="position" @scrolled="scrolled">
            </scrollbar>
        </div>    
    </div>
</template>

<script>
import Columns from './Columns'
import Scrollbar from "./Scrollbar"

export default {
    name: 'table-view',
    components: {
        Columns,
        Scrollbar
    },
    props: [
        'columns',
        'itemHeight',
        'items'
    ],
    data: function () {
        return {
            position: 0,
            height: 0,
            itemsPerPage: 0,
            startIndex: 0,
            displayItems: [],
            index: 0
        }
    },
    watch: {
        items: {
            immediate: true,
            handler (newVal, oldVal) {
                if (this.items.length)
                    this.items[0].isCurrent = true
                this.items.forEach((n, i) => n.index = i)                    
                this.index = 0
                this.onResize()
            }
        },
        position: function (newVal, oldVal) { 
            this.startIndex = newVal 
            this.setPosition()
        }
    },
    computed: {
        totalCount () {
            return this.items.length
        }
    },
    methods: {
        focus () { this.$refs.table.focus() },
        onColumnsWidthChanged: function(widths) {
            console.log("new columnsWidths", widths)
        },
        onResize: function () {
            if (this.$refs.list)
                this.height = this.$refs.list.clientHeight - this.columnHeight
            this.itemsPerPage = Math.floor(this.height / this.itemHeight)
            this.setPosition()
        },
        onKeyDown: function (evt) {
            switch (evt.which) {
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
                default:
                    return // exit this handler for other keys
            }
            evt.preventDefault() // prevent the default action (scroll / move caret)
        },
        onMouseDown: function (evt) {
            const tr = evt.target.closest("tbody tr")
            if (tr) {
                const currentIndex = 
                    Array.from(this.$refs.table.querySelectorAll("tr"))
                    .findIndex(n => n == tr)
                    + this.position -1
                if (currentIndex != -1)
                    this.setCurrentIndex(currentIndex)
            }
        },
        onMouseWheel: function(evt) {
            var delta = evt.deltaY / Math.abs(evt.deltaY) * 3
            let newPos = this.position + delta
            if (newPos < 0)
                newPos = 0
            if (newPos > this.items.length - this.itemsPerPage) {
                newPos = this.items.length - this.itemsPerPage
                console.log(newPos)
            }
            this.position = newPos
        },
        scrolled: function () { this.$refs.table.focus() },
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
        setCurrentIndex(index) {
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
        }
    },
    created: function () {
        window.addEventListener("resize", this.onResize)
    },
    destroyed: function () {
        window.removeEventListener("resize", this.onResize)
    },
    mounted: function () {
        this.columnHeight = this.$refs.column.$el.clientHeight
        this.onResize()
    },
    columnHeight: 0
}
</script>

<style scoped>
.root {
    flex-grow: 1;    
    position: relative;
    overflow: hidden;
}
table {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    outline-width: 0px;
    table-layout: fixed;
    border-spacing: 0px;
}

td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
}    
.scrollbar-container {
    top: 16px;
    position: absolute;
    right: 0px;
    width: 0px;
    background-color: red;
}
tr.isCurrent {
    outline-color: lightgray;
    outline-width: 1px;
    outline-style: solid;
    outline-offset: -1px;
}
table:focus tr.isCurrent {
    outline-color: red;
    outline-width: 1px;
    outline-style: solid;
    outline-offset: -1px;
}
</style>

