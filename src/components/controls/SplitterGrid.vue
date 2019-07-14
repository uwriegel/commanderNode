<template>
    <div ref="container" class="splitterGridContainer" :class='{ isVertical: isVertical}' >
        <slot name="first"></slot>
        <div class="splitter" v-if="!isSecondInvisible" @mousedown="onSplitterMouseDown"></div>
        <slot name="second" v-if="!isSecondInvisible"></slot>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    data() {
        return {
            height: null
        }
    },
    props: [
        "isVertical",
        "isSecondInvisible"
    ],
    watch: {
        isSecondInvisible(newVal) {
            if (!newVal && this.height) {
                Vue.nextTick(() => {
                    const view2 = this.$refs.container.children[2]
                    view2.style.flex = `0 0 ${this.height}%`
                })
            }
            Vue.nextTick(() => { this.$emit("splitter-position-changed") })
        }
    },
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

                const procent2 = newSize2 / (newSize2 + newSize1 + 
                    (this.isVertical ? splitter.offsetHeight : splitter.offsetWidth)) * 100
                this.height = procent2
                view1.style.flexGrow = `1`
                view2.style.flex = `0 0 ${procent2}%`
                this.$emit("splitter-position-changed")

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
