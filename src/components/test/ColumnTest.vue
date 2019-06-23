<template>
    <div class="container">
        <table>
            <columns :columns='columns'></columns>
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
    </div>
</template>

<script>
import Columns from '../controls/Columns'

export default {
    name: 'column-test',
    components: {
        Columns        
    },
    data: function () {
        return {
            columns: {}
        }
    },
    methods: {
        onChange: function () {
            this.columns = [{
                    name: "Name"
                }, {
                    name: "Größe"
                }, {
                    name: "Datum"
                }, {
                    name: "Beschreibung"
                }
            ]
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

