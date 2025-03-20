import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./Home";
import Signin from "./Auth/Signin";
import Signup from "./Auth/Signup";
import Feed from "./pages/Home/Feed";
import Makegroup from "./pages/Group/Makegroup";
import Explore from "./pages/explore/Explore";
import Message from "./pages/messages/Message";
import Create from "./pages/Post/Create";
import Service from "./pages/service/Service";
import Search from "./pages/search/Search";
import Otherperson from "./pages/helper/Otherperson";
import RootLayout from "./Auth/RootLayout";
import Map from "./maps/Mapspoint";
import Group from "./pages/Group/Test/Group";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/a" element={<Map />} />

        {/* <Route path="/" element={<Hometest />} /> */}

        <Route element={<RootLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/Login" element={<Signin />} />
        </Route>

        {/* Main Routes with Sidebar layout */}
        <Route element={<MainLayout />}>
          <Route path="/Dashbord" element={<Feed />} />
          {/* <Route path="/makegroup" element={<Makegroup />} /> */}
          <Route path="/makegroup" element={<Group />} />

          <Route path="/services" element={<Service />} />

          <Route path="/create" element={<Create />} />
          <Route path="/search" element={<Search />} />

          <Route path="/messages" element={<Message />} />

          <Route path="/explore" element={<Explore />} />

          <Route path="/person/:name" element={<Otherperson />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
