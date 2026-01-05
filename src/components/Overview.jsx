import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useClientRefresh } from "../context/ClientRefreshContext";
import { useQuotationRefresh } from "../context/QuotationRefreshContext";

import RecentActivity from "./RecentActivity";
import RecentClient from "./RecentClient";
import RecentQuotation from "./RecentQuotation";

// ✅ Use env-based API URL
const API_URL =
  `${import.meta.env.VITE_API_BASE_URL}/api/Dashboard/quotation-pipeline`;

const formatDate = (date) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const Overview = ({ collapsed }) => {
  const { clientRefreshKey } = useClientRefresh();
  const { quotationRefreshKey } = useQuotationRefresh();

  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [period, setPeriod] = useState("This Month");

  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [errorChart, setErrorChart] = useState(null);

  // 🕒 Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(formatDate(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 📊 Fetch quotation pipeline
  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChart(true);
      setErrorChart(null);

      // Debug: Log API URL
      console.log("API_URL:", API_URL);

      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setErrorChart("Authentication failed. Please log in.");
        setLoadingChart(false);
        return;
      }

      if (!API_URL || API_URL.includes("undefined")) {
        console.error("API_URL is not configured. Check VITE_API_BASE_URL env variable.");
        setErrorChart("API configuration error. Please check environment variables.");
        setLoadingChart(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}?period=${period}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error text:", errorText);
          throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }

        const apiResponse = await response.json();
        console.log("API Response:", apiResponse);

        if (!Array.isArray(apiResponse.quotationPipelineData)) {
          throw new Error("Invalid quotation pipeline data");
        }

        setChartData(apiResponse.quotationPipelineData);
      } catch (err) {
        console.error("Dashboard Error:", err.message || err);
        console.error("Full error:", err);
        setErrorChart(
          err.message === "Unauthorized"
            ? "Session expired. Please login again."
            : `Failed to load dashboard data: ${err.message || "Unknown error"}`
        );
        setChartData([]);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();

    // 🔥 REFRESH WHEN:
    // - period changes
    // - quotation created/updated
    // - client created/updated
  }, [period, quotationRefreshKey, clientRefreshKey]);

  return (
    <div style={{ padding: "40px", height: "200%", overflowY: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6">Quotation Dashboard</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            size="small"
          >
            <MenuItem value="This Week">This Week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="This Year">This Year</MenuItem>
          </Select>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5}}>
            <CalendarTodayIcon fontSize="small" />
            <Typography>{currentDate}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 10,
        }}
      >
        {/* Left */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, width: "107%"}}>
          <RecentActivity
            refreshKey={`${clientRefreshKey}-${quotationRefreshKey}`}
          />
          <RecentClient refreshKey={clientRefreshKey} />
        </Box>

        {/* Right */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, width: "106%"}}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 1,
              minHeight: 400,
              paddingRight: 3,
            }}
          >
            <Typography variant="h6" sx={{ m: 2 }}>
              Quotation Pipeline ({period})
            </Typography>

            {loadingChart ? (
              <Box display="flex" justifyContent="center" height={300}>
                <CircularProgress />
              </Box>
            ) : errorChart ? (
              <Alert severity="error">{errorChart}</Alert>
            ) : chartData.length === 0 ? (
              <Typography align="center">
                No quotation data available
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300} >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="draft" fill="#FFC107" />
                  <Bar dataKey="sent" fill="#03A9F4" />
                  <Bar dataKey="accepted" fill="#4CAF50" />
                  <Bar dataKey="rejected" fill="#F44336" />
                  <Bar dataKey="expired" fill="#9C27B0" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>

          <RecentQuotation refreshKey={quotationRefreshKey} />
        </Box>
      </Box>
    </div>
  );
};

export default Overview;
