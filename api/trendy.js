const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const FollowerModel = require("../models/FollowerModel");
const uuid = require("uuid").v4;
const {
  newLikeNotification,
  newDisLikeNotification,
  removeLikeNotification,
  removeDisLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newReportPostNotification,
  newReadNotification,
} = require("../utilsServer/notificationActions");
const tabooWords = require("../utils/tabooWords");

router.post("/", authMiddleware, async (req, res) => {
  try {
    let { text } = req.body;
    const { location, company, type, keywords, picUrl } = req.body;

    const user = await UserModel.findById(req.userId);
    const role = user.role;

    // function to count the number of taboowords in the users post
    function countTabooWords() {
      // variable to count the number of taboo words
      let count = 0;

      // variable to get all the words in the users text
      let textWords = text.split(" ");

      // iterate through all textWords
      for (let i = 0; i < textWords.length; i++) {
        if (tabooWords.includes(textWords[i])) {
          count++;
        }
      }
      return count;
    }

    // function to replace taboowords with ****
    function censorTabooWords() {
      //variable to be the new text
      let newText = "";

      // variable to get all the words in the users text
      let textWords = text.split(" ");

      // iterate through all textWords
      for (let i = 0; i < textWords.length; i++) {
        if (tabooWords.includes(textWords[i])) {
          let lenOfTabooWord = textWords[i].length;
          let stars = "";

          // get the appropriate number of stars
          for (let j = 0; j < lenOfTabooWord; j++) {
            stars += "*";
          }
          textWords[i] = stars;
        }
      }
      newText = textWords.join(" ");

      return newText;
    }

    // variable to store the number of taboowords the user has
    let taboowords = countTabooWords();

    // checking the number of taboowords the user has
    if (taboowords >= 3) {
      return res.status(401).send("Post cannot have more than 3 taboo words!");
    }

    if (text.length < 1) {
      return res.status(401).send("Text must be at least one character!");
    }

    if (!keywords[keywords.length - 1]) {
      return res.status(401).send("Please select at least one keyword!");
    }

    // replace text with the censored version
    text = censorTabooWords();

    const newPost = {
      user: req.userId,
      text,
    };

    // Set post attributes
    if (location) {
      newPost.location = location;
    }

    if (company) {
      newPost.company = company;
    }

    if (type) {
      newPost.type = type;
    }

    if (keywords[keywords.length - 1]) {
      newPost.keywords = keywords[keywords.length - 1];
    }

    if (picUrl) {
      newPost.picUrl = picUrl;
    }

    const post = await new PostModel(newPost).save();

    const postCreated = await PostModel.findById(post._id).populate("user");

    return res.json(postCreated);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// route to only show trendy posts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trendyPosts = await PostModel.find({ kind: "Trendy" })
      .sort({ likesCount: -1 })
      .populate("user")
      .populate("comments.user");

    if (trendyPosts.length === 0) {
      return res.json([]);
    }

    // Update post type to "Trendy" based on conditions
    for (const post of trendyPosts) {
      const shouldUpdateType =
        post.reads.length > 10 && post.likesCount - post.dislikesCount > 3;

      if (shouldUpdateType && post.kind !== "Trendy") {
        await PostModel.findByIdAndUpdate(post._id, { kind: "Trendy" });
      }
    }

    return res.json(trendyPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate("user")
      .populate("comments.user");

    if (!post) {
      return res.status(404).send("Post not found!");
    }

    // Update post type to "Trendy" based on conditions
    const shouldUpdateType =
      post.reads.length > 10 && post.likesCount - post.dislikesCount > 3;

    if (shouldUpdateType && post.kind !== "Trendy") {
      await PostModel.findByIdAndUpdate(post._id, { kind: "Trendy" });
    }

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Delete post
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    // Find the post, if post not found then return error
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found!");
    }

    // Find the user trying to delete post
    const user = await UserModel.findById(userId);

    // Only allow post to be deleted if the user trying to delete is owner of post or super user
    if (post.user.toString() !== userId) {
      if (user.role === "Super") {
        await post.remove();
        return res.status(200).send("Post deleted Successfully!");
      } else {
        return res.status(401).send("Unauthorized!");
      }
    }

    await post.remove();
    return res.status(200).send("Post deleted Successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Dynamic Route with postId.
// Method: POST
// Middleware: authMiddleware
router.post("/like/:postId", authMiddleware, async (req, res) => {
  try {
    // Extract postId and userId from request parameters and user information.
    const { postId } = req.params;
    const { userId } = req;

    // Find the post in the database based on postId.
    const post = await PostModel.findById(postId);

    // Check if the post exists.
    if (!post) {
      // If no post is found, return a 404 response.
      return res.status(404).send("No Post found!");
    }

    // Check if the user has already liked the post.
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length > 0;

    // If the user has already liked the post, return a 401 response.
    if (isLiked) {
      return res.status(401).send("Post already liked!");
    }

    // Check if the user has already disliked the post.
    const isDisLiked =
      post.dislikes.filter((dislike) => dislike.user.toString() === userId)
        .length > 0;

    // If the user has already disliked the post, remove the dislike.
    if (isDisLiked) {
      post.dislikes = post.dislikes.filter(
        (dislike) => dislike.user.toString() !== userId
      );

      post.dislikesCount--;
      post.likesCount++;

      // Save the updated post without the dislike.
      await post.save();

      // Add a new like to the post.
      await post.likes.unshift({ user: userId });

      // Save the updated post with the new like.
      await post.save();

      // Check if the user liking the post is not the post owner.
      if (post.user.toString() !== userId) {
        // If true, send a new like notification to the post owner.
        await newLikeNotification(userId, postId, post.user.toString());
      }

      // Return a 200 response indicating that the post has been liked successfully.
      return res.status(200).send("Post liked!");
    }

    // If the user hasn't liked and disliked the post, add a new like to the post.
    await post.likes.unshift({ user: userId });
    post.likesCount++;

    // Save the updated post with the new like.
    await post.save();

    // Check if the user liking the post is not the post owner.
    if (post.user.toString() !== userId) {
      // If true, send a new like notification to the post owner.
      await newLikeNotification(userId, postId, post.user.toString());
    }

    // Return a 200 response indicating that the post has been liked successfully.
    return res.status(200).send("Post liked!");
  } catch (error) {
    // Output any errors that occur during the process
    console.error(error);
    // Return a 500 response for server errors.
    return res.status(500).send("Server Error!");
  }
});

// Dynamic Route with postId.
// Method: POST
// Middleware: authMiddleware
router.post("/dislike/:postId", authMiddleware, async (req, res) => {
  try {
    // Extract postId and userId from request parameters and user information.
    const { postId } = req.params;
    const { userId } = req;

    // Find the post in the database based on postId.
    const post = await PostModel.findById(postId);
    // Check if the post exists.
    if (!post) {
      // If no post is found, return a 404 response.
      return res.status(404).send("No Post found!");
    }

    // Check if the user has already disliked the post.
    const isDisLiked =
      post.dislikes.filter((dislike) => dislike.user.toString() === userId)
        .length > 0;

    // If the user has already disliked the post, return a 401 response.
    if (isDisLiked) {
      return res.status(401).send("Post already disliked!");
    }

    // Check if the user has already liked the post.
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length > 0;

    // If the user has already liked the post, remove the like.
    if (isLiked) {
      post.likes = post.likes.filter((like) => like.user.toString() !== userId);

      post.likesCount--;
      post.dislikesCount++;

      // Save the updated post without the dislike.
      await post.save();

      // Add a new dilike to the post.
      await post.dislikes.unshift({ user: userId });

      // Save the updated post with the new dislike.
      await post.save();

      // Check if the user disliking the post is not the post owner.
      if (post.user.toString() !== userId) {
        // If true, send a new dislike notification to the post owner.
        await newDisLikeNotification(userId, postId, post.user.toString());
      }

      // Return a 200 response indicating that the post has been disliked successfully.
      return res.status(200).send("Post disliked!");
    }

    // Check if the user liking the post is not the post owner.
    if (post.user.toString() !== userId) {
      // If true, send a new like notification to the post owner.
      await newLikeNotification(userId, postId, post.user.toString());
    }

    // If the user hasn't liked and disliked the post, add a new like to the post.
    await post.dislikes.unshift({ user: userId });
    post.dislikesCount++;

    // Save the updated post with the new dislike.
    await post.save();

    // Check if the user disliking the post is not the post owner.
    if (post.user.toString() !== userId) {
      // If true, send a new dislike notification to the post owner.

      await newDisLikeNotification(userId, postId, post.user.toString());
    }

    // Return a 200 response indicating that the post has been disliked successfully.
    return res.status(200).send("Post disliked!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Unlike a post
router.put("/unlike/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    // Check if post exists
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("No Post found!");
    }

    // Check if post is liked by user, if not then post cannot be unliked
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length === 0;

    if (isLiked) {
      return res.status(401).send("Post not liked before!");
    }

    // Remove like of user from the post
    const index = post.likes
      .map((like) => like.user.toString())
      .indexOf(userId);

    await post.likes.splice(index, 1);

    await post.save();

    // Remove the like notification sent when user liked the post
    if (post.user.toString() !== userId) {
      await removeLikeNotification(userId, postId, post.user.toString());
    }

    return res.status(200).send("Post Unliked!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Undislike a post
router.put("/undislike/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    // Check if post exists
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("No Post found!");
    }

    // If post is not disliked, return error
    const isDisLiked =
      post.dislikes.filter((dislike) => dislike.user.toString() === userId)
        .length === 0;

    if (isDisLiked) {
      return res.status(401).send("Post not disliked before!");
    }

    // Remove the dislike on the post
    const index = post.dislikes
      .map((dislike) => dislike.user.toString())
      .indexOf(userId);

    await post.dislikes.splice(index, 1);

    await post.save();

    // Remove the dislike notification made when the post was disliked
    if (post.user.toString() !== userId) {
      await removeDisLikeNotification(userId, postId, post.user.toString());
    }

    return res.status(200).send("Post Undisliked!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Get the likes of a post
router.get("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the post exists and get the likes
    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) {
      return res.status(404).send("No Post found!");
    }

    return res.status(200).json(post.likes);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Get the dislikes of a post
router.get("/dislike/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists and get the dislikes
    const post = await PostModel.findById(postId).populate("dislikes.user");
    if (!post) {
      return res.status(404).send("No Post found!");
    }

    return res.status(200).json(post.dislikes);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Post a comment to a post
router.post("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const { text } = req.body;

    // Comments must be at least 1 character
    if (text.length < 1)
      return res.status(401).send("Comment should be at least one character!");

    const post = await PostModel.findById(postId);

    // Check if post exists
    if (!post) return res.status(404).send("Post not found!");

    // Populate new comment object
    const newComment = {
      _id: uuid(),
      text,
      user: userId,
      date: Date.now(),
    };

    // Save the comment to the post object in the database
    await post.comments.unshift(newComment);
    await post.save();

    // If user who commented isn't the owner of the post, send a comment notification to owner
    if (post.user.toString() !== userId) {
      await newCommentNotification(
        postId,
        newComment._id,
        userId,
        post.user.toString(),
        text
      );
    }

    return res.status(200).json(newComment._id);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Delete a comment from a post
router.delete("/:postId/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req;

    // Check if the post exists
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found!");

    // Find and check if the comment exists
    const comment = post.comments.find((comment) => comment._id === commentId);
    if (!comment) {
      return res.status(404).send("No Comment found!");
    }

    // Find user of the comment
    const user = await UserModel.findById(userId);

    // Delete the comment from the post
    const deleteComment = async () => {
      const indexOf = post.comments
        .map((comment) => comment._id)
        .indexOf(commentId);

      await post.comments.splice(indexOf, 1);

      await post.save();

      // If actionable user isn't the owner of post, remove the notification made when comment was submitted
      if (post.user.toString() !== userId) {
        await removeCommentNotification(
          postId,
          commentId,
          userId,
          post.user.toString()
        );
      }

      return res.status(200).send("Deleted Successfully!");
    };

    // Only allow poster of comment or super user to delete comment
    if (comment.user.toString() !== userId) {
      if (user.role === "Super") {
        await deleteComment();
      } else {
        return res.status(401).send("Unauthorized!");
      }
    }

    await deleteComment();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Report a post 
router.post("/report/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const { text, postOwnerUserId } = req.body;

    // Ensure the post isn't be reported by its owner
    if (postOwnerUserId === userId) {
      return res.status(401).send("Cannot Report Your Post!");
    }

    // Report description must have at least one character
    if (text.length < 1)
      return res.status(401).send("Report should be at least one character!");

    const post = await PostModel.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).send("Post not found!");
    }

    // Make a new report object with report information
    const newReport = {
      _id: uuid(),
      text,
      user: userId,
      date: Date.now(),
    };

    // Submit the report
    await post.reports.unshift(newReport);
    await PostModel.findByIdAndUpdate(postId, { $inc: { reportsCount: 1 } });
    await post.save();

    // Create a new report notification to the owner of the post
    if (post.user.toString() !== userId) {
      await newReportPostNotification(
        postId,
        newReport._id,
        userId,
        post.user.toString(),
        text
      );
    }

    return res.status(200).json(newReport._id);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// Get the reports of a post
router.get("/report/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post, check if it exists
    const post = await PostModel.findById(postId).populate("reports.user");
    if (!post) {
      return res.status(404).send("No Post found!");
    }

    return res.status(200).json(post.reports);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

router.post("/read/:postId", authMiddleware, async (req, res) => {
  try {
    // Extract postId and userId from request parameters and user information.
    const { postId } = req.params;
    const { userId } = req;

    // Find the post in the database based on postId.
    const post = await PostModel.findById(postId);

    // Check if the post exists.
    if (!post) {
      // If no post is found, return a 404 response.
      return res.status(404).send("No Post found!");
    }

    // Check if the user reading the post is the post owner.
    if (post.user.toString() === userId) {
      return;
    }

    // Check if the user has already read the post.
    const isRead =
      post.reads.filter((read) => read.user.toString() === userId).length > 0;

    // If the user has already read the post, return a 401 response.
    // if (isRead) {
    //   return res.status(401).send("Post already read!");
    // }
    if (isRead) {
      return;
    }

    // If the user hasn't read the post, add a new read to the post.
    await post.reads.unshift({ user: userId });

    // Save the updated post with the new read.
    await post.save();

    // Check if the user reading the post is not the post owner.
    if (post.user.toString() !== userId) {
      // If true, send a new read notification to the post owner.
      await newReadNotification(userId, postId, post.user.toString());
    }

    // Return a 200 response indicating that the post has been read successfully.
    return res.status(200).send("Post read!");
  } catch (error) {
    // Output any errors that occur during the process
    console.error(error);
    // Return a 500 response for server errors.
    return res.status(500).send("Server Error!");
  }
});

// Get the reads of a post
router.get("/read/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    // Get the reads of the post, check if the post exists
    const post = await PostModel.findById(postId).populate("reads.user");
    if (!post) {
      return res.status(404).send("No Post found!");
    }

    return res.status(200).json(post.reads);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

module.exports = router;
