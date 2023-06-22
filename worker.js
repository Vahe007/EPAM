import { parentPort } from "worker_threads";
import { convertFile } from "./utils.js";

parentPort.on('message', (file) => {
    const target = `csvFiles/${file}`
    convertFile(target).then((val) => {
        parentPort.postMessage(val)
        parentPort.terminate()
    }).catch((err) => {
        parentPort.postMessage(err)
    })
})
