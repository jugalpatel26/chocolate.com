const express = require('express');
const router = express.Router();

let itemsController = require('../controller/itemsController');
let myChocolate = require('../controller/myChocolate');
let newRecipe = require('../controller/newRecipe');
let signIn = require('../controller/signIn');
let signUp = require('../controller/signUp');
let static = require('../controller/static');
let signUpMiddleware = require('../middlewares/signUpMiddlewares')
let newRecipeMiddleware = require('../middlewares/newRecipeMiddlewares')
let itemMiddleware = require('../middlewares/itemMiddlewares')

router.get('/index',static.index);
router.get('/about',static.about);
router.get('/contact',static.contact);
router.get('/signOut',static.signOut);
router.get('/signIn',signIn.getSignIn);
router.post('/signIn',signIn.postSignIn);
router.get('/signUp',signUp.getSignUp);
router.post('/signUp',signUpMiddleware.signUpValidator,signUpMiddleware.validateErrors,signUp.postSignUp);
router.get('/newrecipe',newRecipe.getNewRecipe);
router.post('/newrecipe',newRecipeMiddleware.newRecipeValidator,newRecipeMiddleware.validateErrors,newRecipe.postNewRecipe);
router.get('/categories/catalog',itemsController.itemsCatalog);
router.get('/categories/item/:itemCode',itemMiddleware.itemValidator,itemMiddleware.validateErrors,itemsController.itemDetails);
router.post('/mychocolate/feedback',itemMiddleware.itemValidator,itemMiddleware.validateErrors,myChocolate.feedback);
router.post('/myChocolate',itemMiddleware.itemValidator,itemMiddleware.validateErrors,myChocolate.saveUpdate);
router.get('/myChocolate',myChocolate.getMyChocolate);
router.post('/mychocolate/delete',itemMiddleware.itemValidator,itemMiddleware.validateErrors,myChocolate.deleteMyChocolate);
router.post('/owneritem/delete',itemMiddleware.itemValidator,itemMiddleware.validateErrors,myChocolate.deleteOwnerItem);
router.get('/*',static.index);

module.exports = router;
