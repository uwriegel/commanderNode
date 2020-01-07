import { Themes } from "../themes/themes"

export interface IconData {
    buffer: Buffer
    mime: string
}

export interface Platform {
    initializeThemes(): void
    getCurrentTheme(): Themes
    setThemeCallback(cb: (theme: Themes)=>void): void
    isLinux: Boolean
    getIcon: (file: String)=>Promise<IconData>
}