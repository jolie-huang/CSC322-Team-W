import React from "react";
import { Feed, Divider } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function ReadNotification({ user, notification }) {
  return (
    <>
      {/* Feed Event displays user profile picture and content */}
      <Feed.Event>
        {/* Display user's profile picture in the feed */}
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          {/* Display summary of the read notification */}
          <Feed.Summary>
            <>
              {/* Link to the user's profile who read the post */}
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              {/* Display the action and link to the read post */}
              read your <a href={`/post/${notification.post._id}`}>
                post.
              </a>{" "}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
              {/* Additional charge information for Corporate users */}
              {user.role === "Corporate" &&
                (notification.post.type === "Ad" ||
                  notification.post.type === "Job") && (
                  <Feed.Summary>
                    <>You have been charged $0.10.</>
                  </Feed.Summary>
                )}
            </>
          </Feed.Summary>
          {/* Display the image of the read post if available */}
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
      <Divider />
    </>
  );
}

export default ReadNotification;
