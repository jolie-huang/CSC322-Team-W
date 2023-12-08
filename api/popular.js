const express = require("express");
const router = express.Router();
const PostModel = require("../models/PostModel");
const {
  newReportPostSurferNotification,
} = require("../utilsServer/notificationActions");
const uuid = require("uuid").v4;

// Get the most liked posts in the database. Update posts which fall under the
// conditions constituting a trendy post:
// more than 10 reads and a greater difference between likes and dislikes than 3
router.get("/", async (req, res) => {
  try {
    const mostLikedPosts = await PostModel.find()
      .sort({ likesCount: -1 })
      .limit(3)
      .populate("user")
      .populate("comments.user");

    if (mostLikedPosts.length === 0) {
      return res.json([]);
    }

    // Update post type to "Trendy" based on conditions
    for (const post of mostLikedPosts) {
      const shouldUpdateType =
        post.reads.length > 10 && post.likesCount - post.dislikesCount > 3;

      if (shouldUpdateType && post.kind !== "Trendy") {
        await PostModel.findByIdAndUpdate(post._id, { kind: "Trendy" });
      }
    }

    return res.json(mostLikedPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Reporting a post and sending notification to the posts owner
router.post("/report/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, postOwnerUserId } = req.body;

    // Cant submit report if the description is empty and if there is no post to report
    if (text.length < 1)
      return res.status(401).send("Report should be at least one character!");

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found!");
    }

    // Create new report
    const newReport = {
      _id: uuid(),
      text,
      user: null,
      date: Date.now(),
    };

    await post.reports.unshift(newReport);
    await PostModel.findByIdAndUpdate(postId, { $inc: { reportsCount: 1 } });
    await post.save();

    // Create new report notification if reporter is surfer
    await newReportPostSurferNotification(
      postId,
      newReport._id,
      post.user.toString(),
      text
    );

    return res.status(200).json(newReport._id);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

module.exports = router;
