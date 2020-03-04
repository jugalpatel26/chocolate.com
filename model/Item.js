class Item {
   constructor(itemCode, itemName, catalogCategory, description, rating, imageURL) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.catalogCategory = catalogCategory;
        this.description = description;
        this.rating = rating;
        this.imageURL = imageURL;

    }
    
    getImageURL(icode){

        return "/assets/images/" + icode + ".jpg";

    }

}

module.exports = Item;
