<template>
    <div class="root">
        <h1>Table View Test</h1>
        <div class="container">
            <table-view></table-view>
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
