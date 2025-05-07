const mongoose = require("mongoose");
const PLM = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true,
  },
  listings:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"listing"
    },
  ],
  number:String
});


userSchema.plugin(PLM);
const user = mongoose.model("user", userSchema);
module.exports = user;
