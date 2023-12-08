import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchErrors";

function TokenPage() {
  const router = useRouter(); // Next.js router instance
  const [newPassword, setNewPassword] = useState({ field1: "", field2: "" }); // State to manage new password input fields
  const { field1, field2 } = newPassword; // Destructuring field1 and field2 from the newPassword state
  const [loading, setLoading] = useState(false); // State to manage loading state during form submission
  const [errorMsg, setErrorMsg] = useState(null); // State to manage error messages during form submission
  const [success, setSuccess] = useState(false); // State to track whether the password reset was successful
  // Function to handle changes in the input fields

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewPassword((prev) => ({ ...prev, [name]: value }));
  };
  // Effect to dismiss the error message after 5 seconds
  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);
  // Function to handle the password reset
  const resetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Checking if the passwords match

      if (field1 !== field2) {
        return setErrorMsg("Passwords do not match");
      }
      // Making a POST request to reset the password
      await axios.post(`${baseUrl}/api/reset/token`, {
        password: field1,
        token: router.query.token,
      });
      // Setting the success state to true
      setSuccess(true);
    } catch (error) {
      setErrorMsg(catchErrors(error));
    }
    // Setting the loading state to false after form submission
    setLoading(false);
  };

  return (
    <>
      {/* Displaying success message if the password reset was successful */}
      {success ? (
        <Message
          attached
          success
          size="large"
          header="Password reset successfull"
          icon="check"
          content="Login Again"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/login")}
        />
      ) : (
        <Message
          attached
          icon="settings"
          header="Reset Password"
          color="blue"
        />
      )}
      {/* Displaying the password reset form if success is false */}
      {!success && (
        <Form
          loading={loading}
          onSubmit={resetPassword}
          error={errorMsg !== null}
        >
          {/* Displaying error message, if any */}
          <Message error header="Oh no!" content={errorMsg} />
          {/* Form segment with password input fields */}
          <Segment>
            {/* New Password input field */}
            <Form.Input
              fluid
              icon="eye"
              type="password"
              iconPosition="left"
              label="New Password"
              placeholder="Enter new Password"
              name="field1"
              onChange={handleChange}
              value={field1}
              required
            />
            {/* Confirm Password input field */}
            <Form.Input
              fluid
              icon="eye"
              type="password"
              iconPosition="left"
              label="Confirm Password"
              placeholder="Confirm new Password"
              name="field2"
              onChange={handleChange}
              value={field2}
              required
            />
            {/* Divider and the Reset button */}
            <Divider hidden />
            <Button
              disabled={field1 === "" || field2 === "" || loading}
              icon="configure"
              type="submit"
              color="green"
              content="Reset"
            />
          </Segment>
        </Form>
      )}
    </>
  );
}

export default TokenPage;
