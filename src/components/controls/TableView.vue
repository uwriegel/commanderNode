<template>
    <div class="root" ref="list" @mousewheel="onMouseWheel">
        <table tabindex="1">
            <columns ref="column" :columns='columns' @on-columns-widths-changed='onColumnsWidthChanged'></columns>
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
            displayItems: []
        }
    },
    watch: {
        items: {
            immediate: true,
            handler (newVal, oldVal) {
                if (this.items.length)
                    this.items[0].isCurrent = true
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
        onColumnsWidthChanged: function(widths) {
            console.log("new columnsWidths", widths)
        },
        onResize: function () {
            if (this.$refs.list)
                this.height = this.$refs.list.clientHeight - this.columnHeight
            this.itemsPerPage = Math.floor(this.height / this.itemHeight)
            this.setPosition()
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
        setCurrent: function (value) {
            this.items.forEach(n => n.isCurrent = false)
            this.items[value].isCurrent = true
        },
        setPosition() {
            this.displayItems = this.items.slice(this.startIndex, this.startIndex + this.itemsPerPage + 1)
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

