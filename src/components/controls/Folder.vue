<template>
    <div class="root">
        <h1>Der Folder</h1>
        <table-view :columns='columns' :items='items' :itemHeight='16'></table-view>
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
    methods: {
        changePath: function (path) {
            this.processor = this.processor.getProcessor(path)
            this.columns = this.processor.getColumns(this.columns)


            .values
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
