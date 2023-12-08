const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");

// Load existing messages 
const loadMessages = async (userId, messagesWith) => {
  try {
    // Find all the messages with active user
    const user = await ChatModel.findOne({ user: userId }).populate(
      "chats.messagesWith"
    );
    // Find all messages between active user and specified user
    const chat = user.chats.find(
      (chat) => chat.messagesWith._id.toString() === messagesWith
    );

    // Check if chat exists
    if (!chat) {
      return { error: "No chat found" };
    }

    return { chat };
  } catch (error) {
    return { error };
  }
};

// Send a message to a specified user
const sendMsg = async (userId, msgSendToUserId, msg) => {
  try {
    const user = await ChatModel.findOne({ user: userId });
    const msgSendToUser = await ChatModel.findOne({ user: msgSendToUserId });
    const newMsg = {
      sender: userId,
      receiver: msgSendToUserId,
      msg,
      date: Date.now(),
    };
    const previousChat = user.chats.find(
      (chat) => chat.messagesWith.toString() === msgSendToUserId
    );

    // reorganize the previous messages so that the new message comes first
    if (previousChat) {
      previousChat.messages.push(newMsg);
      await user.save();
    } else {
      const newChat = { messagesWith: msgSendToUserId, messages: [newMsg] };
      user.chats.unshift(newChat);
      await user.save();
    }

    const previousChatForReceiver = msgSendToUser.chats.find(
      (chat) => chat.messagesWith.toString() === userId
    );

    if (previousChatForReceiver) {
      previousChatForReceiver.messages.push(newMsg);
      await msgSendToUser.save();
    } else {
      const newChat = { messagesWith: userId, messages: [newMsg] };
      msgSendToUser.chats.unshift(newChat);
      await msgSendToUser.save();
    }

    return { newMsg };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

// Set a new message to unread
const setMsgToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user.unreadMessage) {
      user.unreadMessage = true;
      await user.save();
    }

    return;
  } catch (error) {
    console.error(error);
  }
};

//Set a message to read once opened
const setMsgToRead = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    if (user.unreadMessage) {
      user.unreadMessage = false;
      await user.save();
    }

    return;
  } catch (error) {
    console.error(error);
  }
};

// Delete a message with a speceffied user
const deleteMsg = async (userId, messagesWith, messageId) => {
  try {
    const user = await ChatModel.findOne({ user: userId });
    const chat = user.chats.find(
      (chat) => chat.messagesWith.toString() === messagesWith
    );

    if (!chat) return;

    // Find the message to delete, and check if it exists
    const messageToDelete = chat.messages.find(
      (message) => message._id.toString() === messageId
    );

    if (!messageToDelete) return;

    if (messageToDelete.sender.toString() !== userId) {
      return;
    }

    const indexOf = chat.messages
      .map((message) => message._id.toString())
      .indexOf(messageToDelete._id.toString());

    await chat.messages.splice(indexOf, 1);
    await user.save();

    return { success: true };
  } catch (error) {
    // console.log(error);
  }
};

module.exports = {
  loadMessages,
  sendMsg,
  setMsgToUnread,
  setMsgToRead,
  deleteMsg,
};
