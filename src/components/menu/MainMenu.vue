<template>
    <ul>
        <main-menu-item v-for="(item, index) in items" :key="index" :item='item' :menuState='menuState' :index='index' :subItems='item.subItems' />
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
            items: [{
                name: "_Datei",
                subItems: [{ 
                    name: "_Umbenennen"
                }, { 
                    name: "-"
                }, { 
                    name: "_Kopieren"
                }, { 
                    name: "_Verschieben"
                }, { 
                    name: "_Löschen"
                }, { 
                    name: "-"
                }, { 
                    name: "_Ordner anlegen"
                }, { 
                    name: "-"
                }, { 
                    name: "_Eigenschaften"
                }, { 
                    name: "Öffnen _mit"
                }, { 
                    name: "-"
                }, { 
                    name: "_Beenden"
                }]
            }, {
                name: "_Navigation",
                subItems: [{ 
                    name: "_Favoriten"
                }, { 
                    name: "_Gleichen Ordner öffnen"
                }]
            }, {
                name: "_Selektion",
                subItems: [{ 
                    name: "_Alles"
                }, { 
                    name: "Alle _deselektieren"
                }]
            }, {
                name: "_Ansicht",
                subItems: [{ 
                    name: "_Versteckte Dateien"
                }, { 
                    name: "_Aktualisieren"
                }, { 
                    name: "-"
                }, { 
                    name: "_Vorschau"
                }, { 
                    name: "-"
                }, { 
                    name: "_Themen"
                }, { 
                    name: "-"
                }, { 
                    name: "_Zoomlevel"
                }, { 
                    name: "_Vollbild"
                }, { 
                    name: "-"
                }, { 
                    name: "_Entwicklerwerkzeuge"
                }]
            }],
            menuState: {
                selectedIndex: -1,
                lastActive: null,
                menubar: null,
                accelerated: false
            }
        }
    },
    mounted: function () {
        this.menuState.menubar = this.$el
    }
}
// TODO: Keyboard when menu per mouse is finished and electron menu is removed
// TODO: focuslost by mouse: close when by keyboard
// TODO: keyboard control: global key event hook
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

