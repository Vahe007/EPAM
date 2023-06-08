import { spawn } from 'child_process'
import fs from 'fs'


class Tester {
    constructor() {
        this.res = {
            start: '',
            duration: 0,
            success: false,
            commandSuccess: false,
            error: ''
        }
    }
    test(command, args = [], timeout = Infinity) {
        this.res.start = new Date()
        const file = `${this.res.start.toISOString()}${command}.json`

        return new Promise((resolve, reject) => {
            const childProcess = spawn(command, args)
            childProcess.stdout.on('data', (data) => {
                console.log(data.toString())
            })
            childProcess.stderr.on('data', (err) => {
                this.res.error = err.message
                writeJson(file, this.res, resolve, reject)
            })

            childProcess.on('error', (err) => {
                this.res.error = err.message
                writeJson(file, this.res, resolve, reject)
            })
            
            setTimeout(() => {
                this.res = { ...this.res, commandSuccess: true, duration: new Date() - this.res.start }
                writeJson(file, this.res, resolve, reject)
            }, timeout)
        })


    }
}


const [node, path, command, args, timeout] = process.argv
const tester = new Tester()
tester.test(command, [args], timeout).then((m) => {
    console.log(m)
}).catch(e => { console.log(e) })




function writeJson(file, obj, resolve, reject) {
    fs.writeFile(file, JSON.stringify(obj, null, 2), (e) => {
        if (e) {
            reject(e.message)
        } else {
            resolve(`Operation completed`)
        }
    })
}




