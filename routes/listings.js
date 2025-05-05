// basic template
const multer = require("multer")
const express = require("express");
const router = express.Router();
require("dotenv").config();
// calling utlis
const wrapAsync = require("../utils/wrapAsync.js");

// calling middleawres
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");
const isUser = require("../middlewares/isUser.js");
const joiValidateListing = require("../middlewares/joiValidateListing.js");
const {cloudinary,storage} = require("../cloudConflig.js")
const upload = multer({storage})


// routs with /listing + following routs
const controller = require("../controllers/listing.js");

router.get("/", wrapAsync(controller.showListings));

// adding data
router
  .route("/create")
  .get(isAuthenticated, (req, res) => {
    res.render("./listings/new");
  })
  .post(isAuthenticated,upload.single("listings[image]"), joiValidateListing, wrapAsync(controller.postCreate));
  // .post(upload.single("listings[image]"),(req,res,next)=>{
  //    res.send(req.file)
  // })

// show rout
// deleting listing
router
  .route("/:id")
  .get(wrapAsync(controller.individualListing))
  .delete(isAuthenticated, isUser, wrapAsync(controller.deleteListing));

// editing data
router
  .route("/:id/edit")
  .get(isAuthenticated, isUser, wrapAsync(controller.renderEditListingForm))
  .patch(
    isAuthenticated,
    isUser,
    joiValidateListing,
    wrapAsync(controller.updateListing)
  );

module.exports = router;
