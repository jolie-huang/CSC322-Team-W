import React from "react";
import { Segment, Grid, Image } from "semantic-ui-react";

function Banner({ bannerData }) {
  // Destructure name and profilePicUrl from bannerData prop
  const { name, profilePicUrl } = bannerData;

  return (
    // Semantic UI Segment for styling with a blue color
    <Segment color="blue" attached="top">
      <Grid>
        {/* Grid column for displaying user information */}
        <Grid.Column floated="left" width={14}>
          <h4>
            {/* Semantic UI Image component for displaying user avatar */}
            <Image avatar src={profilePicUrl} />
            {name}
          </h4>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default Banner;
