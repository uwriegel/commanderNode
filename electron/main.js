const electron = require('electron')
const url = require("url")
const path = require("path")
const settings = require('electron-settings')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const createWindow = function() {    
    const affe = settings.get("window-bounds")

    const bounds = settings.get("window-bounds", { 
        width: 800,
        height: 600,
    })
    bounds.webPreferences = { nodeIntegration: true }    
    bounds.icon = 'kirk2.png'
    bounds.webPreferences = {
        nodeIntegration: true,
    }        
    
    win = new BrowserWindow(bounds)   
    if (settings.get("isMaximized"))
        win.maximize()

    electron.ipcMain.on("openDevTools",  (evt, arg) => win.webContents.openDevTools())
    electron.ipcMain.on("fullscreen",  (evt, arg) => win.setFullScreen(!win.isFullScreen()))
    // Undocument this to get the default menu with developer tools
    win.setMenu(null)
    if (process.env.NODE_ENV === 'DEV')
        win.loadURL('http://localhost:8080/')
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, `/../renderer/index.html`),
            protocol: "file:",
            slashes: true
        }));
    }

    win.on('close', () => {
        if (!win.isMaximized()) {
            const bounds = win.getBounds()
            settings.set("window-bounds", bounds)
            win.webContents.send("closed")
        }
        //child.send("kill")
    })

    win.on('maximize', () => {
        const bounds = win.getBounds()
        settings.set("window-bounds", JSON.stringify(bounds))
        settings.set("isMaximized", true)
    })

    win.on('unmaximize', () => {
        settings.set("isMaximized", false)
    })    

    win.on("closed", () => win = null)    
}

app.on('ready', createWindow)

app.on("activate", () => {
    if (win === null) 
        createWindow()
})

var win
