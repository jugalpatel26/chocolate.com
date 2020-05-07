const mongooseQueries = require('../utility/MongooseQueries');
const objectMapper = require('../utility/ObjectMapper');
const Item = require('../model/Item');

exports.itemsCatalog = async function(req, res) {
try{
  var category = await mongooseQueries.getItemCatogories();
  var itemData = await mongooseQueries.getItems();
  var items = objectMapper.createArrayItemModel(itemData);
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
};

exports.itemDetails = async function(req, res) {
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
};
