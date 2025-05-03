const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { preUrl } = require("../middlewares/isAuthenticated.js");

// mongoose model

// middleware for schema validatoin at backend
const joiValidateUser = require("../middlewares/joiValidateuser.js");
const controller = require("../controllers/user.js");

// user creation rout
router
  .route("/login")
  .get((req, res, next) => {
    res.render("./user/login");
  })
  .post(
    preUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/user/login",
    }),
    wrapAsync(controller.postLogin)
  );

router
  .route("/signup")
  .get((req, res, next) => {
    res.render("./user/signup");
  })
  .post(joiValidateUser, wrapAsync(controller.postSignUp));

router.get("/logout", controller.logout);

module.exports = router;
