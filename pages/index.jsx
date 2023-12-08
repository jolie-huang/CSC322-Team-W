import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import InfiniteScroll from "react-infinite-scroll-component";
import { Segment } from "semantic-ui-react";
import baseUrl from "../utils/baseUrl";
import CreatePost from "../components/Post/CreatePost";
import CardPost from "../components/Post/CardPost";
import { NoPosts } from "../components/Layout/NoData";
import { PostDeleteToastr } from "../components/Layout/Toastr";
import {
  PlaceHolderPosts,
  EndMessage,
} from "../components/Layout/PlaceHolderGroup";
import getUserInfo from "../utils/getUserInfo";
import MessageNotificationModal from "../components/Home/MessageNotificationModal";
import newMsgSound from "../utils/newMsgSound";

function Index({ user, postsData, errorLoading }) {
  // State to manage posts data
  const [posts, setPosts] = useState(postsData || []);
  // State to manage visibility of the post delete toastr
  const [showToastr, setShowToastr] = useState(false);
  // State to manage whether there are more posts to load
  const [hasMore, setHasMore] = useState(true);
  // State to manage the current page number for infinite scroll
  const [pageNumber, setPageNumber] = useState(2);
  // Ref to manage the WebSocket connection
  const socket = useRef();
  // State to manage new message information
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  // State to manage the visibility of the new message modal
  const [newMessageModal, showNewMessageModal] = useState(false);

  // Effect to initialize the WebSocket connection and set the document title
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId: user._id });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          showNewMessageModal(true);
        }
        newMsgSound(name);
      });
    }

    document.title = `Welcome, ${user.name.split(" ")[0]}. Let's Connect!`;
  }, []);

  // Effect to dismiss the post delete toastr after 3 seconds
  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  // Function to fetch more posts on infinite scroll
  const fetchDataOnScroll = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: cookie.get("token") },
        params: { pageNumber },
      });

      if (res.data.length === 0) setHasMore(false);

      setPosts((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
    } catch (error) {
      alert("Error fetching Posts!");
    }
  };

  // Effect to reload the page once after the initial load
  useEffect(() => {
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount === null) {
      sessionStorage.setItem("reloadCount", "1");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
  }, []);

  return (
    <>
      {/* Displaying post delete toastr if necessary */}
      {showToastr && <PostDeleteToastr />}

      {/* Displaying new message notification modal if necessary */}
      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}

      {/* Main content segment */}
      <Segment color="blue">
        {/* Checking if the user is logged in */}
        {user ? (
          <>
            {/* Component to create a new post */}
            <CreatePost user={user} setPosts={setPosts} />

            {/* Displaying posts or no posts message */}
            {posts.length === 0 || errorLoading ? (
              <NoPosts />
            ) : (
              /* Infinite scroll component for posts */
              <InfiniteScroll
                hasMore={hasMore}
                next={fetchDataOnScroll}
                loader={<PlaceHolderPosts />}
                endMessage={<EndMessage />}
                dataLength={posts.length}
              >
                {/* Mapping through posts to display each post */}
                {posts.map((post) => (
                  <CardPost
                    key={post._id}
                    post={post}
                    user={user}
                    setPosts={setPosts}
                    setShowToastr={setShowToastr}
                  />
                ))}
              </InfiniteScroll>
            )}
          </>
        ) : (
          typeof window !== "undefined" && (window.location.href = "/login")
        )}
      </Segment>
    </>
  );
}

// Fetching initial props to load posts on server-side
Index.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });

    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Index;
