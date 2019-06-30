<template>
    <div class="root" ref="list">
        <table>
            <columns ref="column" :columns='columns' @on-columns-widths-changed='onColumnsWidthChanged'></columns>
            <tbody>
                <slot v-for="item in displayItems" :item="item"></slot>
            </tbody>
        </table>    
        <div class=scrollbar-container>
            <scrollbar :totalCount="totalCount" :itemsPerPage="itemsPerPage" :parentHeight="height" 
                v-bind:style="{height: height+'px'}" @on-position="onPosition">
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
            height: 0,
            itemsPerPage: 0,
            startIndex: 0
        }
    },
    watch: {
        items: {
            immediate: true,
            handler (newVal, oldVal) {
                // this.startIndex = 0 // TODO: (Re)set scrollbar position, v-model two way
                this.onResize()
            }
        }
    },
    computed: {
        totalCount () {
            return this.items.length
        },
        displayItems () {
            return this.items.slice(this.startIndex, this.startIndex + this.itemsPerPage + 1)
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
        },
        onPosition: function (position) { this.startIndex = position }
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
</style>
