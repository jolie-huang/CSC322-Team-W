import React, { createRef } from "react";
import Router, { useRouter } from "next/router";
import {
  Container,
  Visibility,
  Grid,
  Sticky,
  Ref,
  Divider,
  Segment,
} from "semantic-ui-react";
import { createMedia } from "@artsy/fresnel";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import nprogress from "nprogress";
import SideMenu from "./SideMenu";
import Search from "./Search";
import MobileHeader from "./MobileHeader";

// Create media breakpoints using Artsy's Fresnel library
const AppMedia = createMedia({
  breakpoints: { zero: 0, smartphone: 541, tablet: 835, desktop: 1080 },
});
// Create media styles and context
const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

function Layout({ children, user }) {
  // Create a reference for the layout context
  const contextRef = createRef();
  const router = useRouter();
  const messagesRoute = router.pathname === "/messages";

  // Handle route change events
  Router.onRouteChangeStart = () => nprogress.start();
  Router.onRouteChangeComplete = () => nprogress.done();
  Router.onRouteChangeError = () => nprogress.done();

  return (
    <>
      {/* Manage head tags */}
      <HeadTags />
      {/* Check if the user is authenticated */}
      {user ? (
        <>
          {/* Apply media styles */}
          <style>{mediaStyles}</style>

          {/* Provide media context */}
          <MediaContextProvider>
            {/* Main layout structure */}
            <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
              {/* Larger screens - desktop and above */}
              <Media greaterThanOrEqual="desktop">
                <Ref innerRef={contextRef}>
                  <Grid>
                    {/* Render sidebar, content, and search bar */}
                    {!messagesRoute ? (
                      <>
                        <Grid.Column floated="left" width={2}>
                          <Sticky context={contextRef}>
                            <SideMenu user={user} pc />
                          </Sticky>
                        </Grid.Column>

                        <Grid.Column width={10}>
                          <Visibility context={contextRef}>
                            {children}
                          </Visibility>
                        </Grid.Column>

                        <Grid.Column floated="left" width={4}>
                          <Sticky context={contextRef}>
                            <Segment basic>
                              <Search />
                            </Segment>
                          </Sticky>
                        </Grid.Column>
                      </>
                    ) : (
                      // Render content for messages route
                      <>
                        <Grid.Column floated="left" width={1} />
                        <Grid.Column width={15}>{children}</Grid.Column>
                      </>
                    )}
                  </Grid>
                </Ref>
              </Media>

              {/* Responsive layouts for tablet to desktop */}
              <Media between={["tablet", "desktop"]}>
                <Ref innerRef={contextRef}>
                  <Grid>
                    {/* Render sidebar and content */}
                    {!messagesRoute ? (
                      <>
                        <Grid.Column floated="left" width={1}>
                          <Sticky context={contextRef}>
                            <SideMenu user={user} pc={false} />
                          </Sticky>
                        </Grid.Column>

                        <Grid.Column width={15}>
                          <Visibility context={contextRef}>
                            {children}
                          </Visibility>
                        </Grid.Column>
                      </>
                    ) : (
                      // Render content for messages route
                      <>
                        <Grid.Column floated="left" width={1} />
                        <Grid.Column width={15}>{children}</Grid.Column>
                      </>
                    )}
                  </Grid>
                </Ref>
              </Media>

              {/* Responsive layouts for smartphone to tablet */}
              <Media between={["smartphone", "tablet"]}>
                <Ref innerRef={contextRef}>
                  <Grid>
                    {/* Render collapsible menu and content */}
                    {!messagesRoute ? (
                      <>
                        <Grid.Column floated="left" width={2}>
                          <Sticky context={contextRef}>
                            <SideMenu user={user} pc={false} />
                          </Sticky>
                        </Grid.Column>

                        <Grid.Column width={14}>
                          <Visibility context={contextRef}>
                            {children}
                          </Visibility>
                        </Grid.Column>
                      </>
                    ) : (
                      // Render content for messages route
                      <>
                        <Grid.Column floated="left" width={1} />
                        <Grid.Column width={15}>{children}</Grid.Column>
                      </>
                    )}
                  </Grid>
                </Ref>
              </Media>

              {/* Mobile layout - zero to smartphone */}
              <Media between={["zero", "smartphone"]}>
                {/* Render mobile header and full-width content */}
                <MobileHeader user={user} />
                <Grid>
                  <Grid.Column width={16}>{children}</Grid.Column>
                </Grid>
              </Media>
            </div>
          </MediaContextProvider>
        </>
      ) : (
        // Render layout for unauthenticated users
        <>
          <Navbar />
          <Container text style={{ paddingTop: "1rem" }}>
            {children}
          </Container>
        </>
      )}
    </>
  );
}

export default Layout;
