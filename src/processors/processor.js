import { getRootProcessor } from './root'
import { getDirectoryProcessor } from './directory'
import { getServicesProcessor } from './servicesProcessor'
import { getNetworkShareProcessor } from './networkShareProcessor'

export const ROOT = "root:"
export const SERVICES = "services:"
export const SHARES = "shares:"

export function createProcessor(recentProcessor, path) {
    switch (path) {
        case ROOT:
            return getRootProcessor(recentProcessor)
        case SERVICES:
            return getServicesProcessor(recentProcessor)
        case SHARES:
            return getNetworkShareProcessor(recentProcessor)
        default:
            return getDirectoryProcessor(recentProcessor, path)
    }
}

export function getDefaultProcessor() {
    function getProcessor(path) { return createProcessor(null, path) }
    
    return { 
        name: "default",
        getProcessor 
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


