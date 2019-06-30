<template>
    <div class="root">
        <table>
            <columns :columns='columns' @on-columns-widths-changed='onColumnsWidthChanged'></columns>
            <tbody>
                <slot v-for="item in items" :item="item"></slot>
            </tbody>
        </table>    
        <div class=scrollbar-container>
        </div>    
    </div>
</template>

<script>
import Columns from './Columns'
export default {
    name: 'table-view',
    components: {
        Columns
    },
    props: [
        'columns',
        'items'
    ],
    methods: {
        onColumnsWidthChanged: function(widths) {
            console.log("new columnsWidths", widths)
        }
    }
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
    height: 100%;
    background-color: red;
}
</style>
