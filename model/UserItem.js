var Item = require('../model/Item');
class UserItem {
  constructor(item,userRating,madeIt) {
  	if(item instanceof Item){
      this.item = item;
  	}
  	this.userRating= userRating;
    this.madeIt= madeIt;
  }

}
module.exports = UserItem;
