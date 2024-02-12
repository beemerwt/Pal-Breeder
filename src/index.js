import './utils';
import 'index.scss';
import pako from 'pako';
import viewer from './viewer';
import Deferred from './deferred';
import mostoptimal from './mostoptimal';
import breedpath from './breedpath';
import palstats from './palstats';
import Pal from "./pal";
import Inventory from './inventory';
import { PalNames, PassiveSkills } from './dictionary';
import { JSONParse, JSONStringify } from 'json-with-bigint';
import { onPageLoaded } from './loader';
import breeding from './breeding';
import DragDrop from './dragdrop';
import TabControl from './tabcontrol';
import ProgressBar from './progressbar';
const pals = [];
let maxProgress = 0;
let savedata;
let saveMessage, saveError;

const VALID_SAVE_MAGIC = 0x506C5A00; // "PlZ"

function downloadFromUrl(filename, url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click(); // does work!
}

function getFileHeader(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const view = new DataView(fileReader.result);
            const uncompressedSize = view.getUint32(0, true); // The size after the first inflation
            const compressedSize = view.getUint32(4, true); // The size after the second inflation
            const magic = view.getUint32(8) & 0xFFFFFF00;
            const compressionByte = view.getUint8(11);

            if (magic !== VALID_SAVE_MAGIC) {
                reject("Invalid File");
                return;
            }

            if (compressionByte !== 0x31 && compressionByte !== 0x32) {
                reject("Invalid Compression");
                return;
            }
            
            resolve([ compressedSize, uncompressedSize, compressionByte ]);
        };

        fileReader.readAsArrayBuffer(file.slice(0, 12));
    });
}

function extractPals(progressBar, data, wasBackup = false) {
    const {
        worldSaveData: {
            CharacterSaveParameterMap: {
                Values
            }
        }
    } = data;

    const url = URL.createObjectURL(new Blob([
        JSONStringify({ worldSaveData: { CharacterSaveParameterMap: { Values } } })
    ]));

    if (!wasBackup)
        downloadFromUrl("Level.sav.json", url);

    // for debugging....    
    // downloadFromUrl("first.bin", URL.createObjectURL(new Blob([ new Uint8Array(Values[0].Value.RawData) ])));

    const pals = [];
    for (let i = 0; i < Values.length; i++) {
        const { Key, Value: { RawData } } = Values[i];

        const palData = new Uint8Array(RawData);
        console.log("Deserializing Pal " + i);
        const pal = palparser.palFromRaw(palData, new Map(), (progress) => {
            progressBar.value = Number(progress) / RawData.length;
        });

        pals.push(pal);
    }

    localStorage.setItem("pals", JSONStringify(pals));
}

function readJsonBackup(file) {
    // load json backup
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        try {
            const result = JSONParse(fileReader.result);
            SaveLoader.onmessage({ data: { result, wasBackup: true } });
        } catch (e) {
            console.error(e);
            DragDrop.error(e);
        }
    }
    
    fileReader.readAsText(file, "utf-8");
}

onPageLoaded(async () => {
    const palSelect = document.querySelectorAll("select.pals");
    const traitSelect = document.querySelectorAll("select.traits");
    const progressBar = new ProgressBar("loading");

    savedata = localStorage.getItem("pals");
    if (savedata !== null) {
        savedata = JSON.parse(savedata);

        for (let i = 1; i < savedata.length; i++) {

            let props = Object.keys(savedata[i]);
            for (let x = 0; x < props.length; x++) {
                if (props[x] === "Rank") {
                    console.log(savedata[i]);
                    break;
                }
            }

            // Skip the ones that aren't in the list
            if (!PalNames.lookup(savedata[i].CharacterID))
                continue;

            const pal = new Pal(savedata[i]);
            pals.push(pal);
            Inventory.addItem(pal);
        }

        Inventory.setSelected(0);

        const sort = document.querySelector("a.sort");
        sort.addEventListener("click", (e) => {
            e.preventDefault();

            const handiworkPals = pals.filter((pal) => pal.suitabilities.handiwork > 4);
            console.log(handiworkPals);
        })
    }

    saveError = console.error;
    saveMessage = (e) => {
        if (e.data.result) {
            if (!e.data.result.worldSaveData) {
                DragDrop.error("Loaded file does not contain element \"worldSaveData.\"");
                return;
            }

            extractPals(progressBar, e.data.result, e.data.wasBackup);
            setTimeout(() => progressBar.value = 0, 2000);
            return;
        }

        const progress = e.data;
        progressBar.value = progress / maxProgress;
    }

    DragDrop.onDrop = async (e) => {
        let file = e.dataTransfer.files[0];
        if (file.name.endsWith(".json")) {
            readJsonBackup(file);
            return;
        }

        try {
            const [ comp, uncomp, zbyte ] = await getFileHeader(file);
            const fileReader = new FileReader();

            function onProgress(e) {
                progressBar.value = e.loaded / e.total;
            }

            fileReader.onloadstart = onProgress;
            fileReader.onprogress = onProgress;
            fileReader.onloadend = () => {
                let rawData = pako.inflate(fileReader.result.slice(12));

                if (zbyte === 0x32) { // inflate a second time
                    if (rawData.byteLength !== comp)
                        throw new Error(`Invalid compression length: ${rawData.byteLength}`);

                    rawData = pako.inflate(rawData);
                }

                if (rawData.byteLength !== uncomp)
                    throw new Error(`Invalid compression length: ${rawData.byteLength}`);

                maxProgress = uncomp;
                
                const SaveLoader = new Worker(new URL('./UploadWorker.js', import.meta.url));
                window.onbeforeunload = function() {
                    SaveLoader.terminate();
                };

                SaveLoader.onmessage = saveMessage;
                SaveLoader.onerror = saveError;
                SaveLoader.postMessage(rawData);
            }

            fileReader.readAsArrayBuffer(file); // read to end

        } catch (e) {
            console.error(e);
            DragDrop.error(e);
        }
        
        setTimeout(() => progressBar.value = 0, 2000);
    }

    Object.keys(palstats).forEach(name => {
        palSelect.forEach((elem) => {
            const opt = document.createElement("option");
            opt.value = name;
            opt.text = name;
            
            elem.appendChild(opt);
        });
    });

    Object.entries(PassiveSkills).forEach(([value, { name }])=> {
        traitSelect.forEach(elem => {
            const opt = document.createElement("option");
            opt.value = value;
            opt.text = name;
            
            elem.appendChild(opt);
        });
    })
});