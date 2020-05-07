const { body,validationResult } = require('express-validator');

exports.newRecipeValidator = [
  body('itemname')
    .isAlphanumeric()
    .isLength({ min: 3 })
    .withMessage('Item name must be only alphanumeric and minimum three characters'),
  body('itemtype')
    .isAlpha()
    .isLength({ min: 3 })
    .withMessage('Item name must be only alphanumeric and minimum three characters'),
  body('recipe')
    .isLength({ min: 100 })
    .withMessage('Recipe must be minimum of 100 characters'),
]

exports.validateErrors = (req, res, next) => {
  var errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.render('newrecipe',{error:errors.array()});
    } else {
      next();
    }
};
