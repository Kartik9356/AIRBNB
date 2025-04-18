const mongoose = require("mongoose");

const schema = mongoose.Schema({
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
        price: String,
        location: String,
        country: String,  
});

module.exports = mongoose.model("listings",schema)