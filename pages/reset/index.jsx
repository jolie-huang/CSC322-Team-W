import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Message, Segment } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchErrors";

function ResetPage() {
  const [email, setEmail] = useState(""); // State to manage the email input field
  const [errorMsg, setErrorMsg] = useState(null); // State to manage error messages during form submission
  const [emailChecked, setEmailChecked] = useState(false); // State to track whether the email has been checked
  const [loading, setLoading] = useState(false); // State to manage loading state during form submission

  // Function to handle the password reset process
  const resetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Making a POST request to initiate the password reset
      await axios.post(`${baseUrl}/api/reset`, { email });
      // Setting emailChecked state to true upon successful request
      setEmailChecked(true);
    } catch (error) {
      setErrorMsg(catchErrors(error));
    }
    // Setting loading state to false after form submission
    setLoading(false);
  };

  // Effect to dismiss the error message after 5 seconds
  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  return (
    <>
      {/* Displaying success message if the email has been checked */}
      {emailChecked ? (
        <Message
          attached
          icon="mail"
          header="Check Your Inbox"
          content="Please check your inbox for further instructions"
          success
        />
      ) : (
        <Message attached icon="settings" header="Reset Password" color="red" />
      )}

      {/* Password reset form */}
      <Form
        loading={loading}
        onSubmit={resetPassword}
        error={errorMsg !== null}
      >
        <Message error header="Oh no!" content={errorMsg} />
        {/* Form segment with email input field */}
        <Segment>
          <Form.Input
            fluid
            icon="mail outline"
            type="email"
            iconPosition="left"
            label="Email"
            placeholder="Enter email address"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          {/* Submit button */}
          <Button
            disabled={loading || email.length === 0}
            icon="configure"
            type="submit"
            color="blue"
            content="Submit"
          />
        </Segment>
      </Form>
    </>
  );
}

export default ResetPage;
