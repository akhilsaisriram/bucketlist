import React, { useEffect, useState } from "react";
import { IconButton, TextField, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const Comments = ({ item }) => {
  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("token"); // Get the token from session storage

  // Fetch comments for the feed
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${window._env_.REACT_APP_BASE_URL}/feed/comments/${item.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      
      setData(response.data.data || []); // Assuming the API returns `data` containing the comments
    } catch (err) {
      setError(err.message || "Failed to fetch comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [item.id]);

  // Function to handle sending the comment
  const handleSendComment = async () => {
    if (comment.trim() && token) {
      try {
        console.log("Sending comment:", comment, item.id);
        const response = await axios.post(
          `${window._env_.REACT_APP_BASE_URL}/feed/feedaction/${item.id}/`,
          { actionType: "comment", data: { comment } },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Add the new comment to the list
        const newComment = {
          username: "You", // Replace with actual user info if available
          comment: comment,
        };
        setData((prevData) => [...prevData, newComment]);
        setComment(""); // Clear the comment input
        console.log(response.data);
      } catch (err) {
        console.error("Failed to send comment:", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-[85vh] p-4">
      <div className="flex-grow justify-start text-left">
        {loading ? (
          <p>Loading comments...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data?.length > 0 ? (
          data.map((m, index) => (
            <div key={index}>
              <strong>
                <h2 className="text-left">{m.username}</h2>
              </strong>
              <p className="text-left">{m.comment}</p>
              <br />
              <hr />
              <br />
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
      <div className="flex items-center space-x-2 mb-5">
        <TextField
          id="outlined-basic"
          label="Comment"
          variant="outlined"
          size="small"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault();
              handleSendComment();
            }
          }}
          multiline
          fullWidth
        />
        <Tooltip title="Press Shift + Enter to send" arrow>
          <IconButton
            className="py-2 px-4 rounded"
            color="primary"
            onClick={handleSendComment}
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Comments;
