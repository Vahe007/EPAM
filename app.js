import os from 'os'

process.stdin.setEncoding('utf8');

console.log(`Welcome ${os.userInfo().username}`)
process.stdout.write('$ ')

process.stdin.on('data', (c) => {
    const data = c.replace(/\n/g, '') //removing the line break at the end of the string
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
    else {
        console.log("Invalid input, try another command")
    }
    process.stdout.write('$ ')
})



process.on('SIGINT', () => {
    console.log(`Thank you ${os.userInfo().username}, goodbye!`)
    process.exit(0)
})