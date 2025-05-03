const mongoose = require("mongoose");

const reviewSchema= mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    comment:String,
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    creator:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }
})

const review= mongoose.model("review",reviewSchema)

module.exports= review;