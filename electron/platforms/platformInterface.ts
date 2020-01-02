import { Themes } from "../themes/themes"

export interface Platform {
    initializeThemes(): void
    getCurrentTheme(): Themes
    setThemeCallback(cb: (theme: Themes)=>void): void
    isLinux: Boolean
}