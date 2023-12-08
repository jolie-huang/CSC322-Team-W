import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Segment } from "semantic-ui-react";
import baseUrl from "../utils/baseUrl";
import PopularCardPost from "../components/Post/PopularCardPost";
import { TrendyHeaderMessage } from "../components/Common/WelcomeMessage";

function Popular() {
  // State to store the popular posts
  const [posts, setPosts] = useState([]);

  // Function to fetch popular posts from the server
  const fetchDataOnScroll = async () => {
    try {
      // Make a GET request to the server's "/api/popular" endpoint
      const res = await axios.get(`${baseUrl}/api/popular`, {});

      setPosts(res.data);
    } catch (error) {
      // Alert the user in case of an error while fetching posts
      alert("Error fetching Posts!");
    }
  };
  // useEffect hook to fetch popular posts when the component mounts
  useEffect(() => {
    fetchDataOnScroll();
  }, []);

  return (
    <>
      <TrendyHeaderMessage />
      <Segment color="blue">
        {posts.map((post) => (
          <PopularCardPost key={post._id} post={post} setPosts={setPosts} />
        ))}
      </Segment>
    </>
  );
}

export default Popular;
