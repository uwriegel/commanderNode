import { spawn } from 'child_process'

const iconProcess = spawn('python3',["./electron/icon.py"])
const jobs: ((url: String)=>void)[] = []

iconProcess.stdout.on('data', (data: Buffer) => 
    jobs.shift()(data.toLocaleString().trimEnd())
)

export function getIconPath(file: String) {
    return new Promise<String>((res, rej) => {
        jobs.push(res)
        iconProcess.stdin.write(`${file}\n`)
    })    
}

