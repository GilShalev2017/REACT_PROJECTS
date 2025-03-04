import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { Home, TableChart, AccessAlarm } from "@mui/icons-material";
import { Link } from "react-router-dom";

const drawerWidth = 240; 

const Sidebar: React.FC = () => {
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
      <Toolbar /> {/* Add a toolbar to push content below the topbar */}
      <List>
        <ListItem component={Link} to="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to="/table">
          <ListItemIcon>
            <TableChart />
          </ListItemIcon>
          <ListItemText primary="Table Page" />
        </ListItem>
        <ListItem component={Link} to="/jobs">
          <ListItemIcon>
            <AccessAlarm />
          </ListItemIcon>
          <ListItemText primary="Jobs Dashboard" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;