import React from "react";
import bb from "../../src/assets/clouds-1850093_1920.jpg";
import { motion } from "framer-motion";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import rome from "../../src/assets/arc-of-constant-3044634_1280.jpg";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FaCamera, FaStar, FaSearch } from "react-icons/fa";




import {  Space } from "antd";
import "../../src/Fotter.css";
import "../../src/App.css"
import {
  GoogleOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  GithubOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: "transparent", // Set the background color of the accordion
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "white" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)", // Adjust if necessary for transparency
  flexDirection: "row-reverse",
  color: "white", // Set the text color to white
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Hometest = () => {
  const [expanded, setExpanded] = React.useState(false); // Initially, no panel is expanded

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false); // Expand the clicked panel or collapse it
  };
  const gradientBackground = {
    // background: "linear-gradient(to right, #ff8a00, #e52e71)",
    // background: "linear-gradient(to right, #bfe9ff, #bfe9ff )",
    background: "linear-gradient(to right, #ff6f72, #f14dfd )",
    WebkitBackgroundClip: "text",
    color: "transparent",
    display: "inline-block",
    // height: 20,
  };
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup"); // Navigate to '/otherpage'
  };
  const handleClickl = () => {
    navigate("/Login"); // Navigate to '/otherpage'
  };
  return (
    <div>
      <div
        className="bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${bb})` }}
      >
        <div className="w-full h-[70vh] flex flex-col items-center bg-cover bg-center text-white bg-black bg-opacity-60">
          <div className="px-4 w-[60vw] h-16 flex justify-between items-center bg-black bg-opacity-50 text-white mt-5 border rounded-full border-black">
            <div className="flex items-center">
              <IconButton>
                <MenuIcon />
              </IconButton>
              <p className="text-2xl">Bucketlist</p>
            </div>
            <div className="flex gap-6">
              <motion.button
                whileHover={{
                  scale: 1.2,
                  color: "gray",
                  transition: {
                    duration: 0.2,
                    ease: "easeInOut",
                  },
                }}
                onClick={handleClickl}
              >
                Signin
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.2,
                  color: "gray",
                  transition: {
                    duration: 0.2,
                    ease: "easeInOut",
                  },
                }}
                onClick={handleClick}
              >
                Signup
              </motion.button>
            </div>
          </div>
          <div className="flex p-20 mt-11 rounded-lg">
            <div>
              <p
                className="text-4xl"
                style={{
                  background: "linear-gradient(90deg, #a56cf1, #61dafb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Bucket List: Discover, Share, Explore
              </p>
              <p className="text-2xl mt-4">
                Unlock the world's hidden gems and create unforgettable travel
                memories. Share your experiences and connect with a global
                community of adventurers.
              </p>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  transition: {
                    duration: 0.2,
                    ease: "easeInOut",
                  },
                }}
                onClick={handleClickl}
                className="w-52 mt-6 bg-gradient-to-r from-[#77A1D3] via-[#79CBCA] to-[#77A1D3] hover:bg-[length:200%_auto] hover:bg-right text-white py-3 px-8 rounded-lg text-lg font-semibold shadow-md transition-all duration-300"
              >
                Start Exploring
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${rome})` }}
      >
        <div className="w-full h-[70vh] flex flex-col bg-cover bg-center text-white bg-black bg-opacity-60">
          <div className="p-20 mt-20">
            <p
              className="text-4xl"
              style={{
                background: "linear-gradient(90deg, #a56cf1, #61dafb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Be Like Rome in Rome
            </p>
            <br></br>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>
                  To truly experience Rome, you have to know Rome.
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="text-white w-[70%]">
                  Discover the true essence of a destination by embracing the
                  local way of life. Engage with the community, learn about
                  their traditions, and share your own cultural experiences.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      {/* text-purple-400 */}
      <div className="bg-gray-900 text-white py-16 px-4 ">
        <p
          className="text-4xl md:text-4xl  text-center  mb-12"
          style={{
            background: "linear-gradient(90deg, #a56cf1, #61dafb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {" "}
          Find Your Dream Destinations
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">
              Personalized Recommendations
            </h3>
            <p className="text-gray-300">
              Our intelligent algorithms analyze your preferences to suggest the
              perfect destinations tailored to your interests and travel style.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">
              Bucket List Inspiration
            </h3>
            <p className="text-gray-300">
              Explore a curated collection of must-visit locations that have
              captivated travelers from around the world.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">
              Destination Guides
            </h3>
            <p className="text-gray-300">
              Dive into comprehensive destination guides that provide insider
              tips, local insights, and practical information to plan your dream
              trip.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-full bg-[rgba(153,152,255,255)] items-center justify-center ">
        <div className="flex align-middle justify-center items-center  p-16">
          <div className=" flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg shadow-slate-700 p-8  text-white">
              {" "}
              <p
                className="text-4xl md:text-4xl  text-center  mb-12"
                style={{
                  background: "linear-gradient(90deg, #a56cf1, #61dafb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Upload Your Own Travel Photos and Reviews
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                  <FaCamera className="text-[rgba(153,152,255,255)] text-3xl mb-4" />
                  <h3 className="text-lg font-bold mb-2">Share Photos</h3>
                  <p className="text-gray-300">
                    Capture and upload your best travel moments to inspire
                    others and create a visual story of your adventures.
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <FaStar className="text-[rgba(153,152,255,255)] text-3xl mb-4" />
                  <h3 className="text-lg font-bold mb-2">Write Reviews</h3>
                  <p className="text-gray-300">
                    Provide honest and helpful reviews of the places you've
                    visited, the services you've experienced, and the
                    discoveries you've made.
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <FaSearch className="text-[rgba(153,152,255,255)] text-3xl mb-4" />
                  <h3 className="text-lg font-bold mb-2">Explore Insights</h3>
                  <p className="text-gray-300">
                    Discover valuable insights from fellow travelers to plan
                    your perfect itinerary and make the most of your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  p-16 ">
          <div className="bg-[#1a1a2e] text-white p-8 rounded-lg  mx-8">
            <p
              className="text-4xl md:text-4xl  text-center  mb-12"
              style={{
                background: "linear-gradient(90deg, #a56cf1, #61dafb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Discover Local Insights and Recommendations
            </p>
            <div className="flex flex-col md:flex-row gap-8 justify-between">
              {/* Card 1 */}
              <div className="flex-1 bg-[#2e2e3a] p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-[#333344] text-2xl font-bold px-4 py-2 rounded-l-md">
                    <p className="text-[rgba(153,152,255,255)] text-3xl ">1</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Authentic Experiences
                </h3>
                <p className="text-sm text-gray-400">
                  Uncover hidden gems and off-the-beaten-path locations
                  recommended by locals to immerse yourself in the true spirit
                  of a destination.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex-1 bg-[#2e2e3a] p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-[#333344] text-2xl font-bold px-4 py-2 rounded-l-md">
                    <p className="text-[rgba(153,152,255,255)] text-3xl ">2</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Insider Tips</h3>
                <p className="text-sm text-gray-400">
                  Gain valuable insights from fellow travelers and locals on the
                  best way to navigate a destination, from transportation to
                  cuisine and beyond.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex-1 bg-[#2e2e3a] p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-[#333344] text-2xl font-bold px-4 py-2 rounded-l-md">
                    <p className="text-[rgba(153,152,255,255)] text-3xl ">3</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Personalized Suggestions
                </h3>
                <p className="text-sm text-gray-400">
                  Our platform analyzes your preferences to provide curated
                  recommendations for activities, accommodations, and must-see
                  attractions tailored to your travel style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a2e] flex flex-col justify-center align-middle items-center">
        <div className=" bg-[#1a1a2e] text-white p-8 rounded-lg max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 ">
          {/* Left Side: Image */}
          <div className="w-full md:w-[40%] md:h-[60vh] rounded-lg overflow-hidden mt-11">
            <img
              src="https://media.post.rvohealth.io/wp-content/uploads/2021/02/woman_working_from_home_distracted_1200x628-facebook-1200x628.jpg" // Replace with the actual image URL or import it as a component
              alt="Plan Itinerary"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side: Steps */}
          <div className="w-full md:w-[60%] mt-11 gap-9">
            <h2 className="text-5xl  text-[#8b9ce6] mb-10">
              Plan Your Perfect Itinerary
            </h2>
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start">
                <div className="flex items-center justify-center bg-[#333344] w-8 h-8 rounded-full font-bold text-white mr-4">
                  <p className="text-[rgba(153,152,255,255)] text-3xl ">1</p>
                </div>
                <div>
                  <h3 className="text-3xl font-semibold">Discover</h3>
                  <p className="text-2xl text-gray-400">
                    Explore our extensive database of destinations and
                    activities to build your dream itinerary.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start">
                <div className="flex items-center justify-center bg-[#333344] w-8 h-8 rounded-full font-bold text-white mr-4">
                  <p className="text-[rgba(153,152,255,255)] text-3xl ">2</p>
                </div>
                <div>
                  <h3 className="text-3xl font-semibold">Customize</h3>
                  <p className="text-2xl text-gray-400">
                    Tailor your trip by adjusting dates, budgets, and
                    preferences to find the perfect fit.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start">
                <div className="flex items-center justify-center bg-[#333344] w-8 h-8 rounded-full font-bold text-white mr-4">
                  <p className="text-[rgba(153,152,255,255)] text-3xl ">3</p>
                </div>
                <div>
                  <h3 className="text-3xl font-semibold">Book</h3>
                  <p className="text-2xl text-gray-400">
                    Seamlessly book your transportation, accommodations, and
                    activities all in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-24">
          <div>
            <p
              className="text-4xl"
              style={{
                background: "linear-gradient(90deg, #a56cf1, #61dafb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Connect with Fellow Travel Enthusiasts
            </p>
            <br></br>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>Join a Vibrant Community</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="text-white w-[100%]">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Share your travel experiences and connect with like-minded
                      adventurers.
                    </li>
                    <li>
                      Participate in discussions, join groups, and exchange
                      valuable tips and insights.
                    </li>
                    <li>
                      Collaborate with fellow travelers to plan group trips and
                      create unforgettable memories.
                    </li>
                  </ul>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
        <div className="p-10 mt-8">
          <p
            className="text-4xl p-9"
            style={{
              background: "linear-gradient(90deg, #a56cf1, #61dafb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Get Insider Tips to Enhance Your Journey
          </p>

          <div className="flex flex-col md:flex-row gap-6 mt-9">
            {/* Card 1 */}
            <div className="bg-[#2b2d42] rounded-lg p-6 flex-1 shadow-lg">
              <h3 className="text-3xl font-semibold mb-2 text-white">Local Expertise</h3>
              <p className="text-gray-400 text-2xl">
                Tap into the knowledge of our network of local experts to
                uncover hidden gems and navigate a destination like a native.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#2b2d42] rounded-lg p-6 flex-1 shadow-lg">
              <h3 className="text-3xl font-semibold mb-2 text-white">
                Personalized Guidance
              </h3>
              <p className="text-gray-400 text-2xl">
                Receive tailored recommendations and advice based on your travel
                preferences and interests to make the most of your journey.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#2b2d42] rounded-lg p-6 flex-1 shadow-lg">
              <h3 className="text-3xl font-semibold mb-2  text-white">Travel Hacks</h3>
              <p className="text-gray-400 text-2xl">
                Discover practical tips and tricks to save time, money, and
                hassle, allowing you to focus on creating unforgettable
                experiences.
              </p>
            </div>
          </div>
        </div>
        <br></br>
      </div>
      <div><footer class="footer">
          <div class="container-fluid">
            <center>
              <h1 class="bodyhead" style={gradientBackground}>
                Contact us
              </h1>
              <Box
                sx={{
                  height: 70,
                  width: 315,
                  //  margin: 4.5,
                  // marginLeft: 2,
                  padding: "1rem",
                  borderRadius: 5,
                  border: "red",
                  // backgroundColor: "white",

                  "&:hover": {
                    // backgroundColor: "white",

                    boxShadow: "2px 3px 10px #F4AAB9",
                  },
                }}
              >
                <Space style={{ marginLeft: 0 }}>
                  <GoogleOutlined style={{ fontSize: 40 }} />
                  <InstagramOutlined style={{ fontSize: 40 }} />
                  <LinkedinOutlined style={{ fontSize: 40 }} />
                  <GithubOutlined style={{ fontSize: 40 }} />
                  {/* <IconFont type="icon-facebook" style={{ fontSize: 40 }} /> */}

                  <TwitterOutlined style={{ fontSize: 40 }} />
                </Space>
              </Box>
            </center>

            <div class="row">
              <div class="col-sm-4">
                <Box
                  sx={{
                    height: 180,
                    width: 390,

                    borderRadius: 5,
                    border: "red",
                    // backgroundColor: "white",

                    "&:hover": {
                      // backgroundColor: "white",

                      boxShadow: "2px 3px 10px #F4AAB9",
                    },
                  }}
                >
                  <div style={{ marginLeft: "2rem", paddingTop: "1rem" }}>
                    {" "}
                    <h1
                      class="bodyhead"
                      style={{
                        ...gradientBackground,
                        fontSize: 25,
                        height: 50,
                        background:
                          "linear-gradient(to right, #bfe9ff, #bfe9ff )",
                      }}
                    >
                      Contact Information
                    </h1>
                    <br></br>
                    <h>Office Address: 123 Street, City, Country</h>
                    <br></br>
                    <h>Email: info@companyname.com</h>
                    <br></br>
                    <h>Phone: +1 (123) 456-7890</h>
                  </div>
                </Box>
              </div>
              <div class="col-sm-4">
                {" "}
                <Box
                  sx={{
                    height: 180,
                    width: 390,

                    borderRadius: 5,
                    border: "red",
                    // backgroundColor: "white",

                    "&:hover": {
                      // backgroundColor: "white",

                      boxShadow: "2px 3px 10px #F4AAB9",
                    },
                  }}
                >
                  <div style={{ marginLeft: "2rem", paddingTop: "1rem" }}>
                    {" "}
                    <h1
                      class="bodyhead"
                      style={{
                        ...gradientBackground,
                        fontSize: 25,
                        height: 30,
                        background:
                          "linear-gradient(to right, #bfe9ff, #bfe9ff )",
                      }}
                    >
                      Privacy Policy
                    </h1>
                    <br></br>
                    <h class="bodyhead">
                      Data Security: We prioritize the security of your personal
                      information and protect it.
                    </h>
                    <br></br>
                    <h>
                      Cookies Usage: We use cookies to improve user experience
                      and track visits to our site.
                    </h>
                  </div>
                </Box>
              </div>
              <div class="col-sm-4">
                {" "}
                <Box
                  sx={{
                    height: 180,
                    width: 390,

                    borderRadius: 5,
                    border: "red",
                    // backgroundColor: "white",

                    "&:hover": {
                      // backgroundColor: "white",

                      boxShadow: " 1px 1px 6px 1px #F4AAB9",
                    },
                  }}
                >
                  <div style={{ marginLeft: "2rem", paddingTop: "1rem" }}>
                    {" "}
                    <h1
                      class="bodyhead"
                      style={{
                        ...gradientBackground,
                        fontSize: 25,
                        height: 50,
                        background:
                          "linear-gradient(to right, #bfe9ff, #bfe9ff )",
                      }}
                    >
                      Copyright Information
                    </h1>
                    <br></br>
                    <h class="bodyhead">
                      Ownership: All content, trademarks, and intellectual
                      property displayed on our site are owned by us or used
                      with permission.
                    </h>
                  </div>
                </Box>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            ></div>
          </div>
          <br></br>
          <center>
            {" "}
            <p>&copy;IT ride | All Rights Reserved</p>
          </center>
        </footer></div>
    </div>
  );
};

export default Hometest;
