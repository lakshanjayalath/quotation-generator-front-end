// src/pages/Dashboard.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";
import Overview from "../components/Overview";
import ClientPage from "../components/ClientPage";
import ItemPage from "../components/ItemPage";
import QuotationList from "../components/QuotationList";
import NewClientForm from "../components/NewClientForm";
import NewItemForm from "../components/NewItemForm";
import NewQuotationForm from "../components/NewQuotationForm";
import Report from "../components/Report"; 
import Setting from "./Setting";


export default function Dashboard() {
  const topBarHeight = 64;
  const location = useLocation();

  // Remove padding only for setting page
  const isSettingPage = location.pathname.startsWith("/dashboard/setting");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: `${topBarHeight}px`,
          background: "#fff",
          zIndex: 1000,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <TopBar />
      </div>

      {/* Sidebar + Main Content */}
      <div style={{ display: "flex", flex: 1, marginTop: `${topBarHeight}px` }}>
        {/* Main Dashboard Sidebar */}
        <Sidebar />

        {/* Dashboard Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isSettingPage ? "0px" : "20px", // conditional padding
          }}
        >
          <Routes>
            <Route index element={<Overview />} />
            <Route path="clients" element={<ClientPage />} />
            <Route path="clients/edit/:id" element={<NewClientForm />} />
            <Route path="items" element={<ItemPage />} />
            <Route path="quotes" element={<QuotationList />} />
            <Route path="new-client" element={<NewClientForm />} />
            <Route path="new-item" element={<NewItemForm />} />
            <Route path="new-quote" element={<NewQuotationForm />} />
            <Route path="reports" element={<Report />} />

            {/* Settings Page */}
            <Route path="setting/*" element={<Setting />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
