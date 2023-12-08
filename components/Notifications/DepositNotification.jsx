import React from "react";
import { Feed, Divider } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function DepositNotification({ notification, accountBalance, tips }) {
  // Render a feed event for deposit notifications

  return (
    <>
      <Feed.Event>
        {/* Display a generic deposit image in the feed */}

        <Feed.Label image="https://www.dictionary.com/e/wp-content/uploads/2018/09/heavy-dollar-sign.png" />
        <Feed.Content>
          {/* Display summary of the deposit notification */}

          <Feed.Summary>
            <>
              {/* Display a message about the new deposit in green */}
              You have made a new{" "}
              <strong style={{ color: "#00ff00" }}>DEPOSIT</strong> to your
              account.
              {/* Display the time since the deposit was made */}
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
      {/* Add a line break and a divider after each deposit notification */}

      <br />
      <Divider />
    </>
  );
}

export default DepositNotification;
