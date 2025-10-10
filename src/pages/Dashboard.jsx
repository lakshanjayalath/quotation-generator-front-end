// Dashboard.jsx
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";
import Overview from "../components/Overview";
import ClientPage from "../components/ClientPage";
import ItemPage from "../components/ItemPage";
import QuotationList from "../components/QuotationList";
import NewClientForm from "../components/NewClientForm";
import NewItemForm from "../components/NewItemForm";
import NewQuotationForm from "../components/NewQuotationForm";

export default function Dashboard() {
  const topBarHeight = 64;

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

      {/* Sidebar + Content */}
      <div style={{ display: "flex", flex: 1, marginTop: `${topBarHeight}px` }}>
        <Sidebar />

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <Routes>
            {/* These paths are relative to /dashboard */}
            <Route index element={<Overview />} />
            <Route path="clients" element={<ClientPage />} />
            <Route path="items" element={<ItemPage />} />
            <Route path="quotes" element={<QuotationList />} />
            <Route path="new-client" element={<NewClientForm />} />
            <Route path="new-item" element={<NewItemForm />} />
            <Route path="new-quote" element={<NewQuotationForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}