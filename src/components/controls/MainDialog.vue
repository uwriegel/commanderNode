<template>
    <div class=dialogroot :class="{ closed: dialogClosed }">
        <transition name="fade">
            <div class=fader v-if="isShowing"></div>
        </transition>                        
        <transition name="slide" v-on:after-leave="afterLeave">
            <div class="dialogContainer" v-if="isShowing">
                <div class="dialog" @keydown="onKeydown">
                    <simple-dialog ref="simpleDialog" v-if="simpleDialog" :data="simpleDialog"></simple-dialog>
                    <div class="buttons">
                        <div ref=btn1 tabindex="1" v-if="yes" class="dialogButton pointer-def"
                            @keydown=keydownYes>Ja</div>
                        <div ref=btn2 tabindex="1" v-if="ok" class="dialogButton pointer-def"
                            @keydown=keydownOk>OK</div>
                        <div ref=btn3 tabindex="2" v-if="no" class="dialogButton pointer-def"
                            @keydown=keydownNo>Nein</div>
                        <div ref=btn4 tabindex="3" v-if="cancel" class="dialogButton pointer-def" 
                            @keydown=keydownCancel @click="onClose">Abbrechen</div>
                    </div>                
                </div>
            </div>
        </transition>                        
    </div>
</template>
    
</template>

<script>
import Vue from 'vue'
import SimpleDialog from './SimpleDialog'

// TODO: Return to click default button

export default {
    data() {
        return {
            isShowing: false,
            dialogClosed: true,
            ok: false,
            yes: false,
            no: false,
            cancel: false, 
            simpleDialog: null
        }
    },
    components: {
        SimpleDialog
    },
    methods: {
        show(config) {
            return new Promise((res, rej) => {
                this.ok = config.ok
                this.no = config.no
                this.yes = config.yes
                this.cancel = config.cancel
                this.simpleDialog = config.simpleDialog
                this.resolve = res
                this.reject = rej
                this.isShowing = true
                this.dialogClosed = false
                Vue.nextTick(() => this.mounted())
            })
        },
        mounted() {
            // create focusables list

            this.focusables = []
            if (this.$refs.btn1)
                this.focusables.push(this.$refs.btn1)
            if (this.$refs.btn2)
                this.focusables.push(this.$refs.btn2)
            if (this.$refs.btn3)
                this.focusables.push(this.$refs.btn3)
            if (this.$refs.btn4)
                this.focusables.push(this.$refs.btn4)
            if (this.$refs.simpleDialog)
                this.$refs.simpleDialog.getFocusables().forEach(n => this.focusables.push(n))

            this.focusIndex = 0
            this.focusables[this.focusIndex].focus()
        },
        onKeydown(evt) {
            switch (evt.which) {
                case 9: // tab
                    this.focusIndex = evt.shiftKey ? this.focusIndex - 1 : this.focusIndex + 1
                    if (this.focusIndex >= this.focusables.length)
                        this.focusIndex = 0
                    if (this.focusIndex < 0)
                        this.focusIndex = this.focusables.length - 1
                    this.focusables[this.focusIndex].focus()
                    break
                case 27: // ESC
                    if (this.cancel) {
                        this.result = 0
                        this.onClose()
                    }
                    break;
            }
            console.log(evt)
            evt.preventDefault()
            evt.stopPropagation()
        },
        keydownYes(evt) {
            if (evt.which == 13 || evt.which == 32) {
                this.result = 2
                this.onClose()
            }
        },
        keydownNo(evt) {
            if (evt.which == 13 || evt.which == 32) {
                this.result = 3
                this.onClose()
            }
        },
        keydownOk(evt) {
            if (evt.which == 13 || evt.which == 32) {
                this.result = 1
                this.onClose()
            }
        },
        keydownCancel(evt) {
            if (evt.which == 13 || evt.which == 32) {
                this.result = 0
                this.onClose()
            }
        },
        onClose() {
            this.isShowing = false
        },
        afterLeave() {
            this.dialogClosed = true
            Vue.nextTick(() => this.resolve({
                result: this.result
            }))
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
.dialogButton.isDefaultButton {
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
