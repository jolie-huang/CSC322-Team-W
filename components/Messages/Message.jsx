import React, { useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
// Message component to display individual chat messages
function Message({ message, user, deleteMsg, bannerProfilePic, divRef }) {
  // State to track whether to show the delete icon
  const [deleteIcon, showDeleteIcon] = useState(false);
  // Check if the message sender is the current user
  const ifYouSender = message.sender === user._id;

  return (
    // Wrapper for each message bubble with a reference for scrolling
    <div className="bubbleWrapper" ref={divRef}>
      {/* Container for the message, allowing interaction for delete icon */}
      <div
        className={ifYouSender ? "inlineContainer own" : "inlineContainer"}
        onClick={() => ifYouSender && showDeleteIcon(!deleteIcon)}
      >
        {/* User avatar for the message sender or recipient */}
        <img
          className="inlineIcon"
          src={ifYouSender ? user.profilePicUrl : bannerProfilePic}
        />
        {/* Bubble for displaying the message content */}
        <div className={ifYouSender ? "ownBubble own" : "otherBubble other"}>
          {message.msg}
        </div>
        {/* Conditional rendering of the delete icon based on user interaction */}
        {deleteIcon && (
          // Popup component for providing additional information on delete action
          <Popup
            trigger={
              <Icon
                name="trash"
                color="red"
                style={{ cursor: "pointer" }}
                onClick={() => deleteMsg(message._id)}
                fitted
              />
            }
            content="This will only delete the message from your inbox!"
            position="top right"
          />
        )}
      </div>
      {/* Timestamp for the message, displayed based on sender or recipient */}
      <span className={ifYouSender ? "own" : "other"}>
        {calculateTime(message.date)}
      </span>
    </div>
  );
}

export default Message;
