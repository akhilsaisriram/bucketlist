import React, { useEffect, useState } from "react";
import { IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { setuserfollower } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
const Dashboard = () => {
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [currentFilter, setCurrentFilter] = useState("All"); // Track current filter

  const onChange = (value) => {
    setCurrentFilter(value); // Update current filter
  };


  const navigate = useNavigate(); // Initialize useNavigate
  const user = useSelector((state) => {
    try {
      // Safely access the data with optional chaining
      return state?.user?.user?.frends?.[0]?.following || [];
    } catch (error) {
      console.error("Error accessing Redux state:", error);
      return [];
    }
  });  console.log(user);
  const [visibleComments, setVisibleComments] = useState({});
  const [clickedIcons, setClickedIcons] = useState({});
  const [item, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false); // State for popup visibility
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Token is missing");
      setLoading(false);
      return;
    }

    axios
      .post(
        `${window._env_.REACT_APP_BASE_URL}/feed/allfeed/`,
        { level: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleIconClick = (id, iconType) => {
    console.log(id, iconType);
    if (iconType === "favorite") {
      like(id, "like");
    }
    if (iconType === "dislike") {
      like(id, "dislike");
    }
    setClickedIcons((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [iconType]: !prevState[id]?.[iconType],
      },
    }));

    if (iconType === "comment") {
      setVisibleComments((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    }
  };

  const handleNextReel = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < item.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePreviousReel = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : item.length - 1
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      handleNextReel();
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      handlePreviousReel();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, item]);

  // Function to handle closing the popup
  const closePopup = () => {
    setPopupOpen(false);
  };

  // Function to open the popup when the dot icon is clicked
  const openPopup = () => {
    setPopupOpen(true);
  };
  const dispatch = useDispatch();

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
          dispatch(setuserfollower({ following: response.data.data }));
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
          dispatch(setuserfollower({ following: response.data.data }));
        }
      } // Optionally, dispatch an action to update the store if necessary
    } catch (error) {
      console.error(
        "Error while following user:",
        error.response ? error.response.data : error.message
      );
      // You can also handle the error state here, e.g., by showing a notification or alert
    }  };

  const like = async (id, ty) => {
    const response = await axios.post(
      `${window._env_.REACT_APP_BASE_URL}/feed/feedaction/${id}/`,
      { actionType: ty, data: null },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
  };
    useEffect(() => {
    if (currentFilter === "All") {
      setFilteredData(item); // Show all data if "All" is selected
    } else {
      setFilteredData(
        item.filter((feed) => feed.type?.toLowerCase() === currentFilter.toLowerCase())
      ); // Filter based on content type
    }
  }, [currentFilter, item]);
  return (
    <div>
       <Select
        className="w-1/4 h-full"
        showSearch
        placeholder="Select a person"
        optionFilterProp="label"
        defaultValue="All" // Sets the default value to "None"

        onChange={onChange}
        options={[
          {
            value: "All",
            label: "All",
          },
          {
            value: "Travel",
            label: "Travel",
          },
        
          {
            value: "insightful",
            label: "insightful",
          },
          {
            value: "location",
            label: "location",
          },
        ]}
      />
      <div className="flex justify-center items-center h-[95vh] relative p-2">
        <IconButton
          onClick={handlePreviousReel}
          className="absolute left-0 mx-20 justify-start transform -translate-y-1/2 hidden md:block"
          style={{
            backgroundColor: "#ffffff88",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          <FaChevronLeft />
        </IconButton>

        <div className="h-full w-full md:w-1/3 md:mt-5">
          {filteredData.length > 0 && (
            <div className="min-h-full  rounded-lg overflow-hidden  transition-shadow duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              <div className="flex justify-between items-center  shadow-md rounded-lg">
                <div className="flex flex-col">
                  <p className=" px-1 text-xl font-semibold text-gray-800">
                    {filteredData[currentIndex]?.username}
                  </p>
                </div>

                {/* Follow Button */}
                <button
                  onClick={() => {
                    user.some((u) => u.uid === filteredData[currentIndex]?.userid)
                      ? handleIconClickunfollow(filteredData[currentIndex].userid)
                      : handleIconClickfollow(filteredData[currentIndex].userid);
                  }}
                  className="px-1 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  {user.some((u) => u.uid === filteredData[currentIndex]?.userid)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
              {filteredData[currentIndex]?.mediatype === "video" ? (
                <video
                  controls
                  className="w-full h-[90vh] object-contain"
                  src={filteredData[currentIndex]?.media}
                  type="video/mp4"
                  loop
                  autoPlay
                  muted
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  className="w-full h-[90vh]  object-fill md:object-fill"
                  src={filteredData[currentIndex]?.media}
                  alt="media"
                />
              )}
            </div>
          )}
        </div>

        <div className="hidden ml-4 gap-3 md:block">
          <div className="flex flex-col space-y-4">
            <MoreVertIcon
              onClick={openPopup} // Open popup on icon click
              style={{
                color: "#a88da2",
                cursor: "pointer",
                fontSize: "2rem",
              }}
            />

            <div className="flex items-center flex-col space-y-3 ">
              {" "}
              <p>{filteredData[currentIndex]?.likes}</p>{" "}
              {/* Group icons and likes in one row */}
              <FavoriteIcon
                onClick={() =>
                  handleIconClick(filteredData[currentIndex]?.id, "favorite")
                }
                style={{
                  color: clickedIcons[filteredData[currentIndex]?.id]?.favorite
                    ? "red"
                    : "#a88da2",
                  cursor: "pointer",
                  fontSize: "2rem",
                }}
              />
              {/* Likes count next to the icon */}
              <p>{filteredData[currentIndex]?.dislikes}</p>{" "}
              <ThumbDownIcon
                onClick={() =>
                  handleIconClick(filteredData[currentIndex]?.id, "dislike")
                }
                style={{
                  color: clickedIcons[filteredData[currentIndex]?.id]?.dislike
                    ? "blue"
                    : "#a88da2",
                  cursor: "pointer",
                  fontSize: "2rem",
                }}
              />
              <ShareIcon
                onClick={() => handleIconClick(filteredData[currentIndex]?.id, "share")}
                style={{
                  color: clickedIcons[filteredData[currentIndex]?.id]?.share
                    ? "skyblue"
                    : "#a88da2",
                  cursor: "pointer",
                  fontSize: "2rem",
                }}
              />
              <CommentIcon
                onClick={() =>
                  handleIconClick(filteredData[currentIndex]?.id, "comment")
                }
                style={{
                  color: clickedIcons[filteredData[currentIndex]?.id]?.comment
                    ? "skyblue"
                    : "#a88da2",
                  cursor: "pointer",
                  fontSize: "2rem",
                }}
              />
            </div>
          </div>
        </div>

        <div className="gap-7">
          <AnimatePresence>
            {visibleComments[filteredData[currentIndex]?.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    height: "90%",
                    width: 500,
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    borderRadius: 10,
                  }}
                >
                  <div className="justify-start">
                    <Comments item={filteredData[currentIndex]} />
                  </div>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
          <br />
          <IconButton
            onClick={handleNextReel}
            className="absolute right-0 mx-20 justify-end transform -translate-y-1/2 hidden md:block"
            style={{
              backgroundColor: "#ffffff88",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <FaChevronRight />
          </IconButton>
        </div>
      </div>

      {/* Popup for MoreVert Icon */}
      {popupOpen && (
        <div
          onClick={closePopup} // Close popup when clicking outside
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
            className="bg-white p-6 rounded-xl w-1/3 shadow-lg max-w-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Posted by{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  navigate(`/person/${filteredData[currentIndex]?.username}`); // Redirect to /person/:username
                }}
                className="text-blue-500 hover:underline"
              >
                {filteredData[currentIndex]?.username}
              </a>
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Location:</strong> {filteredData[currentIndex]?.origin}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Description:</strong> {filteredData[currentIndex]?.content}
            </p>
            <button
              onClick={closePopup}
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
        
      )}
      <br></br>
    </div>
  );
};

export default Dashboard;
