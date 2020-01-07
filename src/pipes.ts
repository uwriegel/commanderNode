import { VersionInfo } from './extensionFs'
import { isLinux } from './platform'

const dateFormat = Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

const timeFormat = Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
})

export function getSize(value: number) {
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

export function getNameOnly(value: string) {
    if (!value)
        return ''

    const pos = getNameExtensionPos(value)
    return pos != -1 ? value.substring(0, pos) : value
}

export function getExtension(value: string) {
    if (!value)
        return ''

    const pos = getNameExtensionPos(value)
    return pos != -1 ? value.substring(pos) : ""
}

function getNameExtensionPos(value: string) {
    const pos = value.lastIndexOf('.')
    return (pos == 0 && isLinux) ? -1 : pos
}

export function getDateTime(date: Date) {
    if (!date)
        return ''

    return dateFormat.format(date) + " " + timeFormat.format(date)  
}

export function getIconUrl(value: string, path: string) {
    if (isLinux)
        return "icon://" + path + '/' + value 
    else {
        if (value.toLowerCase().endsWith(".exe")) 
            return "icon://" + path + '/' + value 

        const pos = value.lastIndexOf('.')
        return pos != -1 ? "icon://" + value.substring(pos + 1) : ""
    }
}

export function getVersion(version: VersionInfo) {
    return version 
        ? version.major + "."  + version.minor + "." + version.build + "." + version.patch
        : ""
}

export function get0IfEmpty(text: string) { return text || "0" }