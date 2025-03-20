import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { ImMakeGroup } from "react-icons/im";
import { BsSearch } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import { FaConnectdevelop } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { GrServices } from "react-icons/gr";
import { motion } from "framer-motion";
import Badge from "@mui/material/Badge";

const Sidebar = memo(({ismenu}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate instead of reloading the page

  const buttons = [
    {
      icon: <IoHomeOutline className="text-2xl md:text-4xl" />,
      text: "HOME",
      id: "home",
      link: "/Dashbord",
    },
    {
      icon: <ImMakeGroup className="text-2xl md:text-4xl" />,
      text: "Make group",
      id: "makeGroup",
      link: "/makegroup",
    },
    {
      icon: <GrServices className="text-2xl md:text-4xl" />,
      text: "Services",
      id: "transport",
      link: "/services",
    },
    {
      icon: <CiCirclePlus className="text-2xl md:text-4xl" />,
      text: "Create",
      id: "create",
      link: "/create",
    },
    {
      icon: <BsSearch className="text-2xl md:text-4xl" />,
      text: "Search",
      id: "search",
      link: "/search",
    },
    // {
    //   icon: <FaConnectdevelop className="text-2xl md:text-4xl" />,
    //   text: "Connect",
    //   id: "connect",
    //   link: "/connect",
    // },
    {
      icon: (
        <Badge color="secondary">
          <TbMessageCircle className="text-2xl md:text-4xl" />
        </Badge>
      ),
      text: "Messages",
      id: "messages",
      link: "/messages",
    },
    {
      icon: <MdOutlineExplore className="text-2xl md:text-4xl" />,
      text: "Explore",
      id: "explore",
      link: "/explore",
    },
  ];

  return (
    <div className="px-5 py-4 md:block fixed bottom-0 left-0 right-0 bg-white md:bg-transparent shadow-lg md:shadow-none md:relative gap-4">
      <div className="flex justify-around md:flex-col gap-8 md:gap-8">
        {buttons.map((button, index) => (
          <div key={index} className="flex items-center relative ">
            {location.pathname === button.link && (
              <motion.div
                layoutId="underline"
                className={`absolute w-full md:w-2 h-1 md:h-8 bg-red-500 rounded transition-all duration-300 ${
                  ismenu ? "left-10" : "left-40"
                }`}                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              ></motion.div>
              
            )}
            <motion.button
              key={button.id}
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3"
              whileHover={{
                scale: 1.08,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              // onClick={() => (window.location.href = button.link)}
              onClick={()=>navigate(button.link)}
            >
              <div>{button.icon}</div>
            {ismenu?<></>:<> <span className="hidden md:block text-lg">{button.text}</span></>} 
            </motion.button>
            <br></br>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Sidebar;
