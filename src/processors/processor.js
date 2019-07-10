import { getRootProcessor } from './root'
import { getDirectoryProcessor } from './directory'

export function createProcessor(path) {
    if (path == "root")
        return getRootProcessor()
    else
        return getDirectoryProcessor()
}

export function getDefaultProcessor() {
    function getProcessor(path) { return createProcessor(path) }
    
    return { 
        name: "default",
        getProcessor 
    }
}

