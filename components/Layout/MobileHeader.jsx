import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu, Container, Icon, Dropdown } from "semantic-ui-react";
import { logoutUser } from "../../utils/authUser";

function MobileHeader({ user }) {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;
  const [dark, setDark] = useState(false);

  // Function to toggle between dark and light themes
  const toggleDarkMode = () => {
    const body = document.body;
    if (dark) {
      setDark(false);
    } else {
      setDark(true);
    }
    // Setting body background and text color based on dark mode state
    if (dark) {
      body.style.backgroundColor = "#23272f";
      body.style.color = "#23272f";
    } else {
      body.style.backgroundColor = "#808080";
      body.style.color = "#23272f";
    }
  };
  return (
    <>
      {/* Mobile Header Menu */}
      <Menu fluid borderless>
        <Container text>
          {/* Home */}
          <Link href="/">
            <Menu.Item header active={isActive("/")}>
              <Icon name="home" size="large" />
            </Menu.Item>
          </Link>

          {/* Messages */}
          <Link href="/messages">
            <Menu.Item
              header
              active={isActive("/messages") || user.unreadMessage}
            >
              <Icon
                name={user.unreadMessage ? "hand point right" : "mail outline"}
                size="large"
                fitted
              />
            </Menu.Item>
          </Link>

          {/* Notifications */}
          <Link href="/notifications">
            <Menu.Item
              header
              active={isActive("/notifications") || user.unreadNotification}
            >
              <Icon
                name={
                  user.unreadNotification ? "hand point right" : "bell outline"
                }
                size="large"
                fitted
              />
            </Menu.Item>
          </Link>
          {/* Dark mode toggle */}
          <Menu.Item header>
            <Dropdown.Item onClick={toggleDarkMode}>
              <Icon
                name="sun"
                size="large"
                style={{ color: "#23272f" }}
                fitted
              />
            </Dropdown.Item>{" "}
          </Menu.Item>

          <Dropdown item icon="bars" direction="left">
            <Dropdown.Menu>
              {/* Search */}
              <Link href="/search">
                <Dropdown.Item active={isActive("/search")}>
                  <Icon name="search" size="large" />
                  Users
                </Dropdown.Item>
              </Link>
              {/* Trendy Tab*/}
              <Link href="/trendy">
                <Dropdown.Item active={isActive("/trendy")}>
                  <Icon name="star" size="large" />
                  Trendy
                </Dropdown.Item>
              </Link>
              {/* Extensive Search */}
              <Link href="/extsearch">
                <Dropdown.Item active={isActive("/extsearch")}>
                  <Icon name="search" size="large" />
                  Search
                </Dropdown.Item>
              </Link>
              {/* Account */}
              <Link href={`/${user.username}`}>
                <Dropdown.Item active={isActive(`/${user.username}`)}>
                  <Icon name="user" size="large" />
                  Account
                </Dropdown.Item>
              </Link>

              {/* Logout */}
              <Dropdown.Item onClick={() => logoutUser(user.email)}>
                <Icon name="sign out alternate" size="large" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
    </>
  );
}

export default MobileHeader;
