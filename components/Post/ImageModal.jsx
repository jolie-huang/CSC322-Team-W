import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Button,
  Popup,
  Header,
  Modal,
  Label,
  Form,
  TextArea,
  Grid,
  Message,
  Embed,
} from "semantic-ui-react";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputField";
import calculateTime from "../../utils/calculateTime";
import {
  deletePost,
  likePost,
  dislikePost,
  reportPost,
  readPost,
  tipPost,
} from "../../utils/postActions";
import LikesList from "./LikesList";
import DisLikesList from "./DisLikesList";
import ReportPostList from "./ReportPostList";
import ReadsList from "./ReadsList";

function ImageModal({
  post,
  user,
  setLikes,
  setDisLikes,
  likes,
  dislikes,
  isLiked,
  isDisLiked,
  setPosts,
  setShowToastr,
  comments,
  setComments,
}) {
  const [reads, setReads] = useState(post.reads);
  const hasRead = post.reads.some((read) => read.user.toString() === user._id);
  const [isRead, setIsRead] = useState(hasRead);
  const [tip, setTip] = useState(1);
  const [reports, setReports] = useState(post.reports);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  // function to handle when a user clicks the "Read" button
  const readPostOnClick = () => {
    setShowFullText(!showFullText);
    readPost(post._id, user._id, setReads);
    setIsRead(true);
  };

  const [open2, setOpen2] = useState(false);

  // creating variables for the different tip options
  const tipTypeOptions = [
    { key: "One", text: "$1", value: 1 },
    { key: "Five", text: "$5", value: 5 },
    { key: "Ten", text: "$10", value: 10 },
  ];

  const handleDropdownChangeTip = async (e, { value }) => {
    // Update the state with the selected value.
    setTip(value);
    await tipPost(post, user, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await reportPost(
      post,
      user,
      text,
      setReports,
      setText,
      setError,
      setOpenReport
    );
    setLoading(false);
  };

  let isvideo = false;
  // distinguising between image or video media
  if (post.picUrl) {
    isvideo = post.picUrl.endsWith(".mp4");
  }

  const [showFullText, setShowFullText] = useState(false);
  return (
    <>
      <Grid columns={2} stackable relaxed>
        <Grid.Column>
          <Modal.Content image>
            <Image wrapped size="large" src={post.picUrl} />
          </Modal.Content>
        </Grid.Column>

        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Image
                floated="left"
                src={post.user.profilePicUrl}
                avatar
                circular
              />
              {/* only allowing super user and this user to have the delete post button */}
              {(user.role === "Super" || post.user._id === user._id) && (
                <>
                  <Popup
                    on="click"
                    position="top right"
                    trigger={
                      <Image
                        src="/deleteIcon.svg"
                        style={{ cursor: "pointer" }}
                        size="mini"
                        floated="right"
                      />
                    }
                  >
                    <Header as="h4" content="Are you sure?" />

                    <p>This action is irreversible!</p>

                    <Button
                      color="red"
                      icon="trash"
                      content="Delete"
                      onClick={() =>
                        deletePost(post._id, setPosts, setShowToastr)
                      }
                    />
                  </Popup>
                </>
              )}
              <Card.Header>
                <Link href={`/${post.user.username}`}>
                  {/* dispalying the user's username and role */}
                  <a>
                    {post.user.name} | {post.user.role.charAt(0).toUpperCase()}
                    {post.user.role.slice(1)}
                  </a>
                </Link>
              </Card.Header>
              {/* displaying trendy/star icon next to trendy posts, username, and post time */}
              <Card.Meta>
                {post.kind === "Trendy" && <Icon name="star" color="yellow" />}
                {post.type} Post @ {calculateTime(post.createdAt)}
              </Card.Meta>

              {/* displaying the company and post location */}
              <Card.Meta
                content={[post.company, post.location]
                  .filter(Boolean)
                  .join(", ")}
              />
              <b>
                <Card.Meta
                  content={post.keywords
                    .slice(0, 3)
                    .map((keyword) => "@" + keyword)
                    .join(", ")}
                />
              </b>

              <Card.Description
                style={{
                  fontSize: showFullText || hasRead ? "20px" : "10px",
                  color: showFullText || hasRead ? "#23272f" : "transparent",
                  overflow: "hidden",
                  marginTop: "10px",
                  textShadow: showFullText || hasRead ? "" : "0 0 8px #000",
                }}
                onCopy={(e) => e.preventDefault()}
              >
                {post.text}
              </Card.Description>
              
              {/* read button */}
              <Button
                as="div"
                labelPosition="right"
                style={{ marginTop: "20px" }}
                floated="right"
              >
                <Button
                  color="black"
                  onClick={readPostOnClick}
                  disabled={isRead}
                >
                  <Icon
                    name={isRead ? "eye slash" : "eye"}
                    style={{ cursor: "pointer" }}
                    color="green"
                    size="large"
                    fitted
                  />
                </Button>
                <Label as="a" color="black">
                  {/* showing all the users who have read this post */}
                  <ReadsList
                    postId={post._id}
                    trigger={
                      reads.length > 0 && (
                        <span className="spanReadsList">
                          {`${reads.length} ${
                            reads.length === 1 ? "read" : "reads"
                          }`}
                        </span>
                      )
                    }
                  />
                </Label>
              </Button>
            </Card.Content>

            <Card.Content extra>
              {/* Like */}
              <Button as="div" labelPosition="right">
                <Button
                  color="blue"
                  onClick={() =>
                    likePost(
                      post._id,
                      user._id,
                      setLikes,
                      setDisLikes,
                      isLiked ? false : true,
                      isDisLiked ? false : true
                    )
                  }
                >
                  <Icon
                    name={isLiked ? "thumbs up" : "thumbs up outline"}
                    style={{ cursor: "pointer" }}
                    fitted
                  />
                </Button>
                <Label as="a" basic color="blue" pointing="left">
                  <LikesList
                    postId={post._id}
                    trigger={
                      likes.length > 0 && (
                        <span className="spanLikesList">
                          {`${likes.length} ${
                            likes.length === 1 ? "like" : "likes"
                          }`}
                        </span>
                      )
                    }
                  />
                </Label>
              </Button>
              {/* Dislike */}
              <Button as="div" labelPosition="right">
                <Button
                  color="brown"
                  onClick={() =>
                    dislikePost(
                      post._id,
                      user._id,
                      setDisLikes,
                      setLikes,
                      isDisLiked ? false : true,
                      isLiked ? true : false
                    )
                  }
                >
                  <Icon
                    name={isDisLiked ? "thumbs down" : "thumbs down outline"}
                    style={{ cursor: "pointer" }}
                    fitted
                  />
                </Button>
                <Label as="a" basic color="brown" pointing="left">
                  {/* displaying all the users that have disliked this post */}
                  <DisLikesList
                    postId={post._id}
                    trigger={
                      dislikes.length > 0 && (
                        <span className="spanDisLikesList">
                          {`${dislikes.length} ${
                            dislikes.length === 1 ? "dislike" : "dislikes"
                          }`}
                        </span>
                      )
                    }
                  />
                </Label>
              </Button>
              {/* comment icon/button */}
              <Button as="div" labelPosition="right">
                <Button color="violet">
                  <Icon name="comment outline" />
                </Button>
                <Label as="a" basic color="violet" pointing="left">
                  {/* showing all the users who have commented on this post */}
                  {comments.length > 0 && (
                    <span>
                      {`${comments.length} ${
                        comments.length === 1 ? "comment" : "comments"
                      }`}
                    </span>
                  )}
                </Label>
              </Button>
              {/* only showing report for users that are not super users */}
              {reports.length > 0 && post.user.role !== "Super" && (
                <Modal
                  closeIcon
                  open={openReport}
                  trigger={
                    <Button as="div" labelPosition="right" floated="right">
                      <Button color="red" style={{ borderRadius: "30px" }}>
                        <Icon
                          name="exclamation"
                          color="black"
                          style={{ cursor: "pointer" }}
                          fitted
                        />
                      </Button>
                    </Button>
                  }
                  onClose={() => setOpenReport(false)}
                  onOpen={() => setOpenReport(true)}
                >
                  <Label
                    as="a"
                    basic
                    style={{
                      borderBottomLeftRadius: "30px",
                      borderBottomRightRadius: "30px",
                      marginTop: "5px",
                      fontSize: "15px",
                      backgroundColor: "#de272d",
                      color: "white",
                    }}
                  >
                    {" "}
                    {/* showing the list of all users that have reported this post */}
                    <ReportPostList
                      postId={post._id}
                      trigger={
                        reports.length > 0 && (
                          <span className="spanReportPostList">
                            {`${reports.length} ${
                              reports.length === 1 ? "report" : "reports"
                            }`}
                          </span>
                        )
                      }
                    />
                  </Label>
                  <Header
                    icon="warning"
                    content="Report Description"
                    color="red"
                  />
                  {/* report pop-up once report button has been clicked */}
                  <Modal.Content>
                    <Form error={error !== null} onSubmit={handleSubmit}>
                      <Message
                        error
                        onDismiss={() => setError(null)}
                        content={error}
                        header="Oh no!"
                      />
                      <Form.Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Please state your reasons for reporting this post..."
                        action={{
                          color: "red",
                          icon: "checkmark",
                          loading: loading,
                          disabled: text === "" || loading,
                        }}
                      />
                    </Form>
                  </Modal.Content>
                </Modal>
              )}
              {/* only dispalying report for users except super users */}
              {reports.length === 0 && post.user.role !== "Super" && (
                <Modal
                  closeIcon
                  open={openReport}
                  trigger={
                    <Button as="div" labelPosition="right" floated="right">
                      <Button
                        color="red"
                        style={{
                          borderRadius: "30px",
                        }}
                      >
                        <Icon
                          name="exclamation"
                          color="black"
                          style={{ cursor: "pointer" }}
                          fitted
                        />
                      </Button>
                    </Button>
                  }
                  onClose={() => setOpenReport(false)}
                  onOpen={() => setOpenReport(true)}
                >
                  <Header
                    icon="warning"
                    content="Report Description"
                    color="red"
                  />
                  <Modal.Content>
                    <Form error={error !== null} onSubmit={handleSubmit}>
                      <Message
                        error
                        onDismiss={() => setError(null)}
                        content={error}
                        header="Oh no!"
                      />
                      <Form.Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Please state your reasons for reporting this post..."
                        action={{
                          color: "red",
                          icon: "checkmark",
                          loading: loading,
                          disabled: text === "" || loading,
                        }}
                      />
                    </Form>
                  </Modal.Content>
                </Modal>
              )}
              {/* clickable tip button */}
              <Modal
                closeIcon
                open={open2}
                trigger={
                  <Button as="div" labelPosition="right">
                    <Button color="green">
                      <Icon
                        name="dollar sign"
                        style={{ cursor: "pointer" }}
                        fitted
                      />
                    </Button>
                  </Button>
                }
                onClose={() => setOpen2(false)}
                onOpen={() => setOpen2(true)}
              >
                <Header icon="dollar sign" content="Tip Post" />
                <Modal.Content>
                  <Form.Dropdown
                    label="How much would you like to tip this post?"
                    placeholder="Tip Amount"
                    defaultValue="one"
                    options={tipTypeOptions}
                    onChange={handleDropdownChangeTip}
                    search
                    selection
                    clearable
                  />
                </Modal.Content>
                {/* bottom buttons of the pop-up */}
                <Modal.Actions>
                  <Button color="red" onClick={() => setOpen2(false)}>
                    <Icon name="remove" style={{ cursor: "pointer" }} /> Cancel
                  </Button>
                  <Button color="green" onClick={() => setOpen2(false)}>
                    <Icon name="checkmark" style={{ cursor: "pointer" }} />{" "}
                    Submit
                  </Button>
                </Modal.Actions>
              </Modal>
              <div
                style={{
                  overflow: "auto",
                  height: comments.length > 2 ? "200px" : "60px",
                  marginBottom: "8px",
                }}
              >
                {/* displaying all the comments on this post */}
                {comments.length > 0 &&
                  comments.map((comment) => (
                    <PostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  ))}
              </div>

              <CommentInputField
                user={user}
                postId={post._id}
                setComments={setComments}
              />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default ImageModal;
