import { Box, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { Image } from 'antd';
import React, { useState } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import FeedDetailsPopup from '../Group/FeedDetailsPopup';

const Diaplayimgvid = ({ posts = [] }) => {

    const [selectedFeed, setSelectedFeed] = useState(null);
    const handleOpenModal = (feed) => {
      setSelectedFeed(feed);
    };
  
  return (
    <div className="flex">
      <Box sx={{ width: "100%", height: "100vh" }}>
        <Box sx={{ width: "100%", height: "100vh", overflowY: "scroll" }}>
          <ImageList variant="masonry" cols={3} gap={8}>
            {posts.map((item) => (
              <ImageListItem key={item.id}>
                {item.mediatype === 'video' ? (
                  <video
                    controls
                    className="w-full h-[90vh] object-cover"
                    src={item.media} // video URL from server
                    type="video/mp4"
                    loop
                    autoPlay
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={item.media} // image URL from server
                    alt={item.content}
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
                  {/* {item.origin} */}
                
                  {item.content}
                </div>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Box>
      {selectedFeed && (
        <FeedDetailsPopup
          selectedFeed={selectedFeed}
          onClose={() => setSelectedFeed(null)}
        />
      )}
    </div>
  );
};

export default Diaplayimgvid;
