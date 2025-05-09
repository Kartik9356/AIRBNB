const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const user = require("../models/user.js");
const data = require("./listing.js");

// calling mongoose to connect server
async function mongoCall() {
  try {
    await mongoose.connect("mongodb+srv://biradarkartik690:tC9RMUg0jwZH9zZn@airbnb.a5iwa0v.mongodb.net/?retryWrites=true&w=majority&appName=AIRBNB");
  } catch (err) {
    console.log("unable to connect database");
  }
}
mongoCall();

for (const kay in data) {
  const element = data[kay];
  element.owner = "681d7beda24fbc9255e78b25";
  add(element);
}

async function add(data) {
  let ldata = await listing.create(data);
  let userdata = await user.findOne({ username: "kartik" });
  userdata.listings.push(ldata._id);
  await userdata.save()
  console.log(data);
}
