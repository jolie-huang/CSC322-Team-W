const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    //These are all required things for each post
    user: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    location: { type: String },
    company: { type: String },
    type: {
      type: String,
      default: "Regular",
      enum: ["Regular", "Ad", "Job"],
    },
    kind: {
      type: String,
      default: "Ordinary",
      enum: ["Ordinary", "Trendy"],
    },
    // Keywords associated with the post (required)
    keywords: [{ type: String, required: true }],
    picUrl: { type: String },
    likes: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
    likesCount: { type: Number, default: 0 }, // For displaying most liked posts.
    dislikes: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
    dislikesCount: { type: Number, default: 0 }, // For displaying most disliked posts.
    // Comments associated with the post
    comments: [
      {
        _id: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    // Reports associated with the post
    reports: [
      {
        _id: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", default: null },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    // Count of reports for the post (default: 0)
    reportsCount: { type: Number, default: 0 },
    // Reads associated with the post
    reads: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
