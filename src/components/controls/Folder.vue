<template>
    <div class="root">
        <h1>Der Folder</h1>
        <table-view ref="table" :columns='tableViewColumns' :items='items' :itemHeight='18'
                @on-column-click='onSort' @on-action='onAction'>
            <template v-slot=row >
                    <tr :class="{ 'isCurrent': row.item.index == $refs.table.index }">
                        <td class="icon-name">
                            <drive class=icon></drive>
                            {{ row.item.name }}
                        </td>
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
import Drive from '../../icons/Drive'

export default {
    name: "folder",
    components: {
        TableView,
        Drive
    },
    data() {
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
        // TODO: Change path
        // TODO: directory items
        // TODO: save latest path
        // TODO: @on-columns-widths-changed
        // TODO: directory input
        // TODO: restrict window
        // TODO: versions
        // TODO: exifs
        // TODO: Selections
        // TODO: Refresh
        // TODO: Hidden items

        async changePath(path) {
            this.processor = this.processor.getProcessor(path)
            this.columns = this.processor.getColumns(this.columns)
            this.items = await this.processor.getItems(path)
        },
        onSort(index, descending) {
            this.items = this.processor.sort(this.items, index, descending)
        },
        onAction(item) {
            const result = this.processor.onAction(item)
            if (!result.done) {
                if (result.newProcessor)
                    this.processor = newProcessor
            }
        }
    }
}
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
}
.icon-name {
    display: flex;
}
.icon {
    margin-right: 3px;
    fill: var(--icon-color);
}
</style>
