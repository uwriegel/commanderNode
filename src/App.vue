<template>
    <div id="app">
        <vue-electron-titlebar :title="'Commander'" :ico="'kirk2.png'" >
            <vue-menu-bar :items="menuItems" @on-menu-item-clicked="onMenuItem" />
        </vue-electron-titlebar>
        <div class="main">
            <!-- <column-test></column-test> -->
            <!-- <scrollbar-test></scrollbar-test> -->
            <!-- <table-view-test></table-view-test> -->
            <!-- <addon></addon> -->
            <!-- <connection-test></connection-test> -->
            <!-- <folder-test></folder-test> -->
            <!-- <splitter-grid-test></splitter-grid-test> -->
            <viewer-test></viewer-test>
            <!-- <commander ref="commander"></commander> -->
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MenuItem } from 'vue-menubar'
//import Scrollbar from './components/controls/Scrollbar'
//import Commander from './components/Commander'

// Tests
import ColumnTest from './components/test/ColumnTest.vue'
import ScrollbarTest from './components/test/ScrollbarTest.vue'
import TableViewTest from './components/test/TableViewTest.vue'
import Addon from './components/test/Addon.vue'
// import ConnectionTest from './components/test/ConnectionTest'
import FolderTest from './components/test/FolderTest.vue'
import SplitterGridTest from './components/test/SplitterGridTest.vue'
import ViewerTest from './components/test/ViewerTest.vue'

const electron = (window as any).require('electron')

export default Vue.extend({
    name: 'app',
    components: {
//        Scrollbar,
//        Commander,
        // Tests:
        ColumnTest,
        ScrollbarTest,
        TableViewTest,
        Addon,
        FolderTest,
        SplitterGridTest,
        ViewerTest
    },
    data() {
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
                            name: "Er_weitertes Umbenennen",
                            action: "extendedRename",
                            accelerator: { 
                                name: "Strg+F2",
                                ctrl: true,
                                key: 113
                            }
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Kopieren",
                            action: "copy",
                            accelerator: { 
                                name: "F5",
                                key: 116
                            }
                        }, { 
                            name: "_Verschieben",
                            action: "move",
                            accelerator: { 
                                name: "F6",
                                key: 117
                            }
                        }, { 
                            name: "_Löschen",
                            accelerator: { name: "Entf"},
                            action: "delete"
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Ordner anlegen",
                            accelerator: { 
                                name: "F7",
                                key: 118
                            },
                            action: "createFolder"
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Eigenschaften",
                            action: "properties",
                            accelerator: { 
                                name: "Alt+Enter",
                                key: 13,
                                alt: true
                            }
                        }, { 
                            name: "Öffnen _mit",
                            action: "openAs",
                            accelerator: { 
                                name: "Strg+Enter",
                                key: 13,
                                ctrl: true
                            }
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
                            action: "openSameFolder",
                            accelerator: { 
                                name: "F9",
                                key: 120,
                            }
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
                            action: "showHidden",
                            checkSelected: () => this.$store.state.showHidden,
                            accelerator: { 
                                name: "Strg+H",
                                key: 72,
                                ctrl: true
                            }
                        }, { 
                            name: "_Aktualisieren",
                            action: "refresh",
                            accelerator: { 
                                name: "Strg+R",
                                key: 82,
                                ctrl: true
                            }
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Vorschau",
                            action: "showViewer",
                            checkSelected: () => this.$store.state.showViewer,
                            accelerator: { 
                                name: "F3",
                                key: 114,
                            }
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
        onKeyDown: function (evt: KeyboardEvent) {
            const key = (Vue as any).menuMakeKey(evt.which, evt.altKey, evt.shiftKey, evt.ctrlKey)
            const action = this.acceleratorMap.get(key)
            if (action) {
                this.onMenuItem(action)
                evt.preventDefault()
                evt.stopPropagation()
            }
        },
        onMenuItem: function (action: string, menuItem?: MenuItem) {
            switch (action) {
                // case "rename":
                //     this.$refs.commander.rename()
                //     break
                // case "extendedRename":
                //     this.$refs.commander.extendedRename()
                //     break
                // case 'properties':
                //     this.$refs.commander.properties()
        //             break
        //         case 'openAs':
        //             this.$refs.commander.openAs()
        //             break
                case "close":
                    close()                     
                    break
        //         case "createFolder":
        //             this.$refs.commander.createFolder()
        //             break
        //         case "copy":
        //             this.$refs.commander.copyItems(false)
        //             break
        //         case "move":
        //             this.$refs.commander.copyItems(true)
        //             break
        //         case "delete":
        //             this.$refs.commander.deleteItems()
        //             break
        //         case "openSameFolder":
        //             this.$refs.commander.openSameFolder()
        //             break
        //         case "theme":
        //             changeTheme()
        //             break
                case "fullscreen":
                    electron.ipcRenderer.send("fullscreen")
                    break
                case "devtools":
                    electron.ipcRenderer.send("openDevTools")
                    break
                case "showHidden":
                    this.$store.commit('setShowHidden', !this.$store.state.showHidden)
                    if (menuItem)
                        menuItem.isSelected = this.$store.state.showHidden
                    break
        //         case "showViewer":
        //             this.$store.commit('setShowViewer', !this.$store.state.showViewer)
        //             if (menuItem)
        //                 menuItem.isSelected = this.$store.state.showViewer
        //             break
        //         case "refresh":
        //             this.$refs.commander.refresh()
        //             break
            }
        }
    },
    mounted: function () {
        const accelerators = this.menuItems.map(n => n.subItems)
            .flat()
            .filter(n => n.accelerator && n.action && n.accelerator.key)
            .map(n => { return { 
                action: n.action, 
                key: (Vue as any).menuMakeKey(n.accelerator.key, n.accelerator.alt, n.accelerator.shift, n.accelerator.ctrl)
            }})
        accelerators.forEach(n => this.acceleratorMap.set(n.key, n.action))

        document.addEventListener('keydown', this.onKeyDown, true)
    }
})
</script>

<style>
body {
    background-color: var(--main-background-color);
    color: var(--main-color); 
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
    border-top: 1px solid transparent;
}
#app:focus-within {
    border-top: 1px solid blue;
}
.main {
    flex-grow: 1;   
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
