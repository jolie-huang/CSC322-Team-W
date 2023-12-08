import React, { useState } from "react";
import Link from "next/link";
import { Form, Modal, Segment, List, Icon } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function MessageNotificationModal({
  socket,
  showNewMessageModal,
  newMessageModal,
  newMessageReceived,
  user,
}) {
  // State to manage the text input for composing a new message
  const [text, setText] = useState("");
  // State to manage loading state during message sending
  const [loading, setLoading] = useState(false);
  // Function to handle modal close event
  const onModalClose = () => showNewMessageModal(false);
  // Function to handle form submission for sending a new message
  const formSubmit = (e) => {
    e.preventDefault();
    // Check if the socket is available
    if (socket.current) {
      // Emit a socket event to send a message from the notification
      socket.current.emit("sendMsgFromNotification", {
        userId: user._id,
        msgSendToUserId: newMessageReceived.sender,
        msg: text,
      });
      // Listen for acknowledgment from the server that the message was sent
      socket.current.on("msgSentFromNotification", () => {
        // Close the modal after the message is sent

        showNewMessageModal(false);
      });
    }
  };

  return (
    <>
      {" "}
      {/* Modal component for displaying new message notification */}
      <Modal
        size="small"
        open={newMessageModal}
        onClose={onModalClose}
        closeIcon
        closeOnDimmerClick
      >
        {/* Modal header displaying sender's name */}

        <Modal.Header
          content={`New Message from ${newMessageReceived.senderName}`}
        />

        <Modal.Content>
          {/* Display the received message, sender's profile picture, and timestamp */}

          <div className="bubbleWrapper">
            <div className="inlineContainer">
              <img
                className="inlineIcon"
                src={newMessageReceived.senderProfilePic}
              />
            </div>

            <div className="otherBubble other">{newMessageReceived.msg}</div>

            <span className="other">
              {calculateTime(newMessageReceived.date)}
            </span>
          </div>
          {/* Message input form with reply button */}

          <div style={{ position: "sticky", bottom: "0px" }}>
            <Segment secondary color="blue" attached="top">
              <Form reply onSubmit={formSubmit}>
                <Form.Input
                  size="large"
                  placeholder="Send New Message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  action={{
                    color: "blue",
                    icon: "telegram plane",
                    disabled: text === "",
                    loading: loading,
                  }}
                />
              </Form>
            </Segment>
          </div>
          {/* View all messages link and instructions */}
          <div style={{ marginTop: "5px" }}>
            <Link href={`/messages?message=${newMessageReceived.sender}`}>
              <a>View All Messages</a>
            </Link>

            <br />
            {/* Instructions for disabling the message popup */}
            <Instructions username={user.username} />
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}
// Instructions component for displaying guidance on disabling message popup
const Instructions = ({ username }) => (
  <List>
    <List.Item>
      <Icon name="help" />
      <List.Content>
        <List.Header>
          If you do not like this message popup to appear when you receive a new
          message:
        </List.Header>
      </List.Content>
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      <List.Content>
        You can disable it by going to your
        <Link href={`/${username}`}>
          <a> Account </a>
        </Link>
        page and clicking on the Settings tab header.
      </List.Content>
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      Inside the menu, there will be a setting named: Show New Message Popup?
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      Just toggle the setting to disable/enable this feature.
    </List.Item>
  </List>
);

export default MessageNotificationModal;
