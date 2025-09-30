import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Dashboard layout */}
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
