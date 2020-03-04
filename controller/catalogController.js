var express = require('express');
var router = express.Router();
var itemDb = require('../utility/ItemDB');



router.get('/',function(req, res) {
    res.render('index');
});


router.get('/categories/catalog', function(req, res) {
    var itemData = itemDb.getItems(); //getting list of items from static database
    res.render('categories', {itemData : itemData});
});

router.get('/contact', function(req, res) {
     res.render('contact');
});

router.get('/about', function(req, res) {
    res.render('about');
});
router.get('/Login', function(req, res) {
    res.send('Login Page');
});
router.get('/SignIn', function(req, res) {
    res.send('SignIn Page');
});

router.get('/categories/item/:itemCode', function(req, res) {
    var itemCode = req.params.itemCode;
    var itemData = itemDb.getItems();
    var item = itemDb.getItem(itemCode);
 
    
    if(item === undefined){
        res.render('categories',{itemData : itemData})
    }
    else{
      res.render('item', {item:item});  
    }
   
});   

router.get('/mychocolate', function(req, res) {
    res.render('mychocolate');
});

router.get('/feedback', function(req, res) {
    res.render('feedback');
});

router.get('/here', function(req, res) {
    res.send('');
});

router.get('/*', function(req, res) {
    res.render('index');
});

module.exports = router;


