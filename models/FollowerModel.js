const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowerSchema = new Schema({
  // Reference to the User model for the owner of the followers/following lists
  user: { type: Schema.Types.ObjectId, ref: "User" },
  // Array of followers and following, each containing a reference to a User model
  followers: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
  following: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

module.exports = mongoose.model("Follower", FollowerSchema);
