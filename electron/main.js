const electron = require('electron')
const url = require("url")
const path = require("path")
const settings = require('electron-settings')
const app = electron.app
const protocol = electron.protocol
const BrowserWindow = electron.BrowserWindow
const fs = require("fs")
const extFs = require('extension-fs')

const createWindow = function() {    
    const bounds = settings.get("window-bounds", { 
        width: 800,
        height: 600,
    })
    bounds.webPreferences = { nodeIntegration: true }    
    bounds.icon = 'kirk2.png'
    bounds.webPreferences = {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
    }        
    
    win = new BrowserWindow(bounds)   
    if (settings.get("isMaximized"))
        win.maximize()

    electron.ipcMain.on("openDevTools",  (evt, arg) => win.webContents.openDevTools())
    electron.ipcMain.on("fullscreen",  (evt, arg) => win.setFullScreen(!win.isFullScreen()))
    // Undocument this to get the default menu with developer tools
    win.setMenu(null)

    protocol.registerBufferProtocol('vue', (request, callback) => {
        var file = decodeURIComponent(request.url.substr(6))
        if (file.toLowerCase().endsWith(".html")) 
            fs.readFile(file, (_, data) => {
                callback({mimeType: 'text/html', data: data})
            })
        else if (file.toLowerCase().endsWith(".js")) 
            fs.readFile(file, (_, data) => {
                callback({mimeType: 'application/javascript', data: data})
            })
        else if (file.toLowerCase().endsWith(".css")) 
            fs.readFile(file, (_, data) => {
                callback({mimeType: 'text/css', data: data})
            })
        else if (file.toLowerCase().endsWith(".jpg")) 
            fs.readFile(file, (_, data) => {
                callback({mimeType: 'img/jpg', data: data})
            })
        else if (file.toLowerCase().endsWith(".pdf")) 
            fs.readFile(file, (_, data) => {
                callback({mimeType: 'application/pdf', data: data})
            })
    }, (error) => {
        if (error) console.error('Failed to register protocol', error)
    })

    protocol.registerBufferProtocol('icon', async (request, callback) => {
        const url = request.url
        var ext = url.substr(7)
        var icon = await extFs.getIcon(ext)
        callback({mimeType: 'img/png', data: icon})
    }, (error) => {
        if (error) console.error('Failed to register protocol', error)
    })
 

    if (process.env.NODE_ENV === 'DEV') {
        require('vue-devtools').install()        
        win.loadURL('http://localhost:8080/')
    }
    else 
        win.loadURL('vue://' + path.join(__dirname, `/../renderer/index.html`))

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
