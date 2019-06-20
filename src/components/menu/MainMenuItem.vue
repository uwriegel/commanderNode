<template>
    <li @click='onClick' tabindex="1" @focusout='onFocusOut' @focusin='onFocusIn' @mouseover='onMouseOver' :class="{ 'selected': menuState.selectedIndex == index }">
        <div class=item>
            <div v-show="!menuState.accelerated">{{name}}</div>
            <accelerated-item :item='item' v-show="menuState.accelerated"></accelerated-item>
        </div>
        <div class="submenu" v-show="show"></div>
    </li>
    
    
</template>
    
<script>
import AcceleratedItem from './AcceleratedItem.vue'

export default {
    name: 'main-menu-item',
    components: {
        AcceleratedItem
    },
    props: [ 
        'item', 
        'menuState',
        'index'
    ],
    methods: {
        onClick: function () {
            this.menuState.selectedIndex = 
                this.menuState.selectedIndex != this.index
                ? this.index
                : -1
            if (this.menuState.selectedIndex == -1) 
                this.close(this.menuState.lastActive)
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
            return result
        },
        name: function () {
            return this.item.replace("_", "")
        },
        _name: function () {
            return this.item.replace("_", "")
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
    li:focus {
        color: yellow;
    }
    .item {
        margin-left: 5px;
        margin-top: 2px;
        margin-right: 5px;
        margin-bottom: 2px;
    }

    .submenu {
        width: 100px;
        height: 300px;
        background-color: white;
        position: absolute;
        border-color: lightgray;
        border-style: solid;
        border-width: 1px;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.21);
    }
</style>
