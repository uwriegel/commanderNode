<template>
    <ul @keydown="onKeyDown">
        <main-menu-item v-for="(item, index) in items" 
            @keyboard-activated-stopped="stopKeyboardActivated" @on-menu-item-clicked="onMenuItem" @on-closing="closeMenu"
            :key="index" :item='item' :menuState='menuState' :index='index' :subItems='item.subItems' />
    </ul>
</template>

<script>
import MainMenuItem from './MainMenuItem.vue'
import { getAccelerators, parseAccelerators } from './accelerators'

export default {
    name: 'main-menu',
    components: {
        MainMenuItem
    },
    props: [
        'items'
    ],
    data() {
        return {
            menuState: {
                selectedIndex: -1,
                lastActive: null,
                menubar: null,
                accelerated: false,
                isKeyboardActivated: false
            }
        }
    },
    methods: {
        stopKeyboardActivated: function () {
            this.menuState.isKeyboardActivated = false
            this.menuState.accelerated = false
        },
        onKeyDown: function (evt) {
            if (this.menuState.selectedIndex != -1) {
                switch (evt.which) {
                    case 37: // <-
                        this.menuState.selectedIndex--
                        if (this.menuState.selectedIndex == -1)
                            this.menuState.selectedIndex = 3 
                        break;
                    case  39:// ->
                        this.menuState.selectedIndex++
                        if (this.menuState.selectedIndex == 4)
                            this.menuState.selectedIndex = 0 
                        break
                }
            }
        },
        onMenuItem: function (param, item) {
            this.$emit('on-menu-item-clicked', param, item)
        },
        closeMenu: function () {
            this.stopKeyboardActivated()
            this.menuState.selectedIndex = -1
            if (this.menuState.lastActive)
                this.menuState.lastActive.focus()
        },
    },
    mounted: function () {
        this.menuState.menubar = this.$el
        document.addEventListener("keydown", evt => {
            if (this.menuState.isKeyboardActivated) {
                const hits = parseAccelerators(this.accelerators, evt.key)
                if (hits.length > 0) {
                    this.menuState.selectedIndex = hits[0]
                    this.menuState.isKeyboardActivated = false
                    evt.preventDefault()
                    evt.stopPropagation()
                }
            }

            if (evt.which == 18 && !evt.repeat && evt.code == "AltLeft") { // Alt 
                if (this.menuState.accelerated) {
                    this.closeMenu()
                    return
                }
                if (!this.menuState.isKeyboardActivated) {
                    if (this.menuState.selectedIndex == -1)
                        this.menuState.isKeyboardActivated = true
                    this.menuState.accelerated = true
                    this.menuState.lastActive = document.activeElement
                } 
            }
            else if (evt.which == 27) // ESC
                this.closeMenu()
        }, true)
        document.addEventListener("keyup", evt => {
            if (evt.which == 18) { // Alt 
                if (this.menuState.isKeyboardActivated && this.menuState.selectedIndex == -1) 
                    this.menuState.selectedIndex = 0
            }
        }, true)
        this.accelerators = getAccelerators(this.items)
    }
}
</script>

<style scoped>
    ul {
        user-select: none;
        cursor:default;
        list-style: none;
        padding: 0;
        margin: 0;
        background-color: var(--menu-background-color);
    }
</style>

