<template>
    <div class="titlebar">
        <img src="../../icons/kirk2.png">
        <div class="bar">
            <slot></slot>
            <div class="dragregion">
                <span>Commander</span>
            </div>
            <div class="button"><span class="dash">&#x2012;</span></div>
            <div class="button"><span>&#9744;</span></div>
            <div class="button close"><span>&#10005;</span></div>
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
        height: 30px;
    }
    .bar {
        flex-grow: 1; 
        display: flex;
    }
    .dragregion {
        flex-grow: 1;
        text-align: center;
        vertical-align: middle;
        margin: 3px 3px 0px 0px;
        -webkit-app-region: drag;
        display: flex;
        align-items: center;        
    }
    .dragregion>span {
        flex-grow: 1;   
        margin-top: -3px;        
    }
    .button {
        width: 44px;
        text-align: center;
        font-size: 12pt;
        display: flex;
        align-items: center;        
        cursor: pointer;
    }
    .button>span {
        flex-grow: 1;   
        margin-top: -3px;
    }
    .button:hover {
        background-color: lightgray;
    }
    .close:hover {
        background-color: red;
        color: white;
    }
    .button>span.dash {
        vertical-align: sub;
        margin-top: 0px;
    }
</style>
