<template>
    <div class="submenu">
        <menu-item class="submenuitem" v-for="(item, index) in items" :key="index" :item='item' :menuState='menuState' />
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
    ]
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
</style>
