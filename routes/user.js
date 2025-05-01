const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { userSchema } = require("../utils/schema.js");

// mongoose model
const user = require("../models/user.js");
const expressError = require("../utils/expressError.js");

// middleware for schema validatoin at backend
function validateUser(req, res, next) {
  let { error } = userSchema.validate(req.body);
  if (error) {
    req.flash("error", "Enter required information");
    res.redirect("/user/register");
  } else {
    next();
  }
}

// user creation rout
router.get("/login", (req, res, next) => {
  res.render("./user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  async (req, res, next) => {
    req.flash("sucess", "wellcome to AIR-BNB");
    res.redirect("/listing");
  }
);

router.get("/register", (req, res, next) => {
  res.render("./user/register");
});

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
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
      res.redirect("/user/login");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/user/register");
    }
  })
);

router.get("/logout", (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(new expressError(403, error.details[0].message));
    }
    req.flash("sucess", "You loged out sucessfully");
    res.redirect("/listing");
  });
});

module.exports = router;
