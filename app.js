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
            }
        }
    })
}


process.stdin.on('data', (command) => {
    const [input, output, operation] = command.toString().trim().split(' ')
    const readableStream = fs.createReadStream(input)
    const writableStream = fs.createWriteStream(output)

    readableStream.on('error', (e) => {
        console.log(e.message)
    })
    writableStream.on('error', (e) => {
        console.log(e.message)
    })

    readableStream.on('end', () => {
        console.log('Operation completed')
    })
    // readableStream.close()
    // writableStream.close()

    const transform = transformFn(operation)

    readableStream.pipe(transform).pipe(writableStream)
})




