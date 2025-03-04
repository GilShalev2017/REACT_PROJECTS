import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

const Topbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant="h6">
                My App
            </Typography>
            <Button color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;