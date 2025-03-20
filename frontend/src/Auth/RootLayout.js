import React from "react";
import bb from "../assets/camera-1130731.jpg";

import {  Outlet } from "react-router-dom";


const RootLayout = () => {
  return (
    <div className="flex flex-row min-h-screen">
      {/* 60% Section */}
      <div
        className="w-[55vw] p-6 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${bb})` }}
      ></div>

      {/* 40% Section */}
      <div className="w-[100vw] md:w-[45vw] bg-[#050c28]"> <Outlet  /></div>
    </div>
  );
};

export default RootLayout;
