<template>
    <div class="container">
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
        <p>
            <button @click='onChange'>Change</button>
        </p>
        <p>
            <button @click='onChange2'>Change with ColumnWidths</button>
        </p>
    </div>
</template>

<script>
import Columns from '../controls/Columns'

export default {
    components: {
        Columns        
    },
    data: function () {
        return {
            columns: {},
            columnsWidths: []
        }
    },
    methods: {
        onChange: function () {
            this.columns = [{
                    name: "Name",
                    isSortable: true
                }, {
                    name: "Größe",
                    isSortable: true
                }, {
                    name: "Datum",
                    isSortable: true
                }, {
                    name: "Beschreibung"
                }
            ]
        },
        onChange2: function () {
            this.columns = [{
                    name: "Name",
                    width: "25%"
                }, {
                    name: "Größe",
                    width: "35.4305%"
                }, {
                    name: "Datum",
                    width: "21.2687%"
                }, {
                    name: "Version",
                    width: "18.3009%"
                }
            ]
        },
        onColumnsWidthChanged: function(widths) {
            console.log("new columnsWidths", widths)
        }
    },
    mounted: function() {
        this.columns = [{
                name: "Name"
            }, {
                name: "Erw."
            }, {
                name: "Datum"
            }
        ]
    }
}
</script>

<style scoped>
    .container {
        margin: 0px 55px;
    }
    table {
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

