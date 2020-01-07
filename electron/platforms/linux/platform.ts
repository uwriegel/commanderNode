import { Platform } from "../platformInterface"
import { Themes } from "../../themes/themes"
import { getSetting } from "gtk-utils"
import { getIconPath } from "../../linux"
import { promises as fs } from "fs"

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

    async getIcon(file: string) {
        let iconPath = await getIconPath(file)
        if (iconPath == 'None')
            iconPath = "./electron/fault.png"
        const buffer = await fs.readFile(iconPath)
        return {
            buffer,
            mime: iconPath.toLowerCase().endsWith("svg") ? 'image/svg+xml' : "img/jpg"
        }
    } 

    readonly isLinux = true
}

