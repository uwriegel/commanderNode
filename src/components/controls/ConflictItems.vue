<template>
    <div class="root">
        <table-view ref="table" class="table" :columns='columns' :items='conflictItems' :itemHeight='32'>
            <template v-slot=row >
                <tr :class="{ 'isCurrent': row.item.index == $refs.table.index }">
                    <td>{{row.item.name}}</td>
                    <td>
                        <div>{{row.item.sourceTime | dateTime }}</div>
                        <div>{{row.item.targetTime | dateTime }}</div>
                    </td>
                    <td>
                        <div class="size">{{row.item.sourceSize | size }}</div>
                        <div class="size">{{row.item.targetSize | size }}</div>
                    </td>
                    <td>
                        <div class="size">{{row.item.sourceVersion | version }}</div>
                        <div class="size">{{row.item.targetVersion | version }}</div>
                    </td>
                </tr>
            </template>
        </table-view>
    </div>
</template>

<script>
import Vue from 'vue'
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
            columns: [ { name: "Name" }, { name: "Datum" }, { name: "Größe" }, { name: "Version" } ],
            conflictItems: []
        }
    },
    methods: {
        getFocusables() {
            return [ this.$refs.table ]
        },
        getFocusIndex(buttonCount) { return buttonCount }
    },
    mounted() {
        Vue.nextTick(() => this.conflictItems = this.items)
    }
}
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.size {
    text-align: right;
    padding-right:10px;
}
.table {
    border: 1px solid gray;
}
</style>