require('dotenv').config(); /** .env process */

/* Dependencies */
var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Routes */
var usersRouter = require('./routes/user');

var app = express();

/* create a write stream (in append mode) for logs */
let dirLogs = path.join(__dirname, 'logs');
let logFileName = path.join(dirLogs, 'access.log');

if (!fs.existsSync(dirLogs)){
    fs.mkdirSync(dirLogs);
}
let accessLogStream = fs.createWriteStream(logFileName, { flags: 'a' });

/* Usage */
app.use(logger('combined', { stream: accessLogStream })); /** Logs */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', usersRouter);

module.exports = app;
