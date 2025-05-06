const mongoose = require("mongoose");
const review = require("./review");

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingImage",
    },
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  category: {
    type: [String],
    enum: ["mountain", "miver", "forest", "beach", "desert", "city", "village"],
    default: [],
  },
});

// middleware to delete all reviews of listing
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
