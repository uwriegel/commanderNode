<template>
    <div class="submenu">
        <menu-item v-for="item in items" :key="item" :item='item.name' :menuState='menuState' />
    </div>    
</template>

<script>
import MenuItem from './MenuItem.vue'

export default {
    name: 'sub-menu',
    components: {
        MenuItem
    },
    props: [
        'items',
        'menuState'
    ],
    computed: {
        separator: function () {

        }
    }
}
</script>

<style>
    .submenu {
        background-color: white; 
        position: absolute;
        color: black;
        border-color: lightgray;
        border-style: solid;
        border-width: 1px;
        white-space: nowrap;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.21);
    }
    .submenu>div {
        margin: 5px 20px;
    }
</style>
