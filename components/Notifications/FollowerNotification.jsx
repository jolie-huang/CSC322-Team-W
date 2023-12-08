import React, { useState } from "react";
import { Feed, Button, Divider } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import { followUser, unfollowUser } from "../../utils/profileActions";

function FollowerNotification({
  notification,
  loggedUserFollowStats,
  setUserFollowStats,
}) {
  // State to manage the button's disabled state during follow/unfollow action
  const [disabled, setDisabled] = useState(false);
  // Check if the logged user is already following the user who triggered the notification
  const isFollowing =
    loggedUserFollowStats.following.length > 0 &&
    loggedUserFollowStats.following.filter(
      (following) => following.user === notification.user._id
    ).length > 0;
  // Render a feed event for follower notifications
  return (
    <>
      <Feed.Event>
        {/* Display user's profile picture in the feed */}
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          {/* Display summary of the follower notification */}
          <Feed.Summary>
            <>
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              {/* Display the action and time of the follow */}
              followed you!
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
          {/* Button to follow/unfollow the user who triggered the notification */}
          <div style={{ position: "absolute", right: "5px" }}>
            <Button
              size="small"
              compact
              icon={isFollowing ? "check circle" : "add user"}
              color={isFollowing ? "instagram" : "twitter"}
              disabled={disabled}
              onClick={async () => {
                setDisabled(true);
                // Follow or unfollow the user based on the current state
                isFollowing
                  ? await unfollowUser(
                      notification.user._id,
                      setUserFollowStats
                    )
                  : await followUser(notification.user._id, setUserFollowStats);

                setDisabled(false);
              }}
            />
          </div>
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  );
}

export default FollowerNotification;
