import { getRootProcessor } from './root'
import { getDirectoryProcessor } from './directory'

export function createProcessor(path) {
    if (path == "root")
        return getRootProcessor()
    else
        return getDirectoryProcessor(path)
}

export function getDefaultProcessor() {
    function getProcessor(path) { return createProcessor(path) }
    
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


