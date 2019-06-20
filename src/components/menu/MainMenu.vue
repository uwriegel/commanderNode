<template>
    <ul>
        <main-menu-item v-for="(item, index) in items" :key="index" :item='item' :menuState='menuState' :index='index' :subItems='item.subItems' />
    </ul>
</template>

<script>
import MainMenuItem from './MainMenuItem.vue'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

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
                    name: "_Entwicklerwerkzeuge",
                    action: function () {
                        console.log("Entwicker usw...")
                        electron.ipcRenderer.send("openDevTools", "")
                    }
                }]
            }],
            menuState: {
                selectedIndex: -1,
                lastActive: null,
                menubar: null,
                accelerated: false,
                isKeyboardActivated: false,
                close: function () {
                    this.menuState.isKeyboardActivated = false
                    this.menuState.accelerated = false
                }.bind(this)
            }
        }
    },
    methods: {
        close: function () {
            this.menuState.close()
            this.menuState.selectedIndex = -1
            if (this.menuState.lastActive)
                this.menuState.lastActive.focus()
        }
    },
    mounted: function () {
        this.menuState.menubar = this.$el
        document.addEventListener("keydown", evt => {
            if (evt.which == 18 && !evt.repeat) { // Alt 
                if (!this.menuState.isKeyboardActivated) {
                    this.menuState.isKeyboardActivated = true
                    this.menuState.accelerated = true
                    this.menuState.lastActive = document.activeElement
                } else 
                    this.close()
                
            }
            else if (evt.which == 27) // ESC
                this.close()
        }, true)
        document.addEventListener("keyup", evt => {
            if (evt.which == 18) { // Alt 
                if (this.menuState.isKeyboardActivated && this.menuState.selectedIndex == -1) 
                    this.menuState.selectedIndex = 0
            }
        }, true)
    },
}
// TODO: Theming menubar
// TODO: keyboard
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
        background-color: #eee;
    }
</style>

