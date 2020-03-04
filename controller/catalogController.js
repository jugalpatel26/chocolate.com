
//importing requires modules
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var itemDb = require('../utility/ItemDB');
var userDb = require('../utility/UserDB');
var mongooseQueries = require('../utility/MongooseQueries')
var session = require('express-session');
var UserItem = require('../model/UserItem');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var UserProfile = require('../model/UserProfile');
var Item = require('../model/Item');
var User = require('../model/User');

router.post('/signup',urlencodedParser, function(req, res) {
  if(req.session.data){
    res.render('index',{data:req.session.data});
  }
  else {
    if(req.body.password === req.body.cpassword){
      var password = saltHashPassword(req.body.password)
      mongooseQueries.matchEmail(req.body.email)
      .then(function(match){
        if(match.length>0){
          res.render('signup',{error:"Email already exist"})
        }
        else{
          var user = new User(null,req.body.firstname,req.body.lastname,req.body.email,password.salt,password.passwordHash)
          mongooseQueries.saveUser(user)
          .then(function(userData){
            var user = createUserModel(userData);
            var userProfile = createUserProfileModel(user.userId,[])
            var data = {
              user:user,
              userProfile:userProfile
            }
            req.session.data = data;
            res.render('index',{data:data})
          })
          .catch(function(err){
            console.log(err);
            res.render('signup',{error:"Please signup again"})
          });
        }
      }).catch(function(err){
        res.render('error',{error:"Please try again"})
      });
    }
    else{
      res.render('signup',{error:"Password and confirm password does not match"})
    }
  }
});

router.post('/signin',urlencodedParser,async function(req, res) {
  try{
    var email = req.body.email;
    var salt = await mongooseQueries.getSalt(email)
    var password = sha512(req.body.password,salt[0].salt)
    var userData = await mongooseQueries.getUser(email,password.passwordHash)
    if(userData.length>0){
      var user = createUserModel(userData);
      var userItemsData = await mongooseQueries.getUserItems(user.userId)
      var userItems = createUserItemsModel(userItemsData);
      var userProfile = createUserProfileModel(user.userId,userItems)
      var data = {
        user:user,
        userProfile:userProfile
      }
      req.session.data = data;
      res.redirect('/mychocolate');
    }
    else{
      res.render('signin',{error:"Email or Password incorrect"});
    }

  }
  catch(e){
    console.log(e);
    res.render('signin',{error:"Database Error"});
  }
});

router.post('/newrecipe',urlencodedParser,function(req, res) {
  if(req.session.data){
    var item = new Item(null,req.body.itemname,req.body.itemtype,req.body.recipe,0,req.body.imageurl,req.session.data.user.userId);
    mongooseQueries.saveItem(item)
    .then(function(data){
        res.redirect('/categories/catalog')
    })
    .catch(function(err){
      res.render("newrecipe",{error:"Form not submitted. Please try again"})
    })
  }
  else {
    res.render('index');
  }
});

router.get('/categories/catalog',async function(req, res) {
try{
  var category = await mongooseQueries.getItemCatogories();
  var itemData = await mongooseQueries.getItems();
  var items = createArrayItemModel(itemData);
  if(req.session.data){
    res.render('items', {items : items, category : category,data:req.session.data});
  }
  else {
    res.render('items', {items : items, category : category});
  }
}
catch(e){
  res.render('error',{error:"Items not fetched from database"});
}
});

router.get('/categories/item/:itemCode',async function(req, res) {
  try{
    var itemCode = req.params.itemCode;
    var itemData = await mongooseQueries.getItem(itemCode);
    var item = new Item(itemData[0]._id,itemData[0].itemName,itemData[0].catalogCategory,itemData[0].description,itemData[0].rating,itemData[0].imageURL,itemData[0].ownerId);

    if(req.session.data){
      res.render('item', {item : item,data:req.session.data});
    }
    else {
      res.render('item', {item : item});
    }

  }
  catch(e){

    res.redirect("/categories/catalog");
  }
});

router.get('/mychocolate/feedback',async function(req, res) {
  try{
    var code = req.query.itemCode;

    if(req.session.data){
        var itemData = await mongooseQueries.getItem(code);
        if(itemData[0].ownerId == req.session.data.user.userId){
          res.redirect('/mychocolate?msg=You are creater')
        }
        else{
          var item = new Item(itemData[0]._id,
            itemData[0].itemName,
            itemData[0].catalogCategory,
            itemData[0].description,
            itemData[0].rating,
            itemData[0].imageURL,
            itemData[0].ownerId)
          res.render('feedback',{item:item,data:req.session.data});
        }
    }
    else {
        res.render("signin",{error:"Please LogIn"})
    }
  }
  catch(e){
      res.render("error",{error:"Item not found"});
  }
});

router.get('/mychocolate/saveupdate',async function(req, res) {
  //fetching query data
  var code = req.query.itemCode;
  var userRating = req.query.userRating;
  var madeIt = req.query.madeIt;

  if(req.session.data){
    try{
      await mongooseQueries.saveUserItems(req.session.data.user.userId,code,userRating,madeIt);
      var userItemsData = await mongooseQueries.getUserItems(req.session.data.user.userId)
      var userItems = createUserItemsModel(userItemsData);
      var userProfile = createUserProfileModel(req.session.data.user.userId,userItems)
      req.session.data.userProfile = userProfile
      res.redirect('/mychocolate');
    }
    catch(e){
      console.log(e);
      res.redirect('/mychocolate?msg=Error while saving. Please try again');

    }
  }
  else {
    res.render('signin',{error:"Please Login"})
  }

});

router.get('/mychocolate', async function(req, res) {
  var msg = req.query.msg;
  try{
    if(req.session.data){
      var createdItemsData = await mongooseQueries.getOwnerItems(req.session.data.user.userId)
      var ownersItems = createArrayItemModel(createdItemsData);
      res.render('mychocolate',{data:req.session.data,ownersItems:ownersItems,msg:msg});
    }
    else {
       res.render('signin',{error:"Please Login"})
    }
  }
  catch(e){
    console.log(e);
    res.render("error",{error:"Database Error"})
  }
});

router.get('/owneritem/delete',async function(req, res) {
  try{
    var code = req.query.itemCode
    if(req.session.data){
      await mongooseQueries.removeOwnerItem(req.session.data.user.userId,code);
      await mongooseQueries.removeAllUserItem(code);
      var userItemsData = await mongooseQueries.getUserItems(req.session.data.user.userId)
      var userItems = createUserItemsModel(userItemsData);
      var userProfile = createUserProfileModel(req.session.data.user.userId,userItems)
      req.session.data.userProfile = userProfile
      res.redirect('/mychocolate')
    }
    else {
      res.render('signin',{error:"Please Login"})
    }
  }
  catch(e){
    res.render('error',{error:"Error while deleting"})
  }
});

router.get('/mychocolate/delete',async function(req, res) {
  try{
    var code = req.query.itemCode
    if(req.session.data){
      await mongooseQueries.removeUserItem(req.session.data.user.userId,code);
      var userItemsData = await mongooseQueries.getUserItems(req.session.data.user.userId)
      var userItems = createUserItemsModel(userItemsData);
      var userProfile = createUserProfileModel(req.session.data.user.userId,userItems)
      req.session.data.userProfile = userProfile
      res.redirect('/mychocolate')
    }
    else {
      res.render('signin',{error:"Please Login"})
    }
  }
  catch(e){
    res.render('error',{error:"error while deleting"})
  }
});

//home page
router.get('/',function(req, res) {
  if(req.session.data){
    res.render('index',{data:req.session.data});
  }
  else {
    res.render('index');
  }

});

router.get('/newrecipe',function(req, res) {
  if(req.session.data){
    res.render('newrecipe',{data:req.session.data});
  }
  else {
    res.render('signin',{error:"Please LogIn"});
  }

});



router.get('/signup',function(req, res) {
  if(req.session.data){
    res.render('index',{data:req.session.data});
  }
  else {
    res.render('signup');
  }

});

router.get('/about', function(req, res) {

  if(req.session.data){
    res.render('about',{data:req.session.data});
  }
  else {
    res.render('about');
  }

});


router.get('/signIn', function(req, res) {
  if(req.session.data){
    res.redirect('/mychocolate');
  }
  else {
    res.render('signin');
  }
});


router.get('/signOut', function(req, res) {
  req.session.destroy();
  res.render('index');
});

router.get('/*', function(req, res) {

  if(req.session.data){
      res.render('index',{data:req.session.data});
  }
  else {
    res.render('index');
  }

});

function createArrayItemModel(itemData){
  var items = []
  for(var i=0;i<itemData.length;i++){
      var item = new Item(
        itemData[i]._id,
        itemData[i].itemName,
        itemData[i].catalogCategory,
        itemData[i].description,
        itemData[i].rating,
        itemData[i].imageURL,
        itemData[i].ownerId);
      items.push(item);
  }
  return items;
}

function createUserModel(userData){
  return new User(userData._id,userData.firstName,userData.lastName,userData.email,userData.salt,userData.password)
}

function createUserProfileModel(userId,userItems){
  return new UserProfile(userId,userItems)
}

function createUserItemsModel(userItemsData){
  var userItems = []
  for(i=0;i<userItemsData.length;i++){
    var item = new Item(userItemsData[i].item._id,
      userItemsData[i].item.itemName,
      userItemsData[i].item.catalogCategory,
      userItemsData[i].item.description,
      userItemsData[i].item.rating,
      userItemsData[i].item.imageURL,
      userItemsData[i].item.ownerId
    )
    var userItem = new UserItem(item,  userItemsData[i].userRating,  userItemsData[i].madeIt)
    userItems.push(userItem);
  }
  return userItems
}

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') 
            .slice(0,length);   
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); 
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); 
    var passwordData = sha512(userpassword,salt);
    return passwordData;
}

module.exports = router;
