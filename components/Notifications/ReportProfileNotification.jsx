import React, { useState, useEffect } from "react";
import { Divider, Feed, Icon } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";

function ReportProfileNotification({ user, notification }) {
  // State to store reported user's name and username
  const [reportedUserName, setReportedUserName] = useState("");
  const [reportedUserUserName, setReportedUserUserName] = useState("");
  // State to store super user's name and username
  const [superUserName, setSuperUserName] = useState("");
  const [superUserUserName, setSuperUserUserName] = useState("");
  // useEffect to fetch reported user's information
  useEffect(() => {
    const getReportedUser = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/profile/id/${notification.profile.user}`,
          {
            headers: { Authorization: cookie.get("token") },
          }
        );
        // Set reported user's name and username in state
        setReportedUserName(res.data.user.name);
        setReportedUserUserName(res.data.user.username);
      } catch (error) {
        alert(error);
      }
    };
    // Call the function to fetch reported user's information
    getReportedUser();
  }, []);
  // useEffect to fetch super user's information
  useEffect(() => {
    const getSuperUser = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/profile/id/${notification.superUser}`,
          {
            headers: { Authorization: cookie.get("token") },
          }
        );
        // Set super user's name and username in state
        setSuperUserName(res.data.user.name);
        setSuperUserUserName(res.data.user.username);
      } catch (error) {
        alert(error);
      }
    };
    // Call the function to fetch super user's information
    getSuperUser();
  }, []);
  return (
    <>
      {/* Feed Event displays user profile picture and content */}
      <Feed.Event>
        {/* Display user's profile picture in the feed */}
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          {/* Display summary of the report profile notification */}

          <Feed.Summary>
            <>
              {/* Display the user who reported */}
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              {/* Display the appropriate message based on user's role */}
              {user.role === "Super" ? (
                <>
                  {" "}
                  reported this <a href={`/${reportedUserUserName}`}>profile</a>
                </>
              ) : (
                <>
                  {" "}
                  reported your <a href={`/${reportedUserUserName}`}>profile</a>
                </>
              )}{" "}
              <Icon
                name="exclamation"
                color="red"
                style={{ marginLeft: "0px" }}
                fitted
              />
              <Icon
                name="exclamation"
                color="red"
                style={{ marginLeft: "-10px" }}
                fitted
              />
              <Icon
                name="exclamation"
                color="red"
                style={{ marginLeft: "-10px" }}
                fitted
              />
              {/* Display the time elapsed since the notification */}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
              <br />
            </>
          </Feed.Summary>

          <Feed.Extra text>
            <b>Report Description: </b>
            <strong style={{ color: "red" }}>{notification.text}</strong>
          </Feed.Extra>
          {user.role === "Super" && (
            <Feed.Extra text>
              <b style={{ color: "red" }}>Affected User: </b>
              <strong style={{ color: "red" }}>
                <u>
                  <a href={`/${reportedUserUserName}`}>{reportedUserName}</a>
                </u>
              </strong>
            </Feed.Extra>
          )}
          {/* Conditionally display affected user or super user handling the case */}

          {user.role !== "Super" && (
            <Feed.Extra text>
              <b style={{ color: "red" }}>Super User Handling The Case: </b>
              <strong style={{ color: "red" }}>
                <u>
                  <a href={`/${superUserUserName}`}>{superUserName}</a>
                </u>
              </strong>
            </Feed.Extra>
          )}
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  );
}

export default ReportProfileNotification;
