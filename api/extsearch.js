const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");

// Advanced search for posts
// Find posts based on username, likes, dislikes, and keyword
router.get(
  "/:username/:likesCount/:dislikesCount/:keywords",
  authMiddleware,
  async (req, res) => {
    try {
      const { username, likesCount, dislikesCount, keywords } = req.params;
      const searchCriteria = {};
      if (username !== "null") {
        const user = await UserModel.findOne({ username: username.toLowerCase() });

        if (user) {
          // Use the found user's _id to search for posts
          searchCriteria["user"] = user;
        } else {
          // If user not found, return an empty array
          return res.status(200).json([]);
        }
      }

      // Get keywords
      if (keywords !== "null") {
        searchCriteria["keywords"] = keywords;
      }

      // Find posts based on number of likes
      if (likesCount !== "null") {
        searchCriteria["likesCount"] = parseInt(likesCount);
      }

      // Find posts based on number of dislikes
      if (dislikesCount !== "null") {
        searchCriteria["dislikesCount"] = parseInt(dislikesCount);
      }
      const results = await PostModel.find(searchCriteria).sort({
        createdAt: -1,
      });

      return res.status(200).json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error!");
    }
  }
);

module.exports = router;
