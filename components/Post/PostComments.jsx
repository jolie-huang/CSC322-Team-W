import React, { useState } from "react";
import { Comment, Icon, Popup } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import { deleteComment } from "../../utils/postActions";

function PostComments({ comment, user, setComments, postId }) {
  // State to manage the disabled state of the delete icon
  const [disabled, setDisabled] = useState(false);
  // State to manage the visibility of the delete icon
  const [deleteIcon, showDeleteIcon] = useState(false);

  return (
    <>
      {/* Comment.Group to display comments */}
      <Comment.Group>
        <Comment>
          {/* Single Comment component displaying user avatar, name, metadata, text, and delete option */}

          <Comment.Avatar src={comment.user.profilePicUrl} />
          <Comment.Content>
            <Comment.Author as="a" href={`/${comment.user.username}`}>
              {comment.user.name}
            </Comment.Author>
            <Comment.Metadata>{calculateTime(comment.date)}</Comment.Metadata>

            <Comment.Text>{comment.text}</Comment.Text>
            {/* Comment.Actions to display delete option */}
            <Comment.Actions>
              <Comment.Action>
                {/* Display delete option for superusers or the comment's author */}
                {(user.role === "Super" || comment.user._id === user._id) && (
                  <Popup
                    content="This will delete your comment! Are you sure?"
                    trigger={
                      <Icon
                        disabled={disabled}
                        color="red"
                        name="trash"
                        onClick={async () => {
                          setDisabled(true);
                          await deleteComment(postId, comment._id, setComments);
                          setDisabled(false);
                        }}
                        fitted
                      />
                    }
                  />
                )}
              </Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </>
  );
}

export default PostComments;
