import os from 'os'
import fs from 'fs'

process.stdin.setEncoding('utf8');

console.log(`Welcome ${os.userInfo().username}`)
process.stdout.write('$ ')

process.stdin.on('data', (c) => {
    const data = c.toString().trim()
    const [arg1, arg2, arg3] = data.split(' ')
    if (data === '.exit') {
        console.log(`Thank you ${os.userInfo().username}, goodbye!`)
        process.exit(0)
    }
    else if (data === 'os --cpus') {
        const cpus = os.cpus()
        console.log(`The amount of CPU cores is ${cpus.length}`)
        cpus.forEach((core, i) => {
            process.stdout.write(`Core N${i + 1}: `)
            console.log(`Model is ${core.model}, Clock speed is ${core.speed / 1000} GHz`)
        })
    }
    else if (data === 'os --homedir') {
        console.log(`Home directory is ${os.homedir}`)
    }
    else if (data === 'os --username') {
        console.log(`OS username is ${os.userInfo().username}`)
    }
    else if (data === 'os --architecture') {
        console.log(`OS architecure is ${os.arch()}`)
    }
    else if (data === 'os --hostname') {
        console.log(`Hostname is ${os.hostname()}`)
    }
    else if (data === 'os --platform') {
        console.log(`Platform is ${os.platform()}`)
    }
    else if (data === 'os --memory') {
        console.log(`Memory is ${os.totalmem()}`)
    }
    else if (data === 'ls') {
        fs.readdir(process.cwd(), { withFileTypes: true }, (err, files) => {
            if (err) {
                console.log(err)
            } else {
                files.sort((f1, f2) => {
                    if (f1.isDirectory() && f2.isFile()) {
                        return -1
                    } else if (f1.isFile() && f2.isDirectory()) {
                        return 1
                    }
                    return f1.name.localeCompare(f2.name)
                })
                const index = '(index)'.padEnd(8)
                const name = '"Name"'.padEnd(20)
                console.log(`${index} ${name} "Type"`)
                files.forEach((file, index) => {
                    console.log(`${index.toString().padEnd(8)} ${file.name.padEnd(20)} ${file.isDirectory() ? 'directory' : 'file'}`)
                })
            }
        })
    }
    else if (arg1 === 'add') {
        fs.appendFile(arg2, '', cb)
    }
    else if (arg1 === 'rn') {
        if (pathExists(arg2)) {
            console.log('Path does not exist, try again')
        } else {
            fs.rename(arg2, arg3, cb)
        }
    }
    else if (arg1 === 'cp') {
        if (pathExists(arg2)) {
            console.log('Path does not exist, try again')
        } else {
            fs.copyFile(arg2, arg3, cb)
        }
    }
    else if (arg1 === 'mv') {
        console.log("directory " + `${process.cwd()}/${arg2}`)
        if (pathExists(arg2)) {
            console.log('Path does not exist, try again')
        } else {
            fs.rename(`${process.cwd()}/${arg2}`, `${arg3}/arg2`, cb)
        }
    }
    else if (arg1 === 'rm') {
        if (pathExists(arg2)) {
            console.log('Path does not exist, try again')
        } else {
            fs.rm(arg2, cb)
        }
    }
    else {
        console.log("Invalid input, try another command")
    }
    // process.stdout.write('$ ')
})


function pathExists(path) {
    fs.exists(path, (e) => {
        console.log('e is ' + e);
        return e ? true : false
    })
}

function cb(err) {
    if (err) console.log(err.message)
}

process.on('SIGINT', () => {
    console.log(`\nThank you ${os.userInfo().username}, goodbye!`)
    process.exit(0)
})