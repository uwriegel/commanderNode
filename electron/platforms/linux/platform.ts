import { Platform } from "../platformInterface"
import { Themes } from "../../themes/themes"
import { getSetting } from "gtk-utils"

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

    readonly isLinux = true
}

