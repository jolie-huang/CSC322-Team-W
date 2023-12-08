import React, { useState } from "react";
import { Form, Segment } from "semantic-ui-react";

function MessageInputField({ sendMsg }) {
  // State to track the text input value and loading state
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  // Container with sticky positioning at the bottom of the screen
  return (
    <div style={{ position: "sticky", bottom: "0" }}>
      {/* Segment component for styling and containing the message input form */}
      <Segment secondary color="black" attached="bottom">
        {/* Form component for handling new message submission */}

        <Form
          reply
          onSubmit={(e) => {
            // Prevent the default form submission behavior
            e.preventDefault();
            // Call the sendMsg function with the current text input value
            sendMsg(text);
            // Clear the text input after sending the message
            setText("");
          }}
        >
          {/* Input field for typing new messages */}
          <Form.Input
            size="large"
            placeholder="Send New Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            // Action component with send button, disabled if text is empty
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
  );
}

export default MessageInputField;
