import React from "react";
import { Feed, Divider } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function DislikeNotification({ notification }) {
  // Render a feed event for dislike notifications

  return (
    <>
      <Feed.Event>
        {/* Display user's profile picture in the feed */}

        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          {/* Display summary of the dislike notification */}

          <Feed.Summary>
            <>
              {/* Link to the user's profile who made the dislike */}
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              {/* Display the action and link to the disliked post */}
              disliked your <a href={`/post/${notification.post._id}`}>post.</a>
              {/* Display the time since the dislike was made */}
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
        </Feed.Content>
      </Feed.Event>
      <br />
    </>
  );
}

export default DislikeNotification;
