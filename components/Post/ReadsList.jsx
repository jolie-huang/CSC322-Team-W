import React, { useState } from "react";
import axios from "axios";
import cookie from "js-cookie";
import Router from "next/router";
import { List, Popup, Image } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchErrors";
import { ReadsPlaceHolder } from "../Layout/PlaceHolderGroup";
// Component to display the list of users who read a post
function ReadsList({ postId, trigger }) {
  // State to manage the list of users who read the post
  const [readsList, setReadsList] = useState([]);
  // State to manage the loading state
  const [loading, setLoading] = useState(false);

  // Function to fetch the list of users who read the post
  const getReadsList = async () => {
    setLoading(true);
    try {
      // Fetching the reads list from the server
      const res = await axios.get(`${baseUrl}/api/posts/read/${postId}`, {
        headers: { Authorization: cookie.get("token") },
      });
      setReadsList(res.data);
    } catch (error) {
      alert(catchErrors(error));
    }
    setLoading(false);
  };

  return (
    <Popup
      on="click"
      onClose={() => setReadsList([])} // Closing the Popup and resetting readsList when it's closed
      onOpen={getReadsList} // Triggering the fetch of reads list when the Popup is opened
      popperDependencies={[readsList]}
      // Triggering the Popup with the provided trigger element
      trigger={trigger}
      wide
    >
      {/* Displaying Placeholder component when loading */}
      {loading ? (
        <ReadsPlaceHolder />
      ) : (
        <>
          {/* Displaying the list of users who read the post */}
          {readsList.length > 0 && (
            <div
              style={{
                overflow: "auto",
                maxHeight: "15rem",
                height: "15rem",
                minWidth: "210px",
              }}
            >
              <List selection size="large">
                {readsList.map((read) => (
                  <List.Item key={read._id}>
                    {/* Display user's avatar, name as a link */}
                    <Image avatar src={read.user.profilePicUrl} />

                    <List.Content>
                      <List.Header
                        onClick={() => Router.push(`/${read.user.username}`)}
                        as="a"
                        content={read.user.name}
                      />
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </>
      )}
    </Popup>
  );
}

export default ReadsList;
