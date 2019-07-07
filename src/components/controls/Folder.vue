<template>
    <div class="root">
        <h1>Der Folder</h1>
        <table-view ref="table" :columns='tableViewColumns' :items='items' :itemHeight='16'>
            <template v-slot=row >
                    <tr :class="{ 'isCurrent': row.item.index == $refs.table.index }">
                        <td>{{ row.item.name }}</td>
                        <td>{{ row.item.description }}</td>
                        <td>{{ row.item.size | size }}</td>
                    </tr>
                </template>
        </table-view>
    </div>
</template>

<script>
import { getDefaultProcessor } from '../../processors/processor'
import TableView from './TableView'

export default {
    name: "folder",
    components: {
        TableView
    },
    data: function () {
        return {
            columns: [],
            items: []
        }
    },
    props: [
        "id"
    ],
    created: function() {
        this.processor = getDefaultProcessor()
        const path = localStorage[`${this.id}-path`] || "root"
        this.changePath(path)
    },
    computed: {
        tableViewColumns() { return this.columns.values }
    },
    methods: {
        // TODO: Icon
        // TODO: Sorting
        changePath: async function (path) {
            this.processor = this.processor.getProcessor(path)
            this.columns = this.processor.getColumns(this.columns)
            this.items = await this.processor.getItems(path)
        }
    }
}
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
}
</style>
