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
        let dir = 'public/uploads/' + file.fieldname;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
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
        res.status(200).send(req.files);
    } else {
        res.status(500).send('Error while uploading files');
    }
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});