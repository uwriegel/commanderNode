<template>
    <div>
        <div class="flex">
            <ul>
                <main-menu-item v-for="(item, index) in items" :key="item" :item='item' :menuState='menuState' :index='index' />
            </ul>
        </div>
        <sub-menu />
    </div>
</template>

<script>
import SubMenu from './SubMenu.vue'
import MainMenuItem from './MainMenuItem.vue'

export default {
    name: 'main-menu',
    components: {
        SubMenu,
        MainMenuItem
    },
    data: function () {
        return {
            items: ["_Datei", "_Navigation", "_Selektion", "_Ansicht" ],
            menuState: {
                selectedIndex: -1
            }
        }
    },
    methods: {
    },
}

// TODO: OnHover when index != -1 track index
// TODO: focuslost by mouse: close
// TODO: computed: split text in three parts: xxx _X xxx when alt is pressed
</script>

<style scoped>
    .flex {
        display: flex;
    }
    ul {
        user-select: none;
        cursor:default;
        list-style: none;
        padding: 0;
        margin: 0;
    }



    ul.subMenuOpened > li.selected {
        background-color: rgb(235,235,255);
        color: black;
    }
</style>

