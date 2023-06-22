import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

export function readDir(dir, format) {
    return new Promise((res, rej) => {
        fs.readdir(dir, (err, files) => {
            if (err) return rej(err.message)
            const csvFiles = files.filter((file) => file.endsWith(format))
            res(csvFiles)
        })
    })
}


export function convertFile(file) {
    return new Promise((res, rej) => {
        const result = []
        fs.createReadStream(`${process.cwd()}/${file}`)
            .pipe(csv())
            .on('data', (data) => {
                result.push(data)
            })
            .on('end', () => {
                writeFile(path.parse(file).name, result).then((msg) => {
                    res(msg)
                }).catch((error) => rej(error))
            })
            .on('error', (err) => {
                rej(err.message)
            })
    })
}


export function writeFile(target, content) {
    return new Promise((res, rej) => {
        fs.appendFile(`converted/${target}.json`, JSON.stringify(content, null, 2), (err) => {
            if (err) {
                return rej(err.message)
            }
            res('Converted attached')
        })
    })
}

export function getParams(url) {
    const indexOf = url.indexOf('/:');
    if (indexOf < 0) return '';
    const fileName = url.slice(indexOf + 2);
    return fileName;
}

export function sendResponse(res, statusCode, type, content) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', type);
    res.end(content);
}
