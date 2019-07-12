<template>
    <div ref="container" class="splitterGridContainer" :class='{ isVertical: isVertical}' >
        <slot name="first"></slot>
        <div class="splitter" v-if="!isSecondInvisible" @mousedown="onSplitterMouseDown"></div>
        <slot name="second" v-if="!isSecondInvisible"></slot>
    </div>
</template>

<script>

// TODO: Event: splitterSize changed
// TODO: Remember splitter size (conserve component?)
// TODO: Icon viewer with test list to display 3 images
export default {
    props: [
        "isVertical",
        "isFixed",
        "isSecondInvisible"
    ],
    methods: {
        onSplitterMouseDown(evt) {
            if (evt.which != 1)
                return
            const view1 = this.$refs.container.children[0]
            const splitter = this.$refs.container.children[1]
            const view2 = this.$refs.container.children[2]
            const size1 = this.isVertical ? view1.offsetHeight : view1.offsetWidth
            const size2 = this.isVertical ? view2.offsetHeight : view2.offsetWidth
            const initialPosition = this.isVertical ? evt.pageY : evt.pageX

            const onmousemove = evt => {
                let delta = (this.isVertical ? evt.pageY : evt.pageX) - initialPosition
                if (delta < 10 - size1)
                    delta = 10 - size1
                if (delta > (this.isVertical ? view1.parentElement.offsetHeight : view1.parentElement.offsetWidth) - 10 - size1 - 6)
                    delta = (this.isVertical ? view1.parentElement.offsetHeight : view1.parentElement.offsetWidth) - 10 - size1 - 6

                const newSize1 = size1 + delta
                const newSize2 = size2 - delta

                if (this.isFixed) {
                    view1.style.flexGrow = `1`
                    view2.style.flexGrow = '0'
                    view2.style.height = `${newSize2}px`
                } else {
                    const procent1 = newSize1 / (newSize1 + newSize2 + 
                        (this.isVertical ? splitter.offsetHeight : splitter.offsetWidth)) * 100
                    view1.style.flex = `0 0 ${procent1}%`
                    view2.style.flexGrow = `1`
                }

                evt.stopPropagation()
                evt.preventDefault()
            }

            const onmouseup = evt => {
                window.removeEventListener('mousemove', onmousemove, true)
                window.removeEventListener('mouseup', onmouseup, true)

                evt.stopPropagation();
                evt.preventDefault();
            }

            window.addEventListener('mousemove', onmousemove, true)
            window.addEventListener('mouseup', onmouseup, true)

            evt.stopPropagation()
            evt.preventDefault()        
        }
    }
}
</script>

<style scoped>
.splitterGridContainer {
    display:flex;
    flex-grow: 1;
    flex-direction: row;
}
.splitterGridContainer.isVertical {
    flex-direction: column;
}
.splitter {
    background-color: var(--grip-color);
    transition: background-color 0.4s;
    flex: 0 0 6px;
    cursor: ew-resize;
}
.isVertical>.splitter {
    cursor: ns-resize;
}
.splitter:hover {
    background-color: darkgray;
}

.splitter:active {
    background-color: #6b6969;
}
</style>
