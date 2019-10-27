export const isLinux = navigator.platform.startsWith("Linux")
export const pathDelimiter = isLinux ? '/' : '\\'