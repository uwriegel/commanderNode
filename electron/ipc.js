const electron = require('electron')

exports.subscribe = async function (webContents, onMessage) {
    callback = onMessage
    electron.ipcMain.on("call", async (evt, method, requestId, arg) => {
        try {
            const result = await callback(method, arg)
            webContents.send("response", requestId, result)
        } catch (err) {
            webContents.send("exception", requestId, JSON.stringify(err))
        }
    })
}

var callback