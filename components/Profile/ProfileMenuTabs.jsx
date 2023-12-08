import React from "react";
import { Menu, Container } from "semantic-ui-react";
// Defining a functional component named 'ProfileMenuTabs' that takes several props as parameters.
function ProfileMenuTabs({
  user,
  activeItem,
  handleItemClick,
  followersLength,
  followingLength,
  ownAccount,
  loggedUserFollowStats,
}) {
  return (
    <>
      {/* Creating a semantic UI Menu component with specific styles */}

      <Menu pointing secondary inverted stackable>
        {/* Using a semantic UI Container component to limit the width of the menu */}

        <Container text>
          {/* Menu item for the 'Profile' tab */}

          <Menu.Item
            name="profile"
            active={activeItem === "profile"}
            onClick={() => handleItemClick("profile")}
          />
          {/* Menu item for the 'Followers' tab, displaying the number of followers */}

          <Menu.Item
            name={`${followersLength} followers`}
            active={activeItem === "followers"}
            onClick={() => handleItemClick("followers")}
          />
          {/* Conditionally rendering additional menu items based on user role and account ownership */}

          {ownAccount && user.role !== "Super" && (
            <>
              {/* Menu item for the 'Following' tab, displaying the number of users being followed */}

              <Menu.Item
                name={`${
                  loggedUserFollowStats.following.length > 0
                    ? loggedUserFollowStats.following.length
                    : 0
                } following`}
                active={activeItem === "following"}
                onClick={() => handleItemClick("following")}
              />

              {/* Menu item for updating the user's profile */}

              <Menu.Item
                name="Update Profile"
                active={activeItem === "updateProfile"}
                onClick={() => handleItemClick("updateProfile")}
              />

              {/* Menu item for the 'Settings' tab */}
              <Menu.Item
                name="settings"
                active={activeItem === "settings"}
                onClick={() => handleItemClick("settings")}
              />

              {/* Menu item for the 'Warnings' tab */}
              <Menu.Item
                name="warnings"
                active={activeItem === "warnings"}
                onClick={() => handleItemClick("warnings")}
              />
            </>
          )}
          {/* Conditionally rendering additional menu items based on user role and account ownership */}
          {ownAccount && user.role === "Super" && (
            <>
              {/* Menu item for the 'Following' tab, displaying the number of users being followed */}

              <Menu.Item
                name={`${
                  loggedUserFollowStats.following.length > 0
                    ? loggedUserFollowStats.following.length
                    : 0
                } following`}
                active={activeItem === "following"}
                onClick={() => handleItemClick("following")}
              />

              {/* Menu item for updating the user's profile */}
              <Menu.Item
                name="Update Profile"
                active={activeItem === "updateProfile"}
                onClick={() => handleItemClick("updateProfile")}
              />

              {/* Menu item for the 'Settings' tab */}

              <Menu.Item
                name="settings"
                active={activeItem === "settings"}
                onClick={() => handleItemClick("settings")}
              />
            </>
          )}

          {/* Conditionally rendering a menu item for the 'Connecting' tab based on account ownership */}

          {!ownAccount && (
            <Menu.Item
              name={`${followingLength} connecting`}
              active={activeItem === "following"}
              onClick={() => handleItemClick("following")}
            />
          )}

          {/* Conditionally rendering a menu item for the 'Warnings' tab based on account ownership and user role */}
          {!ownAccount && user.role === "Super" && (
            <Menu.Item
              name="warnings"
              active={activeItem === "warnings"}
              onClick={() => handleItemClick("warnings")}
            />
          )}
        </Container>
      </Menu>
    </>
  );
}

export default ProfileMenuTabs;
