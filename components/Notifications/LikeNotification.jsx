import React from "react";
import { Feed, Divider } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function LikeNotification({ notification }) {
  return (
    <>
      {/* Feed Event displays user profile picture and content */}
      <Feed.Event>
        {/* Display user's profile picture in the feed */}
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          {/* Display summary of the dislike notification */}
          <Feed.Summary>
            <>
              {/* Link to the user's profile who disliked */}
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              liked your <a href={`/post/${notification.post._id}`}>post.</a>
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
          {/* Display the image of the liked post if available */}
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

export default LikeNotification;
