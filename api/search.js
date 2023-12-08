const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");

// Small search bar for finding users
router.get("/:searchText", authMiddleware, async (req, res) => {
  try {
    const { searchText } = req.params;
    const { userId } = req;

    // If there is no text inputted return no profiles
    if (searchText.length === 0) return;

    let userPattern = new RegExp(`^${searchText}`);

    // Find the users who match the username inputted into the search bar
    const results = await UserModel.find({
      name: { $regex: userPattern, $options: "i" },
    });

    // Obtain the information which must be sent back to the search dropdown
    const resultsToBeSent =
      results.length > 0 &&
      results.filter((result) => result._id.toString() !== userId);

    return res.status(200).json(resultsToBeSent);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error!");
  }
});

module.exports = router;
