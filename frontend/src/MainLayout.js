// import React, { memo, useEffect, useState } from "react";
// import Sidebar from "./pages/Sidebar";
// import { Link, Outlet } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserData } from "./store/user";
// import { connectSocket, joinRoom } from "./store/notifysocketSlice";
// import { LinearProgress } from "@mui/material";
// import { MenuOutlined } from "@mui/icons-material";
// import { setmenu } from "./store/isload";
// const MainLayout = () => {
//   const dispatch = useDispatch();
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   // const [menu, setmenu] = useState(false);
//   const userData = useSelector((state) => state.user.user);
//   const islaod = useSelector((state) => state.loading.isLoading);
//   const menu=useSelector((state) => state.loading.ismenu);
//   console.log(userData);

//   useEffect(() => {
//     dispatch(fetchUserData());
//     dispatch(connectSocket());
//     if (userData) {
//       dispatch(joinRoom({ uid: userData.idd }));
//     }
//   }, [dispatch]);

//   const toggleTheme = () => setIsDarkMode(!isDarkMode);
//   const togglemenu = () =>   dispatch(setmenu(!menu));;

//   return (
//     <div
//       className={`h-screen w-full flex flex-col-reverse md:flex-row ${
//         isDarkMode ? "bg-black text-white" : "bg-white text-black"
//       }`}
//       style={{
//         background: isDarkMode
//           ? "linear-gradient(to top, #333333 0%, #000000 100%)"
//           : "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
//       }}
//     >
//       <div
//         className={`w-full md:h-full h-[5vh] md:border-r border-t md:border-t-0 border-gray-400 transition-all duration-300 ${
//           menu ? "md:w-[5%]" : "md:w-[15%]"
//         }`}
//       >
//         <p
//           className="text-center p-4 text-3xl hidden md:block md:mb-10"
//           onClick={(e) => e.preventDefault()} // Prevent default behavior if needed
//         >
//           <div
//             onClick={togglemenu}
//             className="text-3xl text-gray-800 hover:text-slate-700 focus:text-slate-700 focus:outline-none cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95"
//           >
//             {menu ? (
//               <div className="text-4xl transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95">
//                 <MenuOutlined style={{ fontSize: "35px" }} />
//               </div>
//             ) : (
//               <>𝐵𝓊𝒸𝓀𝑒𝓉 𝓁𝒾𝓈𝓉</>
//             )}
//           </div>
//         </p>
//         <div className="flex md:mt-8">
//           <Sidebar ismenu={menu} />
//         </div>
//       </div>

//       {/* Main content panel */}
//       <div className="flex-grow md:w-[85%] w-full h-full overflow-y-auto max-h-screen">
//         {islaod && <LinearProgress color="secondary" />}

//         <button
//           onClick={toggleTheme}
//           className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 dark:text-white text-black fixed top-2 right-2 flex items-center justify-center"
//         >
//           {isDarkMode ? "🌞" : "🌙"}
//         </button>

//         {/* <Outlet /> */}
//         <Outlet context={{ isDarkMode }} />
//       </div>
//     </div>
//   );
// };

// export default memo(MainLayout);
import React, { memo, useEffect, useState } from "react";
import Sidebar from "./pages/Sidebar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "./store/user";
import { connectSocket, joinRoom } from "./store/notifysocketSlice";
import { 
  LinearProgress, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Avatar 
} from "@mui/material";
import { 
  MenuOutlined, 
  AccountCircle, 
  Settings, 
  ExitToApp, 
  Brightness4, 
  Brightness7 
} from "@mui/icons-material";
import { setmenu } from "./store/isload";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileDrawer, setProfileDrawer] = useState(false);
  const userData = useSelector((state) => state.user.user);
  const islaod = useSelector((state) => state.loading.isLoading);
  const menu = useSelector((state) => state.loading.ismenu);

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(connectSocket());
    if (userData) {
      dispatch(joinRoom({ uid: userData.idd }));
    }
  }, [dispatch]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const togglemenu = () => dispatch(setmenu(!menu));
  
  const toggleProfileDrawer = () => {
    setProfileDrawer(!profileDrawer);
  };
  
  const handleLogout = () => {
    // Clear token from session storage
    sessionStorage.removeItem('token');
    // Close drawer
    setProfileDrawer(false);
    // Redirect to login page
    navigate('/Login');
  };

  return (
    <div
      className={`h-screen w-full flex flex-col-reverse md:flex-row ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
      style={{
        background: isDarkMode
          ? "linear-gradient(to top, #333333 0%, #000000 100%)"
          : "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
      }}
    >
      <div
        className={`w-full md:h-full h-[5vh] md:border-r border-t md:border-t-0 border-gray-400 transition-all duration-300 ${
          menu ? "md:w-[5%]" : "md:w-[15%]"
        }`}
      >
        <p
          className="text-center p-4 text-3xl hidden md:block md:mb-10"
          onClick={(e) => e.preventDefault()}
        >
          <div
            onClick={togglemenu}
            className="text-3xl text-gray-800 hover:text-slate-700 focus:text-slate-700 focus:outline-none cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95"
          >
            {menu ? (
              <div className="text-4xl transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95">
                <MenuOutlined style={{ fontSize: "35px" }} />
              </div>
            ) : (
              <>𝐵𝓊𝒸𝓀𝑒𝓉 𝓁𝒾𝓈𝓉</>
            )}
          </div>
        </p>
        <div className="flex md:mt-8">
          <Sidebar ismenu={menu} />
        </div>
      </div>

      {/* Main content panel */}
      <div className="flex-grow md:w-[85%] w-full h-full overflow-y-auto max-h-screen">
        {islaod && <LinearProgress color="secondary" />}

        {/* Profile Menu Button */}
        <button
          onClick={toggleProfileDrawer}
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 dark:text-white text-black fixed top-2 right-2 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 z-10"
          aria-label="Profile menu"
        >
          {userData && userData.profilePic ? (
            <Avatar 
              src={userData.profilePic} 
              alt={userData.name || "User"} 
              className="w-full h-full"
            />
          ) : (
            <AccountCircle />
          )}
        </button>

        {/* Profile Drawer */}
        <Drawer
          anchor="right"
          open={profileDrawer}
          onClose={toggleProfileDrawer}
        >
          <div style={{ width: 250 }}>
            {userData && (
              <div className="p-4 flex flex-col items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <Avatar 
                  src={userData.profilePic} 
                  alt={userData.name || "User"}
                  className="w-16 h-16 mb-2 border-2 border-white"
                />
                <h3 className="text-lg font-semibold">{userData.name || "User"}</h3>
                <p className="text-sm opacity-80">{userData.email || ""}</p>
              </div>
            )}
            
            <List>
              <ListItem button component={Link} to="/profile" onClick={toggleProfileDrawer}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              
              <ListItem button component={Link} to="/settings" onClick={toggleProfileDrawer}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
              
              <ListItem button onClick={toggleTheme}>
                <ListItemIcon>
                  {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                </ListItemIcon>
                <ListItemText primary={isDarkMode ? "Light Mode" : "Dark Mode"} />
              </ListItem>
            </List>
            
            <Divider />
            
            <List>
              <ListItem button onClick={handleLogout} className="text-red-500 hover:bg-red-50">
                <ListItemIcon>
                  <ExitToApp className="text-red-500" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </div>
        </Drawer>

        <Outlet context={{ isDarkMode }} />
      </div>
    </div>
  );
};

export default memo(MainLayout);
