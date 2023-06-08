import { spawn } from 'child_process'
import fs from 'fs'


class Tester {
    test(command, args = [], timeout = Infinity) {
        const startingTime = new Date()
        const start = startingTime.toISOString()
        let duration = 0
        let success = false
        let commandSuccess = false
        let error = ''

        return new Promise((resolve, reject) => {
            const childProcess = spawn(command, args)
            childProcess.on('spawn', (e) => {
                if (e) {
                    console.log('error', e.message)
                } else {
                    commandSuccess = true
                    process.stdout.write(`${command} ${args.splice(' ')}\n`)
                }

            })
            childProcess.on('error', (e) => {
                error = e.message
                commandSuccess = false
                success = false
                reject(e.message)
            })

            childProcess.on('close', () => {
                console.log('Child process is closed')
            })

            childProcess.on('exit', () => {
                commandSuccess = true
                duration = new Date() - startingTime
                if (timeout >= duration) {
                    success = true
                }
                const file = `${start}${command}.json`
                const obj = {
                    start,
                    duration,
                    success,
                    commandSuccess,
                    error
                }
                fs.writeFile(file, JSON.stringify(obj, null, 2), (e) => {
                    if (e) {
                        reject(e.message)
                    } else {
                        resolve(`Operation completed in ${duration} milliseconds`)
                    }
                })
            })
        })


    }
}


const [node, path, command, args, timeout] = process.argv
const tester = new Tester()
tester.test(command, [args], timeout).then((m) => {
    console.log(m)
}).catch(e => { console.log(e) })

