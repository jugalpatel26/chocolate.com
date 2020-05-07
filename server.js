
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const catalog = require('./routes/catalog');
const signUp = require('./controller/signUp');


app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use(bodyParser.urlencoded({ extended: false }))

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
  app.use('/',catalog);
});

app.listen(8080,()=>{
  console.log("Server running on port 8080");
});
