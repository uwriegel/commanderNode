import * as platform from '../platform'
import { getWindowsRootProcessor } from './windows/root'
import { getLinuxRootProcessor } from './linux/root'
import { getDirectoryProcessor } from './directory'
import { getServicesProcessor } from './services'
import { getNetworkSharesProcessor } from './networkShares'
import { getNetworkShareProcessor } from './networkShare'

export const ROOT = "root:"
export const SERVICES = "services:"
export const SHARES = "shares:"

// TODO: onAction: getShares mit starker Verzögerung, wenn dann bereits weiter geändert

export function createProcessor(recentProcessor, path) {
    switch (path) {
        case ROOT:
            return platform.isLinux 
                ? getLinuxRootProcessor(recentProcessor) 
                : getWindowsRootProcessor(recentProcessor)
        case SERVICES:
            return getServicesProcessor(recentProcessor)
        case SHARES:
            return getNetworkSharesProcessor(recentProcessor)
        default:
            return (path && path.startsWith("\\\\") && path.indexOf('\\', 2) == -1)
                ? getNetworkShareProcessor(recentProcessor, path)
                : getDirectoryProcessor(recentProcessor, path)
    }
}

export function getDefaultProcessor() {
    return { 
        name: "default",
        dispose: () => {}
    }
}

export function combinePath(path1, path2) {
    if (path2 == "..") {
        let pos = path1.lastIndexOf('\\', path1.length - 2)
        if (path1[pos - 1] == ':')
            pos += 1
        return pos != -1 ? path1.substr(0, pos) : null
    }
    return path1.endsWith('\\') ? path1 + path2 : path1 + '\\' + path2
}


