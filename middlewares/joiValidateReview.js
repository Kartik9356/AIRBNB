const { reviewSchema } = require("../utils/schema.js");
const expressError = require("../utils/expressError.js");


function joiValidateReview(req, res, next) {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      next(new expressError(403, error.details[0].message));
    } else {
      next();
    }
  }

  module.exports = joiValidateReview