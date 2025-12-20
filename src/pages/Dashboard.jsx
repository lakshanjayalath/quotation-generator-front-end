// src/pages/Dashboard.jsx (Updated)

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// 🛑 Import BOTH Providers 🛑
import { ClientRefreshProvider } from "../context/ClientRefreshContext"; 
import { QuotationRefreshProvider } from "../context/QuotationRefreshContext"; // 👈 NEW IMPORT

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
import AdminRegisterPage from "./AdminRegisterPage";
import { AdminRoute } from "../components/ProtectedRoute";

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
                    background: "#fff",
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

                {/* Dashboard Content Area */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: isSettingPage ? "0px" : "20px",
                    }}
                >
                    {/* 🛑 CRITICAL NESTING: Both Providers must wrap the Routes 🛑 */}
                    <ClientRefreshProvider>
                        <QuotationRefreshProvider> {/* 👈 NEW PROVIDER ADDED HERE */}
                            <Routes>
                                {/* All components rendered inside Routes now have access to both contexts */}
                                <Route index element={<Overview collapsed={collapsed} />} />

                                <Route path="clients" element={<ClientPage />} />
                                <Route path="clients/edit/:id" element={<NewClientForm />} />
                                <Route path="new-client" element={<NewClientForm />} />

                                <Route path="items" element={<ItemPage />} />
                                <Route path="quotes" element={<QuotationList />} />
                                <Route path="new-item" element={<NewItemForm />} />
                                <Route path="edit-item/:id" element={<NewItemForm />} />
                                <Route path="new-quote" element={<NewQuotationForm />} />
                                <Route path="edit-quote/:id" element={<NewQuotationForm />} />

                                <Route path="reports" element={<AdminRoute><Report /></AdminRoute>} />
                                <Route path="setting/*" element={<AdminRoute><Setting /></AdminRoute>} />
                                <Route path="admin-register" element={<AdminRoute><AdminRegisterPage /></AdminRoute>} />
                            </Routes>
                        </QuotationRefreshProvider> {/* 👈 CLOSING TAG */}
                    </ClientRefreshProvider>
                </div>
            </div>
        </div>
    );
}