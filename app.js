import fs from 'fs'

let maxDepth = 0
let deepestDir = ''

function deepestDirectory(path, depth) {
    const files = fs.readdirSync(path, { withFileTypes: true })
    files.forEach((file) => {
        if (file.isDirectory()) {
            const newPath = path + `/${file.name}`
            const newDepth = depth + 1
            if (maxDepth < depth) {
                maxDepth = depth
                deepestDir = path
            }
            deepestDirectory(newPath, newDepth)
        }
    })
}
deepestDirectory(process.cwd(), 0)

fs.appendFile(`${deepestDir}/file.txt`, 'hello world', (err) => {
    if (err) console.log(err.message)
})
