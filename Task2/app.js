import { spawn, fork } from 'child_process'
import cluster from 'cluster'
import os from 'os'
import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'



function convertFiles(file, convertedFile) {
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

function readDir(dir) {
    return new Promise((res, rej) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                rej(err.message)
            } else {
                res(files)
            }
        })
    })
}

const [n, p, directory] = process.argv


if (cluster.isPrimary) {
    const numOfCpus = os.cpus().length
    const workers = []
    for (let i = 0; i < numOfCpus; i++) {
        const worker = cluster.fork()
        workers.push(worker)
    }
    readDir(directory).then((files) => {
        files.forEach((file, index) => {
            const convertedFile = `${path.parse(file.name).name}.json`
            workers[index].send({ file, convertedFile })
        })
    }).catch((err) => {
        console.log(err)
    })
} else {
    process.on('message', ({ file, convertedFile }) => {
        convertFiles(file, convertedFile)
    })
}







