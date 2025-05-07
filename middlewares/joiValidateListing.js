const { listingSchema } = require("../utils/schema.js");
const expressError = require("../utils/expressError.js")

function joiValidateListing(req, res, next) {
   console.log(req.body)
    let { error } = listingSchema.validate(req.body);
    if (error) {
      console.log(error)
      next(new expressError(403, error.details[0].message));
    } else {
      next();
    }
  }

  module.exports = joiValidateListing