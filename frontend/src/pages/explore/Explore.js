

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import ExploreLayout from "./ExploreLayout";

const Explore = () => {
  const { user } = useSelector((state) => state.user);
  const [isFollowerDialogOpen, setFollowerDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setFollowingDialogOpen] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const [post, setPosts] = useState([]);
  const [location, setLocation] = useState(user.place || null);
  const [isEditingLocation, setIsEditingLocation] = useState(false); // Track if location is being edited

  const followersCount = user.frends?.[0]?.followers?.length || 0;
  const followingCount = user.frends?.[0]?.following?.length || 0;

  const followers = user.frends?.[0]?.followers || [];
  const following = user.frends?.[0]?.following || [];

  const handleFollowersClick = () => setFollowerDialogOpen(true);
  const handleFollowingClick = () => setFollowingDialogOpen(true);
  const handleDialogClose = () => {
    setFollowerDialogOpen(false);
    setFollowingDialogOpen(false);
  };

  const handleLocationSelect = async (selected, loc) => {
    setLocation(selected); // Update the location state
    setIsEditingLocation(false); // Exit edit mode after updating
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found in session storage.");

      // Send location details to the backend
      await axios.post(
        `${window._env_.REACT_APP_BASE_URL}/api/update/`, // Adjust endpoint to your backend setup
        {
          place: selected,
          lat: loc.lat,
          lng: loc.lng,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Location updated successfully.");
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage.");
        return;
      }

      try {
        const response = await axios.get(`${window._env_.REACT_APP_BASE_URL}/feed/putfeed/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(response.data);
        setPostsCount(response.data.length);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

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
      handleLocationSelect={handleLocationSelect}
      followers={followers}
      following={following}
      isFollowerDialogOpen={isFollowerDialogOpen}
      isFollowingDialogOpen={isFollowingDialogOpen}
      post={post}
    />
  );
}  

export default Explore;
