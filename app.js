import { Worker } from 'worker_threads';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import http from 'http';


function readDir(dir) {
    return new Promise((res, rej) => {
        fs.readdir(dir, (err, files) => {
            if (err) return rej(err.message)
            const csvFiles = files.filter((file) => file.endsWith('.csv'))
            res(csvFiles)
        })
    })
}

export function convertFiles(file) {
    return new Promise((res, rej) => {
        const result = []
        fs.createReadStream(`${process.cwd()}/${file}`)
            .pipe(csv())
            .on('data', (data) => {
                result.push(data)
                console.log(result)
            })
            .on('end', () => {
                writeFile(path.parse(file).name, result)
                res('Converted')
            })
            .on('error', (err) => {
                console.log("err.message", err.message)
                rej(err.message)
            })
    })
}

function writeFile(target, content) {
    console.log(target)
    fs.appendFile(`converted/${target}.json`, JSON.stringify(content, null, 2), (err) => {
        if (err) {
            console.log("errorrrrr", err.message);
        }
    })
}

function performConvertion() {
    const workers = []
    for (let i = 0; i < 10; i++) {
        const worker = new Worker('./worker.js')
        workers.push(worker)
    }

    readDir('csvFiles').then((files) => {
        files.forEach((file, index) => {
            const worker = workers[index % workers.length];
            worker.on('message', (msg) => {
                worker.terminate()
            })
    
            worker.on('online', () => {
                worker.postMessage(file)
            })
    
            worker.on('exit', () => {
                worker.terminate();
            })
        })
    })

}

const server = http.createServer(({method, url}, res) => {
    if (method === 'POST' && url === 'exports') {
        performConvertion()
    } else if (method === 'GET' && url === '/files') {
        
    }
})

const port = 8000;
server.listen(port, () => {
    console.log(`Running on port ${port} 🚀`);
})

performConvertion()
