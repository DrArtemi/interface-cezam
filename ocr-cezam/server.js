var resolve = require('path').resolve
var express = require('express');
var multer = require('multer');
var cors = require('cors');
var fs = require('fs');

var app = express();

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
        let dir = 'public/ocr_files/' + file.fieldname;
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
    { name: 'pieceIdentite', maxCount: 10 },
    { name: 'releveBanquaire', maxCount: 10 },
    { name: 'avisImposition', maxCount: 10 },
    { name: 'tableauAmortissement', maxCount: 10 },
    { name: 'liasseFiscale', maxCount: 10 }
])

app.post('/upload', multiple_upload, function (req, res) {
    if (req.files) {
        // create config.json file
        data = {
            'pieceIdentite': [],
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
        fs.writeFileSync('public/ocr_files/config.json', json_data);
        
        res.status(200).send(req.files);
    } else {
        res.status(500).send('Error while uploading files');
    }
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});