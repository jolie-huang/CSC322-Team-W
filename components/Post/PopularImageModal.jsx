import React, { useState } from "react";
import Link from "next/link";
import {
  Modal,
  Grid,
  Image,
  Card,
  Icon,
  Divider,
  Header,
  Button,
  Label,
  Form,
  Message,
} from "semantic-ui-react";
import PopularPostComments from "./PopularPostComments";
import calculateTime from "../../utils/calculateTime";
import { reportPostSurfer } from "../../utils/postSurferActions";
import ReadsList from "./ReadsList";

function PopularImageModal({
  post,
  reads,
  likes,
  dislikes,
  comments,
  setComments,
  reports,
  setReports,
}) {
  const [isRead, setIsRead] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // function to handle when a user clicks the "Read" button
  const readPostOnClick = () => {
    setShowFullText(!showFullText);
    setIsRead(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await reportPostSurfer(
      post,
      text,
      setReports,
      setText,
      setError,
      setOpenReport
    );
    setLoading(false);
  };

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

              <Card.Header>
                <Link href={`/login`}>
                  <a>
                    {post.user.name} | {post.user.role.charAt(0).toUpperCase()}
                    {post.user.role.slice(1)}
                  </a>
                </Link>
              </Card.Header>

              {/* displaying the trendy/star icon for trendy post and post type and post time */}
              <Card.Meta>
                {post.kind === "Trendy" && <Icon name="star" color="yellow" />}
                {post.type} Post @ {calculateTime(post.createdAt)}
              </Card.Meta>

              {/* displaying the company and location on this post */}
              <Card.Meta
                content={[post.company, post.location]
                  .filter(Boolean)
                  .join(", ")}
              />

              {/* displaying the keywords for this post */}
              <b>
                <Card.Meta
                  content={post.keywords
                    .slice(0, 3)
                    .map((keyword) => "@" + keyword)
                    .join(", ")}
                />
              </b>

              {/* dispalying the post text */}
              <Card.Description
                style={{
                  fontSize: showFullText ? "20px" : "10px",
                  color: showFullText ? "#23272f" : "transparent",
                  overflow: "hidden",
                  marginTop: "10px",
                  textShadow: showFullText ? "" : "0 0 8px #000",
                }}
                onCopy={(e) => e.preventDefault()}
              >
                {post.text}
              </Card.Description>
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
                  {/* displaying all the people that have read this post */}
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
                <Link href={`/login`}>
                  <Button color="blue">
                    <Icon
                      name={"thumbs up"}
                      style={{ cursor: "pointer" }}
                      fitted
                    />
                  </Button>
                </Link>
                <Label as="a" basic color="blue" pointing="left">
                  {/* displaying all the users that have liked this post */}
                  {likes.length > 0 && (
                    <span className="spanLikesList">
                      {`${likes.length} ${
                        likes.length === 1 ? "like" : "likes"
                      }`}
                    </span>
                  )}
                </Label>
              </Button>

              {/* Dislike */}
              <Button as="div" labelPosition="right">
                <Link href={`/login`}>
                  <Button color="brown">
                    <Icon
                      name={"thumbs down"}
                      style={{ cursor: "pointer" }}
                      fitted
                    />
                  </Button>
                </Link>
                <Label as="a" basic color="brown" pointing="left">
                  {/* displaing all the users that have disliked this post */}
                  {dislikes.length > 0 && (
                    <span className="spanDisLikesList">
                      {`${dislikes.length} ${
                        dislikes.length === 1 ? "dislike" : "dislikes"
                      }`}
                    </span>
                  )}
                </Label>
              </Button>

              {/* comment icon/button */}
              <Button as="div" labelPosition="right">
                <Link href={`/login`}>
                  <Button color="violet">
                    <Icon name="comment outline" />
                  </Button>
                </Link>
                <Label as="a" basic color="violet" pointing="left">
                  {/* displaying all the users that have commented this post */}
                  {comments.length > 0 && (
                    <span>
                      {`${comments.length} ${
                        comments.length === 1 ? "comment" : "comments"
                      }`}
                    </span>
                  )}
                </Label>
              </Button>

              {/* report for more than 0 reports and not super users */}
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
                    {/* displaying all the users that have reported this post */}
                    {reports.length > 0 && (
                      <span className="spanReportPostList">
                        {`${reports.length} ${
                          reports.length === 1 ? "report" : "reports"
                        }`}
                      </span>
                    )}
                  </Label>
                  <Header
                    icon="warning"
                    content="Report Description"
                    color="red"
                  />
                  {/* report pop-up */}
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

              {/* report for when there are zero reports and not a super user */}
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
                  {/* report pop-up */}
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
              <Button as="div" labelPosition="right">
                <Link href={`/login`}>
                  <Button color="green">
                    <Icon
                      name="dollar sign"
                      style={{ cursor: "pointer" }}
                      fitted
                    />
                  </Button>
                </Link>
              </Button>
              <Divider hidden />

              <div
                style={{
                  overflow: "auto",
                  height: comments.length > 2 ? "200px" : "60px",
                  marginBottom: "8px",
                }}
              >
                {/* displaying all the comments for this post*/}
                {comments.length > 0 &&
                  comments.map((comment) => (
                    <PopularPostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      setComments={setComments}
                    />
                  ))}
              </div>
              <Divider hidden />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default PopularImageModal;
