var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
var session = require('express-session');
var catalogController = require('./controller/catalogController');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chocolate', {useNewUrlParser: true});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
  app.use("/",function(req,res){
    res.render("error",{error:"Database connectivity error"})
  })
});

mongoose.connection.on('connected', function () {
  app.use(session({
    secret : 'jugal',
    resave : false,
    saveUninitialized : true
  }))
  app.use('/',catalogController);
});

app.listen(8080,()=>{
  console.log("Server running on port 8080");
});