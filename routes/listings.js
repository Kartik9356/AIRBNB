// basic template
const express = require("express");
const router = express.Router();

// calling utlis
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../utils/schema.js");

// calling mongooes models and their mongoose middlewares
const  listing  = require("../models/listing.js");
const review = require("../models/review.js");

// middleware for schema validatoin at backend
function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    next(new expressError(403, error.details[0].message));
  } else {
    next();
  }
}

// routs with /listing + following routs
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    let data = await listing.find({});
    res.render("./listings/listings", { data });
  })
);


// adding data
router.get("/create", (req, res) => {
  res.render("./listings/new");
});

router.post(
  "/create",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let data = listings(req.body.listings);
    await data.save();
    res.redirect("/");
  })
);

// show rout
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let data = await listing.findById(req.params.id).populate("reviews");
    if (!data) {
      next(new expressError(400, "Enter valid data"));
    }
    res.render("./listings/show", { data });
  })
);

// editing data
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    let data = await listing.findById(req.params.id);
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    res.render("./listings/edit", { data });
  })
);

router.patch(
  "/:id/edit",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let data = await listing.findByIdAndUpdate(req.params.id, {
      ...req.body.listings,
    });
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    res.redirect(`./listings/${req.params.id}`);
  })
);

// deleting listing
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let data = await listing.findOneAndDelete({ _id: req.params.id });
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    res.redirect("/");
  })
);

module.exports = router