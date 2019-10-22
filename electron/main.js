const electron = require('electron')
const path = require("path")
const settings = require('electron-settings')
const app = electron.app
const protocol = electron.protocol
const BrowserWindow = electron.BrowserWindow
const fs = require("fs")
const extFs = require('extension-fs')
const ipc = require('./ipc')

let themeCallback 
const themeChanges = require('windows-theme-changes') 
themeChanges.register(light => themeCallback(light)) 
const isLightMode = themeChanges.isLightMode() 

protocol.registerSchemesAsPrivileged([{
         scheme: 'vue', privileges: {standard: true, secure: true }
    }])

const createWindow = function() {    
    // if (process.env.NODE_ENV == 'DEV')
    //     require('vue-devtools').install()        

    const bounds = settings.get("window-bounds", { 
        width: 800,
        height: 600,
    })
    bounds.webPreferences = { nodeIntegration: true }    
    bounds.icon = __dirname + '/kirk2.png'
    // Undocument this to get the default menu with developer tools
    bounds.frame = false
    bounds.show = false 
    bounds.backgroundColor = isLightMode ? "#fff" : "#1e1e1e" 
    bounds.webPreferences = {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
    }        
    
    win = new BrowserWindow(bounds)   
    if (settings.get("isMaximized"))
        win.maximize()

    electron.ipcMain.on("openDevTools",  (evt, arg) => win.webContents.openDevTools())
    electron.ipcMain.on("fullscreen",  (evt, arg) => win.setFullScreen(!win.isFullScreen()))
    electron.ipcMain.on("showInfo",  (evt, arg) => extFs.showInfo(arg))
    electron.ipcMain.on("open",  (evt, arg) => extFs.open(arg))
    electron.ipcMain.on("openAs",  (evt, arg) => extFs.openAs(arg))
    electron.ipcMain.on("minimize",  (evt, arg) => win.minimize())
    electron.ipcMain.on("maximize",  (evt, arg) => {
        if (win.isMaximized())
            win.restore()
        else
            win.maximize()  
    })
    electron.ipcMain.on("dragStart", (evt, files) => {
        win.webContents.startDrag({ files, icon: null })
    })
    ipc.subscribe(win.webContents, async (method, arg) => {
        switch (method) {
            case "createDirectory":
                await extFs.createDirectory(arg)
                return ""
            case "rename":
                const param = JSON.parse(arg)
                await extFs.rename(param.path, param.name, param.newName)
                return ""
            case "deleteFiles":
                const files = JSON.parse(arg)
                await extFs.deleteFiles(files)
                return ""
            case "copyItems": {
                const copyItems = JSON.parse(arg)
                await extFs.copyFiles(copyItems.sourcePath, copyItems.targetPath, copyItems.items, copyItems.conflictItems)
                return ""
            }
            case "moveItems": {
                const copyItems = JSON.parse(arg)
                await extFs.moveFiles(copyItems.sourcePath, copyItems.targetPath, copyItems.items, copyItems.conflictItems)
                return ""
            }
        }
    })

    function insertCss(light) {
        const theme = require(light ? './themes/light' : './themes/dark')
        win.webContents.insertCSS(theme.getCss()) 
    }

    win.once('ready-to-show', () => { 
        win.show() 
    }) 

    themeCallback = insertCss

    protocol.registerBufferProtocol('vue', (request, callback) => {
        let file = decodeURIComponent(request.url.substr(6))
        if (file[1] == '/')
            file = file[0] + ':' + file.substr(1)
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
        else if (file.toLowerCase().endsWith(".png")) 
            fs.readFile(file, (_, data) => {
                callback({mimeType: 'img/png', data: data})
            })
        else if (file.toLowerCase().endsWith(".theme/")) {
            const theme = require(isLightMode ? './themes/light' : './themes/dark')
            callback({data: Buffer.from("")})
            insertCss(isLightMode)
        }
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

    win.loadURL(process.env.NODE_ENV != 'DEV'
        ? 'vue://' + path.join(__dirname, `/../renderer/index.html`)
        : 'http://localhost:8080/')

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

app.removeAllListeners('ready')
app.on('ready', createWindow)

app.on("activate", () => {
    if (win === null) 
        createWindow()
})

var win
