const { body,validationResult } = require('express-validator');

exports.signUpValidator = [
  body('firstname')
    .isAlpha()
    .withMessage('First name must be only alphabetical chars'),
  body('lastname')
    .isAlpha()
    .withMessage('Last name must be only alphabetical chars'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password should not be empty, minimum eight characters')
  ]


exports.validateErrors = (req, res, next) => {
  var errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.render('signup',{error:errors.array()});
    } else {
      next();
    }
};
