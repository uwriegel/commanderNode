<template>
    <li @click='onClick' tabindex="1" @focusout='onFocusOut' @focusin='onFocusIn' @mouseover='onMouseOver' @keydown='onKeyDown'
            :class="{ 'selected': menuState.selectedIndex == index }">
        <menu-item class=item :item='item' :menuState='menuState' />
        <sub-menu ref=subMenu v-if="show" :items=subItems :menuState='menuState' ></sub-menu>
    </li>
</template>
    
<script>

// TODO: open with mouse, then turn to left or right: fosus stays. When Arrow up or down, the wrong menitem gets the key events
// TODO: always set focus to selected menu item!

import SubMenu from './SubMenu.vue'
import MenuItem from './MenuItem.vue'

export default {
    name: 'main-menu-item',
    components: {
        MenuItem,
        SubMenu
    },
    props: [ 
        'item', 
        'menuState',
        'index',
        'subItems'
    ],
    watch: {
        keyDown: function(newVal, oldVal) {
            console.log("Keydown", newVal, oldVal)
        }
    },
    methods: {
        onKeyDown: function (evt) {
            switch (evt) {
                case 38: //  |^
                    // TODO (1) use bindings to child: prop and watch
                    this.$refs.subMenu.onKeyDown(evt)
                    break
                case 13: // Enter
                case 32: // Space
                case 40: //  |d
                    if (this.menuState.isKeyboardActivated)
                        this.menuState.isKeyboardActivated = false
                    else 
                        this.$refs.subMenu.onKeyDown(evt)
                    break;
                default:
                    if (this.menuState.accelerated)
                        this.$refs.subMenu.onKeyDown(evt)
            }
        },
        onClick: function () {
            if (this.menuState.isKeyboardActivated == true)
                this.menuState.isKeyboardActivated = false
            else {
                this.menuState.selectedIndex = 
                    this.menuState.selectedIndex != this.index
                    ? this.index
                    : -1
                if (this.menuState.selectedIndex == -1) 
                    this.close(this.menuState.lastActive)
            }
        },
        onFocusIn: function(evt) {
            if (!this.menuState.lastActive) 
                this.menuState.lastActive = evt.relatedTarget
        },
        onFocusOut: function(evt) {
            if (!this.menuState.menubar.contains(evt.relatedTarget)) 
                this.close(!evt.relatedTarget)
        },
        onMouseOver: function () {
            this.menuState.selectedIndex = 
                this.menuState.selectedIndex != this.index && this.menuState.selectedIndex != -1
                ? this.index
                : this.menuState.selectedIndex
        },
        close: function (focus) {
            this.menuState.selectedIndex = -1
            if (focus && this.menuState.lastActive)
                this.menuState.lastActive.focus()
            this.menuState.lastActive = null
            this.$emit('keyboard-activated-stopped')
        }
    },
    computed: {
        show: function () {
            const result = this.menuState.selectedIndex == this.index
            if (result) {
                const recentIndex = this.menuState.selectedIndex
                this.$el.focus()
                this.menuState.selectedIndex = recentIndex
            }
            return !this.menuState.isKeyboardActivated && result
        }
    },
}
</script>

<style scoped>
    li {
        cursor: default;
        display: block;
        float: left;
        position: relative;
    }
    li:focus {
        outline: none;
    }

    li:hover {
        background-color: var(--menu-hover-color);
    }

    li.selected {
        background-color: var(--selected-background-color);
        color: var(--selected-color);
    }
    .item {
        margin-left: 5px;
        margin-top: 2px;
        margin-right: 5px;
        margin-bottom: 2px;
    }
</style>
