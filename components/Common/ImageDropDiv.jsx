import React from "react";
import { Form, Segment, Image, Icon, Header } from "semantic-ui-react";
import { useRouter } from "next/router";
// A reusable component for handling image upload and display
function ImageDropDiv({
  highlighted,
  setHighlighted,
  inputRef,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia,
  profilePicUrl,
}) {
  const router = useRouter();

  const signupRoute = router.pathname === "/signup";

  // Function to render header based on the current route (signup or not)
  const checkForSignupPage = () =>
    signupRoute ? (
      <>
        <Header icon>
          <Icon
            name="file image outline"
            style={{ cursor: "pointer" }}
            onClick={() => inputRef.current.click()}
            size="huge"
            fitted
          />
          Drag n Drop or Click to upload image
        </Header>
      </>
    ) : (
      <span style={{ textAlign: "center" }}>
        <Image
          src={profilePicUrl}
          alt="Profile pic"
          style={{ cursor: "pointer" }}
          onClick={() => inputRef.current.click()}
          size="huge"
          centered
        />
        Drag n Drop or Click to upload image
      </span>
    );

  return (
    <>
      <Form.Field>
        {/* Segment acting as a placeholder for the image drop area */}
        <Segment placeholder basic secondary>
          {/* Input element for file selection (hidden) */}
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
            ref={inputRef}
          />
          {/* Div acting as the drop area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setHighlighted(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setHighlighted(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setHighlighted(true);
              // Extract the dropped file and update media state and preview
              const droppedFile = Array.from(e.dataTransfer.files);
              setMedia(droppedFile[0]);
              setMediaPreview(URL.createObjectURL(droppedFile[0]));
            }}
          >
            {/* Render appropriate content based on whether there is a media preview */}
            {mediaPreview === null ? (
              <>
                {/* Placeholder Segment for the drop area */}

                <Segment
                  {...(highlighted && { color: "blue" })}
                  placeholder
                  basic
                >
                  {checkForSignupPage()}
                </Segment>
              </>
            ) : (
              <Segment color="blue" placeholder basic>
                <Image
                  src={mediaPreview}
                  size="medium"
                  centered
                  style={{ cursor: "pointer" }}
                  onClick={() => inputRef.current.click()}
                />
              </Segment>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
}

export default ImageDropDiv;
