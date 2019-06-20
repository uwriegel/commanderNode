<template>
    <li @click='onClick' @mouseover='onMouseOver' :class="{ 'selected': menuState.selectedIndex == index }">
        <div>{{item}}</div>
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
        padding-left: 5px;
        padding-top: 2px;
        padding-right: 5px;
        padding-bottom: 2px;
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
</style>
