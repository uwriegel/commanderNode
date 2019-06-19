const electron = require('electron')
const settings = require('electron-settings')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const url = process.env.NODE_ENV === 'DEV' 
    ? 'http://localhost:8080/'
    : `file://${process.cwd()}/dist/index.html`

const createWindow = function() {    
    const bounds = JSON.parse(settings.get("window-bounds", JSON.stringify({ 
        width: 800,
        height: 600,
    })))
    bounds.webPreferences = { nodeIntegration: true }    
    bounds.icon = 'kirk2.png'
    bounds.webPreferences = {
        nodeIntegration: true,
    }        
    
    win = new BrowserWindow(bounds)   
    if (settings.get("isMaximized"))
        win.maximize()

    win.loadURL(url)

    win.on('close', () => {
        if (!win.isMaximized()) {
            const bounds = win.getBounds()
            settings.set("window-bounds", JSON.stringify(bounds))
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