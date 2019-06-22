<template>
    <div id="app">
        <main-menu :items="menuItems" @on-menu-item-clicked="onMenuItem" />
        <div class="main">
            <div>Main Content</div>
            <p>
                <input type="text">
            </p>
            <p>
                <input type="text">
            </p>
        </div>
    </div>
</template>

<script>
import MainMenu from './components/menu/MainMenu.vue'
const electron = window.require('electron')
import { changeTheme } from './themes'

export default {
    name: 'app',
    components: {
        MainMenu
    },
    data: function () {
        return {
            menuItems: [
                {
                    name: "_Datei",
                    subItems: [{ 
                            name: "_Umbenennen",
                            action: "rename"
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
                            name: "_Beenden",
                            action: "close"
                        }
                    ]
                }, 
                {
                    name: "_Navigation",
                    subItems: [{ 
                            name: "_Favoriten"
                        }, { 
                            name: "_Gleichen Ordner öffnen"
                        }
                    ]
                }, 
                {
                    name: "_Selektion",
                    subItems: [{ 
                            name: "_Alles"
                        }, { 
                            name: "Alle _deselektieren"
                        }
                    ]
                }, 
                {
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
                            name: "_Themen",
                            action: "theme"
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Zoomlevel"
                        }, { 
                            name: "_Vollbild",
                            action: "fullscreen"
                        }, { 
                            name: "-"
                        }, { 
                            name: "_Entwicklerwerkzeuge",
                            action: "devtools"
                        }
                    ]
                }
            ],


            affe: "Affe"
        }
    },
    methods: {
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
    margin: 3px;
}
</style>
