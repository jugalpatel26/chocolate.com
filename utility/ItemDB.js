var Item = require('../model/Item');

//function to get all items
module.exports.getItems = function () {

    let items = [];
    for (let i = 0; i < data.length; i++) {
        let item = new Item(data[i].itemCode,
            data[i].itemName,
            data[i].catalogCategory,
            data[i].description,
            data[i].rating,

            );
        item.imageURL = item.getImageURL(data[i].itemCode);
        items.push(item);

    }
    return items;


};

//function to get item of particular itemcode
module.exports.getItem = function (itemCode) {

    for (var i = 0; i < data.length; i++) {

        if (data[i].itemCode === itemCode) {
            let item = new Item(data[i].itemCode,
                data[i].itemName,
                data[i].catalogCategory,
                data[i].description,
                data[i].rating,
                data[i].imageUrl
                )
            item.imageURL = item.getImageURL(data[i].itemCode);


            return item;
        }


    }
};

// Hard coded data
var data = [
    {
        itemCode : 'Ma0M&M',
        itemName : 'M&M',
        catalogCategory : 'Mars',
        description : 'M&M® is a candy drop filled with delicious milk chocolate and covered with brightly colored candy coating.',
        rating : 4,
        imageUrl: ""
    },
    {
        itemCode : 'Ma1Sni',
        itemName : 'Snickers',
        catalogCategory : 'Mars',
        description : 'SNICKERS® is the most popular candy bar in the world SNICKERS® is perfect for active people and for those who like to spend time with friends',
        rating : 4,
        imageUrl: ""
    },
    {
        itemCode : 'Ma2Mal',
        itemName : 'Maltesers',
        catalogCategory : 'Mars',
        description : 'Mars® is a nutritious candy bar made of nougat, caramel and real milk chocolate.',
        rating : 4,
        imageUrl: ""
    },
    {
        itemCode : 'Ha0Har',
        itemName : "Harshey's Bar",
        catalogCategory : "Harshey's",
        description : 'Made with farm fresh milk, this HERSHEY’S Chocolate Bar makes life delicious',
        rating : 4,
        imageUrl: ""
    },
    {
        itemCode : 'Ha1Har',
        itemName : "Harshey's Kisses",
        catalogCategory : "Harshey's",
        description : 'The iconic shape, festive foil wrappers and classic taste of HERSHEY’S KISSES Milk Chocolate make them perfect for sharing and savoring',
        rating : 4,
        imageUrl: ""
    },
    {
        itemCode : 'Ha2Har',
        itemName : "Harshey's Almond Bar",
        catalogCategory : "Harshey's",
        description : 'These are more than just candy bars. They’re chances to stop and savor life’s sweeter side. Each bite is filled with crunchy whole almonds and classic HERSHEY’S Milk Chocolate',
        rating : 4,
        imageUrl: ""
    }
];


module.exports.category = ["Mars", "Harshey's"];
