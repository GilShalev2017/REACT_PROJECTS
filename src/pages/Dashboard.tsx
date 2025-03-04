import React from "react";
import { Box, Typography } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography>Welcome to the app!</Typography>
    </Box>
  );
};

export default Dashboard;
