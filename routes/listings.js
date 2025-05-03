// basic template
const express = require("express");
const router = express.Router();

// calling utlis
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../utils/schema.js");

// calling middleawres
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");

// calling mongooes models and their mongoose middlewares
const listing = require("../models/listing.js");
const user = require("../models/user.js")
const review = require("../models/review.js");

// middlewares
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
router.get("/create", isAuthenticated, (req, res) => {
  res.render("./listings/new");
});

router.post(
  "/create",
  isAuthenticated,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let data = new listing(req.body.listings);
    data.owner= req.user._id;
    let lister= await user.findById(req.user._id)
    lister.listings.push(data)
    await lister.save()
    await data.save();
    req.flash("sucess", "Your listing added sucessfully");
    res.redirect("/listing");
  })
);

// show rout
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let data = await listing.findById(req.params.id).populate("reviews");
    if (!data) {
      req.flash("error", "Listing not found");
      res.redirect("/listing");
    }

    res.render("./listings/show", { data });
  })
);

// editing data
router.get(
  "/:id/edit",
  isAuthenticated,
  wrapAsync(async (req, res, next) => {
    let data = await listing.findById(req.params.id);
    if (!data) {
      req.flash("error", "Listing not found");
      res.redirect("/listing");
    }
    res.render("./listings/edit", { data });
  })
);

router.patch(
  "/:id/edit",
  isAuthenticated,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let data = await listing.findByIdAndUpdate(req.params.id, {
      ...req.body.listings,
    });
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    req.flash("sucess", "LIsting information edited sucessfully");
    res.redirect(`/listing/${req.params.id}`);
  })
);

// deleting listing
router.delete(
  "/:id",
  isAuthenticated,
  wrapAsync(async (req, res, next) => {
    let data = await listing.findOneAndDelete({ _id: req.params.id });
    if (!data) {
      next(new expressError(400, "data not found"));
    }
    req.flash("sucess", "Listing deleted sucessfully");
    res.redirect("/listing");
  })
);

module.exports = router;
