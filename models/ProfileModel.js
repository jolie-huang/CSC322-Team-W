const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    // Reference to the user model: included are the biography, 
    // social media links, reports associated with the user, and count of reports
    user: { type: Schema.Types.ObjectId, ref: "User" },
    bio: { type: String, required: true },
    social: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
      youtube: { type: String },
    },
    reports: [
      {
        _id: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    reportsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
