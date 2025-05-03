const mongoose = require("mongoose");
const review = require("./review");

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://marketplace.canva.com/EAGYna2-QZ8/1/0/1600w/canva-brown-and-black-minimalist-hotel-presentation-SqQPhkMUHTQ.jpg",
    set: (v) =>
      v == ""
        ? "https://marketplace.canva.com/EAGYna2-QZ8/1/0/1600w/canva-brown-and-black-minimalist-hotel-presentation-SqQPhkMUHTQ.jpg"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  owner: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
});

// middleware to delete all reviews of listing
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("listing", listingSchema);

module.exports =  listing ;
