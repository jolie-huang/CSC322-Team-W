import React, { useState, useRef } from "react";
import { Form, Button, Message, Divider, Segment } from "semantic-ui-react";
import ImageDropDiv from "../Common/ImageDropDiv";
import CommonInputs from "../Common/CommonInputs";
import uploadPic from "../../utils/uploadPicToCloudinary";
import { profileUpdate } from "../../utils/profileActions";
// UpdateProfile component

function UpdateProfile({ Profile }) {
  // State to manage profile data

  const [profile, setProfile] = useState({
    profilePicUrl: Profile.user.profilePicUrl,
    bio: Profile.bio || "",
    facebook: (Profile.social && Profile.social.facebook) || "",
    instagram: (Profile.social && Profile.social.instagram) || "",
    twitter: (Profile.social && Profile.social.twitter) || "",
    linkedin: (Profile.social && Profile.social.linkedin) || "",
    github: (Profile.social && Profile.social.github) || "",
    youtube: (Profile.social && Profile.social.youtube) || "",
  });
  // State for error message
  const [errorMsg, setErrorMsg] = useState(null);
  // State for loading state during form submission
  const [loading, setLoading] = useState(false);
  // State to toggle the visibility of social links section
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  // State to highlight the image drop area
  const [highlighted, setHighlighted] = useState(false);
  // Ref for the input element
  const inputRef = useRef();
  // State for the selected media file (image)
  const [media, setMedia] = useState(null);
  // State for the media preview (image preview)
  const [mediaPreview, setMediaPreview] = useState(null);

  // Function to handle input change in the form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // If the input is for media (image), update media state and preview

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
    // Update the profile state based on the input name and value

    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {" "}
      {/* Form for updating the profile */}
      <Form
        error={errorMsg !== null}
        loading={loading}
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          let profilePicUrl;
          // If a new media (image) is selected, upload it to Cloudinary

          if (media !== null) {
            profilePicUrl = await uploadPic(media);
          }
          // Handle the case where the image upload fails

          if (media !== null && !profilePicUrl) {
            setLoading(false);
            return setErrorMsg("Error Uploading Image!");
          }
          // Call the profileUpdate function to update the profile

          await profileUpdate(profile, setLoading, setErrorMsg, profilePicUrl);
        }}
      >
        {/* Display error message */}

        <Message
          onDismiss={() => setErrorMsg(false)}
          error
          content={errorMsg}
          attached
          header="Oh no!"
        />
        {/* ImageDropDiv component for handling image upload */}

        <ImageDropDiv
          inputRef={inputRef}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          handleChange={handleChange}
          mediaPreview={mediaPreview}
          setMediaPreview={setMediaPreview}
          setMedia={setMedia}
          profilePicUrl={profile.profilePicUrl}
        />
        {/* Segment for common input fields */}

        <Segment inverted>
          <CommonInputs
            user={profile}
            handleChange={handleChange}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}
          />
        </Segment>

        <Divider hidden />

        <Button
          color="blue"
          icon="pencil alternate"
          disabled={profile.bio === "" || loading}
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default UpdateProfile;
