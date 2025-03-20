import React, { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Divider, Input } from "@mui/material";
import Chat from "../helper/Chat";
import ArchiveIcon from "@mui/icons-material/Archive";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import { Image } from "antd";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const PeopleBucketServiceChat = ({
  peopleData = [],
  bucketlistData = [],
  serviceData = [],
}) => {
  const navigate = useNavigate(); // Initialize useNavigate

  console.log(peopleData);
  console.log(bucketlistData);

  console.log(serviceData);

  const { isDarkMode } = useOutletContext();
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [openBucketDialog, setOpenBucketDialog] = useState(false);

  const handleSelectService = (service) => {
    setSelectedService(service);
    console.log("ser", service);
    handleSelectPerson(service.service_name, service.userid);

    setOpenDialog(true);
  };
  const handleSelectpeople = (service) => {
    console.log("peo", service);
    handleSelectPerson(service.username, service.id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };

  const handleSelectBucket = (bucket) => {
    setSelectedBucket(bucket);
    console.log("ser", bucket);
    handleSelectPerson(bucket.uid.username, bucket.uid.id);

    setOpenBucketDialog(true);
  };

  const handleCloseBucketDialog = () => {
    setOpenBucketDialog(false);
    setSelectedBucket(null);
  };

  const renderServiceTab = () => {
    const filteredServices = serviceData.filter((service) =>
      service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!filteredServices.length) {
      return (
        <Box textAlign="center" padding={2} fontStyle="italic" color="grey.600">
          No services found
        </Box>
      );
    }

    return (
      <List>
        {filteredServices.map((service, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleSelectService(service)}
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <ListItemAvatar>
              <Avatar
                alt={service.service_name}
                src={service.media?.[0] || ""}
              />
            </ListItemAvatar>
            <ListItemText
              primary={service.service_name}
              secondary={
                <>
                  <Box component="span" display="block">
                    <strong>Type:</strong> {service.servicetype}
                  </Box>
                  <Box component="span" display="block">
                    <strong>Available Days:</strong>{" "}
                    {service.available_days.join(", ")}
                  </Box>
                  <Box component="span" display="block">
                    <strong>Likes:</strong> {service.likes} &nbsp;
                    <strong>Dislikes:</strong> {service.dislikes}
                  </Box>
                </>
              }
            />
          </ListItemButton>
        ))}
      </List>
    );
  };

  const renderBucketListTab = () => {
    const filteredBuckets = bucketlistData.filter((bucket) =>
      bucket.bucket.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!filteredBuckets.length) {
      return (
        <Box textAlign="center" padding={2} fontStyle="italic" color="grey.600">
          No bucket list items found
        </Box>
      );
    }

    return (
      <List>
        {filteredBuckets.map((bucket, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleSelectBucket(bucket)}
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <ListItemAvatar>
              <Avatar alt={bucket.bucket} src={bucket.media?.[0] || ""} />
            </ListItemAvatar>
            <ListItemText
              primary={bucket.bucket}
              secondary={
                <>
                  <Box component="span" display="block">
                    <strong>Origin:</strong> {bucket.origin}
                  </Box>
                  <Box component="span" display="block">
                    <strong>Destination:</strong> {bucket.destination}
                  </Box>
                </>
              }
            />
          </ListItemButton>
        ))}
      </List>
    );
  };

  const renderPeopleTab = () => {
    const filteredPeople = peopleData;

    if (!filteredPeople.length) {
      return (
        <Box textAlign="center" padding={2} fontStyle="italic" color="grey.600">
          No people found
        </Box>
      );
    }

    return (
      <List>
        {filteredPeople.map((person, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleSelectpeople(person)}
          >
            <ListItemAvatar>
              <Avatar
                alt={person.username || "Profile"}
                src={person.media?.[0]}
              />
            </ListItemAvatar>
            <ListItemText
            primary={
              <Link to={`/person/${person.username}`} style={{ textDecoration: 'none', color: 'blue' }}>
                {person.username || "Unknown"}
              </Link>
            }
           secondary={person.place}
          />
          </ListItemButton>

        ))}

      </List>
    );
  };
  const renderTabContent = () => {
    if (tabIndex === 2) return renderServiceTab();
    if (tabIndex === 1) return renderBucketListTab();
    return renderPeopleTab();
  };
  const [selectedPerson, setSelectedPerson] = useState(null); // Track selected person

  const handleSelectPerson = (name, id) => {
    if (!name || !id) return;
    setSelectedPerson({
      uid: id || "",
      name: name || "Unknown",
    });
  };
  return (
    <div className="flex flex-row h-screen gap-3">
      <Box
        sx={{
          width: "50vw",
          height: "95vh",
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
            value={tabIndex}
            onChange={(event, newValue) => {
              setTabIndex(newValue);
              setSearchQuery("");
            }}
            sx={{ height: "100%", color: isDarkMode ? "white" : "black" }}
          >
            <BottomNavigationAction label="People" icon={<PersonIcon />} />
            <BottomNavigationAction label="Bucketlist" icon={<GroupsIcon />} />
            <BottomNavigationAction label="Service" icon={<ArchiveIcon />} />
          </BottomNavigation>
        </Paper>

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

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>{renderTabContent()}</Box>
      </Box>

      <div className="flex border rounded-lg shadow-lg p-2 h-[95vh] w-2/3">
        <Chat selectedPerson={selectedPerson} />
      </div>

      {/* Dialog for showing service details */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedService?.service_name}</DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
              {/* Left Section: Service Details */}
              <Box
                flex={1}
                paddingRight={2}
                borderRight={1}
                borderColor="grey.300"
              >
                <Typography variant="body1" gutterBottom>
                  <strong>Type:</strong> {selectedService.servicetype}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Origin:</strong> {selectedService.origin}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Start Time:</strong> {selectedService.start_time}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>End Time:</strong> {selectedService.end_time}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Available Days:</strong>{" "}
                  {selectedService.available_days.join(", ")}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Contact 1:</strong> {selectedService.contact_number1}
                </Typography>
                {selectedService.contact_number2 && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Contact 2:</strong>{" "}
                    {selectedService.contact_number2}
                  </Typography>
                )}
                <Typography variant="body1" gutterBottom>
                  <strong>Description:</strong> {selectedService.discription}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Likes:</strong> {selectedService.likes}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Dislikes:</strong> {selectedService.dislikes}
                </Typography>

                {selectedService.media && selectedService.media.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="h6">Media</Typography>
                    {selectedService.media.map((mediaUrl, index) => (
                      <Box key={index} mt={1}>
                        <Image
                          src={mediaUrl}
                          alt={`Media ${index + 1}`}
                          style={{ maxWidth: "100%", borderRadius: 8 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Right Section: Comments */}
              <Box flex={1} paddingLeft={2}>
                <Typography variant="h6">Comments</Typography>
                {selectedService.comments &&
                selectedService.comments.length > 0 ? (
                  <List>
                    {selectedService.comments.map((comment, index) => (
                      <Typography key={index} variant="body2" gutterBottom>
                        - {comment}
                      </Typography>
                    ))}
                  </List>
                ) : (
                  <Typography>No comments available</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for showing bucket list details */}
      <Dialog
        open={openBucketDialog}
        onClose={handleCloseBucketDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedBucket?.bucket}</DialogTitle>
        <DialogContent>
          {selectedBucket && (
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
              {/* Left Section: Bucket List Details */}
              <Box
                flex={1}
                paddingRight={2}
                borderRight={1}
                borderColor="grey.300"
              >
                <Typography variant="body1" gutterBottom>
                  <strong>Origin:</strong> {selectedBucket.origin}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Destination:</strong> {selectedBucket.destination}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Start date:</strong> {selectedBucket.start_date}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>End date :</strong> {selectedBucket.end_date}
                </Typography>{" "}
                <Typography variant="body1" gutterBottom>
                  <strong>Posted by :</strong>{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default anchor behavior
                      navigate(`/person/${selectedBucket.uid.username}`); // Redirect to /person/:username
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {selectedBucket.uid.username}
                  </a>
                </Typography>
                {selectedBucket.media && selectedBucket.media.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="h6">Media</Typography>
                    {selectedBucket.media.map((mediaUrl, index) => (
                      <Box key={index} mt={1}>
                        <Image
                          src={mediaUrl}
                          alt={`Media ${index + 1}`}
                          style={{ maxWidth: "100%", borderRadius: 8 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Right Section: Comments */}
              <Box flex={1} paddingLeft={2}>
                <Typography variant="h6">Comments</Typography>
                {selectedBucket.comments &&
                selectedBucket.comments.length > 0 ? (
                  <List>
                    {selectedBucket.comments.map((comment, index) => (
                      <Typography key={index} variant="body2" gutterBottom>
                        - {comment}
                      </Typography>
                    ))}
                  </List>
                ) : (
                  <Typography>No comments available</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeopleBucketServiceChat;
