const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { userSchema } = require("../utils/schema.js");

// mongoose model
const user = require("../models/user.js");

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
  validateUser,
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

module.exports = router;
// user creation rout
// app.get("/demo",async(req,res,next)=>{
//     const userObject = new user({
//       email:"kartik@gmail.com",
//       username:"kartik103",
//     })
//     const newUser = await user.register(userObject,"password")
//     console.log(newUser);
//     res.send(newUser);
//   })
