<template>
    <div class="root">
        <h1>Table View Test</h1>
        <div class="container">
            <table-view :eventBus="tableEventBus" :columns='columns' :items='items' :itemHeight='16'
                @selection-changed="onSelectionChanged">
                <template v-slot=row >
                    <tr :class="{ 'isCurrent': row.item.index == selectedIndex }">
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

<script lang="ts">
import Vue from 'vue'
import TableView, { TableViewItem } from '../controls/TableView.vue'

export default Vue.extend({
    components: {
        TableView
    },
    data() {
        return {
            tableEventBus: new Vue(),
            selectedIndex: 0,
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
            items: [] as TableViewItem[]
        }
    },
    computed: {
        totalCount(): number {
            return this.items.length
        }
    },
    methods: {
        onSelectionChanged(index: number) { this.selectedIndex = index },
        onChange(evt: Event) {
            const count = parseInt((evt.srcElement as HTMLInputElement).value)
            this.fillItems(count)
        },
        fillItems(count: number) {
            this.items = []
            Array.from(Array(count).keys()).map((n, i) => {
                return {
                    name: `name ${i}`,
                    extension: `extension ${i}`,
                    date: `datum ${i}`,
                    description: `description ${i}`,
                    isCurrent: false,
                    index: i
                }
            }).forEach((n, i) => this.items[i] = n)
            this.tableEventBus.$emit("focus")
        }
    },
    mounted() {
        this.fillItems(500)
        setTimeout(() => this.tableEventBus.$emit("focus"))
    }
})
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
