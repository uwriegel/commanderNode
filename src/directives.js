export function getSelectAll() {
    return {
        inserted: function (el) {
            el.addEventListener("focus", () => setTimeout(() => el.select()))
        }
    }
}