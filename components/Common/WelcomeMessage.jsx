import { Icon, Message, Divider } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

// Component for a header message with signup and login links
export const TrendyHeaderMessage = () => {
  return (
    <>
      {/* Message for welcoming new users with signup link */}
      <Message
        attached="bottom"
        style={{
          backgroundColor: "#0f3368",
          color: "#ffffff",
          fontSize: "15px",
        }}
      >
        <Icon name="heart" color="violet" size="large" />
        Welcome to SocialPulse!<Link href="/signup"> SignUp</Link> Here!
      </Message>
      <Divider hidden />

      {/* Message for existing users with login link */}
      <Message
        attached="bottom"
        style={{
          marginTop: "-20px",
          backgroundColor: "#0f3368",
          color: "#ffffff",
          fontSize: "15px",
        }}
      >
        <Icon name="help" color="red" size="large" />
        Existing User? <Link href="/login">Login</Link> Here!{" "}
      </Message>
    </>
  );
};

// Component for the header message during login or signup
export const HeaderMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";
  return (
    <Message
      color="blue"
      attached
      header={signupRoute ? "Get Connected!" : "Glad that you are back!"}
      icon={signupRoute ? "user plus" : "thumbs up"}
      content={
        signupRoute ? "Create New Account" : "Login with Email and Password"
      }
    />
  );
};

// Component for the footer message with login, signup, and reset password links
export const FooterMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";

  return (
    <>
      {signupRoute ? (
        // Message for existing users during signup with login link
        <>
          <Message
            attached="bottom"
            style={{ backgroundColor: "#0f3368", color: "#ffffff" }}
          >
            <Icon name="help" color="red" />
            Existing User? <Link href="/login">Login</Link> Here!{" "}
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          {/* // Messages for existing users during login with reset password and
          signup links */}
          <Message attached="bottom" color="red">
            <Icon name="lock" />
            <Link href="/reset">Forgot Password?</Link>
          </Message>
          <Message
            attached="bottom"
            style={{ backgroundColor: "#0f3368", color: "#ffffff" }}
          >
            <Icon name="help" color="red" />
            New User? <Link href="/signup">SignUp</Link> Here!{" "}
          </Message>
        </>
      )}
    </>
  );
};
