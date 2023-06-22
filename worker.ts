import { parentPort, Worker } from "worker_threads";
import { convertFile } from "./utils";

if (parentPort) {
  parentPort.on('message', (file: string) => {
    const target = `csvFiles/${file}`;
    convertFile(target)
      .then((val: string) => {
        parentPort!.postMessage(val);
        parentPort!.close();
      })
      .catch((err: any) => {
        parentPort!.postMessage(err);
      });
  });
}
