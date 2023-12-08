import React, { useState, useEffect } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { Button, Image, List } from "semantic-ui-react";
import Spinner from "../Layout/Spinner";
import { NoFollowData } from "../Layout/NoData";
import { followUser, unfollowUser } from "../../utils/profileActions";
import baseUrl from "../../utils/baseUrl";
// Functional component for displaying a list of followers on a user's profile
const Named = ({
  user,
  loggedUserFollowStats,
  setUserFollowStats,
  profileUserId,
}) => {
  // State variables to manage followers data and loading states
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  // useEffect hook to fetch followers data when the component mounts
  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true);
      // Fetching followers data from the server
      try {
        const res = await axios.get(
          `${baseUrl}/api/profile/followers/${profileUserId}`,
          {
            headers: { Authorization: cookie.get("token") },
          }
        );

        // Updating state with the fetched followers data
        setFollowers(res.data);
      } catch (error) {
        // Handling errors during data fetching
        alert("Error Loading Followers!");
      }
      // Updating loading state after fetching data
      setLoading(false);
    };

    // Calling the function to fetch followers data
    getFollowers();
  }, []); // Empty dependency array ensures the effect runs only on mount

  return (
    <>
      {loading ? (// Displaying a spinner while followers data is being loaded
        <Spinner />
      ) : followers.length > 0 ? (
        followers.map((profileFollower) => {
          // Checking if the logged-in user is already following the displayed follower
          const isFollowing =
            loggedUserFollowStats.following.length > 0 &&
            loggedUserFollowStats.following.filter(
              (following) => following.user === profileFollower.user._id
            ).length > 0;
            // Rendering a list item for each follower
          return (
            <List
              key={profileFollower.user._id}
              divided
              verticalAlign="middle"
              inverted
            >
              <List.Item>
                <List.Content floated="right">
                  {profileFollower.user._id !== user._id && ( // Displaying follow/unfollow button if not the logged-in user
                    <Button
                      color={isFollowing ? "blue" : "red"}
                      icon={isFollowing ? "check" : "add user"}
                      content={isFollowing ? "Following!" : "Follow?"}
                      disabled={followLoading}
                      onClick={() => {
                        // Handling follow/unfollow button click
                        setFollowLoading(true);

                        isFollowing
                          ? unfollowUser(
                              profileFollower.user._id,
                              setUserFollowStats
                            )
                          : followUser(
                              profileFollower.user._id,
                              setUserFollowStats
                            );

                        setFollowLoading(false);
                      }}
                    />
                  )}
                </List.Content>
                <Image avatar src={profileFollower.user.profilePicUrl} />
                <List.Content as="a" href={`/${profileFollower.user.username}`}>
                  {profileFollower.user.name}
                </List.Content>
              </List.Item>
            </List>
          );
        })
      ) : (
       // Displaying a message when there are no followers
        <NoFollowData followersComponent={true} />
      )}
    </>
  );
};
export default Named;
