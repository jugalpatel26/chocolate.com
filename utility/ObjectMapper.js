const UserItem = require('../model/UserItem');
const UserProfile = require('../model/UserProfile');
const Item = require('../model/Item');
const User = require('../model/User');


exports.createArrayItemModel = function(itemData){
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

exports.createUserModel = function(userData){
  return new User(userData._id,userData.firstName,userData.lastName,userData.email,userData.salt,userData.password)
}

exports.createUserProfileModel = function(userId,userItems){
  return new UserProfile(userId,userItems)
}

exports.createUserItemsModel = function(userItemsData){
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
