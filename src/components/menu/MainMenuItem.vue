<template>
    <li @click='onClick' @mouseover='onMouseOver' :class="{ 'selected': menuState.selectedIndex == index }">
        <div class=item>{{item}}</div>
        <div class="submenu" v-show="menuState.selectedIndex == index"></div>
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
        },
        onMouseOver: function () {
            this.menuState.selectedIndex = 
                this.menuState.selectedIndex != this.index && this.menuState.selectedIndex != -1
                ? this.index
                : this.menuState.selectedIndex
        }
    }
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
