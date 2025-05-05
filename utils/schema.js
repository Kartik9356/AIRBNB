const joi = require("joi");

const listingSchema = joi.object({
  listings: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      location: joi.string().required(),
      country: joi.string().required(),
    })
    .required(),
});

const reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});

const userSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
});

module.exports = { listingSchema, reviewSchema, userSchema };
