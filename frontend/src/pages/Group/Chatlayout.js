import React, { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Input,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  CssBaseline,
} from "@mui/material";
import { Avatar } from "antd";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import PropTypes from "prop-types";
import { useOutletContext } from "react-router";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Chat from "../helper/Chat";

const Chatlayout = ({ friends = [] }) => {
  const group = useSelector((state) => state.bucket?.bucket || []); // Access Redux group
  const { isDarkMode } = useOutletContext();

  const [tab, setTab] = useState(0); // Default tab is Group (0: Group, 1: Person)
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [selectedPerson, setSelectedPerson] = useState(null); // Track selected person

  const friendsArray = Array.isArray(friends) ? friends : [];
  const groupArray = Array.isArray(group) ? group : [];

  // Handle person selection
  const handleSelectPerson = (person) => {
    if (!person || !person.uid) return;
    setSelectedPerson({
      uid: person.uid.id || "",
      name: person.uid.username || "Unknown",
    });
  };

  // Filter data based on search query
  const filterList = (list, keys) =>
    list.filter((item) =>
      keys.some((key) => {
        // Handle nested keys
        const value = key.split('.').reduce((obj, keyPart) => obj?.[keyPart], item);
        return value?.toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
   
    const renderGroups = () => {
      const filteredGroups = filterList(groupArray, [
        "uid.username", // Filter by username within the group
        "origin",
        "destination",
      ]);
      return filteredGroups.length > 0 ? (
        filteredGroups.map((item, index) => (
          <ListItemButton key={index} onClick={() => handleSelectPerson(item)}>
            <ListItemAvatar>
              <Avatar>
                {item.uid?.username
                  ? item.uid.username.charAt(0).toUpperCase()
                  : "P"}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`Name: ${item.uid?.username || "Unknown"}`}
              secondary={`Origin: ${item.origin || "Unknown"} | Destination: ${
                item.destination || "Unknown"
              } | Start: ${dayjs(item.start_date).format("DD/MM/YYYY")} | End: ${dayjs(
                item.end_date
              ).format("DD/MM/YYYY")}`}
            />
          </ListItemButton>
        ))
      ) : (
        <Box
          sx={{
            textAlign: "center",
            padding: 2,
            color: isDarkMode ? "grey.500" : "grey.700",
            fontStyle: "italic",
          }}
        >
          No groups found
        </Box>
      );
    };
  const renderFriends = () => {
    const filteredFriends = filterList(friendsArray, ["username"]);
    return filteredFriends.length > 0 ? (
      filteredFriends.map((item, index) => (
        <ListItemButton key={index} onClick={() => handleSelectPerson(item)}>
        <ListItemAvatar>
          <Avatar>
            {item.uid?.username
              ? item.uid.username.charAt(0).toUpperCase()
              : "P"}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`Name: ${item.uid?.username || "Unknown"}`}
          secondary={`Origin: ${item.origin || "Unknown"} | Destination: ${
            item.destination || "Unknown"
          } | Start: ${dayjs(item.start_date).format("DD/MM/YYYY")} | End: ${dayjs(
            item.end_date
          ).format("DD/MM/YYYY")}`}
        />
      </ListItemButton>
      ))
    ) : (
      <Box
        sx={{
          textAlign: "center",
          padding: 2,
          color: isDarkMode ? "grey.500" : "grey.700",
          fontStyle: "italic",
        }}
      >
        No friends found
      </Box>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 w-full overflow-auto">
      {/* Left Panel */}
      <div className="flex h-[40%] md:w-[40%] md:h-full w-full rounded border overflow-auto">
        <Box
          className="w-full md:w-[33vw] h-full"
          sx={{
            height: "82vh",
            borderRadius: 2,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: isDarkMode ? "grey.900" : "background.paper",
            color: isDarkMode ? "white" : "black",
          }}
        >
          <CssBaseline />

          {/* Navigation Tabs */}
          <Paper
            sx={{
              height: "50px",
              boxShadow: 3,
              bgcolor: isDarkMode ? "grey.800" : "background.paper",
            }}
            elevation={2}
          >
            <BottomNavigation
              value={tab}
              onChange={(event, newValue) => {
                setTab(newValue);
                setSearchQuery(""); // Clear search query when switching tabs
              }}
              sx={{ height: "100%", color: isDarkMode ? "white" : "black" }}
            >
              <BottomNavigationAction label="Group" icon={<GroupsIcon />} />
              <BottomNavigationAction label="Person" icon={<PersonIcon />} />
            </BottomNavigation>
          </Paper>

          {/* Search Bar */}
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              margin: 1,
              backgroundColor: isDarkMode ? "grey.800" : "white",
              color: isDarkMode ? "white" : "black",
            }}
          />

          {/* List of Results */}
          <List sx={{ overflowY: "auto", flexGrow: 1 }}>
            {tab === 0 ? renderGroups() : renderFriends()}
          </List>
        </Box>
      </div>

      {/* Right Panel */}
      <div className="flex h-[60%] md:w-[60%] md:h-full w-full rounded border p-4 overflow-auto">
        <Chat selectedPerson={selectedPerson} />
      </div>
    </div>
  );
};

Chatlayout.propTypes = {
  friends: PropTypes.array,
};

export default Chatlayout;
