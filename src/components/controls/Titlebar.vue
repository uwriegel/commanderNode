<template>
    <div class="titlebar">
        <img src="../../icons/kirk2.png">
        <div class="bar">
            <slot></slot>
            <div class="dragregion"></div>
        </div>
    </div>
</template>

<script>
export default {
    // TODO: Minimize, maximize, close
    // TODO: detect windows theme changes
}
</script>

<style scoped>
    .titlebar {
        display: flex;
        background-color: var(--title-background-color);
    }
    img {
        height: 24px;
    }
    .bar {
        flex-grow: 1; 
        display: flex;
    }
    .dragregion{
        flex-grow: 1;
        margin: 3px 3px 0px 0px;
        -webkit-app-region: drag;
    }
</style>
