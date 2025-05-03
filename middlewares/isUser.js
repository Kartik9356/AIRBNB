const expressError = require("../utils/expressError");
const listing = require("../models/listing.js");

async function isUser(req, res, next) {
  let data = await listing.findById(req.params.id);
  if (data.owner.toString() == req.user._id.toString()) {
    return next();
  } else {
    return next(new expressError("404", "access denied"));
  }
}

module.exports = isUser;
