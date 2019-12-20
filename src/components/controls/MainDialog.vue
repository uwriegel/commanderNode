<template>
    <div class=dialogroot :class="{ closed: dialogClosed }">
        <transition name="fade">
            <div class=fader v-if="isShowing"></div>
        </transition>                        
        <transition :name="transitionName" v-on:after-leave="afterLeave">
            <div class="dialogContainer" v-if="isShowing">
                <div class="dialog" :class="{fullscreen: fullscreen}" @keydown="onKeydown">
                    <p v-if="text">{{text}}</p>
                    <simple-dialog ref="simpleDialog" v-if="simpleDialog" :data="simpleDialog"></simple-dialog>
                    <conflict-items ref="conflictsDialog" v-if="conflictItems" :items=conflictItems></conflict-items>
                    <extended-rename ref="extendedRename" v-if="extendedRename" :param=extendedRename></extended-rename>
                    <div class="buttons">
                        <div ref=btn1 tabindex="1" v-if="yes" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def" :class="{default: isButtonYesDefault}"
                            @keydown=keydownYes @click=clickButton(2)>Ja</div>
                        <div ref=btn2 tabindex="1" v-if="ok" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def" :class="{default: isButtonOkDefault}"
                            @keydown=keydownOk @click=clickButton(1)>OK</div>
                        <div ref=btn3 tabindex="2" v-if="no" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def" :class="{default: isButtonNoDefault}"
                            @keydown=keydownNo @click=clickButton(3)>Nein</div>
                        <div ref=btn4 tabindex="3" v-if="cancel" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def" :class="{default: isButtonCancelDefault}" 
                            @keydown=keydownCancel @click=clickButton(0)>Abbrechen</div>
                    </div>                
                </div>
            </div>
        </transition>                        
    </div>
</template>
    
<script lang="ts">
import Vue from 'vue'
import SimpleDialog from './SimpleDialog.vue'
//import ConflictItems from './ConflictItems.vue'
//import ExtendedRename from './ExtendedRename.vue'

export enum DialogResult {
    Cancel,
    Ok,
    Yes,
    No
}

export interface Configuration {
    rightFolder: boolean
    leftFolder: boolean
    ok: boolean
    no: boolean
    yes: boolean
    cancel: boolean
    defButton: string
    simpleDialog?: object
    text: string
}

export interface FocusableElement {
    focus(): ()=>void
}

export interface Content {
    focusable: FocusableElement
}

export interface Result {
    result: number
    inputText?: string
}

export default Vue.extend({
    data() {
        return {
            transitionName: "default",
            isShowing: false,
            dialogClosed: true,
            ok: false,
            yes: false,
            no: false,
            cancel: false, 
            defButton: "",
            text: "",
            simpleDialog: null,
            conflictItems: null,
            extendedRename: null,
            isButtonFocused: false,
            focusIndex: 0,
            inputText: "",
            fullscreen: false,
            content: undefined as Content|undefined,
            focusables: [] as FocusableElement[],
            transitionNames: [] as string[],
            resolve: undefined as ((res: Result)=>void) | undefined,
            reject: undefined as ((res: any)=>void) | undefined,
            result: DialogResult.Cancel
        }
    },
    computed: {
        isButtonYesDefault(): boolean {
            return this.defButton == "yes" && !this.isButtonFocused
        },
        isButtonNoDefault(): boolean {
            return this.defButton == "no" && !this.isButtonFocused
        },
        isButtonOkDefault(): boolean {
            return this.defButton == "ok" && !this.isButtonFocused
        },
        isButtonCancelDefault(): boolean {
            return this.defButton == "cancel" && !this.isButtonFocused
        } 
    },
    components: {
        //SimpleDialog,
        // ConflictItems,
        // ExtendedRename
    },
    methods: {
        show(config: Configuration) {
            this.transitionNames = 
                config.rightFolder 
                    ? [ "slide-left", "slide-right" ] 
                    : (config.leftFolder 
                    ? [ "slide-right", "slide-left" ]
                    : [ "default", "default" ] )
            this.transitionName = this.transitionNames[0]
            this.$emit("state-changed", true)
            return new Promise<Result>((res, rej) => {
                this.ok = config.ok
                this.no = config.no
                this.defButton = config.defButton
                this.yes = config.yes
                this.cancel = config.cancel
                //this.simpleDialog = config.simpleDialog
                //this.conflictItems = config.conflictItems
                //this.extendedRename = config.extendedRename
                this.resolve = res
                this.text = config.text
                this.reject = rej
                this.isShowing = true
                this.dialogClosed = false
                //this.fullscreen = config.conflictItems
                Vue.nextTick(() => this.mounted())
            })
        },
        onFocus() {
            this.isButtonFocused = true
        },
        onBlur() {
            this.isButtonFocused = false
        },
        mounted() {
            this.focusables = []
            //this.content = this.$refs.simpleDialog as Element || this.$refs.conflictsDialog || this.$refs.extendedRename
            if (this.$refs.btn1)
                this.focusables.push(this.$refs.btn1 as any as FocusableElement)
            if (this.$refs.btn2)
                this.focusables.push(this.$refs.btn2 as any as FocusableElement)
            if (this.$refs.btn3)
                this.focusables.push(this.$refs.btn3 as any as FocusableElement)
            if (this.$refs.btn4)
                this.focusables.push(this.$refs.btn4 as any as FocusableElement)
            const buttonCount = this.focusables.length
            // if (this.content) 
            //     this.content.getFocusables().forEach(n => this.focusables.push(n))
            //this.focusIndex = this.content ? this.content.getFocusIndex(buttonCount) : 0
            // this.defButton = this.content ? this.content.getDefaultButton(this.defButton) : this.defButton
            this.focusables[this.focusIndex].focus()
        },
        onKeydown(evt: KeyboardEvent) {
            switch (evt.which) {
                case 9: // tab
                    const active = document.activeElement
                    const setFocus = () => {
                        this.focusIndex = evt.shiftKey ? this.focusIndex - 1 : this.focusIndex + 1
                        if (this.focusIndex >= this.focusables.length)
                            this.focusIndex = 0
                        if (this.focusIndex < 0)
                            this.focusIndex = this.focusables.length - 1
                        this.focusables[this.focusIndex].focus()
                        if (document.activeElement == active)
                            setFocus()    
                    }
                    setFocus()
                    break
                case 13: // Return
                    if (this.defButton && !this.isButtonFocused) {
                        this.result = 
                            this.defButton == "ok"
                            ? 1
                            : this.defButton == "yes"
                            ? 2
                            : this.defButton == "no"
                            ? 3
                            : 0
                        this.onClose()    
                    }
                    break
                case 27: // ESC
                    if (this.cancel) {
                        this.result = 0
                        this.onClose()
                    }
                    break
                default:
                    return
            }
            evt.preventDefault()
            evt.stopPropagation()
        },
        keydownYes(evt: KeyboardEvent) {
            if (evt.which == 13 || evt.which == 32) {
                this.result = DialogResult.Yes
                this.onClose()
            }
        },
        keydownNo(evt: KeyboardEvent) {
            if (evt.which == 13 || evt.which == 32) {
                this.result = DialogResult.No
                this.onClose()
            }
        },
        keydownOk(evt: KeyboardEvent) {
            if (evt.which == 13 || evt.which == 32) {
                this.result = DialogResult.Ok
                this.onClose()
            }
        },
        keydownCancel(evt: KeyboardEvent) {
            if (evt.which == 13 || evt.which == 32) {
                this.result = DialogResult.Cancel
                this.onClose()
            }
        },
        clickButton(btn: DialogResult) {
            this.result = btn
            this.onClose()
        },
        onClose() {
            if (this.result == 0)
                this.transitionName = this.transitionNames[1]
            //this.inputText = this.$refs.simpleDialog ? this.$refs.simpleDialog.getInputText() : ""
            this.$emit("state-changed", false)
            Vue.nextTick(() => this.isShowing = false)
        },
        afterLeave() {
            this.dialogClosed = true
            Vue.nextTick(() => this.resolve ? this.resolve({
                result: this.result,
                inputText: this.inputText
            }): {})
        }
    }
})
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
    background-color: var(--dialog-fader-color);
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
    display: flex;
    flex-direction: column;    
    margin: 30px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 5px;
    background-color: var(--main-background-color);
    z-index: 10;
    transform: translateX(0%);
    box-shadow: 5px 4px 8px 2px rgba(0, 0, 0, 0.35), 0px 0px 20px 2px rgba(0, 0, 0, 0.25);
}
.fullscreen {
    width: 100%;
    height: 80%; 
}
.buttons {
    display: flex;
    margin-top: 20px;
}

.dialogButton {
    display: inline-block;
    background-color: blue;
    outline-color: var(--main-background-color);
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
.dialogButton.default {
    outline-color: rgb(160, 160, 160);
    outline-width: 1px;
    outline-style: solid;
    outline-offset: 1px;
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
    will-change: opacity;
}
.slide-right-enter-active, .slide-right-leave-active, .slide-left-enter-active, .slide-left-leave-active, .default-enter-active, .default-leave-active {
    transition: transform 0.3s, opacity 0.3s;
}
.slide-right-enter {
    transform: translateX(-50%);
    will-change: transform, opacity;
    opacity: 0;
}
.slide-right-leave-to {
    transform: translateX(50%);
    will-change: transform, opacity;
    opacity: 0;
}
 
.slide-left-enter {
    transform: translateX(50%);
    will-change: transform, opacity;
    opacity: 0;
}
.slide-left-leave-to {
    transform: translateX(-50%);
    will-change: transform, opacity;
    opacity: 0;
}

.default-enter {
    opacity: 0;
    will-change: opacity;
}
.default-leave-to {
    will-change: opacity;
    opacity: 0;
}
</style>
