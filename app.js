// basic template
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methoodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methoodOverride("_method"));

app.engine("ejs", ejsMate);

// sesion middleware
app.use(
  session({
    secret: "kartik",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 5 * 24 * 60 * 60 * 1000,
      maxAge: 5 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(flash());

// calling routes
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

// calling mongooes models and their mongoose middlewares
const listing = require("./models/listing.js");
const review = require("./models/review.js");

// calling utlis
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./utils/schema.js");

// calling mongoose to connect server
function mongoCall() {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/AIRBNB");
  } catch (err) {
    console.log(
      "Error in mongoCall function while connectiong mongoose server"
    );
  }
}
mongoCall();

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
  next();
});

// routs

app.get(
  "/",
  wrapAsync(async (req, res, next) => {
    res.render("./listings/index");
  })
);

// listings rout
app.use("/listing", listings);

// adding review
app.use("/listing/:id/review", reviews);

// rout to handle non-existing url's
app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found"));
});

// error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  // res.status(status).send(message)
  res.status(status).render("./listings/error", { status, message });
  next(err);
});

// trigring server
app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
