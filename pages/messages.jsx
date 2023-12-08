import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import { Segment, Header, Divider, Comment, Grid } from "semantic-ui-react";
import baseUrl from "../utils/baseUrl";
import Chat from "../components/Chats/Chat";
import ChatListSearch from "../components/Chats/ChatListSearch";
import { NoMessages } from "../components/Layout/NoData";
import Banner from "../components/Messages/Banner";
import MessageInputField from "../components/Messages/MessageInputField";
import Message from "../components/Messages/Message";
import getUserInfo from "../utils/getUserInfo";
import newMsgSound from "../utils/newMsgSound";
// Function to scroll the chat div to the bottom
const scrollDivToBottom = (divRef) =>
  divRef.current !== null &&
  divRef.current.scrollIntoView({ behaviour: "smooth" });

function Messages({ chatsData, user }) {
  // State to manage the chats data
  let [chats, setChats] = useState(chatsData);

  // State to manage connected users in the chat
  const [connectedUsers, setConnectedUsers] = useState([]);
  // State to manage messages in the chat
  const [messages, setMessages] = useState([]);
  // State to manage banner data for the chat
  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });
  // Next.js router instance
  const router = useRouter();
  // Socket reference
  const socket = useRef();
  // Ref for the open chat ID
  const openChatId = useRef("");
  // Ref for the div in the chat for scrolling
  const divRef = useRef();
  // Initial useEffect to handle user authentication and socket connection
  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not authenticated
      window.location.href = "/login";
    }

    if (!socket.current) {
      // Connecting with the server.
      socket.current = io(baseUrl);
    }
    if (socket.current) {
      // Send data to the server.
      socket.current.emit("join", { userId: user._id });
      socket.current.on("connectedUsers", ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });
    }
    if (chats.length > 0 && !router.query.message) {
      // Redirect to the first chat if there are chats and no specific chat is selected
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
        shallow: true,
      });
    }
  }, []);
  // useEffect to load messages when the chat changes
  useEffect(() => {
    const loadMessages = () => {
      // Emit loadMessages event to request messages for the selected chat
      socket.current.emit("loadMessages", {
        userId: user._id,
        messagesWith: router.query.message,
      });
      // Listen for messagesLoaded event from the server
      socket.current.on("messagesLoaded", async ({ chat }) => {
        // Update messages, bannerData, and openChatId based on the loaded chat
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
        });

        openChatId.current = chat.messagesWith._id;
        divRef.current && scrollDivToBottom(divRef);
      });
      // Listen for noChatFound event from the server
      socket.current.on("noChatFound", async () => {
        const { name, profilePicUrl } = await getUserInfo(router.query.message);
        setBannerData({ name, profilePicUrl });
        setMessages([]);
        openChatId.current = router.query.message;
      });
    };
    // Load messages when the chat changes
    if (socket.current && router.query.message) loadMessages();
  }, [router.query.message]);
  // Function to send a new message
  const sendMsg = async (msg) => {
    if (socket.current) {
      // Emit sendNewMsg event to send a new message to the server
      socket.current.emit("sendNewMsg", {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg,
      });
    }
  };
  // useEffect to handle new messages and message notifications
  useEffect(() => {
    if (socket.current) {
      // Listen for msgSent event from the server when a new message is sent
      socket.current.on("msgSent", ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          // Update messages and chats when the new message is for the currently open chat
          setMessages((prev) => [...prev, newMsg]);
          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.receiver
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;
            return [...prev];
          });
        }
      });
      // Listen for newMsgReceived event from the server when a new message is received
      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        let senderName;
        if (newMsg.sender === openChatId.current) {
          // Update messages and chats when the new message is for the currently open chat

          setMessages((prev) => [...prev, newMsg]);
          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.sender
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;
            senderName = previousChat.name;
            return [...prev];
          });
        } else {
          // Handle when the new message is for a different chat

          const ifPreviouslyMessaged =
            chats.filter((chat) => chat.messagesWith === newMsg.sender).length >
            0;
          if (ifPreviouslyMessaged) {
            // Update chats when the user has messaged with the sender before

            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.messagesWith === newMsg.sender
              );
              previousChat.lastMessage = newMsg.msg;
              previousChat.date = newMsg.date;
              senderName = previousChat.name;
              return [...prev];
            });
          } else {
            // Load sender's information when it's a new chat

            const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

            senderName = name;
            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date,
            };
            setChats((prev) => {
              const previousChat = Boolean(
                prev.find((chat) => chat.messagesWith === newMsg.sender)
              );

              if (previousChat) {
                return [
                  newChat,
                  ...prev.filter((chat) => chat.messagesWith !== newMsg.sender),
                ];
              } else {
                return [newChat, ...prev];
              }
            });
          }
        }
        // Play a sound notification for the new message
        newMsgSound(senderName);
      });
    }
  }, []);
  // Set default value for chats if it's undefined
  if (!chats) {
    chats = [];
  }
  // useEffect to scroll to the bottom when messages change
  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(divRef);
  }, [messages]);

  // Function to delete a message
  const deleteMsg = (messageId) => {
    if (socket.current) {
      // Emit deleteMsg event to delete a message from the server
      socket.current.emit("deleteMsg", {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId,
      });
      // Listen for msgDeleted event from the server
      socket.current.on("msgDeleted", () => {
        // Update messages by removing the deleted message

        setMessages((prev) =>
          prev.filter((message) => message._id !== messageId)
        );
      });
    }
  };
  // Function to delete a chat
  const deleteChat = async (messagesWith) => {
    try {
      // Send a request to delete the chat from the server
      await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
        headers: { Authorization: cookie.get("token") },
      });
      // Update chats by removing the deleted chat
      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      // Redirect to the messages page

      router.push("/messages", undefined, { shallow: true });
      openChatId.current = "";
    } catch (error) {
      // Handle errors when deleting the chat

      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      // Redirect to the messages page

      router.push("/messages", undefined, { shallow: true });
      openChatId.current = "";
    }
  };

  return (
    <>
      <Segment padded basic size="large" style={{ marginTop: "5px" }}>
        {/* Header for going to the homepage */}

        <Header
          icon="home"
          content="Go to Homepage"
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
          color="blue"
        />
        <Divider hidden />
        {/* Chat list search component */}
        <div style={{ marginBottom: "10px" }}>
          <ChatListSearch chats={chats} setChats={setChats} />
        </div>
        {/* Render chats or no messages component based on the existence of chats */}
        {chats.length > 0 ? (
          <>
            <>
              {" "}
              {/* Grid for chat list and message display */}
              <Grid stackable>
                <Grid.Column width={4}>
                  {/* Comment group for rendering individual chat components */}

                  <Comment.Group size="big">
                    <Segment
                      raised
                      style={{ overflow: "auto", maxHeight: "32rem" }}
                    >
                      {chats.map((chat, i) => (
                        <Chat
                          key={i}
                          chat={chat}
                          connectedUsers={connectedUsers}
                          deleteChat={deleteChat}
                        />
                      ))}
                    </Segment>
                  </Comment.Group>
                </Grid.Column>
                <Grid.Column width={12}>
                  {/* Display messages for the selected chat */}

                  {router.query.message && (
                    <>
                      <div
                        style={{
                          overflow: "auto",
                          overflowX: "hidden",
                          maxHeight: "35rem",
                          height: "35rem",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <div style={{ position: "sticky", top: "0" }}>
                          {/* Banner component for displaying chat partner information */}
                          <Banner bannerData={bannerData} />
                        </div>
                        {/* Render individual message components */}
                        {messages.length > 0 &&
                          messages.map((message, i) => (
                            <Message
                              divRef={divRef}
                              key={i}
                              bannerProfilePic={bannerData.profilePicUrl}
                              message={message}
                              user={user}
                              deleteMsg={deleteMsg}
                            />
                          ))}
                      </div>
                      {/* Message input field component */}
                      <MessageInputField sendMsg={sendMsg} />
                    </>
                  )}
                </Grid.Column>
              </Grid>
            </>
          </>
        ) : (
          // Render NoMessages component if there are no chats

          <NoMessages />
        )}
      </Segment>
    </>
  );
}
// Define getInitialProps to fetch initial data for the component
Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    // Fetch chats data from the server

    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token },
    });
    // Return the chats data as props
    return { chatsData: res.data };
  } catch (error) {
    // Handle errors when fetching initial data
    return { errorLoading: true };
  }
};

export default Messages;
