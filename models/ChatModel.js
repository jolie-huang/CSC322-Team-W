const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define a Mongoose schema for the Chat model
const ChatSchema = new Schema({
  // Reference to the User model for the participant in the chat
  user: { type: Schema.Types.ObjectId, ref: "User" },
  // Array of chats, each containing messages with another user
  chats: [
    {
      // Reference to the User model for the user whom the messages are exchanged with
      messagesWith: { type: Schema.Types.ObjectId, ref: "User" },
      // Array of messages in the chat
      messages: [
        {
          // Content, sender, receiver, date of message
          msg: { type: String, required: true },
          sender: { type: Schema.Types.ObjectId, ref: "User" },
          receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          date: { type: Date },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);
