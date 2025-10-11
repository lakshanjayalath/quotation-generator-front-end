// src/pages/Setting.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SettingSidebar from "../components/SettingSidebar";
import CompanyDetails from "../components/CompanyDetails";
import UserDetails from "../components/UserDetails";
import ProductSettings from "../components/ProductSettings";
import TaskSettings from "../components/TaskSettings";
import AccountManagement from "../components/AccountManagement";

export default function Setting() {
  return (
    <div style={{ display: "flex", height: "calc(100vh - 65px)", width: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: "245px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <SettingSidebar />
      </div>

      {/* Right-side Settings Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <Routes>
          <Route path="company-details" element={<CompanyDetails />} />
          <Route path="user-details" element={<UserDetails />} />
          <Route path="product-settings" element={<ProductSettings />} />
          <Route path="task-settings" element={<TaskSettings />} />
          <Route path="account-management" element={<AccountManagement />} />
        </Routes>
      </div>
    </div>
  );
}
