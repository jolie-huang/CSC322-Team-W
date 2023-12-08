import React, { useState, useEffect } from "react";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import cookie from "js-cookie";
import { loginUser } from "../utils/authUser";
import {
  HeaderMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";

function Login() {
  const [user, setUser] = useState({
    // State to manage user input (email and password)
    email: "",
    password: "",
  });
  const { email, password } = user;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Effect to enable or disable the submit button based on user input
  useEffect(() => {
    const isUser = Object.values({ email, password }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    await loginUser(user, setErrorMsg, setFormLoading);
  };

  // Effect to set the document title and pre-fill the email if available in cookies
  useEffect(() => {
    document.title = "Welcome Back!";
    const userEmail = cookie.get("userEmail");
    if (userEmail) setUser((prev) => ({ ...prev, email: userEmail }));
  }, []);

  return (
    <>
      {/* Displaying a welcome message header */}
      <HeaderMessage />
      {/* Login form */}
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleSubmit}
      >
        {/* Displaying error message, if any */}
        <Message
          error
          header="Oh no!"
          content={
            <>
              {errorMsg} <br />
              {errorMsg === "Invalid Credentials!" && (
                <b style={{ color: "black" }}>
                  Still having difficulties? Contact SocialPulse at &#160;
                  <a href="mailto:socialpulse@support.com">
                    socialpulse@support.com
                  </a>
                </b>
              )}
            </>
          }
          onDismiss={() => setErrorMsg(null)}
        />
        {/* Form segment with input fields */}
        <Segment inverted>
          {/* Email input field */}
          <Form.Input
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
          />
          {/* Password input field with option to show/hide password */}
          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: showPassword ? "eye slash" : "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            type={showPassword ? "text" : "password"}
            required
          />
          {/* Divider and the Login button */}
          <Divider hidden />
          <Button
            icon="signup"
            content="Login"
            type="submit"
            color="blue"
            disabled={submitDisabled}
          />
        </Segment>
      </Form>

      <FooterMessage />
    </>
  );
}

export default Login;
