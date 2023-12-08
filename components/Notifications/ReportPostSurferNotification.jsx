import React, { useEffect, useState } from "react";
import { Divider, Feed, Icon } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";

function ReportPostSurferNotification({ user, notification }) {
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
          `${baseUrl}/api/profile/id/${notification.post.user}`,
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
      <Feed.Event>
        {/* Display a default icon for a Surfer */}
        <Feed.Label image="https://cdn.icon-icons.com/icons2/2518/PNG/512/question_mark_icon_151137.png" />
        <Feed.Content>
          <Feed.Summary>
            {" "}
            {/* Display summary of the report post notification */}
            <>
              {" "}
              {/* Display a Surfer as a user who reported */}A{" "}
              <Feed.User as="a">Surfer</Feed.User>{" "}
              {user.role === "Super" ? (
                <>
                  {" "}
                  reported this{" "}
                  <a href={`/post/${notification.post._id}`}>post</a>
                </>
              ) : (
                <>
                  {" "}
                  reported your{" "}
                  <a href={`/post/${notification.post._id}`}>post</a>
                </>
              )}{" "}
              {/* exclamations for emphasis */}
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
            </>
          </Feed.Summary>

          {notification.post.picUrl && (
            <Feed.Extra images>
              <a href={`/post/${notification.post._id}`}>
                <img src={notification.post.picUrl} />
              </a>
            </Feed.Extra>
          )}
          {/* Display the report description */}

          <Feed.Extra text>
            <b>Report Description: </b>
            <strong style={{ color: "red" }}>{notification.text}</strong>
          </Feed.Extra>
          {/* Conditionally display affected user or super user handling the case */}

          {user.role === "Super" && (
            <Feed.Extra text>
              <b style={{ color: "red" }}>Affected User: </b>
              <strong style={{ color: "red" }}>
                <u>
                  {" "}
                  {/* Link to the profile of the reported user */}
                  <a href={`/${reportedUserUserName}`}>{reportedUserName}</a>
                </u>
              </strong>
            </Feed.Extra>
          )}

          {user.role !== "Super" && (
            <Feed.Extra text>
              <b style={{ color: "red" }}>Super User Handling The Case: </b>
              <strong style={{ color: "red" }}>
                <u>
                  {" "}
                  {/* Link to the profile of the super user */}
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

export default ReportPostSurferNotification;
