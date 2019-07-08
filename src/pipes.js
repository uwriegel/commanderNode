const dateFormat = Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

const timeFormat = Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
})

export function getSize(value) {
    if (!value)
        return ''

    let strNumber = `${value}`
    const thSep = '.'
    if (strNumber.length > 3) {
        var begriff = strNumber
        strNumber = ""
        for (var j = 3; j < begriff.length; j += 3) {
            var extract = begriff.slice(begriff.length - j, begriff.length - j + 3)
            strNumber = thSep + extract + strNumber
        }
        var strfirst = begriff.substr(0, (begriff.length % 3 == 0) ? 3 : (begriff.length % 3))
        strNumber = strfirst + strNumber
    }
    return strNumber
}

export function getNameOnly(value) {
    if (!value)
        return ''

    const pos = value.lastIndexOf('.')
    return value.substring(0, pos)
}

export function getExtension(value) {
    if (!value)
        return ''

    const pos = value.lastIndexOf('.')
    return value.substring(pos + 1)
}

export function getDateTime(date) {
    if (!date)
        return ''

    return dateFormat.format(date) + " " + timeFormat.format(date)  
}