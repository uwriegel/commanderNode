const fs = window.require('fs').promises
const path = window.require('path')

async function cacheFiles(filePath, renameItems) {
    for (let i=0; i < renameItems.length; i++)
        await fs.rename(path.join(filePath, renameItems[i].name), path.join(filePath, '#' + renameItems[i].name))
}

async function unCacheFiles(filePath, renameItems) {
    for (let i=0; i < renameItems.length; i++)
        await fs.rename(path.join(filePath, '#' + renameItems[i].name), path.join(filePath, renameItems[i].name))
}

function verifyRename(filePath, renameItems) {
    if (renameItems.some(n => extFs.existsFile(path.join(filePath, n.newName))))
        throw "files exists"
}

async function renameCached(filePath, renameItems) {
    for (let i = 0; i < renameItems.length; i++) 
        await fs.rename(path.join(filePath, '#' + renameItems[i].name), path.join(filePath, renameItems[i].newName))
}

export async function renameFiles(path, renameItems) {
    try {
        await cacheFiles(path, renameItems)
        verifyRename(path, renameItems)
        await renameCached(path, renameItems)
        return true
    } catch (err) {
        console.log(err)
        await unCacheFiles(path, renameItems)
        return false
    }
}
