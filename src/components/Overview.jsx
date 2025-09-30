import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, MenuItem, Select } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RecentTransaction from "./RecentTransaction";
import RecentActivity from "./RecentActivity";
import RecentPayment from "./RecentPayment";

const data = [
  { name: "1/Aug/2025", sales: 0 },
  { name: "7/Aug/2025", sales: 500 },
  { name: "13/Aug/2025", sales: 1000 },
  { name: "19/Aug/2025", sales: 1500 },
  { name: "25/Aug/2025", sales: 2000 },
  { name: "31/Aug/2025", sales: 2500 },
];

const Overview = ({ collapsed }) => {
  const [currency, setCurrency] = useState('USD');
  const [period, setPeriod] = useState('This Week');

  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <div style={{ padding: "30px" }}>
      {/* Greeting + Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pl: `${sidebarWidth + 20}px`,
          pr: 4,
          py: 2,
          flexWrap: "wrap",
          gap: 2,
          transition: "padding-left 0.3s ease",
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarTodayIcon />
            <Typography variant="body1" color="text.primary">
              28 Sep 2025
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main 2-column layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 4,
          mt: 4,
        }}
      >
        {/* Left column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <RecentTransaction />
          <RecentActivity />
        </Box>

        {/* Right column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Chart */}
          <div className="w-full bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#14da09ff"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Payments */}
          <RecentPayment />
        </Box>
      </Box>
    </div>
  );
};

export default Overview;
