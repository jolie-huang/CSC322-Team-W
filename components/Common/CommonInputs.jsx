import React from "react";
import { Form, Button, Message, TextArea, Divider } from "semantic-ui-react";

// Component for rendering common input fields used in user profile and settings
function CommonInputs({
  user: { bio, facebook, instagram, twitter, linkedin, github, youtube },
  handleChange,
  showSocialLinks,
  setShowSocialLinks,
}) {
  return (
    <>
      {/* Text area for user bio/description */}
      <Form.Field
        label="Description"
        control={TextArea}
        name="bio"
        value={bio}
        onChange={handleChange}
        placeholder="This description will help you to connect with other people."
        required
      />
      {/* Button to toggle display of social links */}
      <Button
        content="Add Social Links"
        color="google plus"
        icon="at"
        type="button"
        onClick={() => setShowSocialLinks(!showSocialLinks)}
      />
      {/* Display social links if showSocialLinks is true */}
      {showSocialLinks && (
        <>
          <Divider />
          {/* Input field for social media links */}
          <Form.Input
            icon="facebook f"
            iconPosition="left"
            name="facebook"
            value={facebook}
            onChange={handleChange}
          />

          <Form.Input
            icon="instagram"
            iconPosition="left"
            name="instagram"
            value={instagram}
            onChange={handleChange}
          />

          <Form.Input
            icon="twitter"
            iconPosition="left"
            name="twitter"
            value={twitter}
            onChange={handleChange}
          />

          <Form.Input
            icon="linkedin"
            iconPosition="left"
            name="linkedin"
            value={linkedin}
            onChange={handleChange}
          />

          <Form.Input
            icon="github"
            iconPosition="left"
            name="github"
            value={github}
            onChange={handleChange}
          />

          <Form.Input
            icon="youtube"
            iconPosition="left"
            name="youtube"
            value={youtube}
            onChange={handleChange}
          />

          <Message
            icon="attention"
            info
            size="small"
            header="Social Media Links Are Optional!"
          />
        </>
      )}
    </>
  );
}

export default CommonInputs;
