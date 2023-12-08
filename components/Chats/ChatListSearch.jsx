import React, { useState, useEffect } from "react";
import { List, Image, Search } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import baseUrl from "../../utils/baseUrl";
// Variable to store the cancel token for canceling the search request
let cancel;
// ChatListSearch component for handling chat search functionality
function ChatListSearch({ chats, setChats }) {
  // State variables for text input, loading status, and search results
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  // Next.js router instance
  const router = useRouter();

  // Handler for text input change during search
  const handleChange = async (e) => {
    const { value } = e.target;
    setText(value);
    // If the input is empty, clear results and return
    if (value.length === 0) return;
    if (value.trim().length === 0) return;

    setLoading(true);

    try {
      // Cancel the previous search request if any

      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const token = cookie.get("token");
      // Make a search request using Axios
      const res = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: { Authorization: token },
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      // If no results are found, clear the results state
      if (res.data.length === 0) {
        results.length > 0 && setResults([]);

        return setLoading(false);
      }

      // Update the results state with the search response data
      setResults(res.data);
    } catch (error) {
      // console.log(error);
    }

    setLoading(false);
  };

  // Handler for adding a chat when a search result is selected
  const addChat = (result) => {
    // Check if the user is already in the chat
    const alreadyInChat =
      chats.length > 0 &&
      chats.filter((chat) => chat.messagesWith === result._id).length > 0;
    // If the user is already in the chat, navigate to the chat
    if (alreadyInChat) {
      return router.push(`/messages?message=${result._id}`);
    }
    //
    else {
      // If the user is not in the chat, create a new chat entry and navigate to the chat
      const newChat = {
        messagesWith: result._id,
        name: result.name,
        profilePicUrl: result.profilePicUrl,
        lastMessage: "",
        date: Date.now(),
      };

      setChats((prev) => [newChat, ...prev]);

      return router.push(`/messages?message=${result._id}`);
    }
  };
  // useEffect to handle clearing results when the text input is empty
  useEffect(() => {
    if (text.length === 0 && loading) setLoading(false);
  }, [text]);

  return (
    // Search component for displaying the search input and results
    <Search
      onBlur={() => {
        results.length > 0 && setResults([]);
        loading && setLoading(false);
        setText("");
      }}
      loading={loading} // Loading status for the search component
      value={text} // Current value of the search input
      resultRenderer={ResultRenderer} // Custom result renderer component
      results={results} // Search results array
      onSearchChange={handleChange} // onChange event for handling text input changes
      minCharacters={1} // Minimum characters required for search
      onResultSelect={(e, data) => addChat(data.result)} // onResultSelect event for handling result selection
    />
  );
}
// ResultRenderer component for custom rendering of search results
const ResultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List key={_id}>
      <List.Item>
        <Image src={profilePicUrl} alt="ProfilePic" avatar />
        <List.Content header={name} as="a" />
      </List.Item>
    </List>
  );
};

export default ChatListSearch;
