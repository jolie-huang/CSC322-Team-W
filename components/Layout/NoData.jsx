import { Message, Button } from "semantic-ui-react";

// Message component for when there are no profile posts
export const NoProfilePosts = () => (
  <>
    <Message
      info
      icon="thumbs down"
      header="No Posts?"
      content="User has not posted anything yet!"
    />
    <Button
      icon="long arrow alternate left"
      content="Go Post"
      as="a"
      href="/"
    />
  </>
);

// Message components for different scenarios when there's no follow data
export const NoFollowData = ({ followersComponent, followingComponent }) => (
  <>
    {/* Displayed when there are no followers */}
    {followersComponent && (
      <Message
        icon="user outline"
        info
        content={`User does not have connections!`}
      />
    )}

    {/* Displayed when there are no users being followed */}
    {followingComponent && (
      <Message
        icon="user outline"
        info
        content={`User has not been following  any user!`}
      />
    )}
  </>
);

// Message component for when there are no messages
export const NoMessages = () => (
  <Message
    info
    icon="talk"
    header="No Messages?"
    content="You have not messaged anyone yet. Search above to message someone!"
  />
);

// Message component for when there are no posts
export const NoPosts = () => (
  <Message
    info
    icon="thumbs down"
    header="Hey!"
    content="No Posts. Make sure you have followed someone."
  />
);

// Message component for when no profile is found
export const NoProfile = () => (
  <Message info icon="meh" header="Hey!" content="No Profile Found." />
);

// Message component for when there are no notifications
export const NoNotifications = () => (
  <Message
    info
    icon="thumbs up"
    content="No Notifications! You are good to Go!"
  />
);

// Message component for when there are no trendy posts
export const NoTrendyPosts = () => (
  <Message
    info
    icon="thumbs down"
    header="Hey!"
    content="No Popular Posts! SignUp to be the Write One!"
  />
);
