
export function getAccelerators(items) {
    const getAccelerator = function (item, index) {
        const pos = item.indexOf('_')
        if (pos == -1)
            return null
        return {
            key: item[pos + 1].toLowerCase(),
            index: index
        }
    }
    
    return items.map((n, i) => getAccelerator(n.name, i)).filter(n => n ? true : false)
}

export function parseAccelerators(accelerators, key) {
    return accelerators.filter(element => element.key == key).map(n => n.index)
}
