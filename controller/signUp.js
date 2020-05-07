const mongooseQueries = require('../utility/MongooseQueries');
const objectMapper = require('../utility/ObjectMapper');
const saltHash = require('../utility/SaltHash');
const User = require('../model/User');
const { body,validationResult } = require('express-validator');

exports.postSignUp = function(req, res) {
  if(req.session.data){
    res.render('index',{data:req.session.data});
  }
  else {
    if(req.body.password === req.body.cpassword){
      var password = saltHash.saltHashPassword(req.body.password)
      mongooseQueries.matchEmail(req.body.email)
      .then(function(match){
        if(match.length>0){
          res.render('signup',{error:"Email already exist"})
        }
        else{
          var user = new User(null,req.body.firstname,req.body.lastname,req.body.email,password.salt,password.passwordHash)
          mongooseQueries.saveUser(user)
          .then(function(userData){
            var user = objectMapper.createUserModel(userData);
            var userProfile = objectMapper.createUserProfileModel(user.userId,[])
            var data = {
              user:user,
              userProfile:userProfile
            }
            req.session.data = data;
            res.render('index',{data:data})
          })
          .catch(function(err){
            console.log(err);
            res.render('signup',{error:[{msg:"Please signup again"}]})
          });
        }
      }).catch(function(err){
        res.render('error',{error:[{msg:"Please try again"}]})
      });
    }
    else{
      res.render('signup',{error:[{msg:"Password and confirm password does not match"}]})
    }
  }
};

exports.getSignUp = function(req, res) {
  if(req.session.data){
    res.render('index',{data:req.session.data});
  }
  else {
    res.render('signup');
  }

};
