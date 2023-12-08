import React from "react";

import { List, Divider } from "semantic-ui-react";

function Warnings(profile, reportPostsLength, user) {
  return (
    <>
      {/* Container for Warnings information */}

      <List size="huge" animated inverted>
        <div style={{ marginTop: "10px", color: "white" }}>
          <List.Icon
            name="exclamation triangle"
            size="large"
            verticalAlign="middle"
            color="orange"
          />
          <b>
            {" "}
            {/* Header for Reports */}
            <div style={{ display: "inline", marginLeft: "12px" }}>
              Number of Reports :{/* Display the total number of reports */}
              <p
                style={{
                  display: "inline",
                  color: "red",
                  marginLeft: "5px",
                }}
              >
                {/* Display Profile Reports count */}

                {profile.profile.reportsCount + profile.reportPostsLength}
              </p>
              <br />
              {profile.profile.reportsCount > 1 ? (
                <p
                  style={{
                    display: "inline",
                    color: "red",
                    marginLeft: "50px",
                  }}
                >
                  {profile.profile.reportsCount} Profile Reports
                </p>
              ) : (
                <p
                  style={{
                    display: "inline",
                    color: "red",
                    marginLeft: "50px",
                  }}
                >
                  {profile.profile.reportsCount} Profile Report
                </p>
              )}
              <br />
              {profile.reportPostsLength > 1 ? (
                <p
                  style={{
                    display: "inline",
                    color: "red",
                    marginLeft: "50px",
                  }}
                >
                  {profile.reportPostsLength} Post Reports
                </p>
              ) : (
                <p
                  style={{
                    display: "inline",
                    color: "red",
                    marginLeft: "50px",
                  }}
                >
                  {profile.reportPostsLength} Post Report
                </p>
              )}
            </div>
          </b>

          <br />
          <br />
        </div>
        <Divider />

        {/* Section for Warnings Information */}

        <div style={{ marginTop: "10px", color: "white" }}>
          <List.Icon
            name="exclamation triangle"
            size="large"
            verticalAlign="middle"
            color="red"
          />
          <b>
            {" "}
            {/* Header for Warnings */}
            <div style={{ display: "inline", marginLeft: "12px" }}>
              Number of Warnings:
              <p style={{ display: "inline", color: "red", marginLeft: "5px" }}>
                {profile.user.warningsCount}
              </p>
            </div>
          </b>
          <br />
          <br />
          <br />
          {/* Note about Locked Accounts */}

          <div style={{ display: "inline" }}>
            Note: Greater than{" "}
            <p style={{ display: "inline", color: "red" }}>3</p> warnings will
            result on your account being locked! Locked accounts need to pay a
            fine to remove the warnings and gain access back to SocialPulse.
          </div>
        </div>
        <Divider />
      </List>
    </>
  );
}

export default Warnings;
