var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email: String,
    salt:String,
    password: String

},{collection:'Users',versionKey:false});
var User = mongoose.model('Users',userSchema);

var itemSchema =  new mongoose.Schema({
	itemName:String,
	catalogCategory:String,
	description:String,
	rating:String,
	imageURL:String,
	ownerId:{ type:mongoose.Schema.Types.ObjectId , ref:'Users'}
},{collection:'Items',versionKey:false})
var Item = mongoose.model('Items',itemSchema);

var userItemsSchema = new mongoose.Schema({
	userId: { type:mongoose.Schema.ObjectId, ref :'Users'},
	item:{ type:mongoose.Schema.Types.ObjectId, ref:'Items'},
	userRating:String,
	madeIt:Boolean
},{collection:'UserItems',versionKey:false})
var UserItems = mongoose.model('UserItems',userItemsSchema);


module.exports.saveUser = async function(user){
	this.user = new User(
		{
			firstName:user.firstName,
			lastName:user.lastName,
			email:user.email,
      salt:user.salt,
			password:user.password
		});
 	return this.user.save();
}

module.exports.saveItem = async function(item){
	this.item = new Item(
		{
			itemName:item.itemName,
			catalogCategory:item.catalogCategory,
			description:item.description,
			rating:item.rating,
			imageURL:item.imageURL,
			ownerId:item.ownerId
		});
	return this.item.save();
}

module.exports.getUser = function(email,password){
	return User.find({email:email,password:password}).exec();
}

module.exports.getSalt = function(email){
  return User.find({email:email},'salt').exec();
}

module.exports.getItemCatogories = function(){
	return Item.find().distinct('catalogCategory').exec();
}

module.exports.getItems = function(){
	return Item.find().exec();
}

module.exports.getItem = function(code){
	return Item.find({_id:code}).exec();
}

module.exports.getUserItems = function(userId){
	return UserItems.find({userId:userId}).populate('item').exec()

}
module.exports.saveUserItems = function(userId,itemId,userRating,madeIt){
	return UserItems.findOneAndUpdate({userId:userId,item:itemId},{userId:userId,itemId:itemId,userRating:userRating,madeIt:madeIt},{upsert:true}).exec();

}
module.exports.matchEmail = function(email){
	return User.find({email:email}).exec()
}

module.exports.getOwnerItems = function(userId){
  return Item.find({ownerId:userId}).exec();
}

module.exports.removeUserItem= function(userId,itemCode){
  return UserItems.deleteOne({userId:userId,item:itemCode}).exec();
}
module.exports.removeOwnerItem = function(userId,itemCode){
  return Item.deleteOne({ownerId:userId,_id:itemCode}).exec();
}
module.exports.removeAllUserItem = function(itemCode){
  return UserItems.deleteMany({item:itemCode}).exec();
}
