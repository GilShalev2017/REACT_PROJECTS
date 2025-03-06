// import React from "react";
// import { Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
// import { Home, TableChart, AccessAlarm, ExpandLess, ExpandMore,VideoLibrary,PermMedia } from "@mui/icons-material";
// import { Link } from "react-router-dom";

// const drawerWidth = 240;

// const Sidebar: React.FC = () => {
//   const [openMediaInsight, setOpenMediaInsight] = React.useState(false);

//   const handleClick = () => {
//     setOpenMediaInsight(!openMediaInsight);
//   };

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//           boxSizing: "border-box",
//         },
//       }}
//     >
//       <Toolbar />
//       <List>
//         <ListItem component={Link} to="/">
//           <ListItemIcon>
//             <Home />
//           </ListItemIcon>
//           <ListItemText primary="Dashboard" />
//         </ListItem>
//         <ListItem component={Link} to="/table">
//           <ListItemIcon>
//             <TableChart />
//           </ListItemIcon>
//           <ListItemText primary="Table Page" />
//         </ListItem>
//         <ListItem onClick={handleClick} sx={{ '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}> 
//           <ListItemIcon>
//             <PermMedia />
//           </ListItemIcon>
//           <ListItemText primary="Media Insight" />
//           {openMediaInsight ? <ExpandLess /> : <ExpandMore />}
//         </ListItem>
//         <Collapse in={openMediaInsight} timeout="auto" unmountOnExit>
//           <List component="div" disablePadding>
//             <ListItem component={Link} to="/clips" sx={{ pl: 4, '&:hover': { bgcolor: 'action.hover' } }}>
//               <ListItemIcon>
//                 <VideoLibrary />
//               </ListItemIcon>
//               <ListItemText primary="Clips" />
//             </ListItem>
//             <ListItem component={Link} to="/jobs" sx={{ pl: 4, '&:hover': { bgcolor: 'action.hover' } }}>
//               <ListItemIcon>
//                 <AccessAlarm />
//               </ListItemIcon>
//               <ListItemText primary="AI Jobs" />
//             </ListItem>
//           </List>
//         </Collapse>
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;
import React from "react";
import { Collapse, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { Home, TableChart, AccessAlarm, ExpandLess, ExpandMore, VideoLibrary, PermMedia } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
    const [openMediaInsight, setOpenMediaInsight] = React.useState(false);
    const location = useLocation();

    const handleClick = () => {
        setOpenMediaInsight(!openMediaInsight);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <Toolbar />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/" selected={location.pathname === '/'}>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/table" selected={location.pathname === '/table'}>
                        <ListItemIcon>
                            <TableChart />
                        </ListItemIcon>
                        <ListItemText primary="Table Page" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={handleClick} sx={{ '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            <PermMedia />
                        </ListItemIcon>
                        <ListItemText primary="Media Insight" />
                        {openMediaInsight ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={openMediaInsight} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem disablePadding sx={{ pl: 4, '&:hover': { bgcolor: 'action.hover' } }}>
                            <ListItemButton component={Link} to="/clips" selected={location.pathname === '/clips'}>
                                <ListItemIcon>
                                    <VideoLibrary />
                                </ListItemIcon>
                                <ListItemText primary="Clips" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ pl: 4, '&:hover': { bgcolor: 'action.hover' } }}>
                            <ListItemButton component={Link} to="/jobs" selected={location.pathname === '/jobs'}>
                                <ListItemIcon>
                                    <AccessAlarm />
                                </ListItemIcon>
                                <ListItemText primary="AI Jobs" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Collapse>
            </List>
        </Drawer>
    );
};

export default Sidebar;