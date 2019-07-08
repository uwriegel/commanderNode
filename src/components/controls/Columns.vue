<template>
    <thead>
        <tr ref='tr' :class="{'pointer-ew': draggingReady }">
            <th v-for="column in columns" :key="column.name" @mousemove='onMouseMove' @mousedown='onMouseDown' @click='onClick(column)'
                :class="{'is-sortable': column.isSortable, 'sort-ascending': column.sortAscending, 'sort-descending': column.sortDescending}">
                {{column.name}}
            </th>
        </tr>
    </thead>
</template>

<script>
export default {
    name: 'columns',
    props: [
        /***
         * @param {string} name
         * @param {boolean} isSortable
         * @param {number} columnsType
         * @param {number} width
         */
        'columns'
    ],
    watch: {
        columns: {
            immediate: true,
            handler (newVal, oldVal) {
                if (oldVal != newVal)
                    setTimeout(() => {
                        const ths = Array.from(this.$refs.tr.children)
                        ths.forEach((th, i) => th.style.width = this.columns[i].width || (100 / this.columns.length) + '%')
                    })
            }
        }
    },
    data() {
        return {
            draggingReady: false
        }
    },
    methods: {
        onMouseMove: function (evt) {
            const th = evt.target
            const thWidth = th.clientWidth + th.clientLeft
            const mouseX = evt.offsetX + th.clientLeft
            const trRect = this.$refs.tr.getBoundingClientRect()
            const absoluteRight = trRect.width + trRect.x

            this.draggingReady = (mouseX < 3 || mouseX > thWidth - 4) 
                && (evt.pageX - trRect.x > 4)
                && (evt.pageX < absoluteRight - 4)
        },
        onMouseDown: function (evt) {
            if (this.draggingReady) {
                const th = evt.target
                const mouseX = evt.offsetX + th.clientLeft
                const dragleft = mouseX < 3

                const startDragPosition = evt.pageX
                const targetColumn = evt.target

                const currentHeader = dragleft ? targetColumn.previousElementSibling : targetColumn 
                const nextHeader = currentHeader.nextElementSibling

                const currentLeftWidth = currentHeader.offsetWidth
                const sumWidth = currentLeftWidth + nextHeader.offsetWidth

                const onmove = evt => {
                    document.body.style.cursor = 'ew-resize'
                    let diff = evt.pageX - startDragPosition
                    if (currentLeftWidth + diff < 15)
                        diff = 15 - currentLeftWidth
                    else if (diff > sumWidth - currentLeftWidth - 15)
                        diff = sumWidth - currentLeftWidth - 15

                    const getCombinedWidth = (column, nextColumn) => {
                        const firstWidth = 
                            column.style.width
                            ? parseFloat(column.style.width.substr(0, column.style.width.length - 1))
                            : 100 / this.columns.length
                        const secondWidth = 
                            nextColumn.style.width
                            ? parseFloat(nextColumn.style.width.substr(0, nextColumn.style.width.length - 1))
                            : 100 / this.columns.length
                        return firstWidth + secondWidth
                    }                        

                    const combinedWidth = getCombinedWidth(currentHeader, nextHeader)

                    let leftWidth = currentLeftWidth + diff
                    let rightWidth = sumWidth - currentLeftWidth - diff
                    const factor = combinedWidth / sumWidth
                    leftWidth = leftWidth * factor
                    rightWidth = rightWidth * factor

                    currentHeader.style.width = leftWidth + '%'
                    nextHeader.style.width = rightWidth + '%'
                    evt.preventDefault()
                }

                const onup = evt => {
                    const getWidths = () => {
                        const ths = Array.from(this.$refs.tr.children)
                        return ths.map(th => {
                            let width = th.style.width
                            if (!width)
                                width = (100 / this.columns.length) + '%'
                            return width
                        })
                    }

                    window.removeEventListener('mousemove', onmove)
                    window.removeEventListener('mouseup', onup)
                    document.body.style.cursor = null
                    this.$emit('on-columns-widths-changed', getWidths())
                }

                window.addEventListener('mousemove', onmove)
                window.addEventListener('mouseup', onup)
            }
        },
        onClick: function (column) {
            if (!this.draggingReady && column.isSortable) {
                const descending = column.sortAscending == true
                this.columns.forEach(n => {
                    this.$set(n, 'sortAscending', false)
                    this.$set(n, 'sortDescending', false)
                })
                if (descending)
                    this.$set(column, 'sortDescending', true)
                else
                    this.$set(column, 'sortAscending', true)
                const index = this.columns.findIndex(n => n == column)
                this.$emit('on-column-click', index, descending)
            }
        } 
    }
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
        border-left-color: var(--columns-separator-color);
        border-left-style: solid;
        border-left-width: 1px;
        transition: background-color 0.3s; 
    }

    tr th:first-child {
        border-left-width: 0px;
    }

    tr.pointer-ew {
        cursor: ew-resize;
    }
    .is-sortable:hover {
        background-color: var(--selected-background-hover-color);
    }
    .sort-ascending:before {
        position: relative;
        bottom: 11px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid var(--selected-color);
        content: '';
        margin-right: 5px;
    }
    .sort-descending:before {
        position: relative;
        top: 10px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid var(--selected-color);
        content: '';
        margin-right: 5px;
    }
</style>
