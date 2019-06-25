<template>
    <div class="scrollbar"></div>
</template>

<script>
export default {
    name: "scrollbar"
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
    transition: width 0.4s, height 0.4s, opacity 0.4s;
}
</style>
