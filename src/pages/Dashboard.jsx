// src/pages/Dashboard.jsx

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// 🛑 Context Providers
import { ClientRefreshProvider } from "../context/ClientRefreshContext";
import { QuotationRefreshProvider } from "../context/QuotationRefreshContext";

// Layout Components
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";

// Pages / Components
import Overview from "../components/Overview";
import ClientPage from "../components/ClientPage";
import ItemPage from "../components/ItemPage";
import QuotationList from "../components/QuotationList";
import NewClientForm from "../components/NewClientForm";
import NewItemForm from "../components/NewItemForm";
import NewQuotationForm from "../components/NewQuotationForm";
import Report from "../components/Report";
import Setting from "./Setting";

// ✅ Client-only profile page
import EditClientProfile from "../components/EditClientProfile";

export default function Dashboard() {
  const topBarHeight = 64;
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
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
          zIndex: 1000,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <TopBar />
      </div>

      {/* Sidebar + Main Content */}
      <div style={{ display: "flex", flex: 1, marginTop: `${topBarHeight}px` }}>
        
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isSettingPage ? "0px" : "20px",
          }}
        >
          <ClientRefreshProvider>
            <QuotationRefreshProvider>
              <Routes>
                {/* Overview */}
                <Route index element={<Overview collapsed={collapsed} />} />

                {/* Clients (Admin) */}
                <Route path="clients" element={<ClientPage />} />
                <Route path="clients/edit/:id" element={<NewClientForm />} />
                <Route path="new-client" element={<NewClientForm />} />

                {/* ✅ Client Profile (TopBar ONLY, no :id) */}
                <Route path="edit-profile" element={<EditClientProfile />} />

                {/* Items */}
                <Route path="items" element={<ItemPage />} />
                <Route path="new-item" element={<NewItemForm />} />

                {/* Quotations */}
                <Route path="quotes" element={<QuotationList />} />
                <Route path="new-quote" element={<NewQuotationForm />} />
                <Route path="edit-quote/:id" element={<NewQuotationForm />} />

                {/* Reports & Settings */}
                <Route path="reports" element={<Report />} />
                <Route path="setting/*" element={<Setting />} />
              </Routes>
            </QuotationRefreshProvider>
          </ClientRefreshProvider>
        </div>
      </div>
    </div>
  );
}

