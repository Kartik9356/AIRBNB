const { userSchema } = require("../utils/schema.js");


function validateUser(req, res, next) {
    let { error } = userSchema.validate(req.body);
    if (error) {
      req.flash("error", error.message);
      res.redirect("/user/signup");
    } else {
      next();
    }
  }

  module.exports= validateUser