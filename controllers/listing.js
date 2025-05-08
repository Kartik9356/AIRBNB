const listing = require("../models/listing.js");
const review = require("../models/review.js");
const user = require("../models/user.js");
const expressError = require("../utils/expressError.js");

module.exports.showListings = async (req, res, next) => {
  let data = await listing.find({});
  res.render("./listings/index", { data });
};

module.exports.postCreate = async (req, res, next) => {
  let data = new listing(req.body.listings);
  data.owner = req.user._id;
  data.image.url = req.file.path;
  data.image.filename = req.file.originalname;
  let lister = await user.findById(req.user._id);
  lister.listings.push(data);
  await lister.save();
  await data.save();
  req.flash("sucess", "Your listing added sucessfully");
  res.redirect("/listing");
};

module.exports.individualListing = async (req, res, next) => {
  let data = await listing
    .findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "creator" },
    })
    .populate("owner");
  res.locals.listing = data;
  if (!data) {
    req.flash("error", "Listing not found");
    res.redirect("/listing");
  }
  let more = await listing.find({
    country: { $regex: new RegExp(data.country, "i") }, // "i" makes it case-insensitive
  });
  res.render("./listings/show", { data,more });
};

module.exports.renderEditListingForm = async (req, res, next) => {
  let data = await listing.findById(req.params.id);
  if (!data) {
    req.flash("error", "Listing not found");
    res.redirect("/listing");
  }
  res.render("./listings/edit", { data });
};

module.exports.updateListing = async (req, res, next) => {
  // let data = await listing.findByIdAndUpdate(req.params.id, {
  //   ...req.body.listings  });
  let { title, description, price, country, location, category } =
    req.body.listings;
  let data = await listing.findById(req.params.id);
  if (data) {
    data.title = title;
    data.description = description;
    data.price = price;
    data.country = country;
    data.location = location;
    if (req.file) {
      data.image.url = req.file.path;
      data.image.filename = req.file.originalname;
    }
    if (category) {
      data.category = category;
    }
    await data.save();
  } else {
    next(new expressError(400, "data not found"));
  }
  req.flash("sucess", "LIsting information edited sucessfully");
  res.redirect(`/listing/${req.params.id}`);
};

module.exports.deleteListing = async (req, res, next) => {
  let data = await listing.findOneAndDelete({ _id: req.params.id });
  if (!data) {
    next(new expressError(400, "data not found"));
  }
  await review.deleteMany({ _id: { $in: data._id.reviews } });
  await user.updateOne(
    { _id: req.user._id }, // Assuming `owner` is the field linking the listing to a user
    { $pull: { listings: data._id } }
  );
  req.flash("sucess", "Listing deleted sucessfully");
  res.redirect("/listing");
};
