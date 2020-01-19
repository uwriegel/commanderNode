import express from 'express'
import * as process from 'process'
import http from 'http'

const app = express()

const dir = __dirname + '/../test'

app.use('/test', express.static(dir))

http.createServer(app).listen(9865, () => console.log('Listening', dir))

console.log('Elektron', process.pid)

