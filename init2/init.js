const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const user = require("../models/user.js");
const data = require("./listing.js");

// calling mongoose to connect server
async function mongoCall() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AIRBNB");
  } catch (err) {
    console.log("hello");
  }
}
mongoCall();

for (const kay in data) {
  const element = data[kay];
  element.owner = "68183fe483c31949d7ceefd8";
  add(element);
}

async function add(data) {
  let ldata = await listing.insertOne(data);
  let userdata = await user.findOne({ username: "kartik" });
  userdata.listings.push(ldata._id);
  await userdata.save()
  console.log(data);
}
