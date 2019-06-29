<template>
    <div class="root">
        <table>
            <columns :columns='columns' :columnsWidths='columnsWidths' @on-columns-widths-changed='onColumnsWidthChanged'></columns>
            <tbody>
                <tr>
                    <td>Test</td>
                    <td>txt</td>
                    <td>25.02.1999 14:23</td>
                </tr>
                <tr>
                    <td>Bild</td>
                    <td>jpg</td>
                    <td>15.12.2009 12:39</td>
                </tr>
            </tbody>
        </table>        
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
        'columnsWidths'
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
    position: relative;
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
</style>
