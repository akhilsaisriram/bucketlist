import React, { useEffect, useState } from "react";
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
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Avatar, Button } from "antd";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate, useOutletContext } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import MessageChat from "./MessageChat";
import axios from "axios";
import { setbucket, setfeed } from "../../../store/bucket";
import { setLoading } from "../../../store/isload";
import { AddIcCallOutlined, MoreVert, Settings } from "@mui/icons-material";
import Settingsa from "./Settings";
import AddIcon from "@mui/icons-material/Add";

const GroupMembers = ({ selected_bucket = {} }) => {
  const { ocord, dcord, radius, polyline } = selected_bucket || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const group = useSelector((state) => state.bucket?.bucket || []);
  const [group, setgroup] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch paginated groups from backend
  const fetchGroups = async (pageNumber) => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${window._env_.REACT_APP_BASE_URL}/bucketlist/nearbypagination/`,
        { ocord, dcord, radius, polyline, page: pageNumber },
        { headers }
      );

      setTotalPages(response.data.count / 10); // Assuming 10 per page
      console.log("pagenoiatuon", response.data);

      setgroup(response.data?.results?.bucket);

      const bucketpeole = response.data?.results?.bucket;
      const bucketfeed = response.data?.results?.feed;

      dispatch(setbucket(bucketpeole));
      dispatch(setfeed(bucketfeed));

      // console.log("mem", bucketfeed);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroups(page);
  }, [page, ocord, dcord, radius, polyline]);

  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");

  const groupArray = Array.isArray(group) ? group : [];

  const filterList = (list, keys) =>
    list.filter((item) =>
      keys.some((key) => {
        const value = key
          .split(".")
          .reduce((obj, keyPart) => obj?.[keyPart], item);
        return value?.toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  console.log("dd", groupArray);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    event.stopPropagation(); // Prevent triggering parent clicks
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const renderGroups = () => {
    const filteredGroups = filterList(groupArray, [
      "uid.username",
      "origin",
      "destination",
    ]);
    return filteredGroups.length > 0 ? (
      filteredGroups.map((item, index) => (
        <Tooltip
          key={index}
          title={
            item.visble !== 0 ? (
              <>
                <div>
                  <strong>Origin:</strong> {item.origin || "Unknown"}
                </div>
                <div>
                  <strong>Destination:</strong> {item.destination || "Unknown"}
                </div>
                <div>
                  <strong>Start:</strong>{" "}
                  {dayjs(item.start_date).format("DD/MM/YYYY")}
                </div>
                <div>
                  <strong>End:</strong>{" "}
                  {dayjs(item.end_date).format("DD/MM/YYYY")}
                </div>
              </>
            ) : (
              ""
            )
          }
          arrow
        >
          <ListItemButton onClick={() => handleSelectPerson(item)}>
            <ListItemAvatar>
              <Avatar>
                {item.uid?.username
                  ? item.uid.username.charAt(0).toUpperCase()
                  : "P"}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.uid?.username || "Unknown"} />
            <IconButton
              edge="end"
              size="small"
              onClick={(e) => {
                // e.stopPropagation(); // Prevent triggering the ListItemButton click
                handleClick(e);
              }}
              aria-label="more options"
            >
              <MoreVert />
            </IconButton>{" "}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => navigate(`/person/${item.uid?.username}`)}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>Connect</MenuItem>
            </Menu>
          </ListItemButton>
        </Tooltip>
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
  const [selectedPerson, setSelectedPerson] = useState(null); // Track selected person

  const handleSelectPerson = (person) => {
    console.log("chat", person);

    if (!person || !person.uid) return;
    setSelectedPerson({
      uid: person.uid.id || "",
      name: person.uid.username || "Unknown",
    });
  };
  const [openSettings, setOpenSettings] = useState(false);

  // Add these handler functions:
  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };
  return (
    <div className="px-1  h-full w-full flex flex-row items-center justify-start text-center">
      <div className="flex flex-col items-center justify-start w-[20vw] h-full bg-white/50 border rounded-3xl p-4">
        <div className="flex flex-row items-center justify-between">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton onClick={handleOpenSettings}>
            <Settings></Settings>
          </IconButton>
          <Settingsa open={openSettings} onClose={handleCloseSettings} />{" "}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <span>Groups</span>
            <IconButton onClick={handleOpenSettings} className="w-14 h-14 rounded-full transition-colors duration-300 bg-gray-200 text-white">
              <AddIcon size={50} />
            </IconButton>
          </div>

          <Button className="rounded-full bg-blue-500 px-6 py-3 text-white font-medium transition duration-300 hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 ">
            Community
          </Button>
        </div>

        <List sx={{ overflowY: "auto", flexGrow: 1, width: "100%" }}>
          {renderGroups()}
        </List>
        <div className="flex items-center justify-center w-full mt-4">
          <nav aria-label="Pagination" className="flex items-center space-x-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-600 shadow-sm"
              aria-label="Previous page"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200">
              <span className="font-medium text-gray-700">{page}</span>
              <span className="text-gray-500"> / {Math.ceil(totalPages)}</span>
            </div>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-600 shadow-sm"
              aria-label="Next page"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
      <div className="px-3 flex w-full h-[96vh]">
        <MessageChat selectedPerson={selectedPerson} />
      </div>
    </div>
  );
};

export default GroupMembers;
