const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

ipcRenderer.on("response", (event, requestId, arg) => {
    const promise = requests.get(requestId)
    requests.delete(requestId)
    promise.res(arg)
})

ipcRenderer.on("exception", (event, requestId, arg) => {
    const promise = requests.get(requestId)
    requests.delete(requestId)
    promise.rej(JSON.parse(arg))
})

export const sendToMain = (method, arg) => {
    return new Promise((res, rej) => {
        requests.set(++requestId, { res: res, rej: rej })
        ipcRenderer.send("call", method, requestId, arg)
    })
}

var requests = new Map()
var requestId = 0
