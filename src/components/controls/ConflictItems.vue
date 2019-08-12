<template>
    <div class="root">
        <p>Möchtest Du?</p>
        <table-view :columns='columns' :items='items' :itemHeight='16'>
            <template v-slot=row >
                <tr :class="{ 'isCurrent': false }">
                    <td>{{row.item.name}}</td>
                </tr>
            </template>
        </table-view>
    </div>
</template>

<script>
import TableView from './TableView'

export default {
    components: {
        TableView
    },
    props: [
        "items"
    ],
    data() {
        return {
            columns: [ { name: "Name" }, { name: "Datum" }, { name: "Größe" }, { name: "Version" } ]
        }
    },


    mounted() {
        //this.items[0].index 
    }
}
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
</style>