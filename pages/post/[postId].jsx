import React, { useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import Link from "next/link";
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Container,
  Header,
  Popup,
  Button,
} from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import PostComments from "../../components/Post/PostComments";
import CommentInputField from "../../components/Post/CommentInputField";
import LikesList from "../../components/Post/LikesList";
import { likePost } from "../../utils/postActions";
import calculateTime from "../../utils/calculateTime";
import { NoPostFound } from "../../components/Layout/NoData";

function PostPage({ post, errorLoading, user }) {
  if (errorLoading) {
    return <NoPostFound />;
  }
  // State to manage likes for the post
  const [likes, setLikes] = useState(post.likes);
  // Check if the current user has liked the post
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;
  // State to manage comments for the post
  const [comments, setComments] = useState(post.comments);

  return (
    <Container text>
      <Segment basic>
        {/* Displaying post card */}
        <Card color="blue" fluid>
          {post.picUrl && (
            // Displaying post image if available
            <Image
              src={post.picUrl}
              style={{ cursor: "pointer" }}
              floated="left"
              wrapped
              ui={false}
              alt="PostImage"
              onClick={() => setShowModal(true)}
            />
          )}

          <Card.Content>
            {/* Displaying post user's profile picture */}
            <Image
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
            />
            {/* Displaying delete icon for post owner or Super user */}
            {(user.role === "Super" || post.user._id === user._id) && (
              <>
                {/* Popup for delete confirmation */}
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
                  {/* Delete button */}
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
            {/* Displaying post user's name with link to profile */}
            <Card.Header>
              <Link href={`/${post.user.username}`}>
                <a>{post.user.name}</a>
              </Link>
            </Card.Header>
            {/* Displaying post metadata */}
            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

            {post.location && <Card.Meta content={post.location} />}
            {post.company && <Card.Meta content={post.company} />}
            {post.type && <Card.Meta content={post.type} />}
            {/* Displaying post text */}
            <Card.Description
              style={{
                fontSize: "17px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px",
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            {/* Icon for liking the post */}
            <Icon
              name={isLiked ? "heart" : "heart outline"}
              color="red"
              style={{ cursor: "pointer" }}
              onClick={() =>
                likePost(post._id, user._id, setLikes, isLiked ? false : true)
              }
              fitted
            />
            {/* Component to display the list of likes */}
            <LikesList
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">
                    {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
                  </span>
                )
              }
            />
            {/* Icon for commenting on the post */}
            <Icon
              name="comment outline"
              style={{ marginLeft: "7px" }}
              color="blue"
              fitted
            />
            {/* Displaying comments for the post */}
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

            <Divider hidden />
            {/* Component for commenting on the post */}
            <CommentInputField
              user={user}
              postId={post._id}
              setComments={setComments}
            />
          </Card.Content>
        </Card>
      </Segment>
      <Divider hidden />
    </Container>
  );
}

PostPage.getInitialProps = async (ctx) => {
  try {
    const { postId } = ctx.query;
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/posts/${postId}`, {
      headers: { Authorization: token },
    });

    return { post: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default PostPage;
