import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SampleTablePage from "./pages/SampleTablePage";
import JobsDashboardPage from "./pages/JobsDashboardPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/table" element={<SampleTablePage />} />
      <Route path="/jobs" element={<JobsDashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;
