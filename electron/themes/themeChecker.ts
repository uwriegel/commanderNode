import { get } from '../platforms/platform'
import { Themes } from './themes'

export let themeCallback: (light: boolean)=>void

const platform = get()

export function initialize() {
    platform.initializeThemes()
    const theme = platform.getCurrentTheme() 
    return theme == Themes.LinuxLight || theme == Themes.WindowsLight
}
