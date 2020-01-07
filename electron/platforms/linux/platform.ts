import { Platform } from "../platformInterface"
import { Themes } from "../../themes/themes"
import { getSetting } from "gtk-utils"
import { getIconPath } from "../../linux"
import { read } from "fs"
import { spawn } from "child_process"

let themeCallback: (theme: Themes)=>void

export class LinuxPlatform implements Platform {
    initializeThemes() {
        let recentTheme = ""
        setInterval(() => {
            const theme = getSetting("org.gnome.desktop.interface", "gtk-theme")
            if (recentTheme != theme) {
                recentTheme = theme
                themeCallback(recentTheme.endsWith('dark') ? Themes.LinuxDark : Themes.LinuxLight)
            }
        }, 5000)
    }

    getCurrentTheme() {
        const theme = getSetting("org.gnome.desktop.interface", "gtk-theme")
        return theme.endsWith('dark') ? Themes.LinuxDark : Themes.LinuxLight
    }

    setThemeCallback(cb: (theme: Themes)=>void) {
        themeCallback = cb
    }

    getIcon(file: String) {
        const iconProcess = spawn('python3',["./electron/icon.py"])

        return new Promise<Buffer>((res, rej) => {
        // return new Promise<string>((res, rej) => {
        //     iconProcess.stdout.on('data', (data: Buffer) => {
        //         iconProcess.stdout.removeAllListeners('data')
        //         res(data.toLocaleString().trimEnd())
        //     })
        //     iconProcess.stdin.write(`${file}\n`)
        })    
        


        // var iconPath = await getIconPath(file)
        // // read(file, (_, data) => {
        // // return new Buffer(icon)
        // return iconPath
    } 

    readonly isLinux = true
}

