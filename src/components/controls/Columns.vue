<template>
    <!-- <thead app-columns [id]="'left'" [columns]="columns" (onSort)="onSort($event)"></thead> -->
    <thead>
        <tr>
            <th class="pointer-ew">Name</th>
            <th class="pointer-ew">Erw.</th>
            <th class="pointer-ew">Datum</th>
        </tr>
    </thead>
</template>

<script>
export default {
    name: 'columns'
}
</script>

<style scoped>
    tr th {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        user-select: none;
        padding-left: 5px;
        text-align: left;
        font-weight: normal;
        color: var(--selected-color);
        background-color: var(--selected-background-color);
        border-left-color: white;
        border-left-style: solid;
        border-left-width: 1px;
        transition: background-color 0.3s;
    }

    tr th:first-child {
        border-left-width: 0px;
    }

    th.pointer-ew {
        cursor: ew-resize;
    }
</style>
