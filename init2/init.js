const mongoose= require("mongoose")
const listing = require("../models/listing.js")
const data= require("./listing.js")

// calling mongoose to connect server
async function mongoCall() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AIRBNB");
  } catch (err) {
    console.log("hello");
  }
}
mongoCall();

async function add(data) {
  await listing.insertMany(data)
}
add(data)