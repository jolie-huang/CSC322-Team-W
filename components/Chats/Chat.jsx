import React from "react";
import {
  Divider,
  Comment,
  Icon,
  List,
  Popup,
  Button,
  Header,
} from "semantic-ui-react";
import { useRouter } from "next/router";
import calculateTime from "../../utils/calculateTime";
// Chat component for displaying individual chat entries
function Chat({ chat, connectedUsers, deleteChat }) {
  // Next.js router instance
  const router = useRouter();
  // Check if the user is online based on connected users
  const isOnline =
    connectedUsers.length > 0 &&
    connectedUsers.filter((user) => user.userId === chat.messagesWith).length >
      0;

  return (
    <>
      {/* List component for selection of chat entries */}
      <List selection>
        {/* List item representing a chat entry */}
        <List.Item
          // Set as active if it matches the current message query in the URL
          active={router.query.message === chat.messagesWith}
          // Click handler to navigate to the chat when clicked
          onClick={() =>
            router.push(`/messages?message=${chat.messagesWith}`, undefined, {
              shallow: true,
            })
          }
        >
          {/* Comment component representing the chat entry */}
          <Comment>
            {/* Avatar of the chat user */}

            <Comment.Avatar src={chat.profilePicUrl} />
            <Comment.Content>
              {/* Author (name) of the chat user */}

              <Comment.Author as="a">
                {chat.name} {/* Display a green circle if the user is online */}
                {isOnline && <Icon name="circle" size="small" color="green" />}
              </Comment.Author>
              {/* Metadata section including the date and delete option */}
              <Comment.Metadata>
                <div>{calculateTime(chat.date)}</div>
                {/* Delete option with confirmation popup */}
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {/* Popup for delete confirmation */}
                  <Popup
                    on="click"
                    position="top right"
                    trigger={
                      <Icon
                        name="trash"
                        color="red"
                        style={{ cursor: "pointer" }}
                        size="large"
                        floated="right"
                        fitted
                      />
                    }
                  >
                    {/* Header and content of the delete confirmation popup */}
                    <Header as="h4" content="Are you sure?" />
                    <p>This action is irreversible!</p>

                    <Button
                      color="red"
                      icon="trash"
                      content="Delete"
                      onClick={() => deleteChat(chat.messagesWith)}
                    />
                  </Popup>
                </div>
              </Comment.Metadata>
              {/* Text section showing the last message in the chat */}
              <Comment.Text>
                {chat.lastMessage.length > 20
                  ? `${chat.lastMessage.substring(0, 20)} ...`
                  : chat.lastMessage}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </List.Item>
      </List>
      <Divider />
    </>
  );
}

export default Chat;
