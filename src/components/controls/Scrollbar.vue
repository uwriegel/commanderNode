<template>
    <transition name="slide">
        <div v-show="range > 0" class="scrollbar">
            <div class="scrollbarUp" @mousedown="upMouseDown" @mouseup="mouseup">
                <div class="scrollbarUpImg"></div>
            </div>
            <div class="scrollbarGrip" @mousedown="gripMouseDown" @mouseup="mouseup"
                v-bind:style="{ height: gripHeight + 'px' }">
            </div>
            <div class="scrollbarDown" @mousedown="downMouseDown" @mouseup="mouseup">
                <div class="scrollbarDownImg"></div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "scrollbar",
    props: [
        'totalCount',
        'itemsPerPage'
    ],
    data: function() {
        return {
            Affenkopf: 5
        }
    },
    computed: {
        range: function () {
            return Math.ceil(Math.max(0, this.totalCount - this.itemsPerPage))
        },
        gripHeight: function () {
            return this.Affenkopf;
        }
    }, 
    methods: {
        upMouseDown: function (evt) {

        },
        downMouseDown: function (evt) {

        },
        gripMouseDown: function (evt) {

        },
        mouseup:  function (evt) {

        }
    }
}
</script>

<style scoped>
.scrollbar {
    position: absolute;
    height: 100%;
    width: 16px; 
    overflow: hidden;
    box-sizing: border-box;
    background-color: var(--background-color);
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
