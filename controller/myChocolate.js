const mongooseQueries = require('../utility/MongooseQueries');
const objectMapper = require('../utility/ObjectMapper');
const Item = require('../model/Item');

exports.feedback = async function(req, res) {
  try{
    var code = req.body.itemCode;

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
};

exports.saveUpdate = async function(req, res) {
  //fetching query data
  var code = req.body.itemCode;
  var userRating = req.body.userRating;
  var madeIt = req.body.madeIt;

  if(req.session.data){
    try{
      await mongooseQueries.saveUserItems(req.session.data.user.userId,code,userRating,madeIt);
      var userItemsData = await mongooseQueries.getUserItems(req.session.data.user.userId)
      var userItems = objectMapper.createUserItemsModel(userItemsData);
      var userProfile = objectMapper.createUserProfileModel(req.session.data.user.userId,userItems)
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

};

exports.getMyChocolate =  async function(req, res) {
  var msg = req.query.msg;
  try{
    if(req.session.data){
      var createdItemsData = await mongooseQueries.getOwnerItems(req.session.data.user.userId)
      var ownersItems = objectMapper.createArrayItemModel(createdItemsData);
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
};

exports.deleteOwnerItem = async function(req, res) {
  try{
    var code = req.body.itemCode
    if(req.session.data){
      await mongooseQueries.removeOwnerItem(req.session.data.user.userId,code);
      await mongooseQueries.removeAllUserItem(code);
      var userItemsData = await mongooseQueries.getUserItems(req.session.data.user.userId)
      var userItems = objectMapper.createUserItemsModel(userItemsData);
      var userProfile = objectMapper.createUserProfileModel(req.session.data.user.userId,userItems)
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
};

exports.deleteMyChocolate = async function(req, res) {
  try{
    var code = req.body.itemCode
    if(req.session.data){
      await mongooseQueries.removeUserItem(req.session.data.user.userId,code);
      var userItemsData = await mongooseQueries.getUserItems(req.session.data.user.userId)
      var userItems = objectMapper.createUserItemsModel(userItemsData);
      var userProfile = objectMapper.createUserProfileModel(req.session.data.user.userId,userItems)
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
};
