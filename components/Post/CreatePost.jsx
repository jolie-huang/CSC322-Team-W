import React, { useState, useRef } from "react";
import {
  Form,
  Button,
  Image,
  Divider,
  Message,
  Icon,
  Dropdown,
} from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";
import uploadVid from "../../utils/uploadVidToCloudinary";
import { submitNewPost } from "../../utils/postActions";
import CropImageModal from "./CropImageModal";
import keywordss from "../../utils/keyWords";

function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({
    // Initial values for the new post.
    text: "",
    location: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const addStyles = () => ({
    textAlign: "center",
    height: "150px",
    width: "150px",
    border: "dotted",
    paddingTop: media === null && "60px",
    cursor: "pointer",
    borderColor: highlighted ? "green" : "black",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    // handeling if user posts a video or image and any possible errors
    if (media !== null) {
      if (typeof media === "object" && media.type) {
        if (media.type.startsWith("image/")) {
          picUrl = await uploadPic(media);
          if (!picUrl) {
            setLoading(false);
            return setError("Error Uploading Image!");
          }
        } else if (media.type.startsWith("video/")) {
          picUrl = await uploadVid(media);
          if (!picUrl) {
            setLoading(false);
            return setError("Error Uploading Video!");
          }
        }
      } else if (typeof media === "string" && media.startsWith("data:image/")) {
        picUrl = await uploadPic(media);
        if (!picUrl) {
          setLoading(false);
          return setError("Error Uploading Image!");
        }
      } else if (typeof media === "string" && media.startsWith("data:video/")) {
        picUrl = await uploadVid(media);
        if (!picUrl) {
          setLoading(false);
          return setError("Error Uploading Video!");
        }
      }
    }

    await submitNewPost(
      newPost.text,
      newPost.location,
      newPost.company,
      type,
      keywords,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  // Creating variables for the different post type options.
  const postTypeOptions = [
    { key: "Regular", text: "Regular Post", value: "Regular" },
    { key: "Ad", text: "Ad Post", value: "Ad" },
    { key: "Job", text: "Job Post", value: "Job" },
  ];

  const [type, setType] = useState("");

  const [keywords, setKeywords] = useState([]);

  // Transform the keywords array into options required by the Dropdown component.
  const keywordsOptions = keywordss.map((keyword) => ({
    key: keyword,
    text: keyword,
    value: keyword,
  }));

  const handleDropdownChangeType = (e, { value }) => {
    // Update the state with the selected value.
    setType(value);
  };

  const handleDropdownChangeKeywords = (e, { value }) => {
    // Update the state with the selected value.
    setKeywords((prevKeywords) => [...prevKeywords, value]);
  };

  return (
    <>
      {/* allowing users to crop their image */}
      {showModal && (
        <CropImageModal
          mediaPreview={mediaPreview}
          setMedia={setMedia}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      {/* handeling if there is an error  */}
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oh no!"
        />

        <Form.Group>
          {/* area to type text for post */}
          <Image src={user.profilePicUrl} circular avatar inline />
          <Form.TextArea
            placeholder="What's New?"
            name="text"
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Field>
          {/* allowing users to choose keywords */}
          <label>Keywords</label>
          <Dropdown
            placeholder="Select Keywords"
            fluid
            multiple
            selection
            search
            options={keywordsOptions}
            onChange={handleDropdownChangeKeywords}
          />
        </Form.Field>

        {/* allowing users to add a location to their post */}
        <Form.Group>
          <Form.Input
            value={newPost.location}
            name="location"
            onChange={handleChange}
            label="Add Location"
            icon="map marker alternate"
            placeholder="Location?"
          />
          {/* only allowing corporate or super users to write a company for their post */}
          {(user.role === "Super" || user.role === "Corporate") && (
            <Form.Input
              value={newPost.company}
              name="company"
              onChange={handleChange}
              label="Add Company"
              icon="briefcase"
              placeholder="Company name?"
            />
          )}

          {/* allowing users to choose their post type */}
          {(user.role === "Super" || user.role === "Corporate") && (
            <Form.Dropdown
              label="Post Type"
              placeholder="Post Type?"
              options={
                user.role === "Super" || user.role === "Corporate"
                  ? postTypeOptions // Display all options for Super or Corporate users
                  : postTypeOptions.filter(
                      (option) => option.value === "Regular"
                    ) // Display only "Regular Post" for other users
              }
              onChange={handleDropdownChangeType}
              search
              selection
              clearable
            />
          )}
          {/* accepted media are images and videos */}
          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            type="file"
            accept="image/*, video/*"
          />
        </Form.Group>

        <div
          onClick={() => inputRef.current.click()}
          style={addStyles()}
          onDrag={(e) => {
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

            const droppedFile = Array.from(e.dataTransfer.files);

            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }}
        >
          {/* plus icon to display when there is no media */}
          {media === null ? (
            <Icon name="plus" size="big" />
          ) : (
            <div style={{ textAlign: "center" }}>
              {(typeof media === "object" &&
                media.type &&
                media.type.startsWith("image/")) ||
              (typeof media === "string" && media.startsWith("data:image/")) ? (
                <Image
                  style={{ height: "150px", width: "150px" }}
                  src={mediaPreview}
                  alt="PostImage"
                  centered
                  size="medium"
                />
              ) : (
                <video width="150" height="150" controls>
                  <source src={mediaPreview} type={media.type} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </div>
        {/* displaying crop button for images only */}
        {mediaPreview !== null &&
          media !== null &&
          (typeof media === "object"
            ? media.type.startsWith("image/")
            : typeof media === "string" && media.startsWith("data:image/")) && (
            <>
              <Divider hidden />
              <Button
                content="Crop Image"
                type="button"
                primary
                circular
                onClick={() => setShowModal(true)}
              />
            </>
          )}

        <Divider hidden />

        {/* send button for the post */}
        <Button
          circular
          disabled={newPost.text === "" || loading}
          content={<strong>Post</strong>}
          style={{ backgroundColor: "#1DA1F2", color: "white" }}
          icon="send"
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  );
}

export default CreatePost;
