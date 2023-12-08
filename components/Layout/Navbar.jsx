import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu, Container, Icon } from "semantic-ui-react";

function Navbar() {
  // Get the current router instance
  const router = useRouter();
  // Function to check if a given route is active
  const isActive = (route) => router.pathname === route;

  return (
    // The top-level container for the navigation bar
    <Menu fluid borderless inverted>
      {/* Container for the menu items */}
      <Container text>
        {/* Link to the "/popular" route */}
        <Link href="/popular">
          {/* Menu item for the "Popular" link */}
          <Menu.Item header active={isActive("/popular")}>
            {/* Icon and text for the "Popular" link */}
            {router.pathname === "/popular" ? (
              // Render a yellow star icon if the link is active
              <Icon size="large" name="star" color="yellow" />
            ) : (
              // Render a standard star icon if the link is not active
              <Icon size="large" name="star" />
            )}
            Popular
          </Menu.Item>
        </Link>

        {/* Link to the "/login" route */}
        <Link href="/login">
          {/* Menu item for the "Login" link */}
          <Menu.Item header active={isActive("/login")}>
            {/* Icon and text for the "Login" link */}
            {router.pathname === "/login" ? (
              // Render a blue "sign in" icon if the link is active
              <Icon size="large" name="sign in" color="blue" />
            ) : (
              // Render a standard "sign in" icon if the link is not active
              <Icon size="large" name="sign in" />
            )}
            Login
          </Menu.Item>
        </Link>

        {/* Link to the "/signup" route */}
        <Link href="/signup">
          {/* Menu item for the "SignUp" link */}
          <Menu.Item header active={isActive("/signup")}>
            {/* Icon and text for the "SignUp" link */}
            {router.pathname === "/signup" ? (
              // Render a green "signup" icon if the link is active
              <Icon size="large" name="signup" color="green" />
            ) : (
              // Render a standard "signup" icon if the link is not active
              <Icon size="large" name="signup" />
            )}
            SignUp
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
}

export default Navbar;
