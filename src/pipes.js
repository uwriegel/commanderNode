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