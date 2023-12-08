import React from "react";
import { Divider, Feed } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function CommentNotification({ notification }) {
  // Render a feed event for comment notifications
  return (
    <>
      <Feed.Event>
        {/* Display user's profile picture in the feed */}
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          {/* Display summary of the comment notification */}
          <Feed.Summary>
            <>
              {" "}
              {/* Link to the user's profile who made the comment */}
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              {/* Display the action and link to the commented post */}
              commented on your{" "}
              <a href={`/post/${notification.post._id}`}>post.</a>
              {/* Display the time since the comment was made */}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
          {/* Display post image if available */}
          {notification.post.picUrl && (
            <Feed.Extra images>
              <a href={`/post/${notification.post._id}`}>
                <img src={notification.post.picUrl} />
              </a>
            </Feed.Extra>
          )}
          {/* Display the text content of the comment */}
          <Feed.Extra text>
            <strong>{notification.text}</strong>
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
      {/* Add a divider after each comment notification */}

      <Divider />
    </>
  );
}

export default CommentNotification;
