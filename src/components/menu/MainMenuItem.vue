<template>
    <li @click='onClick' tabindex="1" @focusout='onFocusOut' @focusin='onFocusIn' @mouseover='onMouseOver' 
        :class="{ 'selected': menuState.selectedIndex == index }">
        <menu-item class=item :item='item' :menuState='menuState' />
        <sub-menu v-show="show" :items=subItems :menuState='menuState'></sub-menu>
    </li>
</template>
    
<script>
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
    methods: {
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
            this.menuState.close()
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
        background-color: rgb(235,235,255);
    }

    li.selected {
        background-color: blue;
        color: white;
    }
    /* li:focus {
        color: yellow;
    } */
    .item {
        margin-left: 5px;
        margin-top: 2px;
        margin-right: 5px;
        margin-bottom: 2px;
    }
</style>
