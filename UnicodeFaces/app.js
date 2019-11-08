const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const { getIndex } = require('./routes/index');
const port = 1337;

//database configuration
/*
const db = mysql.createConnection({
    host: '',
    root: '',
    password: '',
    database: ''
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;
*/

//middleware configuration
app.set('port', process.env.port || port);
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//set up routes for app
app.get('/', getIndex);

/*
app.get('/', (req, res) => {
    res.send('Hello World.');
});
*/

app.listen(port);