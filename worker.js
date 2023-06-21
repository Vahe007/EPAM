import { parentPort } from "worker_threads";
import { convertFiles } from "./app.js";

parentPort.on('message', (file) => {
    const target = `csvFiles/${file}`
    convertFiles(target).then((val) => {
        parentPort.postMessage(val)
    }).catch((err) => console.log(err))
})
