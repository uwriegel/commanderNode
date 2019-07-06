<template>
    <transition name="slide">
        <div ref="scrollbar" v-show="range > 1" class="scrollbar" 
                @mousedown="pageMouseDown" @mouseleave="mouseleave" @mouseup="mouseup">
            <div class="scrollbarUp" @mousedown.stop="upMouseDown" @mouseleave="mouseleave" @mouseup="mouseup">
                <div class="scrollbarUpImg"></div>
            </div>
            <div class="scrollbarGrip" @mousedown.stop="gripMouseDown" @mouseup="mouseup"
                v-bind:style="{ height: gripHeight + 'px', top: gripTop + 'px' }">
            </div>
            <div class="scrollbarDown" @mousedown.stop="downMouseDown" @mouseleave="mouseleave" @mouseup="mouseup">
                <div class="scrollbarDownImg"></div>
            </div>
        </div>
    </transition>
</template>

<script>
const scrollerHeight = 15

export default {
    name: "scrollbar",
    props: [
        'value',
        'totalCount',
        'itemsPerPage',
        'parentHeight'
    ],
    data: function() {
        return {
            position: 0
        }
    },
    watch: {
        parentHeight: function (newVal, oldVal) {
            this.setPosition(Math.min(this.range -1, this.position))
        },
        value: function (newVal, oldVal) {
            this.position = newVal
        },
        totalCount: function (newVal, oldVal) {
            this.setPosition(0)
        }
    },
    computed: {
        range: function () {
            return Math.max(0, this.totalCount - this.itemsPerPage) + 1
        },
        gripHeight: function () {
            var gripHeight = (this.parentHeight - 32) * (this.itemsPerPage / this.totalCount)
            if (gripHeight < 5)
                gripHeight = 5
            return gripHeight
        },
        gripTop: function () {
            return scrollerHeight + ((this.parentHeight - this.gripHeight - 2 * scrollerHeight) * (this.position / (this.range -1)))
        }
    }, 
    methods: {
        upMouseDown: function (evt) {
            const mouseUp = () => this.setPosition(Math.max(0, this.position - 1))
            mouseUp()
            this.timer = setTimeout(() => this.interval = setInterval(mouseUp, 10), 600)
        },
        downMouseDown: function (evt) {
            const mouseDown = () => this.setPosition(Math.min(this.range -1, this.position + 1))
            mouseDown()
            this.timer = setTimeout(() => this.interval = setInterval(mouseDown, 10), 600)

        },
        pageMouseDown: function (evt) {
            let up = evt.offsetY <= this.gripTop 
            const page = () => {
                if ((evt.offsetY > this.gripTop && evt.offsetY < this.gripTop + this.gripHeight)
                        || up ? evt.offsetY > this.gripTop : evt.offsetY < this.gripTop + this.gripHeight) {
                    this.mouseUp()          
                    return
                }
                    
                this.setPosition(evt.offsetY <= this.gripTop
                    ? Math.max(0, this.position - this.itemsPerPage + 1)
                    : Math.min(this.range -1, this.position + this.itemsPerPage - 1)
                )
            }
            page()
            this.timer = setTimeout(() => this.interval = setInterval(page, 50), 600)
        },
        gripMouseDown: function (evt) {
            const startPos = evt.y - this.gripTop
            const range = this.parentHeight - this.gripHeight - 2 * scrollerHeight
            const maxPosition = this.totalCount - this.itemsPerPage
            const onmove = evt => {
                const delta = evt.y - startPos
                const factor = Math.min(1, (Math.max(0, delta * 1.0 / range)))
                this.setPosition(Math.floor(factor * maxPosition))
            }
            const onup = evt => {
                window.removeEventListener('mousemove', onmove)
                window.removeEventListener('mouseup', onup)
            }
            window.addEventListener('mousemove', onmove)
            window.addEventListener('mouseup', onup)
        },
        mouseup: function (evt) {
            clearTimeout(this.timer)
            clearInterval(this.interval)
        },
        mouseleave: function (evt) {
            clearTimeout(this.timer)
            clearInterval(this.interval)
        },
        setPosition: function (position) {
            this.position = position
            this.$emit('input', this.position)
        }
    },
    timer: 0,
    interval: 0
}
</script>

<style scoped>
.scrollbar {
    position: absolute;
    height: 100%;
    width: 16px; 
    overflow: hidden;
    box-sizing: border-box;
    background-color: var(--main-background-color);
    right: 0px;
    border-style: solid;
    border-color: var(--scrollbar-border-color);
    border-width: 1px;
    user-select: none;
}

.slide-enter-active, .slide-leave-active {
    transition: width 0.4s, height 0.4s, opacity 0.4s;
}
.slide-enter, .slide-leave-to {
    opacity: 0;
    width: 0px;
    height: 0px;
}

.scrollbarUp {
    position: absolute;
    box-sizing: border-box;
    background-color: var(--main-background-color);
    width: 100%;
    height: 15px;
    transition: background-color 0.5s;
}

.scrollbarUp:hover, .scrollbarDown:hover {
    background-color: var(--scrollbar-grip-color);
}

.scrollbarUp:active, .scrollbarDown:active {
    background-color: var(--scrollbar-button-active-color);
    cursor: default;
}

.scrollbarUp:active .scrollbarUpImg, .scrollbarDown:active .scrollbarDownImg {
    border-bottom-color: var(--scrollbar-border-active-color);
    border-top-color: var(--scrollbar-border-active-color);
}

.scrollbarUpImg {
    position: absolute;
    top: 4px;
    left: 3px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6px solid var(--scrollbar-image-color);
}

.scrollbarDown {
    position: absolute;
    box-sizing: border-box;
    background-color: var(--main-background-color);
    width: 100%;
    bottom: 0px;
    height: 15px;
    transition: background-color 0.5s;
}

.scrollbarDownImg {
    position: absolute;
    top: 4px;
    left: 3px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid var(--scrollbar-image-color);
}

.scrollbarGrip {
    position: absolute;
    box-sizing: border-box;
    background-color: var(--scrollbar-grip-color);
    top: 15px;
    width: 100%;
    height: 28px;
    transition: background-color 0.5s;
}

.scrollbarGrip:hover {
    background-color: var(--scrollbar-grip-hover-color);
}

.scrollbarGrip:active {
    background-color: var(--scrollbar-grip-active-color);
    transition: background-color 0s;
}

</style>
