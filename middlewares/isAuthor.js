const expressError = require("../utils/expressError");
const review = require("../models/review.js");

async function isAuthor(req, res, next) {
  let data = await review.findById(req.params.Rid);
  if (data.creator.toString() == req.user._id.toString()) {
    return next();
  } else {
    return next(new expressError("401", "access denied"));
  }
console.log(data)
next()
}

module.exports = isAuthor;
