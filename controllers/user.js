const user = require("../models/user.js");
const expressError = require("../utils/expressError.js");

module.exports.postLogin=async (req, res, next) => {
    req.flash("sucess", "wellcome to AIR-BNB");
    if (res.locals.preUrl) {
      res.redirect(`${res.locals.preUrl}`);
    } else {
      res.redirect("/listing");
    }
  }

  module.exports.postSignUp=async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const userObject = new user({
        email,
        username,
      });
      const newUser = await user.register(userObject, password);
      if (newUser) {
        req.flash("sucess", "Registerd sucessfully, Login now");
      }
      req.login(newUser, (err) => {
        if (err) {
          return next(new expressError(500, err)); // ✅ Wraps the error in your custom handler
        }
        res.redirect("/listing");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/user/signup");
    }
  }

  module.exports.logout=(req, res, next) => {
    req.logOut((error) => {
      if (error) {
        return next(new expressError(403, error.details[0].message));
      }
      req.flash("sucess", "You loged out sucessfully");
      res.redirect("/listing");
    });
  }