import { Menu, BrowserWindow } from "electron"

const DELETE_FILES = "DELETE_FILES"
const CREATE_FOLDER = "CREATE_FOLDER"
const REFRESH = "REFRESH"
const PREVIEW = "PREVIEW"
const SHOWHIDDEN = "SHOWHIDDEN"

export function initializeMenu(win: BrowserWindow) {
    const menu = Menu.buildFromTemplate([
        {
            label: '&Datei',
            submenu: [{
                label: '&Umbenennen',
                accelerator: "F2",
                //click: evt => win.webContents.send(RENAME)
            },
            {
                label: '&Erweitertes Umbenennen',
                accelerator: "Control+F2",
                //click: evt => win.webContents.send(EXTENDED_RENAME)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Kopieren',
                accelerator: "F5",
                //click: evt => win.webContents.send(COPY)
            },
            {
                label: '&Verschieben',
                accelerator: "F6",
                //click: evt => win.webContents.send(MOVE)
            },
            {
                label: '&Löschen',
                accelerator: "Delete",
                click: evt => win.webContents.send(DELETE_FILES)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Ordner anlegen',
                accelerator: "F7",
                click: evt => win.webContents.send(CREATE_FOLDER)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Eigenschaften',
                accelerator: "Alt+Return",
                //click: evt => win.webContents.send(PROPERTIES)
            },
            {
                label: 'Öffnen &mit',
                accelerator: "Ctrl+Return",
                //click: evt => win.webContents.send(OPEN_WITH)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Beenden',
                accelerator: 'Alt+F4',
                role: "quit"
            }
        ]},
        {
            label: '&Navigation',
            submenu: [{
                label: '&Favoriten',
                accelerator: 'F1'
            },
            {
                label: '&Gleichen Ordner öffnen',
                accelerator: 'F9',
                //click: evt => win.webContents.send(ADAPT_PATH)
            }
        ]},
        {
            label: '&Selektion',
            submenu: [{
                label: '&Alles',
                accelerator: 'numadd',
                //click: evt => win.webContents.send(SELECT_ALL)
            },
            {
                label: 'Alle &deselektieren',
                accelerator: 'numsub',
                //click: evt => win.webContents.send(DESELECT_ALL)
            }
        ]},
        {
            label: '&Ansicht',
            submenu: [{
                label: '&Versteckte Dateien',
                accelerator: "Ctrl+H",
                type: "checkbox",
                click: evt => win.webContents.send(SHOWHIDDEN, evt.checked)
            },
            {
                label: '&Aktualisieren',
                accelerator: "Ctrl+R",
                click: evt => win.webContents.send(REFRESH)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Vorschau',
                type: "checkbox",
                accelerator: "F3",
                click: evt => win.webContents.send(PREVIEW, evt.checked)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Themen',
                type: "submenu",
                submenu: [{
                    label: '&Blau',
                    type: "radio",
                  //  checked: theme == themeBlue,
                    //click: evt => setTheme(themeBlue)
                },
                {
                    label: '&Hellblau',
                    type: "radio",
                    //checked: theme == themeLightBlue,
                    //click: evt => setTheme(themeLightBlue)
                },
                {
                    label: '&Dunkel',
                    type: "radio",
                    //checked: theme == themeDark,
                    //click: evt => setTheme(themeDark)
                }]
            },
            {
                type: 'separator'
            },            
            {
                label: '&Zoomlevel',
                type: "submenu",
                submenu: [{
                    label: '50%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(0.5)
                },
                {
                    label: '75%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(0.75)
                },
                {
                    label: '100%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(1.0)
                },
                {
                    label: '150%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(1.5)
                },
                {
                    label: '200%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(2.0)
                },
                {
                    label: '250%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(2.5)
                },
                {
                    label: '300%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(3.0)
                },
                {
                    label: '350%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(3.5)
                },
                {
                    label: '400%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(4.0)
                }]
            },
            {
                label: '&Vollbild',
                click: () => win.setFullScreen(!win.isFullScreen()),
                accelerator: "F11"
            },
            {
                type: 'separator'
            },            
            {
                label: '&Entwicklerwerkzeuge',
                click: () => win.webContents.openDevTools(),
                accelerator: "F12"
            }
        ]}
    ])
    
    Menu.setApplicationMenu(menu)    
}