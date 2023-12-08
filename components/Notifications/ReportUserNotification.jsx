import React, { useState, useEffect } from "react";
import { Divider, Feed, Icon } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";

function ReportUserNotification({ user, notification }) {
  return (
    <>
      {/* Feed Event displays user profile picture and content */}
      <Feed.Event>
        {/* Display user's profile picture in the feed */}

        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          {/* Display summary of the report user notification */}

          <Feed.Summary>
            <>
              {" "}
              {/* Display the role and name of the super user who reported */}
              Super User{" "}
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              {/* Display the account reported icon for emphasis */}
              reported your account{" "}
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
              <Icon
                name="exclamation"
                color="red"
                style={{ marginLeft: "-10px" }}
                fitted
              />
              {/* Display the time elapsed since the notification */}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
              <br />
              {/* Conditionally display handling super user if not a super user */}
              {user.role !== "Super" && (
                <Feed.Extra text>
                  {" "}
                  {/* Display information about the super user handling the case */}
                  <b style={{ color: "red" }}>Super User Handling The Case: </b>
                  <strong style={{ color: "red" }}>
                    <u>
                      {" "}
                      {/* Link to the profile of the super user handling the case */}
                      <a href={`/${notification.user.username}`}>
                        {notification.user.name}
                      </a>
                    </u>
                  </strong>
                </Feed.Extra>
              )}
            </>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  );
}

export default ReportUserNotification;
