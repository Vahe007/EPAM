import {parentPort} from 'worker_threads'
import path from 'path'
import { convertFile } from './app.js'

parentPort.on('message', (file) => {
    const convertedPath = `${path.parse(file.name).name}.json`
    convertFile(`csvFiles/${file.name}`, `converted/${convertedPath}`).then((data) => {
        console.log(data)
    }).catch(error => console.log(error))
})