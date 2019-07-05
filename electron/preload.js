const path = require("path")
const extFs = path.join(__dirname, `/../node_modules/extension-fs/build/release/extension-fs.node`)
global.extFs = window.extFs = extFs
