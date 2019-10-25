<template>
    <div class="root">
        <table-view ref="table" class="table" :columns='columns' :items='conflictItems' :itemHeight='32'>
            <template v-slot=row >
                <tr :class="{ 'isCurrent': row.item.index == $refs.table.index }">
                    <td class=title>{{row.item.name}}</td>
                    <td>
                        <div :class="{ 'newer': row.item.sourceTime > row.item.targetTime }">{{row.item.sourceTime | dateTime }}</div>
                        <div :class="{ 'older': row.item.sourceTime < row.item.targetTime }">{{row.item.targetTime | dateTime }}</div>
                    </td>
                    <td :class="{ 'different': row.item.sourceSize != row.item.targetSize }">
                        <div class="size" >{{row.item.sourceSize | oIfEmpty | size }}</div>
                        <div class="size" >{{row.item.targetSize | oIfEmpty | size }}</div>
                    </td>
                    <td>
                        <div :class="{ 'newer': compareVersions(row.item) > 0 }" class="size">
                            {{row.item.sourceVersion | version }}
                        </div>
                        <div :class="{ 'older': compareVersions(row.item) < 0 }" class="size">
                            {{row.item.targetVersion | version }}
                        </div>
                    </td>
                </tr>
            </template>
        </table-view>
    </div>
</template>

<script>
import Vue from 'vue'
import TableView from './TableView'
import { compareVersions } from '../../processors/directory'

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
        getFocusIndex(buttonCount) { return buttonCount },
        getDefaultButton() { return this.noIsDefault ? "no" : "yes" },
        compareVersions(item) {  return compareVersions(item.sourceVersion, item.targetVersion) }
    },
    mounted() {
        this.noIsDefault = this.items.some(n => (n.sourceTime < n.targetTime || this.compareVersions(n) < 0))
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
td {
    color: lightgray;
}
.title {
    color: var(--main-color);
}
.newer {
    background-color: lightgreen;
    color: black;
}
.older {
    background-color: red;
    color: white;
}
.different {
    color: var(--main-color);
}
</style>