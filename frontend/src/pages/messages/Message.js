
import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import { Input } from "antd";
import Chat from "../helper/Chat";

const Message = () => {
  const { isDarkMode } = useOutletContext();
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState([]);
  const [accept, setAccept] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null); // State for selected person

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No token found in session storage.");
          return;
        }

        const response = await fetch(
          `${window._env_.REACT_APP_BASE_URL}/group/getgroup_accept_frends_details/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const fren = [];

        if (data.frend?.[0]?.followers) {
          fren.push(...data.frend[0].followers);
        }

        if (data.frend?.[0]?.following) {
          fren.push(...data.frend[0].following);
        }
        setFriends(fren);

        if (data.groups?.[0]?.members) {
          setGroup(data.groups[0].members);
        }
        setAccept(data.acceptances);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter friends or group based on the search query and the current BottomNavigation value
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroup = group.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click on friend or group member
  const handleSelectPerson = (person) => {
    console.log(person);
    
    setSelectedPerson(person);
  };

  return (
    <div className="flex flex-row p-10 h-screen gap-3">
      <Box
        ref={ref}
        sx={{
          width: "33vw",
          height: "89vh",
          overflow: "hidden",
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
        <Paper
          sx={{
            height: "50px",
            width: "100%",
            boxShadow: 3,
            bgcolor: isDarkMode ? "grey.800" : "background.paper",
          }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              setSearchQuery(""); // Reset search when switching tabs
            }}
            sx={{ height: "100%", color: isDarkMode ? "white" : "black" }}
          >
            <BottomNavigationAction label="Person" icon={<PersonIcon />} />
            <BottomNavigationAction label="Group" icon={<GroupsIcon />} />
            <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
          </BottomNavigation>
        </Paper>

        {/* Search input */}
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            margin: 8,
            backgroundColor: isDarkMode ? "grey.800" : "white",
            color: isDarkMode ? "white" : "black",
          }}
        />

        {/* List of Friends or Group */}
        <List sx={{ overflowY: "auto", flexGrow: 1 }}>
          {value === 0 ? (
            <div>
              {filteredFriends.map((friend, index) => (
                <ListItemButton key={index} onClick={() => handleSelectPerson(friend)}>
                  <ListItemAvatar>
                    <Avatar alt="Profile Picture" />
                  </ListItemAvatar>
                  <ListItemText primary={friend.name} />
                </ListItemButton>
              ))}
            </div>
          ) : (
            <div>
              {filteredGroup.map((member, index) => (
                <ListItemButton key={index} onClick={() => handleSelectPerson(member)}>
                  <ListItemAvatar>
                    <Avatar alt="Profile Picture" />
                  </ListItemAvatar>
                  <ListItemText primary={member.name} />
                </ListItemButton>
              ))}
            </div>
          )}
        </List>
      </Box>

      <div className="flex border rounded-lg shadow-lg p-2 w-2/3">
        {/* Pass selectedPerson to Chat component */}
        <Chat selectedPerson={selectedPerson} />
      </div>
    </div>
  );
};

export default Message;
