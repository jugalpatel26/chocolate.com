
//importing requires modules
var express = require('express');
var router = express.Router();
var itemDb = require('../utility/ItemDB');
var userDb = require('../utility/UserDB');
var session = require('express-session');
var UserItem = require('../model/UserItem');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var UserProfile = require('../model/UserProfile');
var Item = require('../model/Item');

//home page 
router.get('/',function(req, res) {
  if(req.session.theUser){
    res.render('index',{userprofile:req.session.userProfile});
  }
  else {
    res.render('index',{userprofile:null});
  }

});


router.get('/categories/catalog', function(req, res) {
  
  var category = itemDb.category;
  var itemData = itemDb.getItems();// getting all chocolate items
  
  if(req.session.theUser){
    res.render('categories', {itemData : itemData, category : category,userprofile:req.session.userProfile});
  }
  else {
    res.render('categories', {itemData : itemData, category : category,userprofile:null});
  }

});


router.get('/contact', function(req, res) {
  
  if(req.session.theUser){
    res.render('contact',{userprofile:req.session.userProfile});
  }
  else {
    res.render('contact',{userprofile:null});
  }

});


router.get('/about', function(req, res) {
  
  if(req.session.theUser){
    res.render('about',{userprofile:req.session.userProfile});
  }
  else {
    res.render('about',{userprofile:null});
  }

});


router.get('/signIn', function(req, res) {
  res.render('signin',{userprofile:null});
});


router.get('/signOut', function(req, res) {
  req.session.destroy();
  res.render('index',{userprofile:null});
});

router.post('/signin',urlencodedParser, function(req, res) {
  
  var email = req.body.email;
  var password = req.body.password;
  req.session.theUser = userDb.getUser(email,password) // calling function to check login credentials and return user
  
  if(req.session.theUser){
    req.session.userProfile = userDb.getUserProfile(req.session.theUser.userId); // calling function to get userprofile and storing in session variable
    res.render('mychocolate',{userprofile:req.session.userProfile});
  }
  else{
    res.render('signin',{userprofile:null});
  }

});

router.get('/categories/item/:itemCode', function(req, res) {
  
  var itemCode = req.params.itemCode;
  var category = itemDb.category;
  var itemData = itemDb.getItems();
  var item = itemDb.getItem(itemCode); // calling function to get item data tobe displayed.

  if(req.session.theUser){
    if(item === undefined){
      res.render('categories',{itemData : itemData, category : category, userprofile:req.session.userProfile })
    }
    else{
      res.render('item', {item:item, userprofile:req.session.userProfile});
    }
  }
  else {
    if(item === undefined){
      res.render('categories',{itemData : itemData, category : category, userprofile:null})
    }
    else{
      res.render('item', {item:item, userprofile:null});
    }
  }

});

router.get('/mychocolate', function(req, res) {
    if(req.session.theUser){
        res.render('mychocolate',{userprofile:req.session.userProfile});
    }
    else {

       intializeSessionVariable(req,res);
    }
});

router.get('/mychocolate/saveupdate', function(req, res) {
  //fetching query data
  var code = req.query.itemCode;
  var userRating = req.query.userRating;
  var madeIt = req.query.madeIt;
  if(req.session.theUser){
    try{
      var userProfile = new UserProfile(req.session.userProfile.userId,req.session.userProfile.userItems);
      var item = itemDb.getItem(code); // calling function to get item data tobe added or updated.
      userProfile.addUpdateItem(item,userRating,madeIt) // calling UserProfile function to add and update items in userprofile
      req.session.userProfile= userProfile; // updating session variable
     
      res.render('mychocolate',{userprofile:req.session.userProfile});
    }
    catch(e){

      res.render('mychocolate',{userprofile:req.session.userProfile});
  
    }
  }
  else {
    intializeSessionVariable(req,res);
  }

});

router.get('/mychocolate/delete', function(req, res) {
  var code = req.query.itemCode
  
  if(req.session.theUser){
    var userProfile = new UserProfile(req.session.userProfile.userId,req.session.userProfile.userItems);
    var item = itemDb.getItem(code); // calling function to get item data tobe deleted.
    userProfile.removeItem(code) // calling UserProfile function to remove items in userprofile
    req.session.userProfile= userProfile;
    res.render('mychocolate',{userprofile:req.session.userProfile});
  }
  else {
    intializeSessionVariable(req,res);
  }

});

router.get('/mychocolate/feedback', function(req, res) {
  var code = req.query.itemCode;
  
  if(req.session.theUser){
      var item = itemDb.getItem(code); // calling function to get item data tobe displayed.
      if(item){
        res.render('feedback',{item:item,userprofile:req.session.userProfile});
      }
      else {
        res.render('mychocolate',{userprofile:req.session.userProfile});
      }
  }
  else {
      intializeSessionVariable(req,res);
  }

});

router.get('/here', function(req, res) {
    res.send('');
});

router.get('/*', function(req, res) {
  
  if(req.session.theUser){
      res.render('index',{userprofile:req.session.userProfile});
  }
  else {
    res.render('index',{userprofile:null});
  }

});


//function to intialize session variables
function intializeSessionVariable(req,res){
  req.session.theUser = userDb.getUsers()[0]; //storing user data in session variable
  req.session.userProfile = userDb.getUserProfile(req.session.theUser.userId); //storing user profile in session variable
  res.render('mychocolate',{userprofile:req.session.userProfile});
}
module.exports = router;
