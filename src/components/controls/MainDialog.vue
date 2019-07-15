<template>
    <div class=dialogroot :class="{ closed: dialogClosed }">
        <transition name="fade">
            <div class=fader v-if="isShowing">
            </div>
        </transition>                        
        <transition name="fade2" v-on:after-leave="afterLeave">
            <div class="affe" @click="onClose" v-if="isShowing">Affe</div>        
        </transition>                        
    </div>
</template>
    
</template>

<script>
export default {
    data() {
        return {
            isShowing: false,
            dialogClosed: true
        }
    },
    methods: {
        show() {
            this.isShowing = true
            this.dialogClosed = false
        },
        onClose() {
            this.isShowing = false
        },
        afterLeave() {
            this.dialogClosed = true
        }
    }
}
</script>

<style scoped>
.dialogroot {
    position: absolute;
    width: 100%;
    height: 100%;
}
.fader {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.50);
}
.closed  {
    display: none;
}
.affe {
    position: absolute;
    background-color: red;
    padding: 30px;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade2-enter-active, .fade2-leave-active {
    transition: opacity 0.8s;
}
.fade2-enter, .fade2-leave-to {
    opacity: 0;
}

</style>
