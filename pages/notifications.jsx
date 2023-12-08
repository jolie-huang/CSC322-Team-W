import React, { useEffect, useState, useRef, Fragment } from "react";
import io from "socket.io-client";
import { Feed, Segment, Divider, Container } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import { NoNotifications } from "../components/Layout/NoData";
import LikeNotification from "../components/Notifications/LikeNotification";
import CommentNotification from "../components/Notifications/CommentNotification";
import FollowerNotification from "../components/Notifications/FollowerNotification";
import MessageNotificationModal from "../components/Home/MessageNotificationModal";
import ReportPostNotification from "../components/Notifications/ReportPostNotification";
import ReportPostSurferNotification from "../components/Notifications/ReportPostSurferNotification";
import ReportProfileNotification from "../components/Notifications/ReportProfileNotification";
import ReportUserNotification from "../components/Notifications/ReportUserNotification";
import ReadNotification from "../components/Notifications/ReadNotification";
import newMsgSound from "../utils/newMsgSound";
import getUserInfo from "../utils/getUserInfo";
import DepositNotification from "../components/Notifications/DepositNotification";
import WithdrawNotification from "../components/Notifications/WithdrawNotification";
import TipNotification from "../components/Notifications/TipNotification";
import DislikeNotification from "../components/Notifications/DislikeNotification";

function Notifications({ notifications, errorLoading, user, userFollowStats }) {
  // State to manage logged user's follow statistics

  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);
  // Ref for the socket connection

  const socket = useRef();
  // State to manage new message received information

  const [newMessageReceived, setNewMessageReceived] = useState(null);
  // State to control the display of new message modal

  const [newMessageModal, showNewMessageModal] = useState(false);

  useEffect(() => {
    // Initialize or reuse the socket connection

    if (!socket.current) {
      socket.current = io(baseUrl);
    }
    // Set up event listeners on the socket connection

    if (socket.current) {
      // Join the socket room with the user's ID

      socket.current.emit("join", { userId: user._id });
      // Listen for new messages and handle accordingly
      // Get sender information

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
        // Show new message modal if configured by the user

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
    // Cleanup function to be executed on component unmount

    const notificationRead = async () => {
      try {
        // Mark notifications as read on the server

        await axios.post(
          `${baseUrl}/api/notifications`,
          {},
          { headers: { Authorization: cookie.get("token") } }
        );
      } catch (error) {
        // console.log(error);
      }
    };
    // Execute cleanup function on component unmount

    return () => {
      notificationRead();
    };
  }, []);

  return (
    <>
      {" "}
      {/* Check if user is logged in */}
      {user ? (
        <>
          {" "}
          {/* Render new message modal if needed */}
          {newMessageModal && newMessageReceived !== null && (
            <MessageNotificationModal
              socket={socket}
              showNewMessageModal={showNewMessageModal}
              newMessageModal={newMessageModal}
              newMessageReceived={newMessageReceived}
              user={user}
            />
          )}{" "}
          {/* Container for notifications */}
          <Container style={{ marginTop: "1.5rem" }}>
            {/* Check if there are notifications */}

            {notifications.length > 0 ? (
              <Segment color="blue" raised>
                {/* Feed component to display notifications */}

                <div
                  style={{
                    maxHeight: "40rem",
                    overflow: "auto",
                    height: "40rem",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Feed size="small">
                    {/* Map through notifications and render specific components based on type */}

                    {notifications.map((notification) => (
                      <Fragment key={notification._id}>
                        {/* Read Notification */}

                        {notification.type === "newRead" &&
                          notification.post !== null && (
                            <ReadNotification
                              key={notification._id}
                              user={user}
                              notification={notification}
                            />
                          )}
                        {/* Like/dislike, comment, report post, report post (surfer, etc notifs! */}
                        {notification.type === "newLike" &&
                          notification.post !== null && (
                            <LikeNotification
                              key={notification._id}
                              notification={notification}
                            />
                          )}
                        {notification.type === "newDisLike" &&
                          notification.post !== null && (
                            <DislikeNotification
                              key={notification._id}
                              notification={notification}
                            />
                          )}
                        {notification.type === "newComment" &&
                          notification.post !== null && (
                            <CommentNotification
                              key={notification._id}
                              notification={notification}
                            />
                          )}

                        {notification.type === "newReportPost" &&
                          notification.post !== null && (
                            <ReportPostNotification
                              key={notification._id}
                              user={user}
                              notification={notification}
                            />
                          )}
                        {notification.type === "newReportPostSurfer" &&
                          notification.post !== null && (
                            <ReportPostSurferNotification
                              key={notification._id}
                              user={user}
                              notification={notification}
                            />
                          )}
                        {notification.type === "newReportProfile" &&
                          notification.profile !== null && (
                            <ReportProfileNotification
                              key={notification._id}
                              user={user}
                              notification={notification}
                            />
                          )}
                        {notification.type === "newSuperUserReport" &&
                          notification.profile !== null && (
                            <ReportUserNotification
                              key={notification._id}
                              user={user}
                              notification={notification}
                            />
                          )}
                        {notification.type === "newFollower" && (
                          <FollowerNotification
                            key={notification._id}
                            notification={notification}
                            loggedUserFollowStats={loggedUserFollowStats}
                            setUserFollowStats={setUserFollowStats}
                          />
                        )}
                        {notification.type === "newDeposit" && (
                          <DepositNotification
                            key={notification._id}
                            notification={notification}
                            accountBalance={user.accountBalance}
                            tips={user.tips}
                          />
                        )}
                        {notification.type === "newWithdraw" && (
                          <WithdrawNotification
                            key={notification._id}
                            notification={notification}
                            accountBalance={user.accountBalance}
                            tips={user.tips}
                          />
                        )}
                        {notification.type === "newTip" && (
                          <TipNotification
                            key={notification._id}
                            notification={notification}
                            accountBalance={user.accountBalance}
                            tips={user.tips}
                          />
                        )}
                      </Fragment>
                    ))}
                  </Feed>
                </div>
              </Segment>
            ) : (
              // Display message if no notifications

              <NoNotifications />
            )}
            <Divider hidden />
          </Container>
        </>
      ) : (
        // Redirect to no profile found page if user is not logged in

        typeof window !== "undefined" &&
        (window.location.href = "/noprofilefound")
      )}
    </>
  );
}
// Define getInitialProps to fetch notifications data during server-side rendering

Notifications.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx); // Get token from cookies

    const res = await axios.get(`${baseUrl}/api/notifications`, {
      // Fetch notifications data from the server

      headers: { Authorization: token },
    });
    // Return notifications data as props
    return { notifications: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Notifications;
