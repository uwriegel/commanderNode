<template>
    <div class="root">
        <h1>Table View Test</h1>
        <div class="container">
            <table-view ref="table" :columns='columns' :items='items' :itemHeight='16'>
                <template v-slot=row >
                    <tr :class="{ 'isCurrent': row.item.index == $refs.table.index }">
                        <td>{{row.item.name}}</td>
                        <td>{{row.item.extension}}</td>
                        <td>{{row.item.date}}</td>
                        <td>{{row.item.description}}</td>
                    </tr>
                </template>
            </table-view>
        </div>
        <div class="input">
            <input type="number" autofocus @change="onChange" placeholder="Items count" />
            <div>Message is: {{ totalCount }}</div>
        </div>    
    </div>
</template>

<script>
import TableView from '../controls/TableView'

export default {
    components: {
        TableView
    },
    data: function () {
        return {
            columns: [
                {
                    name: "Name",
                    isSortable: true,
                    width: "25%"
                }, {
                    name: "Größe",
                    isSortable: true,
                    width: "35.4305%"
                }, {
                    name: "Datum",
                    isSortable: true,
                    width: "21.2687%"
                }, {
                    name: "Beschreibung",
                    width: "18.3009%"
                }
            ],
            items: []
        }
    },
    computed: {
        totalCount: function () {
            return this.items.length
        }
    },
    methods: {
        onChange (evt) {
            const count = parseInt(evt.srcElement.value)
            this.items = []
            Array.from(Array(count).keys()).map((n, i) => {
                return {
                    name: `name ${i}`,
                    extension: `extension ${i}`,
                    date: `datum ${i}`,
                    description: `description ${i}`,
                    isCurrent: false
                }
            }).forEach((n, i) => this.items[i] = n)
            this.$refs.table.focus()
        }
    }
}
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.container {
    flex-grow: 1;
    padding: 20px;
    display: flex;
}
.input {
    margin: 20px;
}
</style>
