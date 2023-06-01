import fs from 'fs'

let maxDepth = 0
let deepestDir = ''

function findDeepestDirectory(path, depth) {
    const files = fs.readdirSync(path, { withFileTypes: true })
    files.forEach((file) => {
        if (file.isDirectory()) {
            const newPath = path + `/${file.name}`
            const newDepth = depth + 1
            if (maxDepth < depth) {
                maxDepth = depth
                deepestDir = path
            }
            findDeepestDirectory(newPath, newDepth)
        }
    })
}
findDeepestDirectory(process.cwd(), 0)

console.log('deepest ' + deepestDir)
// fs.appendFile(`${deepestDir}/file1.txt`, 'hello world', (err) => {
//     if (err) console.log(err.message)
// })
