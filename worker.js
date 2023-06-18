import { parentPort } from 'worker_threads'
import path from 'path'
import { convertFile } from './app.js'

parentPort.on('message', ({ convertedDir, file }) => {
    const convertedPath = `${path.parse(file.name).name}.json`
    convertFile(`csvFiles/${file.name}`, `${convertedDir}/${convertedPath}`).then((data) => {
        console.log(data)
    }).catch(error => console.log(error))
})
