
import React, { useState } from "react";
import axios from "axios";

import { useNavigate} from "react-router";

const Signin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useNavigate(); // Next.js router for navigation

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (username.trim().length === 0 || password.trim().length === 0) {
      setError("Username and password cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${window._env_.REACT_APP_BASE_URL}/api/login/`, {
        email: username,
        password: password,
      });

      const accessToken = response.data.access;
      sessionStorage.setItem("token", accessToken);

      console.log("Login successful. Token:", accessToken);
      router("/Dashbord"); // Redirect to the dashboard
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data.detail || "Login failed.");
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
            <h1 className={`text-4xl font-bold `}>Login</h1>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="username" className="block text-sm text-white mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white bg-opacity-100 text-black focus:ring-2 focus:ring-white"
              disabled={loading}
            />
          </div>
          <div className="relative">
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-400 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-white">
            Do not have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
