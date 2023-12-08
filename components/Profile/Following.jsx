import React, { useState, useEffect } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { Button, Image, List } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import Spinner from "../Layout/Spinner";
import { NoFollowData } from "../Layout/NoData";
import { followUser, unfollowUser } from "../../utils/profileActions";

const Named = ({
  user,
  loggedUserFollowStats,
  setUserFollowStats,
  profileUserId,
}) => {
  // State variables to manage following data and loading states
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  // useEffect hook to fetch following data when the component mounts
  useEffect(() => {
    const getFollowing = async () => {
      setLoading(true);
      try {
        // Fetching following data from the server
        const res = await axios.get(
          `${baseUrl}/api/profile/following/${profileUserId}`,
          {
            headers: { Authorization: cookie.get("token") },
          }
        );
        // Updating state with the fetched following data
        setFollowing(res.data);
      } catch (error) {
        // Handling errors during data fetching
        alert("Error Loading Connections!");
      }
      // Updating loading state after fetching data
      setLoading(false);
    };
    // Calling the function to fetch following data
    getFollowing();
  }, []); // Empty dependency array ensures the effect runs only on mount

  return (
    <>
      {loading ? ( // Displaying a spinner while following data is being loaded
        <Spinner />
      ) : following.length > 0 ? ( // Displaying following list if there are users being followed
        following.map((profileFollowing) => {
          // Checking if the logged-in user is already following the displayed user
          const isFollowing =
            loggedUserFollowStats.following.length > 0 &&
            loggedUserFollowStats.following.filter(
              (following) => following.user === profileFollowing.user._id
            ).length > 0;

          return (
            <List
              key={profileFollowing.user._id}
              divided
              verticalAlign="middle"
              inverted
            >
              <List.Item>
                <List.Content floated="right">
                  {profileFollowing.user._id !== user._id && ( // Displaying follow/unfollow button if not the logged-in user
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
                              profileFollowing.user._id,
                              setUserFollowStats
                            )
                          : followUser(
                              profileFollowing.user._id,
                              setUserFollowStats
                            );

                        setFollowLoading(false);
                      }}
                    />
                  )}
                </List.Content>
                <Image avatar src={profileFollowing.user.profilePicUrl} />
                <List.Content
                  as="a"
                  href={`/${profileFollowing.user.username}`}
                >
                  {profileFollowing.user.name}
                </List.Content>
              </List.Item>
            </List>
          );
        })
      ) : (
        // Displaying a message when there are no users being followed
        <NoFollowData followingComponent={true} />
      )}
    </>
  );
};

export default Named;
