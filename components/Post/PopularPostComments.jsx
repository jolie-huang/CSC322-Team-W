import React, { useState } from "react";
import { Comment, Icon, Popup } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import { deleteComment } from "../../utils/postActions";
// Component to display comments on popular posts
function PopularPostComments({ comment, setComments, postId }) {
  // State to manage the disabled state of the delete icon
  const [disabled, setDisabled] = useState(false);
  // State to manage the visibility of the delete icon
  const [deleteIcon, showDeleteIcon] = useState(false);

  return (
    <>
      {/* Comment.Group to display comments */}
      <Comment.Group>
        {/* Single Comment component displaying user avatar, name, metadata, and text */}
        <Comment>
          {/* Avatar, author of the comment w link to user's profile, and metadata */}
          <Comment.Avatar src={comment.user.profilePicUrl} />
          <Comment.Content>
            <Comment.Author as="a" href={`/${comment.user.username}`}>
              {comment.user.name}
            </Comment.Author>
            <Comment.Metadata>{calculateTime(comment.date)}</Comment.Metadata>
            {/* Text of the comment */}
            <Comment.Text>{comment.text}</Comment.Text>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </>
  );
}

export default PopularPostComments;
