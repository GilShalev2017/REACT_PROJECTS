import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Button } from "@mui/material";

const SampleTablePage: React.FC = () => {
  const rows = [
    { id: 1, name: "Item 1", value: "100" },
    { id: 2, name: "Item 2", value: "200" }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Sample Table</Typography>
      <Toolbar>
        <Button variant="contained">Add Item</Button>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SampleTablePage;
