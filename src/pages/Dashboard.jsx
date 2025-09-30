import Sidebar from '../components/SideBar';
import TopBar from '../components/TopBar';
import Overview from "../components/Overview";
import RecentTransaction from "../components/RecentTransaction";
import RecentActivity from "../components/RecentActivity";
import RecentPayment from "../components/RecentPayment";
import { Box, Typography, MenuItem, Select } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from "react";

export default function Dashboard() {
  const [currency, setCurrency] = useState('USD');
  const [period, setPeriod] = useState('This Week');
  const [collapsed, setCollapsed] = useState(false); // ✅ state lifted here

  // 👇 Adjust width dynamically
  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* TopBar */}
      <TopBar />

      {/* Greeting + Right Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pl: `${sidebarWidth + 20}px`, // ✅ adjusts with sidebar
          pr: 4,
          py: 2,
          flexWrap: "wrap",
          gap: 2,
          transition: "padding-left 0.3s ease", // ✅ smooth transition
          backgroundColor: "transparent",
          zIndex: 2,
        }}
      >
        <Typography variant="h6" color="text.primary">
          Glad to see you
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            size="small"
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
          </Select>

          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            size="small"
          >
            <MenuItem value="This Week">This Week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="This Year">This Year</MenuItem>
          </Select>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon />
            <Typography variant="body1" color="text.primary">
              28 Sep 2025
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main content expands automatically */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '50px',
            overflowY: 'auto',
            gap: '30px',
            transition: "all 0.3s ease", // ✅ animate expansion
          }}
        >
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <RecentTransaction />
            <Box sx={{ mt: 6 }}>
              <RecentActivity />
            </Box>
          </div>

          {/* Right column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Overview />
            <Box sx={{ mt: 4 }}>
              <RecentPayment />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
