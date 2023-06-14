import { isMainThread, Worker, parentPort } from 'worker_threads'
import fs from 'fs'
import csv from 'csv-parser'

function readDir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, { withFileTypes: true }, (error, files) => {
            if (error) reject(error.message)
            else {
                resolve(files)
            }
        })
    })
}


export function convertFile(file, convertedFile) {
    return new Promise((res, rej) => {
        const results = []
        let recordCount = 0
        const start = new Date()
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data)
                recordCount += data.toString().split('\n').length - 1
            })
            .on('end', () => {
                const duration = new Date() - start
                fs.writeFile(convertedFile, JSON.stringify(results, null, 2), (err) => {
                    if (err) {
                        rej(err.message)
                    } else {
                        res(`Files converted successfully in ${duration} milliseconds and with the record count ${recordCount}`)
                    }
                })
            })
    })
}


if (isMainThread) {
    const workers = []
    for (let i = 0; i < 10; i++) {
        const worker = new Worker('./worker.js')
        workers.push(worker)
    }
    readDir('csvFiles').then((files) => {
        files.forEach((file, index) => {
            const currentWoker = workers[index]
            currentWoker.on('online', () => {
                currentWoker.postMessage(file)
            })
        })
    }).catch((error) => {
        console.log(error)
    })
}
