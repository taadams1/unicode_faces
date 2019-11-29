const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const async = require('async');
const fetch = require('node-fetch');
const tf = require('@tensorflow/tfjs');
const faceapi = require('face-api.js');
const app = express();

const { getIndex, getArray, scoreGrid, characterCheck } = require('./routes/index');
const port = 1337;

//database configuration

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'uc_faces'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


//middleware configuration
app.set('port', process.env.port || port);
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({
    parameterLimit: 200000,
    limit: '20mb',
    extended: true
}));
app.use(bodyParser.json({ limit: '20mb' }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/models')));

//set up routes for app
app.get('/', getIndex);
app.post('/grid', getArray);
app.post('/score', scoreGrid);
//app.get('/score', (req, res) => { res.redirect('/') });
app.get('/charCheck', characterCheck);

/*
app.get('/', (req, res) => {
    res.send('Hello World.');
});
*/

app.listen(port);