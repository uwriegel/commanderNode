import { app, BrowserWindow, protocol, BrowserViewConstructorOptions, ipcMain, NativeImage, Item } from 'electron'
import * as path from "path"
import settings from 'electron-settings'
import * as fs from "fs"
import * as extFs from 'extension-fs'
import * as ipc from './ipc'
import * as os from 'os'
import { get as getPlatform} from './platforms/platform'
import { Themes } from './themes/themes'

const isLinux = os.platform() == "linux"

protocol.registerSchemesAsPrivileged([{
    scheme: 'vue', privileges: {standard: true, secure: true }
}])

const createWindow = function() {    
    // if (process.env.NODE_ENV == 'DEV')
//     //     require('vue-devtools').install()        

    const bounds = settings.get("window-bounds", { 
        width: 800,
        height: 600,
    }) as BrowserViewConstructorOptions
    const b = bounds as any
    b.icon = __dirname + '/kirk2.png'
    // Undocument this to get the default menu with developer tools
    b.frame = false
    b.show = false 

    const platform = getPlatform()
    platform.initializeThemes()
    const theme = platform.getCurrentTheme() 
    const isLightMode = theme == Themes.LinuxLight || theme == Themes.WindowsLight
    b.backgroundColor = isLightMode ? "#fff" : "#1e1e1e" 
    bounds.webPreferences = {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
    }        
    
    win = new BrowserWindow(bounds)   
    if (settings.get("isMaximized"))
        win.maximize()

    ipcMain.on("openDevTools",  (evt, arg) => win.webContents.openDevTools())
    ipcMain.on("fullscreen",  (evt, arg) => win.setFullScreen(!win.isFullScreen()))
    ipcMain.on("showInfo",  (evt, arg) => extFs.showInfo(arg))
    ipcMain.on("open",  (evt, arg) => extFs.open(arg))
    ipcMain.on("openAs",  (evt, arg) => extFs.openAs(arg))
    ipcMain.on("minimize",  (evt, arg) => win.minimize())
    ipcMain.on("maximize",  (evt, arg) => {
        if (win.isMaximized())
            win.restore()
        else
            win.maximize()  
    })
    ipcMain.on("dragStart", (evt, files) => {
        win.webContents.startDrag( { files, icon: null as NativeImage } as any as Item)
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

    async function insertCss(theme: Themes) {
        let css
        switch (theme) {
            case Themes.LinuxLight:
                css = './themes/ubuntu'
                break
            case Themes.LinuxDark:
                css = './themes/ubuntuDark'
                break
            case Themes.WindowsDark:
                css = './themes/dark'
                break
            case Themes.WindowsLight:
                css = './themes/light'
                break
        }
        let cssTheme = await import(css)
        win.webContents.insertCSS(cssTheme.getCss()) 
    }

    win.once('ready-to-show', () => win.show()) 

    platform.setThemeCallback(insertCss)

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
            insertCss(theme)
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

var win: BrowserWindow
