const { listingSchema } = require("../utils/schema.js");

function joiValidateListing(req, res, next) {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      next(new expressError(403, error.details[0].message));
    } else {
      next();
    }
  }

  module.exports = joiValidateListing