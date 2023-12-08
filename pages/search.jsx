import Search from "../components/Layout/Search";
import { List, Divider } from "semantic-ui-react";

function SearchPage(user) {
  return (
    <>
      {/* Container div for Search component with margin */}
      <div style={{ margin: "1rem" }}>
        <Search />
      </div>

      {/* List component for displaying search results and user stats */}
      <List size="huge" animated inverted>
        <div style={{ marginTop: "10px", color: "white" }}>
          {/* Icon and title for the user search section */}
          <List.Icon
            name="address card"
            size="large"
            verticalAlign="middle"
            color="blue"
          />
          <b>
            <p style={{ display: "inline", marginLeft: "12px" }}>
              Search for users
            </p>
            <br />
            {/* Subsection displaying users the current user is following */}
            <div style={{ display: "inline", marginLeft: "50px" }}>
              Users You Are Following:
              <p style={{ display: "inline", color: "red", marginLeft: "5px" }}>
                {user.userFollowStats.following.length}
              </p>
            </div>
          </b>

          <br />
          <br />
        </div>
        <Divider />
      </List>
    </>
  );
}

export default SearchPage;
