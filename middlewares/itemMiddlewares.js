const { check,validationResult } = require('express-validator');

exports.itemValidator = [
  check('itemCode')
    .isAlphanumeric()
    .isLength(24)
    .withMessage('Invalid item code'),
  ]


exports.validateErrors = (req, res, next) => {
  var errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.render('error',{error:errors.array()[0].msg});
    } else {
      next();
    }
};
