import * as electron from 'electron'

export async function subscribe(webContents: electron.WebContents, onMessage: (method: string, arg: any)=>Promise<string>) {
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

var callback: (method: string, arg: any)=>Promise<string>