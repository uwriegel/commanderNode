import { getRootProcessor } from './root'

export function createProcessor(path) {
    if (path == "root")
        return getRootProcessor()
}

export function getDefaultProcessor() {
    function getProcessor(path) { return createProcessor(path) }
    
    return { 
        name: "default",
        getProcessor 
    }
}

