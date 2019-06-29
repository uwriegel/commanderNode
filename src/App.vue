<template>
    <div id="app">
        <main-menu :items="menuItems" @on-menu-item-clicked="onMenuItem" />
        <div class="main">
            <!-- <column-test></column-test> -->
            <!-- <scrollbar-test></scrollbar-test> -->
            <table-view-test></table-view-test>
        </div>
    </div>
</template>

<script>
import MainMenu from './components/menu/MainMenu.vue'
import Scrollbar from './components/controls/Scrollbar'

// Tests
import ColumnTest from './components/test/ColumnTest'
import ScrollbarTest from './components/test/ScrollbarTest'
import TableViewTest from './components/test/TableViewTest'

import { makeKey } from './components/menu/accelerators'
const electron = window.require('electron')
import { changeTheme } from './themes'

export default {
    name: 'app',
    components: {
        MainMenu,
        Scrollbar,
        // Tests:
        ColumnTest,
        ScrollbarTest,
        TableViewTest
    },
    data: function () {
        return {
            menuItems: [
                {
                    name: "_Datei",
                    subItems: [{ 
                            name: "_Umbenennen",
                            action: "rename",
                            accelerator: { 
                                name: "F2",
                                key: 113
                            }
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Kopieren",
                            accelerator: { name: "F5"}
                        }, { 
                            name: "_Verschieben",
                            accelerator: { name: "F6"}
                        }, { 
                            name: "_Löschen",
                            accelerator: { name: "Entf"}
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Ordner anlegen",
                            accelerator: { name: "F7"}
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Eigenschaften",
                            accelerator: { name: "Alt+Enter"}
                        }, { 
                            name: "Öffnen _mit",
                            accelerator: { name: "Strg+F4"}
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Beenden",
                            action: "close",
                            accelerator: { name: "Alt+F4"}
                        }
                    ]
                }, 
                {
                    name: "_Navigation",
                    subItems: [{ 
                            name: "_Favoriten",
                            accelerator: { name: "F1"}
                        }, { 
                            name: "_Gleichen Ordner öffnen",
                            accelerator: { name: "F9"}
                        }
                    ]
                }, 
                {
                    name: "_Selektion",
                    subItems: [{ 
                            name: "_Alles",
                            accelerator: { name: "Num +"}
                        }, { 
                            name: "Alle _deselektieren",
                            accelerator: { name: "Num -"}
                        }
                    ]
                }, 
                {
                    name: "_Ansicht",
                    subItems: [{ 
                            name: "_Versteckte Dateien",
                            accelerator: { name: "Strg+H"}
                        }, { 
                            name: "_Aktualisieren",
                            accelerator: { name: "Strg+R"}
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Vorschau",
                            accelerator: { name: "F3"}
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Themen",
                            action: "theme"
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Zoomlevel"
                        }, { 
                            name: "_Vollbild",
                            action: "fullscreen",
                            accelerator: { 
                                name: "F11",
                                key: 122
                            }
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Entwicklerwerkzeuge",
                            action: "devtools",
                            accelerator: { 
                                name: "F12",
                                key: 123
                            }
                        }
                    ]
                }
            ],
            acceleratorMap: new Map()
        }
    },
    methods: {
        onKeyDown: function (evt) {
            const key = makeKey(evt.which, evt.altKey, evt.shiftKey, evt.ctrlKey)
            const action = this.acceleratorMap.get(key)
            if (action) {
                this.onMenuItem(action)
                evt.preventDefault()
                evt.stopPropagation()
            }
        },
        onMenuItem: function (action) {
            switch (action) {
                case "rename":
                    setTimeout(() => {
                        const toFocus = document.activeElement
                        alert(this.affe)
                        if (toFocus)
                            setTimeout(() => toFocus.focus())
                    })
                    break
                case "close":
                    close()                     
                    break
                case "theme":
                    changeTheme()
                    break
                case "fullscreen":
                    electron.ipcRenderer.send("fullscreen")
                    break
                case "devtools":
                    electron.ipcRenderer.send("openDevTools")
                    break
            }
        }
    },
    mounted: function () {
        const accelerators = this.menuItems.map(n => n.subItems)
            .flat()
            .filter(n => n.accelerator && n.action && n.accelerator.key)
            .map(n => { return { 
                action: n.action, 
                key: makeKey(n.accelerator.key, false, false, false)
            }})
        accelerators.forEach(n => this.acceleratorMap.set(n.key, n.action))

        document.addEventListener('keydown', this.onKeyDown, true)
    }
}
</script>

<style>
@import 'assets/css/theme.css';
body {
    background-color: var(--main-background-color);
    font-family: sans-serif;
    font-size: 75%;
    overflow:hidden;
    height: 100vh;
    padding: 0px;
    margin: 0px;    
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.main {
    flex-grow: 1;   
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
