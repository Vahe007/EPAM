import { Worker, isMainThread } from 'worker_threads';
import { readDir, getParams, sendResponse } from './utils.js';
import http from 'http';
import fs from 'fs';

function performConvertion() {
    return new Promise((res, rej) => {
        const workers = []
        for (let i = 0; i < 10; i++) {
            const worker = new Worker('./worker.js')
            workers.push(worker)
        }
        readDir('csvFiles', '.csv').then((files) => {
            files.forEach((file, index) => {
                const worker = workers[index % workers.length];
                worker.on('message', (msg) => {
                    res(msg)
                    worker.terminate()
                })

                worker.on('online', () => {
                    worker.postMessage(file)
                })

                worker.on('error', (error) => {
                    rej(error.message)
                    worker.terminate()
                })

                worker.on('exit', () => {
                    worker.terminate();
                })
            })
        })
    })

}

if (isMainThread) {
    const server = http.createServer(({ method, url }, res) => {
        const params = getParams(url)

        if (method === 'POST' && url === '/exports') {
            performConvertion().then((msg) => {
                sendResponse(res, '200', 'text/plain', msg)
            })
        }
        else if (method === 'GET' && url.startsWith('/files')) {
            readDir('converted', '.json').then((files) => {
                params ?
                    fs.readFile(`converted/${params}.json`, (err, data) => {
                        err ? sendResponse(res, '404', 'text/plain', err.message) : sendResponse(res, '200', 'application/json', data.toString())
                    }) :
                    sendResponse(res, 200, 'application/json', JSON.stringify(files))
            }).catch((error) => sendResponse(res, '404', 'text/plain', error))
        }
        else if (method === 'DELETE' && url.startsWith('/files')) {
            fs.unlink(`converted/${params}.json`, (err) => {
                err ? sendResponse(res, 404, 'text/plain', err.message) : sendResponse(res, 200, 'text/plain', `File with ${params} name was successfully deleted`)
            })
        }
        else {
            sendResponse(res, 404, 'text/plain', 'URL is not valid')
        }
    })

    const port = 8000;
    server.listen(port, () => {
        console.log(`Running on port ${port} 🚀`);
    })
}

