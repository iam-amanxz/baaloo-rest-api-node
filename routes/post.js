const express = require("express");
const PostController = require("../controllers/PostController");

const router = express.Router();

router.get("/my-posts", PostController.myAllPosts);
router.get("/", PostController.allPosts);
router.get("/:id", PostController.post);
router.post("/", PostController.createPost);
// router.put("/:id", PostController.updatePost);
router.delete("/:id", PostController.deletePost);

module.exports = router;
