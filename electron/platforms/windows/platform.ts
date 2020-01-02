import { Platform } from "../platformInterface"
import * as themeChanges from 'windows-theme-changes' 
import { Themes } from '../../themes/themes'

let themeCallback: (theme: Themes)=>void

export class WindowsPlatform implements Platform {
    initializeThemes() {
        themeChanges.register(lightMode => themeCallback(lightMode ? Themes.WindowsLight : Themes.WindowsDark)) 
    }

    getCurrentTheme() {
        return themeChanges.isLightMode() 
            ? Themes.WindowsLight 
            : Themes.WindowsDark
    }

    setThemeCallback(cb: (theme: Themes)=>void) {
        themeCallback = cb
    }

    readonly isLinux = false
}


