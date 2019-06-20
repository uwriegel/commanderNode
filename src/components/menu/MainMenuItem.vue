<template>
    <li @click='onClick' tabindex="1" @focusout='onFocusOut' @focusin='onFocusIn' @mouseover='onMouseOver' :class="{ 'selected': menuState.selectedIndex == index }">
        <div class=item>{{item}}</div>
        <div class="submenu" v-show="show"></div>
    </li>
    
    <!-- <span class="accelerator">D</span><span>atei</span> -->
</template>
    
<script>
export default {
    name: 'main-menu-item',
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
            if (this.menuState.selectedIndex == -1) {
                if (this.menuState.lastActive)
                    this.menuState.lastActive.focus()
                this.menuState.lastActive = null
            }
        },
        onFocusIn: function(evt) {
            if (!this.menuState.lastActive) 
                this.menuState.lastActive = evt.relatedTarget
        },
        onFocusOut: function(evt) {
            if (!this.menuState.menubar.contains(evt.relatedTarget)) {
                this.menuState.selectedIndex = -1
                if (!evt.relatedTarget)
                    this.menuState.lastActive.focus()
                this.menuState.lastActive = null
            }
        },
        onMouseOver: function () {
            this.menuState.selectedIndex = 
                this.menuState.selectedIndex != this.index && this.menuState.selectedIndex != -1
                ? this.index
                : this.menuState.selectedIndex
        }
    },
    computed: {
        show: function() {
            const result = this.menuState.selectedIndex == this.index
            if (result) {
                const recentIndex = this.menuState.selectedIndex
                this.$el.focus()
                this.menuState.selectedIndex = recentIndex
            }
            return result
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
