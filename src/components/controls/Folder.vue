<template>
    <div class="root" @keydown='onKeyDown'> 
        <input ref="input" v-selectall @keydown='onInputKeyDown' v-model.lazy="path">
        <table-view ref="table" :columns='tableViewColumns' :items='items' :itemHeight='18'
                @on-column-click='onSort' @on-columns-widths-changed='onColumnsWidthChanged' @on-action='onAction' >
            <template v-slot=row>
                <tr v-if='processor.name == "directory" && row.item.isDirectory ' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden }">
                    <td class="icon-name">
                        <folder-icon class=icon></folder-icon>
                        {{ row.item.name }}
                    </td>  
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-if='processor.name == "directory" && !row.item.isDirectory ' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden }">
                    <td class="icon-name">
                        <img :src='row.item.name | iconUrl(processor.path)' alt="">
                        {{ row.item.name | nameOnly }}
                    </td>
                    <td>{{ row.item.name | extension }}</td>
                    <td>{{ row.item.time | dateTime }}</td>
                    <td class="size">{{ row.item.size | size }}</td>
                    <td></td>
                </tr>
                <tr v-if='processor.name == "root"' 
                        :class="{ 'isCurrent': row.item.index == $refs.table.index, 'isHidden': row.item.isHidden }">
                    <td class="icon-name">
                        <drive-icon class=icon></drive-icon>
                        {{ row.item.name }}
                    </td>
                    <td>{{ row.item.description }}</td>
                    <td class="size">{{ row.item.size | size }}</td>
                </tr>
            </template>
        </table-view>
    </div>
</template>

<script>
import { getDefaultProcessor } from '../../processors/processor'
import TableView from './TableView'
import DriveIcon from '../../icons/DriveIcon'
import FolderIcon from '../../icons/FolderIcon'

export default {
    components: {
        TableView,
        DriveIcon,
        FolderIcon
    },
    data() {
        return {
            columns: [],
            items: [],
            processor: getDefaultProcessor(),
            path: ""
        }
    },
    props: [
        "id"
    ],
    watch: {
        path(newVal, oldVal) {
            if (this.processor.path != newVal)
                this.changePath(newVal, null, true)
        }
    },
    created: function() {
        const path = localStorage[`${this.id}-path`] || "root"
        this.changePath(path, null, true)
    },
    computed: {
        tableViewColumns() { return this.columns.values }
    },
    methods: {
        // TODO: save path when changing path
        // TODO: restrict window
        // TODO: versions
        // TODO: exifs
        // TODO: Selections
        // TODO: Refresh
        // TODO: Hidden items

        focus() { this.$refs.table.focus() },
        onInputKeyDown(evt) {
            switch (evt.which) {
                case 9: // TAB
                    this.focus()
                    break
                default:
                    return // exit this handler for other keys
            }
            evt.preventDefault() // prevent the default action (scroll / move caret)
        },
        onColumnsWidthChanged: function(widths) {
            localStorage[this.getStorageColumnsWidthName()] = JSON.stringify(widths)
        },
        async changePath(path, lastPath, checkProcessor) {
            if (checkProcessor) 
                this.changeProcessor(this.processor.getProcessor(path))
            this.items = await this.processor.getItems(path)
            this.path = path
            localStorage[`${this.id}-path`] = path
            if (lastPath) {
                const newPos = this.items.findIndex(n => n.name == lastPath)
                if (newPos != -1) 
                    setTimeout(() => this.$refs.table.setCurrentIndex(newPos))
            }
        },
        onSort(index, descending) {
            const selected = this.items[this.$refs.table.index]
            this.items = this.processor.sort(this.items, index, descending)
            const newPos = this.items.findIndex(n => n == selected)
            setTimeout(() => this.$refs.table.setCurrentIndex(newPos))
        },
        onAction(item) {
            const result = this.processor.onAction(item)
            if (!result.done) {
                if (result.newProcessor)
                    this.changeProcessor(result.newProcessor)
                this.changePath(result.path, result.lastPath)
            }
        },
        onKeyDown(evt) {
            switch (evt.which) {
                case 9: // TAB
                    if (evt.shiftKey) {
                        this.$refs.input.focus()
                        evt.preventDefault() // prevent the default action (scroll / move caret)
                    }
                    return
            }
        },        
        getStorageColumnsWidthName() { return this.id + '-' + this.processor.name + '-columnsWidths'},
        changeProcessor(processor) {
            if (processor) {
                this.processor = processor
                const columns = this.processor.getColumns(this.columns)
                const value = localStorage[this.getStorageColumnsWidthName()]
                if (value) {
                    const widths = JSON.parse(value)
                    columns.values.forEach((n, i) => n.width = widths[i])
                }
                this.columns = columns
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
input {
    font-size: 100%;
    box-sizing: border-box;
    margin-left: 3px;
    margin-right: 3px;
    border-style: none;
    width: calc(100% - 6px);
    outline-width: 0px;
}
.icon-name {
    display: block;
}
.icon {
    margin-right: 1px;
    fill: var(--icon-color);
    vertical-align: bottom;
}
.size {
    text-align: right;
}
tr.isHidden {
    opacity: 0.5;
}
td {
    min-height: 16px;
}
img {
    vertical-align: bottom;
}
</style>
