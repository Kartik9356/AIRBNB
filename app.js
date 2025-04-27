// basic template
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methoodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methoodOverride("_method"));

app.engine("ejs", ejsMate);

// calling mongooes models and their mongoose middlewares
const  listing  = require("./models/listing.js");
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

// middleware for schema validatoin at backend
function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    next(new expressError(403, error.details[0].message));
  } else {
    next();
  }
}

function validateReview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    next(new expressError(403, error.details[0].message));
  } else {
    next();
  }
}

// routs

app.get(
  "/",
  wrapAsync(async (req, res, next) => {
    res.render("./listings/index");
  })
);

// listings rout
app.get(
  "/listing",
  wrapAsync(async (req, res, next) => {
    console.log("HIT '/'");
    let data = await listing.find({});
    res.render("./listings/listings", { data });
  })
);


// adding data
app.get("/listing/create", (req, res) => {
  res.render("./listings/new");
});

app.post(
  "/listing/create",
  validateListing,
  wrapAsync(async (req, res, next) => {
    console.log(req.body.listings);
    let data = listings(req.body.listings);
    await data.save();
    res.redirect("/");
  })
);

// show rout
app.get(
  "/listing/:id",
  wrapAsync(async (req, res, next) => {
    console.log("HIT '/listing'");
    let data = await listing.findById(req.params.id).populate("reviews");
    if (!data) {
      next(new expressError(400, "Enter valid data"));
    }
    res.render("./listings/show", { data });
  })
);

// editing data
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res, next) => {
    console.log("HIT : /listings:id/edit");
    let data = await listing.findById(req.params.id);
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    res.render("./listings/edit", { data });
  })
);

app.patch(
  "/listing/:id/edit",
  validateListing,
  wrapAsync(async (req, res, next) => {
    console.log("HIT  patch: /listing:id/edit");
    let data = await listing.findByIdAndUpdate(req.params.id, {
      ...req.body.listings,
    });
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    res.redirect(`/listing/${req.params.id}`);
  })
);

// deleting listing
app.delete(
  "/listing/:id",
  wrapAsync(async (req, res, next) => {
    let data = await listing.findOneAndDelete({ _id: req.params.id });
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    res.redirect("/");
  })
);

// adding review
app.post(
  "/listing/:id/review",
  validateReview,
  wrapAsync(async (req, res, next) => {
    let list = await listing.findOne({ _id: req.params.id });

    let data = await review.create(req.body.review);

    list.reviews.push(data);
    list = await list.save();
    res.redirect(`/listing/${req.params.id}`);
  })
);

// deleting review
app.delete(
  "/listing/:Lid/review/:Rid",
  wrapAsync(async (req, res, next) => {
    let { Lid, Rid } = req.params;
    let rev = await review.findByIdAndDelete(Rid);
    let data = await listing.findByIdAndUpdate(Lid, {
      $pull: { reviews: Rid },
    });
    console.log(rev, data);
    res.redirect(`/listing/${Lid}`);
  })
);

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
