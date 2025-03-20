
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceForm from './ServiceForm';
import ServiceDisplay from './ServiceDisplay';

const Service = () => {
  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${window._env_.REACT_APP_BASE_URL}/service/getdataservice/`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data)
        setSubmittedData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const submitData = new FormData();

      const nonFileFields = {
        service_name: formData.serviceName,
        servicetype: formData.serviceType,
        available_days: formData.availableDays,
        start_time: formData.startTime.toLocaleTimeString(),
        end_time: formData.endTime.toLocaleTimeString(),
        origin: formData.location,
        discription: formData.description,
        contact_number1: formData.phoneNumber1,
        contact_number2: formData.phoneNumber2,
        "ocord[coordinates]": JSON.stringify([
          parseFloat(formData.olon),
          parseFloat(formData.olat),
        ]),
      };

      Object.entries(nonFileFields).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      if (formData.serviceImage)
        submitData.append("media", formData.serviceImage);
      if (formData.idProofImage)
        submitData.append("proofid", formData.idProofImage);

      const response = await axios.post(
        `${window._env_.REACT_APP_BASE_URL}/service/putservise/`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.service)
      setSubmittedData([...submittedData, response.data.service]);
      
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "An error occurred while submitting the form"
      );
      console.error("Submit error:", err);
    }
  };
console.log(submittedData)
  return (
    <div className="flex flex-col md:flex-row">
      <ServiceForm onSubmit={handleSubmit} />
      <ServiceDisplay submittedDataa={submittedData} />
    </div>
  );
};

export default Service;