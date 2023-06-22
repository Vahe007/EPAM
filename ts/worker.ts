import { parentPort } from "worker_threads";
import { convertFile } from "./utils";

if (parentPort) {
    parentPort.on('message', (file: string) => {
        const target = `csvFiles/${file}`;
        convertFile(target)
            .then((val: string) => {
                if (parentPort) {
                    parentPort.postMessage(val);
                    // parentPort.terminate();
                }
            })
            .catch((err: string) => {
                if (parentPort) {
                    parentPort.postMessage(err);
                }
            });
    });
}