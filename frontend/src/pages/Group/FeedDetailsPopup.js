import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import axios from "axios";
import { useNavigate } from "react-router";

const FeedDetailsPopup = ({ selectedFeed, onClose }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(selectedFeed.comments || []);
  const [likes, setLikes] = useState(selectedFeed.likes || 0);
  const [dislikes, setDislikes] = useState(selectedFeed.dislikes || 0);

  // Unified function for like/dislike and comment actions
  const sendAction = async (actionType, data = "") => {
    try {
      const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
      const endpoint = `${window._env_.REACT_APP_BASE_URL}/feed/feedaction/${selectedFeed.id}/`; // Common endpoint for all actions

      const requestData = {
        actionType: actionType, // Action type like 'like', 'dislike', or 'comment'
        data: actionType === "comment" ? { comment: data } : { type: data }, // Send corresponding data
      };

      const response = await axios.post(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      if (response.status === 201) {
        if (actionType === "like") {
          setLikes(likes + 1); // Increment the like count
        } else if (actionType === "dislike") {
          setDislikes(dislikes + 1); // Increment the dislike count
        } else if (actionType === "comment") {
          setComments([...comments, data]); // Add new comment to the list
          setNewComment(""); // Clear the input field after submitting the comment
        }
      }
    } catch (error) {
      console.error(`Error while sending ${actionType}:`, error);
    }
  };

  // Button click handlers
  const handleLike = () => {
    sendAction("like", "like"); // Send like action
  };

  const handleDislike = () => {
    sendAction("dislike", "dislike"); // Send dislike action
  };

  const handleComment = () => {
    sendAction("comment", newComment); // Send comment text
  };
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%", // Increased width
        maxWidth: 1000, // Increased max width
        bgcolor: "white",
        boxShadow: 24,
        borderRadius: 2,
        p: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "85vh", // Slightly taller height
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Media Section */}
      <Card sx={{ flex: 1, mr: { md: 2 }, mb: { xs: 2, md: 0 } }}>
        {selectedFeed.mediatype === "video" ? (
          <CardMedia
            component="video"
            controls
            src={selectedFeed.media}
            sx={{ width: "100%", height: "50vh", objectFit: "cover" }}
          />
        ) : (
          <CardMedia
            component="img"
            image={selectedFeed.media}
            alt={selectedFeed.content || "Media"}
            sx={{ width: "100%", height: "50vh", objectFit: "cover" }}
          />
        )}
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {selectedFeed.origin}
          </Typography>
          <Typography variant="body1">{selectedFeed.content}</Typography>
          <Typography variant="caption" display="block" color="textSecondary">
            Posted by : <a
       href="#"
       onClick={(e) => {
         e.preventDefault(); // Prevent default anchor behavior
         navigate(`/person/${selectedFeed.username}`); // Redirect to /person/:username
       }}
       className="text-blue-500 hover:underline">{selectedFeed.username}</a>
          </Typography>

          {/* Likes and Dislikes */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <IconButton onClick={handleLike} color="primary">
              <ThumbUpIcon />
            </IconButton>
            <Typography>{likes} Likes</Typography>

            <IconButton onClick={handleDislike} color="error">
              <ThumbDownIcon />
            </IconButton>
            <Typography>{dislikes} Dislikes</Typography>
          </Box>
          <br></br>
        </CardContent>
      </Card>

      {/* Comment Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 1,
            p: 1,
          }}
        >
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <ListItem key={index}>
              <p><strong>{comment.username}:</strong> {comment.comment}</p>

              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
              No comments yet.
            </Typography>
          )}
        </List>
        <Box
          sx={{
            display: "flex",
            mt: 2,
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleComment}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FeedDetailsPopup;
