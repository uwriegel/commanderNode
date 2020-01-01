import { platform } from 'os'
import { Platform } from './platformInterface'
import * as LinuxModule from './linux/platform'
import * as WindowsModule from './windows/platform'

export function get() {
    return platform() == "linux"
    ? getLinuxPlatform()
    :  getWindowsPlatform()
}

function getLinuxPlatform() {
    const module: typeof LinuxModule = require("./linux/platform")
    return new LinuxModule.LinuxPlatform() as Platform
}
    
function getWindowsPlatform() {
    const module: typeof WindowsModule = require("./windows/platform")
    return new WindowsModule.WindowsPlatform() as Platform
}
