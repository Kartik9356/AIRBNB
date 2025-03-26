// basic template
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methoodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methoodOverride("_method"));


// calling mongooes models
const listings = require("./models/listings.js");

// calling mongoose to connect server
function mongoCall() {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/AIRBNB");
  } catch (err) {
    console.log(
      "Error in mongoCall function while connectiong mongoose server"
    );
  }
}
mongoCall();



// routs

app.get("/", async (req, res) => {
  console.log("HIT '/'");
  let data = await listings.find({});
  // console.log(data)
  res.render("./listings/index", { data });
});

// show rout
app.get("/show/:id", async (req, res) => {
  console.log("HIT '/show'");
  let data = await listings.findById(req.params.id);
  res.render("./listings/show", { data });
});

// adding data
app.get("/listings/create", (req, res) => {
  res.render("./listings/new");
});

app.post("/listings/create", async (req, res) => {
  console.log(req.body.listings);
  let data = listings(req.body.listings);
  data.save();  
  res.redirect("/");
});

// editing data
app.get("/listings/:id/edit", async (req, res) => {
  console.log("HIT : /listings:id/edit");
  let data = await listings.findById(req.params.id);
  res.render("./listings/edit", { data });
});

app.patch("/listings/:id/edit", async (req, res) => {
  console.log("HIT  patch: /listings:id/edit");
  // let data=req.body.listings
  // console.log(data)
  let data = await listings.findByIdAndUpdate(req.params.id,{...req.body.listings})
  // res.send(` listing data is ${data}`);
  res.redirect(`/${req.params.id}`)
});


// deleting listing
app.delete("/listing/:id",async(req,res)=>{
  let data= await listings.findByIdAndDelete(req.params.id)
  res.redirect("/")
})


















// trigring server
app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});   
      