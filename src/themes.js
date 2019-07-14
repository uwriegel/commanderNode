const root = document.documentElement

export function changeTheme() {
    console.log(getComputedStyle(document.body).getPropertyValue('--main-background-color'))
    root.style.setProperty('--main-background-color', 'red')
    root.style.setProperty('--menu-border-color', 'darkred')
    root.style.setProperty('--menu-shadow-color', 'darkred')
    root.style.setProperty('--menu-separator-color', 'darkred')
    root.style.setProperty('--tr-selected-color', 'white')
    root.style.setProperty('--selected-background-color', 'rgb(255, 136, 136)')
}
