// basic template
const express = require("express");
const router = express.Router({ mergeParams: true });

// calling utlis
const wrapAsync = require("../utils/wrapAsync.js");

// calling middleawres
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");
const isAuthor = require("../middlewares/isAuthor.js");

// middleware for schema validatoin at backend
const joiValidateReview = require("../middlewares/joiValidateReview.js");

const controller = require("../controllers/review.js");
router.post(
  "/",
  isAuthenticated,
  joiValidateReview,
  wrapAsync(controller.postReview)
);

// deleting review
router.delete(
  "/:Rid",
  isAuthenticated,
  isAuthor,
  wrapAsync(controller.deleteReview)
);

module.exports = router;
