const mongoose = require("mongoose");
const PLM = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true,
  }
});


userSchema.plugin(PLM);
const user = mongoose.model("user", userSchema);
module.exports = user;
