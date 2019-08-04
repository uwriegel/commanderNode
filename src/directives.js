export function getSelectAll() {
    return {
        inserted: function (el) {
            el.addEventListener("focus", () => setTimeout(() => el.select()))
        }
    }
}

export function getSelectNameOnly() {
    return {
        inserted: function (el, binding) {
            let initial = true
            if (binding.value)
                el.addEventListener("focus", () => setTimeout(() => {
                    if (initial) {
                        var pos = el.value.lastIndexOf('.');
                        const name = pos != -1 ? el.value.substring(0, pos) : el.value
                        el.setSelectionRange(0, name.length)
                        initial = false
                    }
                }))
        }
    }
}