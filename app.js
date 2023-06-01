import os from 'os'
import fs from 'fs'

process.stdin.setEncoding('utf8');

console.log(`Welcome ${os.userInfo().username}`)
process.stdout.write('$ ')

process.stdin.on('data', (c) => {
    const data = c.toString().trim()
    const [arg1, arg2, arg3] = data.split(' ')

    console.log('arg1 ' + arg2);

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



    else if (arg1 === 'add') {

        fs.appendFile(arg2, '', (err) => {
            if (err) console.log(err.message)
        })

    }
    else if (arg1 === 'rn') {
        if (pathExists(arg2)) {
            console.log('Path does not exist, try again')
        } else {
            fs.rename(arg2, arg3, (err) => {
                if (err) console.log(err.message)
            })
        }
    }
    else if (arg1 === 'cp') {
        fs.copyFile(arg2, arg3, (err) => {
            if (err) console.log(err.message)
        })
    }
    else if (arg1 === 'rm') {
        fs.rm(arg2, (err) => {
            if (err) console.log(err.message)
        })
    }



    else {
        console.log("Invalid input, try another command")
    }
    process.stdout.write('$ ')
})


function pathExists(path) {
    fs.exists(path, (e) => {
        return e ? true : false
    })
}


process.on('SIGINT', () => {
    console.log(`\nThank you ${os.userInfo().username}, goodbye!`)
    process.exit(0)
})