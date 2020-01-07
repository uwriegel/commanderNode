import { getIconPath } from "./linux"

async function lsblk() {
    
    async function test() {
        var t = await getIconPath("test.css")
        console.log("Ergebnisse", t)
    }
    async function test1() {
        var t = await getIconPath("test.js")
        console.log("Ergebnisse", t)
    }
    async function test2() {
        var t = await getIconPath("test.cs")
        console.log("Ergebnisse", t)
    }
    async function test3() {
        var t = await getIconPath("test.py")
        console.log("Ergebnisse", t)
    }
    await test()
    await test1()
    await test2()
    await test3()

    let start = process.hrtime.bigint()
    let result
    for  (let i = 0; i < 1000; i++) {
        var t = await getIconPath("test.html")
        console.log(t)
    }
    let end = process.hrtime.bigint()
    console.info(`Execution time: ${((end - start) / BigInt(1000000.0))} ms`)
}

lsblk()
