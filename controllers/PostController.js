const Post = require("../models/PostModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middleware/jwt");
var mongoose = require("mongoose");
const PostModel = require("../models/PostModel");
mongoose.set("useFindAndModify", false);

// Post Schema
function PostData(data) {
  this.id = data._id;
  this.title = data.title;
  this.description = data.description;
  this.startingPrice = data.startingPrice;
  this.endingAt = data.endingAt;
  this.bids = data.bids;
  this.photos = data.photos;
  this.district = data.district;
  this.city = data.city;
  this.phone = data.phone;
  this.email = data.email;
  this.condition = data.condition;
  this.status = data.status;
  this.createdAt = data.createdAt;
  this.updatedAt = data.updatedAt;
  this.owner = data.owner;
}

exports.allPosts = [
  function (req, res) {
    try {
      Post.find().then((posts) => {
        if (posts.length > 0) {
          return apiResponse.successResponseWithData(res, "success", posts);
        } else {
          return apiResponse.successResponseWithData(res, "success", []);
        }
      });
    } catch (e) {
      return apiResponse.ErrorResponse(res, e);
    }
  },
];

exports.post = [
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.successResponseWithData(res, "success", {});
    }

    try {
      Post.findOne({ _id: req.params.id }).then((post) => {
        if (post !== null) {
          let postData = new PostData(post);
          return apiResponse.successResponseWithData(res, "success", postData);
        } else {
          return apiResponse.notFoundResponse(res, "record not found");
        }
      });
    } catch (e) {
      return apiResponse.ErrorResponse(res, e);
    }
  },
];

exports.myAllPosts = [
  auth,
  function (req, res) {
    try {
      Post.find({ owner: req.user._id }).then((posts) => {
        if (posts.length > 0) {
          return apiResponse.successResponseWithData(res, "success", posts);
        } else {
          return apiResponse.notFoundResponse(res, "records not found");
        }
      });
    } catch (e) {
      return apiResponse.ErrorResponse(res, e);
    }
  },
];

exports.createPost = [
  auth,
  body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
  body("description", "Description must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("startingPrice", "Starting Price must not be empty")
    .isLength({ min: 1 })
    .trim(),
  body("endingAt", "Ending Date must not be empty"),
  body("photos", "Photos must not be empty").isLength({ min: 1 }).trim(),
  body("phone", "Phone number must not be empty"),
  body("district", "District number must not be empty"),

  sanitizeBody("*").escape(),

  (req, res) => {
    try {
      const errors = validationResult(req);
      const post = new PostModel({
        title: req.body.title,
        description: req.body.description,
        startingPrice: req.body.startingPrice,
        condition: req.body.condition,
        endingAt: req.body.endingAt,
        bids: req.body.bids,
        status: req.body.status,
        photos: req.body.photos,
        owner: req.user,
        phone: req.body.phone,
        email: req.body.email,
        district: req.body.district,
        city: req.body.city,
      });

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        post.save(function (e) {
          if (e) {
            return apiResponse.ErrorResponse(res, e);
          }
          const postData = new PostData(post);
          return apiResponse.successResponseWithData(
            res,
            "Post add Success.",
            postData
          );
        });
      }
    } catch (e) {
      return apiResponse.ErrorResponse(res, e);
    }
  },
];

exports.updatePost = [];

exports.deletePost = [
  auth,
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }

    try {
      Post.findById(req.params.id, (e, foundPost) => {
        if (foundPost === null) {
          return apiResponse.notFoundResponse(res, "record not found");
        } else {
          if (foundPost.owner.toString() !== req.user._id) {
            return apiResponse.unauthorizedResponse(
              res,
              "You are not authorized to do this operation."
            );
          } else {
            Post.findByIdAndRemove(req.params.id, function (e) {
              if (e) {
                return apiResponse.ErrorResponse(res, e);
              } else {
                return apiResponse.successResponse(res, "Post delete Success.");
              }
            });
          }
        }
      });
    } catch (e) {
      return apiResponse.ErrorResponse(res, e);
    }
  },
];
