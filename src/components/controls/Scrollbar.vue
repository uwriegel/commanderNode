<template>
    <transition name="slide">
        <div v-show="range > 0" class="scrollbar"></div>
    </transition>
</template>

<script>
export default {
    name: "scrollbar",
    props: [
        'totalCount',
        'itemsPerPage'
    ],
    computed: {
        range: function () {
            return Math.ceil(Math.max(0, this.totalCount - this.itemsPerPage))
        }
    }
}
</script>

<style scoped>
.scrollbar {
    position: absolute;
    height: 100%;
    width: 20px; 
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
</style>
