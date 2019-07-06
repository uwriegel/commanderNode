<template>
    <div class="root">
        <h1>Der Folder</h1>
        <table-view :columns='tableViewColumns' :items='items' :itemHeight='16'></table-view>
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
            // TODO: unobserve
            processor: getDefaultProcessor(),
            columns: [],
            items: []
        }
    },
    props: [
        "id"
    ],
    created: function() {
        const path = localStorage[`${this.id}-path`] || "root"
        this.changePath(path)
    },
    computed: {
        tableViewColumns() { return this.columns.values }
    },
    methods: {
        changePath: function (path) {
            this.processor = this.processor.getProcessor(path)
            this.columns = this.processor.getColumns(this.columns)
        }
    }
}
</script>

<style scoped>
.root {
    background-color: red;
    display: flex;
    flex-direction: column;
}
</style>
