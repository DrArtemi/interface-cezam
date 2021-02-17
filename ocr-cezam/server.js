const resolve = require('path').resolve
const { spawn } = require('child_process');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = '/home/adrien/ocr_files/' + file.fieldname;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
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

app.post('/upload', multiple_upload, function (req, res) {
    if (req.files) {
        // create config.json file
        data = {
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
        var config_path = '/home/adrien/ocr_files/config.json';
        var excel_path = '/home/adrien/ocr_files/processed.xlsx';
        fs.writeFileSync(config_path, json_data);
        console.log('Files uploaded !');

        var script_out = [];
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

app.listen(8000, function() {
    console.log('App running on port 8000');
});