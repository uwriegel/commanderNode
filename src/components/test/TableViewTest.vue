<template>
    <div class="root">
        <h1>Table View Test</h1>
        <div class="container">
            <table-view :columns='columns' :columnsWidths='columnsWidths'></table-view>
        </div>
        <p>Status</p>
    </div>
</template>

<script>
import TableView from '../controls/TableView'

export default {
    name: 'table-view-test',
    components: {
        TableView
    },
    data: function () {
        return {
            columns: [
                {
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
            ],
            columnsWidths: ["25%", "35.4305%", "21.2687%", "18.3009%"]
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
}
</style>
