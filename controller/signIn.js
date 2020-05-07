const mongooseQueries = require('../utility/MongooseQueries');
const objectMapper = require('../utility/ObjectMapper');
const saltHash = require('../utility/SaltHash');

exports.postSignIn = async function(req, res) {
  try{
    var email = req.body.email;
    var salt = await mongooseQueries.getSalt(email)
    if(salt.length > 0){
      var password = saltHash.sha512(req.body.password,salt[0].salt)
      var userData = await mongooseQueries.getUser(email,password.passwordHash)
      if(userData.length>0){
        var user = objectMapper.createUserModel(userData);
        var userItemsData = await mongooseQueries.getUserItems(user.userId)
        var userItems = objectMapper.createUserItemsModel(userItemsData);
        var userProfile = objectMapper.createUserProfileModel(user.userId,userItems)
        var data = {
          user:user,
          userProfile:userProfile
        }
        req.session.data = data;
        res.redirect('/mychocolate');
      }
      else{
        res.render('signin',{error:"Password incorrect"});
      }
    }
    else{
      res.render('signin',{error:"Email incorrect"});
    }

  }
  catch(e){
    res.render('signin',{error:"Database Error"});
  }
};

exports.getSignIn = function(req, res) {
  if(req.session.data){
    res.redirect('/mychocolate');
  }
  else {
    res.render('signin');
  }
};
