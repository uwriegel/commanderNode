import * as electron from 'electron'
import * as path from "path"
import settings from 'electron-settings'
import * as fs from "fs"
import * as extFs from 'extension-fs'
import * as ipc from './ipc'
import * as os from 'os'
const app = electron.app
const protocol = electron.protocol
const BrowserWindow = electron.BrowserWindow

let themeCallback: (light: boolean)=>void
import * as themeChanges from 'windows-theme-changes' 

themeChanges.register(themeCallback) 
const isLightMode = themeChanges.isLightMode() 

const isLinux = os.platform() == "linux"

protocol.registerSchemesAsPrivileged([{
        scheme: 'vue', privileges: {standard: true, secure: true }
}])

const createWindow = function() {    
    // if (process.env.NODE_ENV == 'DEV')
    //     require('vue-devtools').install()        

    const bounds = settings.get("window-bounds", { 
        width: 800,
        height: 600,
    }) as electron.BrowserViewConstructorOptions
    const b = bounds as any
    b.icon = __dirname + '/kirk2.png'
    // Undocument this to get the default menu with developer tools
    b.frame = false
    b.show = false 
    b.backgroundColor = isLightMode ? "#fff" : "#1e1e1e" 
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
        win.webContents.startDrag( { files, icon: null as electron.NativeImage } as any as electron.Item)
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

    async function insertCss(light: boolean) {
        const theme = light 
            ? await import('./themes/light') 
            : await import('./themes/dark')
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
        else if (isLinux)
            file = "/" + file
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
            callback({data: Buffer.from(""), mimeType: 'utf8'})
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
            settings.set("window-bounds", bounds as any)
            win.webContents.send("closed")
        }
        //child.send("kill")
    })

    win.on('maximize', () => {
        const bounds = win.getBounds()
        settings.set("window-bounds", bounds as any)
        settings.set("isMaximized", true)
    })

    win.on('unmaximize', () => {
        settings.set("isMaximized", false)
    })    

     win.on("closed", () => {win = null})    
}

app.removeAllListeners('ready')
app.on('ready', createWindow)

app.on("activate", () => {
    if (win === null) 
        createWindow()
})

var win: electron.BrowserWindow
