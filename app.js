var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
let catalogController = require('./controller/catalogController');


app.use('/', catalogController);


app.listen(8080);
module.exports = app;
