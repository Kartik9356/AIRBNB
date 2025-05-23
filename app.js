// basic template
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methoodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
require("dotenv").config();


// calling routes
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// calling mongooes models and their mongoose middlewares
const listing = require("./models/listing.js");
const review = require("./models/review.js");
const user = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methoodOverride("_method"));

app.engine("ejs", ejsMate);


// const DBURL = "mongodb://localhost:27017/AIRBNB";
// calling mongoose to connect server
async function mongoCall() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (err) {
    return new expressError(500, "Database not found");
  }
}
mongoCall();

// sesion middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    }),
  })
);
app.use(flash());

// implementing session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// calling utlis
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./utils/schema.js");


// middlewares
// middleware to get HIT
app.use((req, res, next) => {
  console.log("HIT : ", req.originalUrl);
  next();
});

// middlewaer for flash message
app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.currUser);
  next();
});

// routs

app.get(
  "/",
  wrapAsync(async (req, res, next) => {
    let data = await listing.find({});
    res.render("./listings/index", { data });
  })
);

// listings rout
app.use("/listing", listingRouter);

// adding review
app.use("/listing/:id/review", reviewRouter);

// user routs
app.use("/user", userRouter);

// rout to handle non-existing url's
app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found"));
});

// error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  res.status(status).render("./listings/error", { status, message });
  next(err);
});

// trigring server
app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
