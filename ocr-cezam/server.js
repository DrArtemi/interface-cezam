import fs from 'fs';
import XLSX from 'xlsx';
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

var config_path = '/home/adrien/ocr_files/config.json';
var excel_path = '/home/adrien/ocr_files/processed.xlsx';

var storage = diskStorage({
    destination: function (req, file, cb) {
        let dir = '/home/adrien/ocr_files/' + file.fieldname;
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
    { name: 'releveBanquaire', maxCount: 10 },
    { name: 'avisImposition', maxCount: 10 },
    { name: 'tableauAmortissement', maxCount: 10 },
    { name: 'liasseFiscale', maxCount: 10 }
])

app.post('/upload', multiple_upload, (req, res) => {
    if (req.files) {
        // create config.json file
        let data = {
            'documentIdentite': [],
            'releveBanquaire': [],
            'avisImposition': [],
            'tableauAmortissement': [],
            'liasseFiscale': []
        }
        for (let file in req.files) {
            for (let d of req.files[file]) {
                data[file].push(resolve(d.path));
            }
        }
        let json_data = JSON.stringify(data, null, 4);
        writeFileSync(config_path, json_data);
        console.log('Files uploaded !');

        const python = spawn(
            '/home/adrien/miniconda3/envs/ocr/bin/python3',
            [
                '/home/adrien/Repositories/Cezam/ocr-cezam/ocr_cezam.py',
                '-config',
                config_path,
                '-excel-path',
                excel_path
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
            res.status(200).send({'processedFile': excel_path});
        });
    } else {
        console.log('Failed to upload files !');
        res.status(500).send('Error while uploading files');
    }
});

app.get('/download', (req, res) => {
    res.download(excel_path);
});

app.get('/get-excel-content', (req, res) => {
    var buff = fs.readFileSync(excel_path);
    var wb = XLSX.read(buff, {type: 'buffer'});

    console.log(wb.SheetNames);
    let data = {}
    wb.SheetNames.forEach((sheetName) => {
        let html = XLSX.utils.sheet_to_html(wb.Sheets[sheetName], {editable: true});
        data[sheetName] = html
    });
    res.status(200).send({'excelData': data});
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});