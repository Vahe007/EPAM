import { isMainThread, Worker, parentPort } from 'worker_threads'
import fs from 'fs'
import csv from 'csv-parser'
import http from 'http'
import path from 'path'

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


function convertFile(file, convertedFile) {
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


function convertFiles(res, convertedDir) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync('csvFiles')) {
            reject('Path does not exist')
        }
        readDir('csvFiles').then((files) => {
            files.forEach((file) => {
                const convertedPath = `${path.parse(file.name).name}.json`
                convertFile(`csvFiles/${file.name}`, `${convertedDir}/${convertedPath}`).then((data) => {
                    console.log(data)
                }).catch(error => sendResponse(res, 404, 'text/plain', error))
            })
        }).catch((error) => {
            console.log(error)
        })
    })
}

const server = http.createServer(function (req, res) {
    if (req.method === 'POST' && req.url === '/exports') {
        req.on('data', (data) => {
            convertedDir = JSON.parse(data.toString())
            fs.mkdir(convertedDir, (err) => {
                if (err) sendResponse(res, 500, 'text/plain', error)
            })
            convertFiles(res, convertedDir).then((msg) => {sendResponse(res, 200, 'text/plain', msg)}).catch(error => sendResponse(res, 500, 'text/plain', error))
        })
    }
    else if (req.method === 'GET' && req.url.startsWith('/files')) {
        fs.readdir(convertedDir, (err, files) => {
            if (err) {
                sendResponse(res, 500, 'text/plain', err.message);
            }
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
            fs.unlink(`${process.cwd()}/${convertedDir}/${fileName}.json`, (err) => {
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

