import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, TextField } from "@mui/material";
import Auto_comp from "../../maps/Auto_comp";
import { Select } from "antd";

const Create = () => {
  const [origin, setOrigin] = useState("");
  const [content, setContent] = useState("");
  const [olat, setOlat] = useState("");
  const [olon, setOlon] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [responseMessage, setResponseMessage] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("origin", origin);
    formData.append("content", content);
    formData.append("olat", olat);
    formData.append("olon", olon);
    if (file) formData.append("file", file);

    try {
      const response = await axios.post(
        `${window._env_.REACT_APP_BASE_URL}/feed/putfeed/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            setProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        }
      );
      setResponseMessage(response.data.message || "File uploaded successfully");

      // Clear progress and message after a delay
      setTimeout(() => {
        setProgress(0);
        setResponseMessage("");
      }, 3000); // Adjust timing as needed
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponseMessage("Failed to upload file");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*,video/*",
    maxSize: 500 * 1024 * 1024, // 500 MB limit
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div
      className="upload-feed-form"
      style={{ maxWidth: 500, margin: "0 auto" }}
    >
      <Typography variant="h4" gutterBottom>
        Upload Feed
      </Typography>

      <TextField
        label="Enter Content"
        multiline
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
      />

      <Box
        sx={{
          height: 100,
          borderRadius: 5,
          backgroundColor: "white",
          opacity: 0.8,
          "&:hover": {
            backgroundColor: "#f5f5f5",
            opacity: 1,
          },
        }}
      >
        <div {...getRootProps()} style={{ outline: "none" }}>
          <input {...getInputProps()} />
          <div
            style={{
              border: "2px dashed #cccccc",
              padding: "20px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <Typography>Drag & Drop or Click to Upload</Typography>
          </div>
        </div>
      </Box>

      {file && (
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: 10 }}
        >
          Selected file: {file.name}
        </Typography>
      )}
      <br></br>
      <Auto_comp
        onSelect={(selected, loc) => {
          setOrigin(selected);
          setOlat(loc.lat);
          setOlon(loc.lng);
        }}
      />
      <br></br>
      <Select
        className="w-full h-full"
        showSearch
        placeholder="Select a person"
        optionFilterProp="label"
        defaultValue="None" // Sets the default value to "None"

        onChange={onChange}
        options={[
          {
            value: "None",
            label: "None",
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
      <br></br>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        style={{ marginTop: 20 }}
      >
        Upload
      </Button>

      {progress > 0 && <Typography>Upload Progress: {progress}%</Typography>}
      {responseMessage && <Typography>{responseMessage}</Typography>}
    </div>
  );
};

export default Create;
