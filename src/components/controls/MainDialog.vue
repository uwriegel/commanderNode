<template>
    <div class=dialogroot :class="{ closed: dialogClosed }">
        <transition name="fade">
            <div class=fader v-if="isShowing"></div>
        </transition>                        
        <transition name="slide" v-on:after-leave="afterLeave">
            <div class="dialogContainer" v-if="isShowing">
                <div class="dialog" @click="onClose">
                    <div class="text">Der Text der Dialogbox</div>
                    <div class="buttons">
                        <div tabindex="1" class="dialogButton pointer-def">Ja</div>
                        <div tabindex="1" class="dialogButton pointer-def">OK</div>
                        <div tabindex="2" class="dialogButton pointer-def">Nein</div>
                        <div tabindex="3" class="dialogButton pointer-def">Abbrechen</div>
                    </div>                
                </div>
            </div>
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

.dialogContainer {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;    
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
.dialog {
    padding: 30px;
    border-radius: 5px;
    background-color: white;
    z-index: 10;
    transform: translateX(0%);
    box-shadow: 5px 4px 8px 2px rgba(0, 0, 0, 0.35), 0px 0px 20px 2px rgba(0, 0, 0, 0.25);
}
.buttons {
    display: flex;
    margin-top: 20px;
}

.dialogButton {
    display: inline-block;
    background-color: blue;
    user-select: none;
    color: white;
    text-align: center;
    width: 80px;
    height: 20px;
    line-height: 20px;
    transition: background-color 0.3s, outline-color 400ms;
    border-radius: 3px;
    margin-left: 5px;
}
.dialogButton:first-child {
    margin-left: auto;
}

.dialogButton:hover {
    background-color: #7979ff;
}
.dialogButton.isDefaultButton{
    outline-color: gray;
    outline-width: 1px;
    outline-style: solid;
    outline-offset: 1px;
}
.dialogButton:active, .buttonActive {
    background-color: #01018e;
}
.dialogButton:focus {
    outline-color: blue;
    outline-width: 1px;
    outline-style: solid;
    outline-offset: 1px;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.slide-enter-active, .slide-leave-active {
    transition: transform 0.3s, opacity 0.3s;
}
.slide-enter {
    transform: translateX(-50%);
    opacity: 0;
}
.slide-leave-to {
    transform: translateX(50%);
    opacity: 0;
}

</style>
