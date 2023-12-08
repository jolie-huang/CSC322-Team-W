const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

// Set a new notification to unread
const setNotificationToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    // Ensure the notification exists, make it unread
    if (!user.unreadNotification) {
      user.unreadNotification = true;
      await user.save();
    }

    return;
  } catch (error) {
    console.error(error);
  }
};

// Create a notificaiton for a new like
const newLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newLike",
      user: userId,
      post: postId,
      date: Date.now(),
    };

    // update the notifications of the user properly ordered
    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// Remove an already existing like notification
const removeLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });

    // Find the notification to remove
    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.type === "newLike" &&
        notification.user.toString() === userId &&
        notification.post.toString() === postId
    );
    // Reindex the notifications
    const indexOf = user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.notifications.splice(indexOf, 1);
    await user.save();

    return;
  } catch (error) {
    console.error(error);
  }
};

// Create a notification for a new dislike
const newDisLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newDisLike",
      user: userId,
      post: postId,
      date: Date.now(),
    };

    // Apply the new notification, and reindex notifications so new is first
    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// Remove an existing dislike notification
const removeDisLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });
    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.type === "newDisLike" &&
        notification.user.toString() === userId &&
        notification.post.toString() === postId
    );
    // Reindex the notifications accounting for a removed notification
    const indexOf = user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.notifications.splice(indexOf, 1);
    await user.save();

    return;
  } catch (error) {
    console.error(error);
  }
};

// Create a new comment notification
const newCommentNotification = async (
  postId,
  commentId,
  userId,
  userToNotifyId,
  text
) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newComment",
      user: userId,
      post: postId,
      commentId,
      text,
      date: Date.now(),
    };

    // Create the new notification, and ensure it is first
    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

// Remove an existing comment notification
const removeCommentNotification = async (
  postId,
  commentId,
  userId,
  userToNotifyId
) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });
    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.type === "newComment" &&
        notification.user.toString() === userId &&
        notification.post.toString() === postId &&
        notification.commentId === commentId
    );
    //  Reindex the notifications to ensure that order is preserved
    const indexOf = await user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());
    // Remove the notification
    await user.notifications.splice(indexOf, 1);
    await user.save();
  } catch (error) {
    console.error(error);
  }
};

// Create a new notification for reports on profiles
const newReportProfileNotification = async (
  profileId,
  reportId,
  userId,
  userToNotifyId,
  text
) => {
  try {
    const superUsers = await UserModel.find({ role: "Super" });
    const randomIndex = Math.floor(Math.random() * superUsers.length);
    const randomSuperUser = superUsers[randomIndex];
    const superUserToNotifyId = randomSuperUser._id;

    // Get the user to notify and the inputs of the new notificaiton
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newReportProfile",
      user: userId,
      profile: profileId,
      reportId,
      text,
      date: Date.now(),
      superUser: superUserToNotifyId,
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);

    // Notify super user of the report
    const superUserToNotify = await NotificationModel.findOne({
      user: superUserToNotifyId,
    });
    const newSuperUserNotification = {
      type: "newReportProfile",
      user: userId,
      profile: profileId,
      reportId,
      text,
      date: Date.now(),
      superUser: superUserToNotifyId,
    };

    await superUserToNotify.notifications.unshift(newSuperUserNotification);
    await superUserToNotify.save();
    await setNotificationToUnread(superUserToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// Create a new notification for a report on a post
const newReportPostNotification = async (
  postId,
  reportId,
  userId,
  userToNotifyId,
  text
) => {
  try {
    const superUsers = await UserModel.find({ role: "Super" });
    const randomIndex = Math.floor(Math.random() * superUsers.length);
    const randomSuperUser = superUsers[randomIndex];
    const superUserToNotifyId = randomSuperUser._id;

    // Find the user to notify and construct the report notification
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newReportPost",
      user: userId,
      post: postId,
      reportId,
      text,
      date: Date.now(),
      superUser: superUserToNotifyId,
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);

    // Notify a super user to handle the report
    const superUserToNotify = await NotificationModel.findOne({
      user: superUserToNotifyId,
    });
    const newSuperUserNotification = {
      type: "newReportPost",
      user: userId,
      post: postId,
      reportId,
      text,
      date: Date.now(),
      superUser: superUserToNotifyId,
    };

    await superUserToNotify.notifications.unshift(newSuperUserNotification);
    await superUserToNotify.save();
    await setNotificationToUnread(superUserToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// Create a new notification to show a new follower
const newFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });
    const newNotification = {
      type: "newFollower",
      user: userId,
      date: Date.now(),
    };

    await user.notifications.unshift(newNotification);
    await user.save();
    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// Remove the notification of a new follower if they unfollowed
const removeFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });
    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.type === "newFollower" &&
        notification.user.toString() === userId
    );
    const indexOf = await user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.notifications.splice(indexOf, 1);
    await user.save();
  } catch (error) {
    console.error(error);
  }
};

// Create a new notification of a warning for a user from a super user
const newReportUserNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });
    const newNotification = {
      type: "newSuperUserReport",
      user: userId,
      date: Date.now(),
    };

    await user.notifications.unshift(newNotification);
    await user.save();
    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// Remove warning notification if super user takes back the warning
const removeReportUserNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });
    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.type === "newSuperUserReport" &&
        notification.user.toString() === userId
    );

    if (!notificationToRemove) {
      console.error(`Notification not found for user: ${userId}`);
      return;
    }

    const indexOf = await user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.notifications.splice(indexOf, 1);
    await user.save();
  } catch (error) {
    console.error(error);
  }
};


// If super user resets your warning back to 0, send notification
const resetReportUserNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });

    // Find the user to be notified
    if (!user) {
      console.error(`User not found for id: ${userToNotifyId}`);
      return;
    }

    user.notifications = user.notifications.filter(
      (notification) => notification.type !== "newSuperUserReport"
    );

    await user.save();
  } catch (error) {
    console.error(error);
  }
};

// New notification for a read on post
const newReadNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newRead",
      user: userId,
      post: postId,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// New notification for if a super user reports your post
const newReportPostSurferNotification = async (
  postId,
  reportId,
  userToNotifyId,
  text
) => {
  try {
    const superUsers = await UserModel.find({ role: "Super" });
    const randomIndex = Math.floor(Math.random() * superUsers.length);
    const randomSuperUser = superUsers[randomIndex];
    const superUserToNotifyId = randomSuperUser._id;

    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newReportPostSurfer",
      user: null,
      post: postId,
      reportId,
      text,
      date: Date.now(),
      superUser: superUserToNotifyId,
    };
    // Send notification to user
    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);

    // Notify a super user to handle the report
    const superUserToNotify = await NotificationModel.findOne({
      user: superUserToNotifyId,
    });
    const newSuperUserNotification = {
      type: "newReportPostSurfer",
      user: null,
      post: postId,
      reportId,
      text,
      date: Date.now(),
      superUser: superUserToNotifyId,
    };
    // Send notification to super user
    await superUserToNotify.notifications.unshift(newSuperUserNotification);
    await superUserToNotify.save();
    await setNotificationToUnread(superUserToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// Create a notification for when a user has had money deposited to their account
const newDepositNotification = async (userId) => {
  try {
    const user = await NotificationModel.findOne({ user: userId });
    const newNotification = {
      type: "newDeposit",
      user: userId,
      date: Date.now(),
    };

    await user.notifications.unshift(newNotification);
    await user.save();
    await setNotificationToUnread(userId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// New notification for if a user withdraws money from their account
const newWithdrawNotification = async (userId) => {
  try {
    const user = await NotificationModel.findOne({ user: userId });
    const newNotification = {
      type: "newWithdraw",
      user: userId,
      date: Date.now(),
    };

    await user.notifications.unshift(newNotification);
    await user.save();
    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

// New notification for if a user tips another users post or profile
const newTipNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newTip",
      user: userId,
      post: postId,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  newLikeNotification,
  newDisLikeNotification,
  removeLikeNotification,
  removeDisLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newReportPostNotification,
  newReportProfileNotification,
  newFollowerNotification,
  removeFollowerNotification,
  newReportUserNotification,
  removeReportUserNotification,
  resetReportUserNotification,
  newReadNotification,
  newReportPostSurferNotification,
  newDepositNotification,
  newWithdrawNotification,
  newTipNotification,
};
