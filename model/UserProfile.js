var UserItem = require('./UserItem');
var Item = require('./Item');


class UserProfile {
  constructor(userId,userItems) {
        this.userId = userId;
        this.userItems = userItems;
  }

//using same function for adding and updating
addUpdateItem(item,userRating,madeIt){
         var flag =0;
        if(item instanceof Item && userRating<=5 && madeIt != undefined){
            for (let i=0; i<this.userItems.length; i++){
                if (this.userItems[i].item.itemCode === item.itemCode){
                    this.userItems[i].madeIt = madeIt;
                    this.userItems[i].userRating = userRating;
                    flag =1;
                    break;
                }
            }
            if(flag==0){

              let newItem = new UserItem(item,userRating,madeIt);
              this.userItems.push(newItem);
            }
        } else{
            throw new Error("item should be a Item object");
        }
}

removeItem(code){
        for(let i=0;i<this.userItems.length;i++){
           if(code == this.userItems[i].item.itemCode){
             this.userItems.splice(i,1);
             break;
           }
        }
       
}

getitems(){
  return this.userItems;
}

finditem(itemcode){
  for(let i=0;i<this.userItems.lenght;i++){
           if(item.itemCode == this.userItems[i].item.itemCode){
              return true;
           }
      }
}

emptyProfile(){
  this.userItems = [];
}

}

module.exports = UserProfile;
