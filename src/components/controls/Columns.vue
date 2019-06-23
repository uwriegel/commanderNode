<template>
    <thead>
        <tr ref='tr' :class="{'pointer-ew': draggingReady }">
            <th v-for="column in columns" :key="column.name" @mousemove='onMouseMove' @mousedown='onMouseDown'>
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
         */
        'columns'
    ],
    data: function () {
        return {
            draggingReady: false,
            previous: false
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
                const startDragPosition = evt.pageX
                const targetColumn = evt.target

                document.body.style.cursor = 'ew-resize'

                console.log(this.previous)
                console.log(targetColumn)
                console.log(targetColumn.previousElementSibling)
return
                // const currentHeader = this.previous ? targetColumn : targetColumn.previousElementSibling
                // console.log(currentHeader)

                // if (!currentHeader)
                //     currentHeader = targetColumn


                const nextHeader = currentHeader.nextElementSibling
                const currentLeftWidth = currentHeader.offsetWidth
                const sumWidth = currentLeftWidth + nextHeader.offsetWidth

                const onmove = evt => {
                    document.body.style.cursor = 'ew-resize'
                    //this.renderer.setStyle(document.body, "cursor", 'ew-resize')
                    let diff = evt.pageX - startDragPosition

                    if (currentLeftWidth + diff < 15)
                        diff = 15 - currentLeftWidth
                    else if (diff > sumWidth - currentLeftWidth - 15)
                        diff = sumWidth - currentLeftWidth - 15

                    const getCombinedWidth = (column, nextColumn) => {
                        const firstWidth = 
                            column.style.width
                            ? parseFloat(column.style.width.substr(0, column.style.width.length - 1))
                            : 100 / this.columns.values.length
                        const secondWidth = 
                            nextColumn.style.width
                            ? parseFloat(nextColumn.style.width.substr(0, nextColumn.style.width.length - 1))
                            : 100 / this.columns.values.length
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
                    //const columnsWidths = this.getWidths()
                    //localStorage[this.getColumnsId()] = JSON.stringify(columnsWidths)
                    document.body.style.cursor = null
                    window.removeEventListener('mousemove', onmove)
                    window.removeEventListener('mouseup', onup)
                }

                window.addEventListener('mousemove', onmove)
                window.addEventListener('mouseup', onup)
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
</style>
