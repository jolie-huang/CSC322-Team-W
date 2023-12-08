import React from "react";
import { Feed, Divider, Icon } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function TipNotification({ notification, accountBalance, tips }) {
  return (
    <>
      {" "}
      {/* Feed Event displays user profile picture and content */}
      <Feed.Event>
        {" "}
        {/* Display user's profile picture in the feed */}
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          {/* Display summary of the tip notification */}

          <Feed.Summary>
            <>
              {/* Display the user who gave the tip and link to their profile */}
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              {/* Display the action of tipping and link to the tipped post */}
              tip your <a href={`/post/${notification.post._id}`}>post</a>{" "}
              {/* Display multiple dollar sign icons for emphasis */}
              <Icon
                name="dollar sign"
                color="green"
                style={{ marginLeft: "-10px" }}
                fitted
              />
              <Icon
                name="dollar sign"
                color="green"
                style={{ marginLeft: "-10px" }}
                fitted
              />
              <Icon
                name="dollar sign"
                color="green"
                style={{ marginLeft: "-10px" }}
                fitted
              />
              {/* Display the time elapsed since the notification */}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
          {/* Conditionally display the image if the tipped post has a picture */}
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

export default TipNotification;
