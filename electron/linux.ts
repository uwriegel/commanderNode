import { spawn } from 'child_process'

const iconProcess = spawn('python3',["./electron/icon.py"])
const jobs: ((url: string)=>void)[] = []

iconProcess.stdout.on('data', (data: Buffer) => {
    const lines = data.toLocaleString().split("\n").map(n => n.trimEnd())
    lines.forEach(n => {
        if (n)
            jobs.shift()(n)
    })
})

export function getIconPath(file: string) {
    return new Promise<string>((res, rej) => {
        jobs.push(res)
        iconProcess.stdin.write(`${file}\n`)
    })    
}

