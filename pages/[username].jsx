import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";
import axios from "axios";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { Grid } from "semantic-ui-react";
import baseUrl from "../utils/baseUrl";
import { NoProfilePosts, NoProfile } from "../components/Layout/NoData";
import CardPost from "../components/Post/CardPost";
import { PlaceHolderPosts } from "../components/Layout/PlaceHolderGroup";
import ProfileMenuTabs from "../components/Profile/ProfileMenuTabs";
import ProfileHeader from "../components/Profile/ProfileHeader";
import Followers from "../components/Profile/Followers";
import Following from "../components/Profile/Following";
import UpdateProfile from "../components/Profile/UpdateProfile";
import Settings from "../components/Profile/Settings";
import Warnings from "../components/Profile/Warnings";
import {
  PostDeleteToastr,
  UserDeleteToastr,
} from "../components/Layout/Toastr";
import MessageNotificationModal from "../components/Home/MessageNotificationModal";
import newMsgSound from "../utils/newMsgSound";
import getUserInfo from "../utils/getUserInfo";
// Functional component for the user profile page

function ProfilePage({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  reportPostsLength,
  user,
  userFollowStats,
}) {
  // Initializing necessary variables and state variables
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPostToastr, setShowPostToastr] = useState(false);
  const [showUserToastr, setShowUserToastr] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");
  const handleItemClick = (clickedTab) => setActiveItem(clickedTab);
  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);
  // const ownAccount = profile.user._id === user._id;
  const ownAccount = profile
    ? profile.user._id === (user ? user._id : null)
    : false;
  const socket = useRef();
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);

  if (errorLoading) {
    return <NoProfile />;
  }
  // Initializing and connecting to the socket when the component mounts
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }
    // Emitting a "join" event to the socket to join the user to a room
    if (socket.current) {
      socket.current.emit("join", { userId: user._id });
      // Listening for the "newMsgReceived" event from the socket
      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
         // Updating state to show a new message notification modal
        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          showNewMessageModal(true);
        }
        // Playing a sound for a new message
        newMsgSound(name);
      });
    }
  }, []);
    // Fetching user posts when the username in the URL changes
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);

      try {
        const { username } = router.query;
        const res = await axios.get(
          `${baseUrl}/api/profile/posts/${username}`,
          {
            headers: { Authorization: cookie.get("token") },
          }
        );

        setPosts(res.data);
      } catch (error) {
        alert("Error Loading Posts!");
      }

      setLoading(false);
    };
    getPosts();
  }, [router.query.username]);
  // Setting a timeout to hide the post toastr after a specific duration
  useEffect(() => {
    showPostToastr && setTimeout(() => setShowPostToastr(false), 4000);
  }, [showPostToastr]);

  useEffect(() => {
    showUserToastr && setTimeout(() => setShowUserToastr(false), 4000);
  }, [showUserToastr]);

  // Rendering the user profile page
  return (
    <>
      {showPostToastr && <PostDeleteToastr />}

      {showUserToastr && <UserDeleteToastr />}

      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}

      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <ProfileMenuTabs
              user={user}
              activeItem={activeItem}
              handleItemClick={handleItemClick}
              followersLength={followersLength}
              followingLength={followingLength}
              ownAccount={ownAccount}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {activeItem === "profile" && (
              <>
                <ProfileHeader
                  profile={profile}
                  ownAccount={ownAccount}
                  loggedUserFollowStats={loggedUserFollowStats}
                  setUserFollowStats={setUserFollowStats}
                  user={user}
                  setShowUserToastr={setShowUserToastr}
                />
             {/* // Placeholder for posts while loading */}
                {loading ? (
                  <PlaceHolderPosts />
                ) : posts.length > 0 ? (
                  // Mapping and rendering user posts
                  posts.map((post) => (
                    <CardPost
                      key={post._id}
                      post={post}
                      user={user}
                      setPosts={setPosts}
                      setShowToastr={setShowPostToastr}
                    />
                  ))
                ) : (
                 // Displaying a message when there are no posts

                  <NoProfilePosts />
                )}
              </>
            )}
            {/* // Rendering the followers component */}
            {activeItem === "followers" && (
              <Followers
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}
              {/* // Rendering the following component */}
            {activeItem === "following" && (
              <Following
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}

            {activeItem === "updateProfile" && (
              // Rendering the update profile component
              <UpdateProfile Profile={profile} />
            )}

            {activeItem === "settings" && (
             // Rendering the settings component

              <Settings user={user} newMessagePopup={user.newMessagePopup} />
            )}

            {user.role !== "Super" && activeItem === "warnings" && (
             // Rendering the warnings component
              <Warnings
                profile={profile}
                reportPostsLength={reportPostsLength}
                user={user}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
// Server-side data fetching using getInitialProps
ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);
     // Fetching user profile information from the server
    const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: { Authorization: token },
    });

    const { profile, followersLength, followingLength, reportPostsLength } =
      res.data;

    // Returning the fetched data as props
    return {
      profile,
      followersLength,
      followingLength,
      reportPostsLength,
    };
  } catch (error) {
    // Handling errors and indicating an error loading state
    return { errorLoading: true };
  }
};
export default ProfilePage;
