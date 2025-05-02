// middleware for user authentaction
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.preUrl = req.originalUrl;
    req.flash("error", "Login first");
    return res.redirect("/user/login");
  }
  next();
};

const preUrl = (req, res, next) => {
  res.locals.preUrl = req.session.preUrl;
  next();
};

module.exports = { isAuthenticated, preUrl };
