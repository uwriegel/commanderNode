<template>
    <ul>
        <main-menu-item v-for="(item, index) in items" :key="item" :item='item' :menuState='menuState' :index='index' />
    </ul>
</template>

<script>
import MainMenuItem from './MainMenuItem.vue'

export default {
    name: 'main-menu',
    components: {
        MainMenuItem
    },
    data: function () {
        return {
            items: ["_Datei", "_Navigation", "_Selektion", "_Ansicht" ],
            menuState: {
                selectedIndex: -1,
                lastActive: null,
                menubar: null
            }
        }
    },
    mounted: function () {
        this.menuState.menubar = this.$el
    }
}

// TODO: computed: split text in three parts: xxx _X xxx when alt is pressed, keyboardActivated on and off
// TODO: Control via alt
// TODO: focuslost by mouse: close when by keyboard
</script>

<style scoped>
    ul {
        user-select: none;
        cursor:default;
        list-style: none;
        padding: 0;
        margin: 0;
        background-color: lightgray;
    }



    ul.subMenuOpened > li.selected {
        background-color: rgb(235,235,255);
        color: black;
    }
</style>

