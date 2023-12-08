import React from "react";
import { range } from "lodash";
import {
  Placeholder,
  Divider,
  List,
  Button,
  Card,
  Container,
  Icon,
} from "semantic-ui-react";

// Simulates placeholder content for posts by generating three placeholders
export const PlaceHolderPosts = () =>
  range(1, 4).map((item) => (
    <div key={item}>
      <Placeholder fluid>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
      <Divider hidden />
    </div>
  ));
// Represents a placeholder for suggested user content
export const PlaceHolderSuggestions = () => (
  <>
    {/* Placeholder for a user card with image and 'Follow' button */}
    <List.Item>
      <Card color="red">
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
        <Card.Content>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="medium" />
            </Placeholder.Header>
          </Placeholder>
        </Card.Content>

        <Card.Content extra>
          <Button
            disabled
            circular
            size="small"
            icon="add user"
            content="Follow?"
            color="twitter"
          />
        </Card.Content>
      </Card>
    </List.Item>
  </>
);

// Creates placeholders for notifications, generating ten notification placeholders
export const PlaceHolderNotifications = () =>
  range(1, 10).map((item) => (
    <>
      {/* Placeholder for notification header */}
      <Placeholder key={item}>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
      <Divider hidden />
    </>
  ));

// Displays an end message with a hand icon link for navigation
export const EndMessage = () => (
  <Container textAlign="center">
    {/* Hand icon link to the homepage */}
    <a href="/">
      <Icon name="hand point up" size="large" />
    </a>
    <Divider hidden />
  </Container>
);

// Generates placeholder items for reads, likes, dislikes, and reports
export const ReadsPlaceHolder = () =>
  range(1, 6).map((item) => (
    <Placeholder key={item} style={{ minWidth: "200px" }}>
      {/* Placeholder for item header */}
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ));

// Placeholder components for likes
export const LikesPlaceHolder = () =>
  range(1, 6).map((item) => (
    <Placeholder key={item} style={{ minWidth: "200px" }}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ));

// Placeholder components for dislikes
export const DislikesPlaceHolder = () =>
  range(1, 6).map((item) => (
    <Placeholder key={item} style={{ minWidth: "200px" }}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ));

// Placeholder components for reports
export const ReportsPlaceHolder = () =>
  range(1, 6).map((item) => (
    <Placeholder key={item} style={{ minWidth: "200px" }}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ));
