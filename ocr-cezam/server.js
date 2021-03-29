import fs from 'fs';
import XLSX from 'xlsx';
import path from 'path';
import { resolve } from 'path';
import { spawn } from 'child_process';
import express from 'express';
import multer, { diskStorage } from 'multer';
import cors from 'cors';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const app = express();

const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
};
app.use(cors(corsOpts));

let processDir = process.env.PROCESS_DIR;
let condaEnv = process.env.CONDA_ENV;
let ocrScript = process.env.OCR_SCRIPT;

var storage = diskStorage({
    destination: function (req, file, cb) {
        let now = new Date();
        let dir = path.join(processDir, now.getTime().toString(), file.fieldname);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname );
    }
});

var upload = multer({ storage: storage });
var multiple_upload = upload.fields([
    { name: 'documentIdentite', maxCount: 10 },
    { name: 'releveBancaire', maxCount: 10 },
    { name: 'avisImposition', maxCount: 10 },
    { name: 'tableauAmortissement', maxCount: 10 },
    { name: 'liasseFiscale', maxCount: 10 },
    { name: 'bulletinPaie', maxCount: 10 }
])

app.post('/upload', multiple_upload, (req, res) => {
    if (req.files) {
        // create config.json file
        let data = {
            'documentIdentite': [],
            'releveBancaire': [],
            'avisImposition': [],
            'tableauAmortissement': [],
            'liasseFiscale': [],
            'bulletinPaie': []
        }
        let saveDir = null;
        for (let file in req.files) {
            for (let d of req.files[file]) {
                if (saveDir === null) {
                    saveDir = resolve(path.dirname(d.destination));
                }
                data[file].push(resolve(d.path));
            }
        }
        let jsonData = JSON.stringify(data, null, 4);

        let configPath = path.join(saveDir, 'config.json');
        let excelPath = path.join(saveDir, 'processed.xlsx');
        let timestamp = path.basename(saveDir)

        writeFileSync(configPath, jsonData);
        console.log('Files uploaded !');

        const python = spawn(
            condaEnv,
            [
                ocrScript,
                '-config',
                configPath,
                '-excel-path',
                excelPath
            ]
        );

        python.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        python.stderr.on('data', function(data) {
            console.error(data.toString());
        });        

        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            res.status(200).send({'timestamp': timestamp});
        });
    } else {
        console.log('Failed to upload files !');
        res.status(500).send('Error while uploading files');
    }
});

app.get('/download', (req, res) => {
    if (req.query.timestamp !== undefined) {
        let excelPath = path.join(processDir, req.query.timestamp, 'processed.xlsx');
        res.download(excelPath);
    } else {
        res.status(404).send("No timestamp provided");
    }
});

app.get('/get-excel-content', (req, res) => {
    if (req.query.timestamp !== undefined) {
        let excelPath = path.join(processDir, req.query.timestamp, 'processed.xlsx');
        let buff = fs.readFileSync(excelPath);
        let wb = XLSX.read(buff, {type: 'buffer'});

        console.log(wb.SheetNames);
        let data = {}
        wb.SheetNames.forEach((sheetName) => {
            let html = XLSX.utils.sheet_to_html(wb.Sheets[sheetName], {editable: true});
            data[sheetName] = html
        });
        res.status(200).send({'excelData': data});
    } else {
        res.status(404).send("No timestamp provided");
    }
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});