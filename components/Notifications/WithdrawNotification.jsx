import React from "react";
import { Feed, Divider } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function WithdrawNotification({ notification, accountBalance, tips }) {
  return (
    <>
      {" "}
      {/* Feed Event displays user profile picture and content */}
      <Feed.Event>
        {" "}
        {/* Display a generic dollar sign image for the withdrawal notification */}
        <Feed.Label image="https://www.dictionary.com/e/wp-content/uploads/2018/09/heavy-dollar-sign.png" />
        <Feed.Content>
          {/* Display summary of the withdrawal notification */}
          <Feed.Summary>
            <>
              You have made a new{" "}
              <strong style={{ color: "#ff0000" }}>WITHDRAW</strong> from your
              account.
              {/* Display the time elapsed since the withdrawal */}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
      <br />
      <Divider />
    </>
  );
}

export default WithdrawNotification;
