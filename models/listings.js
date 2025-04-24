const mongoose = require("mongoose");
const { type } = require("../utils/schema");

const reviewSchema = mongoose.Schema({
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
  reviews:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"review"
    }
  ]
});

module.exports = mongoose.model("listings", reviewSchema);
