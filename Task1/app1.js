import { spawn, fork } from 'child_process'
import cluster from 'cluster'
import os from 'os'
import fs from 'fs'


const [node, path, directory] = process.argv
console.log('dir: ' + directory)
fs.readdir(directory, { withFileTypes: true }, (err, file) => {
    console.log("file: " + file)
})

if (cluster.isMaster) {
    const numOfCpus = os.cpus().length
    for (let i = 0; i < numOfCpus; i++) {
        cluster.fork()
    }
} else {

}
