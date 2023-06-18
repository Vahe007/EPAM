import { isMainThread, Worker, parentPort } from 'worker_threads'
import fs from 'fs'
import csv from 'csv-parser'
import http, { get } from 'http'

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


function convertFiles() {
    return new Promise((resolve, reject) => {
        const path = 'csvFiles'
        if (!fs.existsSync(path)) {
            reject('Path does not exist')
        }
        const workers = []
        for (let i = 0; i < 10; i++) {
            const worker = new Worker('./worker.js')
            workers.push(worker)
        }
        readDir(path).then((files) => {
            files.forEach((file, index) => {
                const currentWoker = workers[index]
                currentWoker.on('online', () => {
                    currentWoker.postMessage(file)
                })
            })
        }).catch((error) => {
            console.log(error)
        })
    })
}


const server = http.createServer(function (req, res) {
    if (req.method === 'POST' && req.url === '/exports') {
        convertFiles()
    }
    else if (req.method === 'GET' && req.url.startsWith('/files')) {
        fs.readdir('./converted', (err, files) => {
            if (err) console.log(err.message);
            else {
                const fileName = getParams(req.url)
                if (fileName) {
                    fs.readFile(`${process.cwd()}/converted/${fileName}.json`, (err, data) => {
                        if (err) sendResponse(res, 404, 'text/plain', 'Not Found');
                        else { sendResponse(res, 200, 'text/plain', data.toString()); }
                    })
                }
                else {
                    sendResponse(res, 200, 'application/json', JSON.stringify(files))
                }
            }
        })
    }
    else if (req.method === 'DELETE' && req.url.startsWith('/files')) {
        const fileName = getParams(req.url)
        if (fileName) {
            fs.unlink(`${process.cwd()}/converted/${fileName}.json`, (err) => {
                if (err) {
                    console.log('error', err.message)
                    sendResponse(res, 404, 'text/plain', 'Not Found')
                }
                else { sendResponse(res, 200, 'text/plain', `File with ${fileName} name was successfully deleted`) }
            })
        }
    }
})

server.listen(8000, () => {
    console.log('Listening to port 8000 🚀');
})


function getParams(url) {
    const indexOf = url.indexOf('/:');
    if (indexOf < 0) return '';
    const fileName = url.slice(indexOf + 2);
    return fileName;
}

function sendResponse(res, statusCode, type, content) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', type);
    res.end(content);
}

