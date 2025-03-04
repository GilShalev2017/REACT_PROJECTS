import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AppRoutes from "./routes";

const drawerWidth = 240; // Sidebar width

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <CssBaseline />

        {/* Full-width Topbar */}
        <Box sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 2000 }}>
          <Topbar />
        </Box>

        {/* Content below Topbar */}
        <Box sx={{ display: "flex", flexGrow: 1, mt: 8 }}>
          {/* Sidebar */}
          <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
            <Sidebar />
          </Box>

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AppRoutes />
          </Box>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
