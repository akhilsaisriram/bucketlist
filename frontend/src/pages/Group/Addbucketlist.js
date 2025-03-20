import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Input, DatePicker } from "antd";
import Auto_comp from "../../maps/Auto_comp";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { add_group, group_place } from "../../store/group"; // Import the add_grop action
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/isload";
import { fetchUserData } from "../../store/user";
import { setbucket, setfeed, setPolyline } from "../../store/bucket";
const Addbucketlist = ({ onRoutingData }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    olat: "",
    olon: "",
    destination: "",
    dlat: "",
    dlon: "",
    ocord: "",
    dcord: "",
    startDate: null,
    endDate: null,
  });
  const [top100Films, setTop100Films] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [payload, setPayload] = useState(null); // Updated name from `setpa` to `setPayload`

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleDateChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelect = (field, selected) => {
    setFormData((prevData) => ({ ...prevData, [field]: selected }));
  };

  const handleSubmit = async () => {
    const newGroup = {
      origin: formData.origin,
      olat: formData.olat,
      olon: formData.olon,
      destination: formData.destination,
      dlat: formData.dlat,
      dlon: formData.dlon,
      startDate: formData.startDate
        ? formData.startDate.format("YYYY-MM-DD")
        : null,
      endDate: formData.endDate ? formData.endDate.format("YYYY-MM-DD") : null,
    };

    console.log(formData);
    const updatedTop100Films = [...top100Films, newGroup];
    setTop100Films(updatedTop100Films);

    try {
      await axios.post(
        `${window._env_.REACT_APP_BASE_URL}/bucketlist/putdata/`,
        { bucket: formData },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      // alert('Group data submitted successfully');
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data");
    }

    handleClose();
  };

  const handleRemove = async (index) => {
    const removedItem = top100Films[index];
    console.log("Removed item:", removedItem);
    const updatedTop100Films = top100Films.filter((_, i) => i !== index);
    setTop100Films(updatedTop100Films);
    try {
      await axios.post(`${window._env_.REACT_APP_BASE_URL}/bucketlsit/DeleteBucketElement`, {
        token: sessionStorage.getItem("token"),
        bucket: removedItem,
      });
      // alert('Group data removed successfully');
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data");
    }
  };

  const handleAutocompleteSelect = async (event, value) => {
    console.log("Selected autocomplete option:", value);
    dispatch(group_place(value));
    dispatch(setLoading(true));

    const ocord = value.ocord; // WKT format for origin
    const dcord = value.dcord; // WKT format for destinationcur
    const radius = 10000;

    const origin = `${value.olat},${value.olon}`;
    const destination = `${value.dlat},${value.dlon}`;

    const url = `https://api.olamaps.io/routing/v1/directions?origin=${origin}&destination=${destination}&alternatives=false&steps=true&overview=full&language=en&traffic_metadata=false&api_key=MdsBLQtub1D2n4KEMKHXyHggjA89vCj0RIJbx2YH`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPayload(""); // Clear previous payload

      //  Directly use the routing data in the axios request
      const polyline = data.routes[0].overview_polyline;
      // console.log("aa", polyline);
      dispatch(setPolyline(polyline));

      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`, // Include token in header
        };

        const response = await axios.post(
          `${window._env_.REACT_APP_BASE_URL}/bucketlist/nearby/`,
          { ocord, dcord, radius,polyline }, // Send ocord, dcord, and radius
          { headers } // Include headers in the request
        );

        const bucketpeole = response.data.bucket;
        const bucketfeed = response.data.feed;


        dispatch(setbucket(bucketpeole));
        dispatch(setfeed(bucketfeed));

        // console.log("mem", bucketfeed);
        dispatch(setLoading(false));

      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }

    dispatch(setLoading(false));
    setSelectedOption(value);
  };

  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    if (!user) {
      // Fetch user data if not already present in Redux
      dispatch(fetchUserData());
    }
    console.log(user.bucketlist);
    const data =
      user.bucketlist.map((item) => {
        const extractCoordinates = (coordString) => {
          if (!coordString) return { lat: null, lon: null }; // Return nulls if input is invalid
          const match = coordString.match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
          return match
            ? { lon: parseFloat(match[2]), lat: parseFloat(match[1]) } // Extract longitude and latitude
            : { lat: null, lon: null };
        };

        const originCoords = extractCoordinates(item.ocord);
        const destinationCoords = extractCoordinates(item.dcord);

        return {
          origin: item.origin,
          olat: originCoords.lat,
          olon: originCoords.lon,
          destination: item.destination,
          dlat: destinationCoords.lat,
          dlon: destinationCoords.lon,
          startDate: item.start_date,
          name: item.bucket,
          endDate: item.end_date,
          id: item.id,
          ocord: item.ocord,
          dcord: item.dcord,
        };
      }) || []; // Default to an empty array if user.bucketlist is undefined

    console.log("daad",data);
    setTop100Films(data);
  }, [dispatch, user]);
console.log("dda",top100Films);

  return (
    <div>
      <div className="mx-8 flex gap-3">
        <motion.button whileHover={{ scale: 1.2 }} onClick={handleOpen}>
          <AddCircleOutlineIcon style={{ fontSize: 30 }} />
        </motion.button>
        <AnimatePresence>
          {open && (
            <Dialog
              open={open}
              onClose={handleClose}
              PaperComponent={motion.div}
              PaperProps={{
                initial: { scale: 0 },
                animate: { scale: 1 },
                exit: { scale: 0 },
                transition: { duration: 0.5 },
                className:
                  "bg-opacity-80 bg-black text-white rounded-2xl w-full",
              }}
            >
              <DialogTitle className="bg-black text-white text-2xl">
                Fill the details of the Group
              </DialogTitle>
              <DialogContent className="bg-black text-white w-full">
                <div className="text-white space-y-4 mb-4 text-lg">
                  <div className="relative z-50">
                    <p>Start and End Dates:</p>
                    <div className="flex gap-4">
                      <DatePicker
                        value={formData.startDate}
                        onChange={(date) => handleDateChange("startDate", date)}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        className="z-50 w-1/2"
                      />
                      <DatePicker
                        value={formData.endDate}
                        onChange={(date) => handleDateChange("endDate", date)}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        className="z-50 w-1/2"
                      />
                    </div>
                  </div>
                  <div>
                    <p>Name of Group:</p>
                    <Input
                      placeholder="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <p>Origin:</p>

                    <Auto_comp
                      onSelect={(selected, loc) => {
                        handleSelect("origin", selected);
                        handleSelect("olat", loc.lat);
                        handleSelect("olon", loc.lng);
                      }}
                    />
                  </div>
                  <div>
                    <p>Destination:</p>
                    <Auto_comp
                      onSelect={(selected, loc) => {
                        handleSelect("destination", selected);
                        handleSelect("dlat", loc.lat);
                        handleSelect("dlon", loc.lng);
                      }}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  className="mt-4"
                >
                  Submit
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        <div>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={top100Films}
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
              `${option.origin} ->  ${option.destination} (${option.startDate} - ${option.endDate})`
            }
            renderOption={(props, option, { index }) => {
              const { key, ...restProps } = props;
              return (
                <li key={key} {...restProps}>
                  <span>{`${option.origin} -> ${option.destination} (${option.startDate} - ${option.endDate})`}</span>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Bucketlist" />
            )}
            onChange={handleAutocompleteSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Addbucketlist;
