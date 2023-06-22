import { Worker, isMainThread } from 'worker_threads';
import { readDir, getParams, sendResponse } from './utils';
import * as http from 'http';
import * as fs from 'fs';

function performConversion(): Promise<string> {
  return new Promise((res, rej) => {
    const workers: Worker[] = [];
    for (let i = 0; i < 10; i++) {
      const worker = new Worker('./worker.js');
      workers.push(worker);
    }
    readDir('csvFiles', '.csv').then((files: string[]) => {
      files.forEach((file, index) => {
        const worker = workers[index % workers.length];
        worker.on('message', (msg) => {
          res(msg);
          worker.terminate();
        });

        worker.on('online', () => {
          worker.postMessage(file);
        });

        worker.on('error', (error) => {
          rej(error.message);
          worker.terminate();
        });

        worker.on('exit', () => {
          worker.terminate();
        });
      });
    });
  });
}

if (isMainThread) {
  const server = http.createServer((req: any, res: any) => {
    const { method, url }: { method: string; url: string } = req as { method: string; url: string };
    const params: string | undefined = getParams(url);

    if (method === 'POST' && url === '/exports') {
      performConversion().then((msg: string) => {
        sendResponse(res, 200, 'text/plain', msg);
      });
    } else if (method === 'GET' && url.startsWith('/files')) {
      readDir('converted', '.json')
        .then((files: string[]) => {
          if (params !== undefined) {
            fs.readFile(`converted/${params}.json`, (err, data) => {
              if (err) {
                sendResponse(res, 404, 'text/plain', err.message);
              } else {
                sendResponse(res, 200, 'application/json', data.toString());
              }
            });
          } else {
            sendResponse(res, 200, 'application/json', JSON.stringify(files));
          }
        })
        .catch((error: any) => sendResponse(res, 404, 'text/plain', error));
    } else if (method === 'DELETE' && url.startsWith('/files')) {
      if (params !== undefined) {
        fs.unlink(`converted/${params}.json`, (err) => {
          if (err) {
            sendResponse(res, 404, 'text/plain', err.message);
          } else {
            sendResponse(
              res,
              200,
              'text/plain',
              `File with ${params} name was successfully deleted`
            );
          }
        });
      } else {
        sendResponse(res, 404, 'text/plain', 'Missing file name');
      }
    } else {
      sendResponse(res, 404, 'text/plain', 'URL is not valid');
    }
  });

  const port = 8000;
  server.listen(port, () => {
    console.log(`Running on port ${port} 🚀`);
  });
}
