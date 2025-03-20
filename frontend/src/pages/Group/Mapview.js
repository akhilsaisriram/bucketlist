
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  Typography,
} from "@mui/material";
import { Image } from "antd";
import React, { useEffect, useState } from "react";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import Map from "../../maps/Map";
import { BsInfoCircle } from "react-icons/bs";
import { useSelector } from "react-redux";
import FeedDetailsPopup from "./FeedDetailsPopup";

const Mapview = () => {
  const reduxRoutingData = useSelector((state) => state.bucket.polyline); // Data from Redux store
  const [routingData, setRoutingData] = useState(null); // Local state for routing data
  const places = useSelector((state) => state.bucket.feed); // Feed data

  // State to handle modal
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update local state when reduxRoutingData changes
  useEffect(() => {
    // Set routingData to null initially
    setRoutingData(null);

    // Set routingData to new data after a short delay
    const timeoutId = setTimeout(() => {
      setRoutingData(reduxRoutingData);
    }, 10);

    // Cleanup the timeout when the effect is re-run or the component unmounts
    return () => clearTimeout(timeoutId);
  }, [reduxRoutingData]);

  // Open Modal with selected feed
  const handleOpenModal = (feed) => {
    setSelectedFeed(feed);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeed(null);
  };

  return (
    <div className="flex w-full">
      <div className="flex w-full flex-row">
        <Splitter direction={SplitDirection.Horizontal} initialSizes={[30, 70]}>
          {/* Map Section */}
          <Box sx={{ width: "100%", height: "100vh" }}>
            {routingData && <Map payload={routingData}></Map>}
          </Box>

          {/* Feed Section */}
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              // backgroundColor: "lightblue",
            }}
          >
            <Box sx={{ width: "100%", height: "100vh", overflowY: "scroll" }}>
              <ImageList variant="masonry" cols={3} gap={8}>
                {places.map((item) => (
                  <ImageListItem key={item.id}>
                    {/* Conditional Rendering for Video or Image */}
                    {item.mediatype === "video" ? (
                      <video
                        controls
                        className="w-full h-[90vh] object-cover"
                        src={item.media}
                        type="video/mp4"
                        loop
                        autoPlay
                        muted
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={item.media}
                        alt={item.content || "Media"}
                        loading="lazy"
                      />
                    )}
                    <ImageListItemBar
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                          "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                      }}
                      title={item.origin}
                      position="top"
                      actionIcon={
                        <IconButton onClick={() => handleOpenModal(item)}>
                          <BsInfoCircle style={{ color: "white" }} />
                        </IconButton>
                      }
                      actionPosition="left"
                    />
                    <div className="flex-wrap">
                      <hr />
                      <p>{item.content}</p>
                      <hr></hr>
                    </div>
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Box>
        </Splitter>
      </div>

      {selectedFeed && (
        <FeedDetailsPopup
          selectedFeed={selectedFeed}
          onClose={() => setSelectedFeed(null)}
        />
      )}
    </div>
  );
};

export default Mapview;
