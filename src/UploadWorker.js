import * as palparser from 'palparser-wasm';

async function deserialize(e) {
    console.log("UploadWorker Message Received");

    let lastTime = self.performance.now();
    let elapsed = 0;

    const json = palparser.deserialize(e.data, null,
      (progress) => {
        // prevent flooding by keeping time
        let timeNow = self.performance.now();
        elapsed += (timeNow - lastTime);
        lastTime = timeNow;

        if (elapsed > 2000) {
            self.postMessage(Number(progress));
            elapsed = 0;
        }
      });

    console.log("Finished deserializing.");
    console.log(json);
    self.postMessage({ result: json });
}

onmessage = (e) => deserialize(e);

export default {
  deserialize,
  set onmessage(value) {
    postMessage = value;
  }
}