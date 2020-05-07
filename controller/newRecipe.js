const Item = require('../model/Item');
const mongooseQueries = require('../utility/MongooseQueries');

exports.postNewRecipe = function(req, res) {
  if(req.session.data){
    var item = new Item(null,req.body.itemname,req.body.itemtype,req.body.recipe,0,req.body.imageurl,req.session.data.user.userId);
    mongooseQueries.saveItem(item)
    .then(function(data){
        res.redirect('/categories/catalog')
    })
    .catch(function(err){
      res.render("newrecipe",{error:[{msg:"Form not submitted. Please try again"}]})
    })
  }
  else {
    res.render('index');
  }
};

exports.getNewRecipe = function(req, res) {
  if(req.session.data){
    res.render('newrecipe',{data:req.session.data});
  }
  else {
    res.render('signin',{error:"Please LogIn"});
  }

};
