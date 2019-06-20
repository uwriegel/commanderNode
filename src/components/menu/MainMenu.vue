<template>
    <ul @keydown="onKeyDown">
        <main-menu-item ref="mmi" v-for="(item, index) in items" :key="index" :item='item' :menuState='menuState' :index='index' :subItems='item.subItems' />
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
        onKeyDown:function (evt) {
            if (this.menuState.selectedIndex == -1)
                return
            switch (evt.which) {
                case 37: // <-
                    this.menuState.selectedIndex--
                    if (this.menuState.selectedIndex == -1)
                        this.menuState.selectedIndex = 3 
                    break;
                case  39:// ->
                    this.menuState.selectedIndex++
                    if (this.menuState.selectedIndex == 4)
                        this.menuState.selectedIndex = 0 
                    break
                case 38: //  |^
                    this.$refs.mmi[this.menuState.selectedIndex].onKeyDown(evt)
                    break
                case 13: // Enter
                case 32: // Space
                case 40: //  |d
                    if (this.menuState.isKeyboardActivated)
                        this.menuState.isKeyboardActivated = false
                    else
                        this.$refs.mmi[this.menuState.selectedIndex].onKeyDown(evt)
                    break;
            }
        },
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
                if (this.menuState.accelerated) {
                    this.close()
                    return
                }
                if (!this.menuState.isKeyboardActivated) {
                    if (this.menuState.selectedIndex == -1)
                        this.menuState.isKeyboardActivated = true
                    this.menuState.accelerated = true
                    this.menuState.lastActive = document.activeElement
                } 
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

