require('dotenv').config(); /** .env process */

/* Dependencies */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Routes */
var usersRouter = require('./routes/users');

var app = express();

/* Usage */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', usersRouter);

module.exports = app;
