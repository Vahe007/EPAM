import fs from 'fs'
import { Transform } from 'stream'



function transformFn(operation) {
    return new Transform({
        transform(chunk, encoding, cb) {
            let modified = ''
            switch (operation) {
                case 'uppercase':
                    modified = chunk.toString().toUpperCase()
                    cb(null, modified)
                    break
                case 'lowercase':
                    modified = chunk.toString().toLowerCase()
                    cb(null, modified)
                    break
                case 'reverse':
                    modified = chunk.toString().split('').reverse().join('')
                    cb(null, modified)
                    break
                default:
                    console.log('Invalid command')
                    return 'Invalid command'
            }
        }
    })
}


const [node, path, input, output, command] = process.argv

const readableStream = fs.createReadStream(input)
const writableStream = fs.createWriteStream(output)


const transform = transformFn(command)

readableStream.pipe(transform).pipe(writableStream)

readableStream.on('error', (e) => {
    if (e) {
        console.log("message " + e.message)
        readableStream.unpipe(writableStream)
        return
    }
})
writableStream.on('error', (e) => {
    if (e) {
        return console.log(e.message)
    }
})

readableStream.on('end', (e) => {
    if (e) {
        console.log(e.message);
    }
})
