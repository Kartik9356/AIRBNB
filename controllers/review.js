const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.postReview = async (req, res, next) => {
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
};

module.exports.deleteReview = async (req, res, next) => {
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
};
