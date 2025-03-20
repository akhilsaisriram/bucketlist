

import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, phone, dob, password } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !dob.trim() ||
      !password.trim()
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${window._env_.REACT_APP_BASE_URL}/api/register/`, {
        username: name,
        email,
        phone,
        dob,
        password,
      });

      console.log("Registration successful:", response.data);

      sessionStorage.setItem("token", response.data.access);

      router("/Dashbord");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        setError(err.response.data.detail || "Registration failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-white bg-opacity-0 transition-shadow duration-300 shadow-[0_10px_25px_rgba(255,255,255,0)] w-2/3 rounded-lg p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="text-white text-center mr-8">
            <h1 className={`text-4xl font-bold `}>Sign Up</h1>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="name" className="block text-sm text-white mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white bg-opacity-100 text-black focus:ring-2 focus:ring-white"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-white mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white bg-opacity-100 text-black focus:ring-2 focus:ring-white"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-white mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white bg-opacity-100 text-black focus:ring-2 focus:ring-white"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm text-white mb-1">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white bg-opacity-100 text-black focus:ring-2 focus:ring-white"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-white mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white bg-opacity-100 text-black focus:ring-2 focus:ring-white"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-2 text-center">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
