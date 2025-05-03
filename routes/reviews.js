// basic template
const express = require("express");
const router = express.Router({ mergeParams: true });

// calling utlis
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../utils/schema.js");

// calling middleawres
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");
const isAuthor = require("../middlewares/isAuthor.js");

// calling mongooes models and their mongoose middlewares
const listing = require("../models/listing.js");
const review = require("../models/review.js");

// middleware for schema validatoin at backend
function validateReview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    next(new expressError(403, error.details[0].message));
  } else {
    next();
  }
}

router.post(
  "/",
  isAuthenticated,
  validateReview,
  wrapAsync(async (req, res, next) => {
    let list = await listing.findOne({ _id: req.params.id });
    let data = new review(req.body.review);
    data.creator = req.user._id;
    list.reviews.push(data);
    data = await data.save();
    list = await list.save();
    if (list && data) {
      req.flash("sucess", "Review added sucessfully");
    } else {
      req.flash("error", "Review not added");
    }
    res.redirect(`/listing/${req.params.id}`);
  })
);

// deleting review
router.delete(
  "/:Rid",
  isAuthenticated,
  isAuthor,
  wrapAsync(async (req, res, next) => {
    let { id, Rid } = req.params;
    let rev = await review.findByIdAndDelete(Rid);
    let data = await listing.findByIdAndUpdate(id, {
      $pull: { reviews: Rid },
    });
    if (data) {
      req.flash("sucess", "Review deleted sucessfully");
    } else {
      req.flash("error", "Review not deleted");
    }
    res.redirect(`/listing/${id}`);
  })
);

module.exports = router;
