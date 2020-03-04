var User = require('../model/User');
var UserProfile = require('../model/UserProfile');
var UserItem = require('../model/UserItem');
var Item = require('../model/Item'); 

//function to get all users
module.exports.getUsers = function(){
    let users = [];
    for (let i = 0; i < usersData.length; i++){
        let user = new User(usersData[i].userId,usersData[i].firstName,usersData[i].lastName,usersData[i].email,usersData[i].password)
        users.push(user);
    }
    return users;
}

//function to getuser using email and password
module.exports.getUser = function(email,password){
  var count= 0;
   for (let i = 0; i < usersData.length; i++){
    if(email == usersData[i].email && password == usersData[i].password){
      let user = new User(usersData[i].userId,usersData[i].firstName,usersData[i].lastName,usersData[i].email,usersData[i].password)
      return user;
      console.log(count++);
   }
  }
}


//function to get all users profile
module.exports.getUserProfiles  = function(){
  let userProfiles = [];
  let userItems = [];
  for (let i = 0; i < userprofileData.length; i++){
     let userProfile = new UserProfile(userprofileData[i].userId)
      for(let j=0; j < userprofileData[i].userItems.length; j++){
        let item = new Item(userprofileData[i].userItems[j].item.itemCode,
              userprofileData[i].userItems[j].item.itemName,
              userprofileData[i].userItems[j].item.catalogCategory,
              userprofileData[i].userItems[j].item.description,
              userprofileData[i].userItems[j].item.rating,
              userprofileData[i].userItems[j].item.imageUrl
            )
        item.imageURL = item.getImageURL(userprofileData[i].userItems[j].item.itemCode);
        let userItem = new UserItem(item,userprofileData[i].userItems[j].userRating,userprofileData[i].userItems[j].madeIt)
        userItems.push(userItem);
      }
      userProfile.userItems = userItems
      userProfiles.push(userProfile);
  }
  return userProfiles;
}

//function to get profile of particular userId
module.exports.getUserProfile  = function(userId){
  userItems = [];
  for (let i = 0; i < userprofileData.length; i++){
    if(userId==userprofileData[i].userId){
      let userProfile = new UserProfile(userprofileData[i].userId)
      for(let j=0; j < userprofileData[i].userItems.length; j++){
        let item = new Item(userprofileData[i].userItems[j].item.itemCode,
              userprofileData[i].userItems[j].item.itemName,
              userprofileData[i].userItems[j].item.catalogCategory,
              userprofileData[i].userItems[j].item.description,
              userprofileData[i].userItems[j].item.rating,
              userprofileData[i].userItems[j].item.imageUrl
            )
        item.imageURL = item.getImageURL(userprofileData[i].userItems[j].item.itemCode);
        let userItem = new UserItem(item,userprofileData[i].userItems[j].userRating,userprofileData[i].userItems[j].madeIt)
        userItems.push(userItem);
      }
      userProfile.userItems = userItems
      return userProfile;
    }
  }
}

//hardcoded userProfile
var userprofileData = [
  {
    userId: 1,
    userItems : [
      {
        item:{
          itemCode: 'Ma0M&M',
          itemName: 'M&M',
          catalogCategory: 'Mars',
          description : 'M&M® is a candy drop filled with delicious milk chocolate and covered with brightly colored candy coating.',
          rating: '4',
          imageUrl: ""
          },
        userRating: '3',
        madeIt: 'true'
      },
      {
        item:{
          itemCode : 'Ma1Sni',
          itemName : 'Snickers',
          catalogCategory : 'Mars',
          description : 'SNICKERS® is the most popular candy bar in the world SNICKERS® is perfect for active people and for those who like to spend time with friends',
          rating : '4',
          imageUrl: ""
          },
        userRating: '3',
        madeIt: 'true'
      },
    ]
  },
  {
    userId: 2,
    userItems : [
      {
        item:{
          itemCode : 'Ma2Mal',
          itemName : 'Maltesers',
          catalogCategory : 'Mars',
          description : 'Mars® is a nutritious candy bar made of nougat, caramel and real milk chocolate.',
          rating : '4',
          imageUrl: ""
        },
        userRating: '3',
        madeIt: 'true'
      },
      {
        item:{
          itemCode : 'Ma1Sni',
          itemName : 'Snickers',
          catalogCategory : 'Mars',
          description : 'SNICKERS® is the most popular candy bar in the world SNICKERS® is perfect for active people and for those who like to spend time with friends',
          rating : '4',
          imageUrl: ""
          },
        userRating: '3',
        madeIt: 'true'
      },
    ]
  }
]

//hardcoded userdata
var usersData = [
  {
    userId : 1,
    firstName : 'Jugal',
    lastName : 'Patel',
    email : 'abc@abc.com',
    password: 'abc123'
  },
  {
    userId : 2,
    firstName : 'rohit',
    lastName : 'sharma',
    email : 'xyz@xyz.com',
    password: 'xyz123'
  }
]
