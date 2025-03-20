import React, { useState } from "react";
import Auto_comp from "../../maps/Auto_comp";
import axios from "axios";
import PeopleBucketServiceChat from "./People_bucket_service_chat";
import { Box, Typography } from "@mui/material";
import Diaplayimgvid from "../helper/Diaplayimgvid";
import Mapspoint from "../../maps/Mapspoint";
import Map from "../../maps/Map";

const Search = () => {
  const [routingData, setRoutingData] = useState(null); // Local state for routing data

  const [feed, setFeed] = useState([]);
  const [service, setService] = useState([]);
  const [bucketlist, setBucketlist] = useState([]);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState(null);

  const extractCoordinates = (ocord) => {
    // Regular expression to capture the coordinates from the "SRID=4326;POINT (longitude latitude)" format
    const regex = /POINT \(([-+]?[0-9]*\.?[0-9]+) ([-+]?[0-9]*\.?[0-9]+)\)/;
    const match = ocord.match(regex);
  
    if (match) {
      const longitude = parseFloat(match[1]); // Longitude is the first captured group
      const latitude = parseFloat(match[2]);  // Latitude is the second captured group
      return [latitude,longitude];            // Return the coordinates as [longitude, latitude]
    }
    return null; // If the format doesn't match, return null
  };

  const handleLocationSelect = async (selected, loc) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found in session storage.");

      const response = await axios.post(
        `${window._env_.REACT_APP_BASE_URL}/search/find/`,
        {
          lat: loc.lat,
          lng: loc.lng,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { services, feeds, bucketlists, people } = response.data;

          // Extract coordinates from each feed's "ocord" field
    const newRoutingData = feeds.map(feed => {
      const coordinates = extractCoordinates(feed.ocord);
      return coordinates; // This will return an array of coordinates [longitude, latitude]
    }).filter(coord => coord !== null); // Filter out null values
      setService(services);
      setFeed(feeds);
      setBucketlist(bucketlists);
      setPeople(people);


      setRoutingData(null);

      // Set routingData to new data after a short delay
      const timeoutId = setTimeout(() => {
        console.log(newRoutingData)

        setRoutingData(newRoutingData);
      }, 1000);
  
      // Cleanup the timeout when the effect is re-run or the component unmounts
      return () => clearTimeout(timeoutId);
    } catch (error) {
      setError("Error updating location: " + error.message);
      console.error("Error updating location:", error);
    }
  };

  console.log(feed)
  console.log(routingData);
  
  return (
    <div className="p-3">
      <Auto_comp
        onSelect={(selected, loc) => handleLocationSelect(selected, loc)}
      />
      <hr />
      {error && (
        <Box
          textAlign="center"
          padding={2}
          color="error.main"
          fontStyle="italic"
        >
          {error}
        </Box>
      )}
      <div>
        <Box
          sx={{
            height: "89vh",
            overflow: "hidden",
            borderRadius: 2,
            boxShadow: 3,
            display: "flex",
          }}
        >
          <div className="w-full mt-4">
            <hr style={{ borderColor: "black" }} />
            <Diaplayimgvid posts={feed} />
          </div>
        </Box>
      </div>

      <div>
        <br />
        <PeopleBucketServiceChat
          peopleData={people}
          bucketlistData={bucketlist}
          serviceData={service}
        />
      </div>
      <div>
        <Box
          sx={
            {
              // padding: 2,
              // height: "89vh",
              // overflow: "hidden",
              // borderRadius: 2,
              // boxShadow: 3,
              // display: "flex",
              // position: "relative", // Ensure the Box acts as a positioning context
            }
          }
        >
          {routingData && (
            <Mapspoint
              payload={routingData}
              sx={{
                padding: 2,
                height: "89vh",
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                // position: "relative",
                position: "absolute", // Position it within the Box
                zIndex: 10, // Set a high z-index value to ensure it's on top
              }}
            />
          )}
        </Box>
      </div>
    </div>
  );
};

export default Search;
