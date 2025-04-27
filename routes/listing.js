const express = require("express");
const router = express.Router();

// calling utlis
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../utils/schema.js");
const { listing } = require("../models/listing.js");

// middleware for schema validatoin at backend
function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    next(new expressError(403, error.details[0].message));
  } else {
    next();
  }
}

// listings rout
router.get(
  "/listing",
  wrapAsync(async (req, res, next) => {
    console.log("HIT home rout");
    let data = await listing.find({});
    res.render("./listings/listings.ejs", { data });
  })
);

// show rout
router.get(
  "/listing/:id",
  wrapAsync(async (req, res, next) => {
    let data = await listing.findById(req.params.id).populate("reviews");
    if (!data) {
      next(new expressError(400, "Enter valid data"));
    }
    res.render("./listing/show", { data });
  })
);

// adding data
router.get("/listing/create", (req, res) => {
  res.render("./listings/new");
});

router.post(
  "/listing/create",
  validateListing,
  wrapAsync(async (req, res, next) => {
    console.log(req.body.listings);
    let data = listings(req.body.listings);
    await data.save();
    res.redirect("/");
  })
);

// editing data
router.get(
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

router.patch(
  "/listing/:id/edit",
  validateListing,
  wrapAsync(async (req, res, next) => {
    console.log("HIT  patch: /listings:id/edit");
    let data = await listing.findByIdAndUpdate(req.params.id, {
      ...req.body.listings,
    });
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    res.redirect(`/show/${req.params.id}`);
  })
);

// deleting listing
router.delete(
  "/listing/:id",
  wrapAsync(async (req, res, next) => {
    let data = await listing.findOneAndDelete({ _id: req.params.id });
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    res.redirect("/");
  })
);

module.exports = router;
