import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import ExploreLayout from "../explore/ExploreLayout";

const Otherperson = () => {
  const { name } = useParams(); // Retrieve the dynamic parameter from the route
  const [user, setUser] = useState({}); // Initialize with an empty object
  const [isFollowerDialogOpen, setFollowerDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setFollowingDialogOpen] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const [post, setPosts] = useState([]);
  const [location, setLocation] = useState(null); // Set location separately
  const [isEditingLocation, setIsEditingLocation] = useState(false); // Track if location is being edited

  const handleSendToBackend = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve token from session storage
      if (!token) {
        console.error("No token found in session storage.");
        return;
      }

      const response = await axios.get(`${window._env_.REACT_APP_BASE_URL}/api/protected/`, {
        params: { name }, // Pass name as a query parameter
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      });

      setUser(response.data);
      setLocation(response.data.place); // Update location state
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  useEffect(() => {
    if (name) {
      handleSendToBackend();
    }
  }, [name]);

 

  // Extract relevant data from user safely
  const followersCount = user?.frends?.[0]?.followers?.length || 0;
  const followingCount = user?.frends?.[0]?.following?.length || 0;

  const followers = user?.frends?.[0]?.followers || [];
  const following = user?.frends?.[0]?.following || [];

  const handleFollowersClick = () => setFollowerDialogOpen(true);
  const handleFollowingClick = () => setFollowingDialogOpen(true);
  const handleDialogClose = () => {
    setFollowerDialogOpen(false);
    setFollowingDialogOpen(false);
  };

  const token = sessionStorage.getItem("token");

  
  const handleIconClickfollow = async (id) => {
    try {
      console.log("Following user with ID:", id);

      const response = await axios.post(
        `${window._env_.REACT_APP_BASE_URL}/frends/following/`,
        { target_user_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log(response.data.data);
        if (response.data.message === "success") {
        }
      } // Optionally, dispatch an action to update the store if necessary
    } catch (error) {
      console.log(error);
      
      // You can also handle the error state here, e.g., by showing a notification or alert
    }
  };

  const handleIconClickunfollow = async (id) => {

    try {
      console.log("Following user with ID:", id);

      const response = await axios.post(
        `${window._env_.REACT_APP_BASE_URL}/frends/unfollowing/`,
        { target_user_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log(response.data);
        if (response.data.message === "success") {
        }
      } // Optionally, dispatch an action to update the store if necessary
    } catch (error) {
      console.error(
        "Error while following user:",
        error.response ? error.response.data : error.message
      );
      // You can also handle the error state here, e.g., by showing a notification or alert
    }  };



  return (
    <ExploreLayout
      user={user}
      followersCount={followersCount}
      followingCount={followingCount}
      postsCount={postsCount}
      location={location}
      isEditingLocation={isEditingLocation}
      setIsEditingLocation={setIsEditingLocation}
      handleFollowersClick={handleFollowersClick}
      handleFollowingClick={handleFollowingClick}
      handleDialogClose={handleDialogClose}
     handleLocationSelect={0}

      followers={followers}
      following={following}
      isFollowerDialogOpen={isFollowerDialogOpen}
      isFollowingDialogOpen={isFollowingDialogOpen}
      post={post}
    />
  );
};

export default Otherperson;
