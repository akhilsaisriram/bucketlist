import React, { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { Image } from "antd";
import axios from "axios";
const ServiceDisplay = ({ submittedDataa ,show=true}) => {
  
  const [submittedData, setSubmittedData] = useState([]);

  // Initialize state with data passed as a prop
  useEffect(() => {
    if (Array.isArray(submittedDataa)) {
      setSubmittedData(submittedDataa);
    }
  }, [submittedDataa]);

  // Function to handle deletion
  const handleDelete = async (id, indexx) => {
    try {
      // Send DELETE request to the API
      const response = await axios.delete(
        `${window._env_.REACT_APP_BASE_URL}/service/del/${id}/`, // Replace with your endpoint
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Send token in Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted item from the state
        const updatedServices = submittedData.filter((_, index) => index !== indexx);
        setSubmittedData(updatedServices);
        console.log("Service deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting service:", error.response?.data || error.message);
    }
  };

  console.log(submittedData);

  return (
    <div className="h-[100vh] w-full md:w-[100%] p-10 bg-slate-500 overflow-y-auto">
      <p className="text-white text-2xl mb-4">Service Information</p>
      {submittedData &&
        Array.isArray(submittedData) &&
        submittedData.length > 0 && (
          <div className="space-y-4 text-white">
            {submittedData.map((data, index) => (
              <div key={index}>
                <div className="gap-3 ">
           {   show&&    <button
                    onClick={() => handleDelete(data.id,index)}
                    className="mt-2 px-4 py-2 mx-4 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete<DeleteIcon></DeleteIcon>
                  </button>}
                  
           
                </div>
                <div>
                  <strong>Service Name:</strong>{" "}
                  {data.service_name ? data.service_name : "N/A"}
                </div>
                <div>
                  <strong>Service Type:</strong>{" "}
                  {data.servicetype ? data.servicetype : "N/A"}
                </div>
                <div>
                  <strong>Available Days:</strong>{" "}
                  {Array.isArray(data.available_days)
                    ? data.available_days.join(", ")
                    : "N/A"}
                </div>
                <div>
                  <strong>Start Time:</strong>{" "}
                  {data.start_time ? data.start_time : "N/A"}
                </div>
                <div>
                  <strong>End Time:</strong>{" "}
                  {data.end_time ? data.end_time : "N/A"}
                </div>
                <div>
                  <strong>Location:</strong> {data.origin ? data.origin : "N/A"}
                </div>
                <div>
                  <strong>Description:</strong>{" "}
                  {data.discription ? data.discription : "N/A"}
                </div>
                <div>
                  <strong>Phone number 1:</strong>{" "}
                  {data.contact_number1 ? data.contact_number1 : "N/A"}
                </div>
                <div>
                  <strong>Phone number 2:</strong>{" "}
                  {data.contact_number2 ? data.contact_number2 : "N/A"}
                </div>
                <div>
                  <h3>Service Image/Video:</h3>
                  {data.media && data.media.length > 0 ? (
                    data.media.map((mediaUrl, index) =>
                      data.mediatype[index] === "video" ? (
                        <video key={index} width="320" height="240" controls>
                          <source src={mediaUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          key={index}
                          src={mediaUrl}
                          alt={`Service Media ${index + 1}`}
                          width="320"
                          height="240"
                        />
                      )
                    )
                  ) : (
                    <p>No service image/video provided</p>
                  )}
                </div>

                <div>
                  <h3>ID Proof Image:</h3>
                  {data.proofid && data.proofid.length > 0 ? (
                    data.proofid.map((proofUrl, index) => (
                      <Image
                        key={index}
                        src={proofUrl}
                        alt={`ID Proof ${index + 1}`}
                        width="320"
                        height="240"
                      />
                    ))
                  ) : (
                    <p>No ID proof image provided</p>
                  )}
                </div>
                <br />
                <hr />
              </div>
            ))}
            <hr />
          </div>
        )}
    </div>
  );
};

export default ServiceDisplay;
