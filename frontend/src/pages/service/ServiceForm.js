import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auto_comp from "../../maps/Auto_comp";

const ServiceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceType: "",
    availableDays: [],
    startTime: new Date(),
    endTime: new Date(),
    location: "",
    olat: "",
    olon: "",
    description: "",
    serviceImage: null,
    idProofImage: null,
    phoneNumber1: "",
    phoneNumber2: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData({ ...formData, [name]: file });
  };

  const handleDayChange = (day) => {
    setFormData((prevData) => {
      const isSelected = prevData.availableDays.includes(day);
      return {
        ...prevData,
        availableDays: isSelected
          ? prevData.availableDays.filter((d) => d !== day)
          : [...prevData.availableDays, day],
      };
    });
  };

  const handleTimeChange = (name, time) => {
    setFormData({ ...formData, [name]: time });
  };

  const handleLocationSelect = (selected, loc) => {
    setFormData((prev) => ({
      ...prev,
      location: selected,
      olat: loc.lat,
      olon: loc.lng,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="h-[100vh] w-full md:w-[50%] p-4 bg-slate-100 overflow-y-auto">
      <p className="text-2xl font-semibold mb-4">Services</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Service Name</label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter service name"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Service Type</label>
          <input
            type="text"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter service type"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Available Days</label>
          <div className="space-x-2">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <label key={day}>
                <input
                  type="checkbox"
                  value={day}
                  checked={formData.availableDays.includes(day)}
                  onChange={() => handleDayChange(day)}
                /> {day}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Start Time</label>
          <DatePicker
            selected={formData.startTime}
            onChange={(date) => handleTimeChange("startTime", date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Start Time"
            dateFormat="h:mm aa"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">End Time</label>
          <DatePicker
            selected={formData.endTime}
            onChange={(date) => handleTimeChange("endTime", date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="End Time"
            dateFormat="h:mm aa"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <Auto_comp onSelect={handleLocationSelect} />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter description"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Service Image</label>
          <input
            type="file"
            name="serviceImage"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">ID Proof Image</label>
          <input
            type="file"
            name="idProofImage"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone Number 1</label>
          <input
            type="tel"
            name="phoneNumber1"
            value={formData.phoneNumber1}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter first phone number"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone Number 2</label>
          <input
            type="tel"
            name="phoneNumber2"
            value={formData.phoneNumber2}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter second phone number"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;