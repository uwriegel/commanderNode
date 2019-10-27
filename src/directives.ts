import { DirectiveOptions } from 'vue'

export function getSelectAll() {
    return {
        inserted: function (el: HTMLElement) {
            el.addEventListener("focus", () => setTimeout(() => (el as HTMLInputElement).select()))
        }
    }as DirectiveOptions
}

export function getSelectNameOnly() {
    return {
        inserted: function (el: HTMLElement, binding) {
            let initial = true
            if (binding.value)
                el.addEventListener("focus", () => setTimeout(() => {
                    if (initial) {
                        const input = el as HTMLInputElement
                        const pos = input.value.lastIndexOf('.');
                        const name = pos != -1 ? input.value.substring(0, pos) : input.value
                        input.setSelectionRange(0, name.length)
                        initial = false
                    }
                }))
        } 
    } as DirectiveOptions
}