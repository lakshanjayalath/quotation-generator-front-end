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
import { Box, Typography, MenuItem, Select, CircularProgress, Alert } from "@mui/material"; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Import both custom context hooks
import { useClientRefresh } from "../context/ClientRefreshContext";
import { useQuotationRefresh } from "../context/QuotationRefreshContext"; 

import RecentActivity from "./RecentActivity";
import RecentClient from "./RecentClient";
import RecentQuotation from "./RecentQuotation";

// API URL for the quotation pipeline chart
const API_URL = "http://localhost:5264/api/Dashboard/quotation-pipeline";

const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

const Overview = ({ collapsed }) => {
    // 1. Get BOTH refresh keys from context 
    const { clientRefreshKey } = useClientRefresh();
    const { quotationRefreshKey } = useQuotationRefresh(); 

    const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
    const [period, setPeriod] = useState('This Month'); 
    
    // Chart data state
    const [chartData, setChartData] = useState([]);
    const [loadingChart, setLoadingChart] = useState(true);
    const [errorChart, setErrorChart] = useState(null);

    // EFFECT 1: REAL-TIME CLOCK (Unchanged)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(formatDate(new Date()));
        }, 1000);
        return () => clearInterval(timer);
    }, []); 

    // EFFECT 2: Data Fetching (Quotation Pipeline Chart)
    useEffect(() => {
        const fetchChartData = async () => {
            setLoadingChart(true);
            setErrorChart(null);
            
            const authToken = localStorage.getItem('authToken'); 
            if (!authToken) {
                setErrorChart("Authentication failed. Please log in.");
                setLoadingChart(false);
                return; 
            }

            try {
                // Fetch data for the quotation pipeline based on period
                const response = await fetch(`${API_URL}?period=${period}`, {
                    headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
                });
                
                if (response.status === 401) { throw new Error("Unauthorized."); }
                if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }

                const apiResponse = await response.json();
                
                // Assuming the API returns a structure like: { ..., quotationPipelineData: [...] }
                const pipelineDataArray = apiResponse.quotationPipelineData; 
                
                if (Array.isArray(pipelineDataArray)) {
                    setChartData(pipelineDataArray);
                } else {
                    console.error("API response did not contain the expected 'quotationPipelineData' array:", apiResponse);
                    throw new Error("Invalid data format for chart. Expected 'quotationPipelineData' array.");
                }
                
            } catch (err) {
                console.error("Error fetching quotation data:", err);
                const errorMessage = err.message.includes("Unauthorized") 
                    ? "Session expired. Please log in again."
                    : (err.message.includes("Invalid data format") ? err.message : "Failed to load quotation data. Check API URL and server status.");
                setErrorChart(errorMessage);
                setChartData([]);
            } finally {
                setLoadingChart(false);
            }
        };

        fetchChartData();
    // CRITICAL FIX: Watching period AND the quotation refresh key 
    }, [period, quotationRefreshKey]); 

    return (
        <div style={{ padding: "30px", height: "100%", overflowY: "auto" }}>
            {/* Greeting + Controls */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                    flexWrap: "wrap",
                    gap: 2
                }}
            >
                {/* Updated Title */}
                <Typography variant="h6" color="text.primary">
                    Quotation Dashboard
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        size="small"
                        sx={{ minWidth: 120 }}
                    >
                        <MenuItem value="This Week">This Week</MenuItem>
                        <MenuItem value="This Month">This Month</MenuItem>
                        <MenuItem value="This Year">This Year</MenuItem>
                    </Select>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CalendarTodayIcon fontSize="small" />
                        <Typography variant="body1" color="text.primary">
                            {currentDate}
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
                    flex: 1,
                }}
            >
                {/* Left column: Activity + Client */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    <RecentActivity /> 
                    
                    {/* Pass the clientRefreshKey to RecentClient */}
                    <RecentClient refreshKey={clientRefreshKey} />
                </Box>

                {/* Right column: Chart + Quotation */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    
                    {/* Chart Box - Quotation Pipeline */}
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            p: 4,
                            borderRadius: 2,
                            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                            minHeight: 400
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Quotation Pipeline ({period})
                        </Typography>
                        
                        {/* Chart rendering logic */}
                        {loadingChart ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                                <CircularProgress size={24} />
                                <Typography ml={2}>Loading pipeline data...</Typography>
                            </Box>
                        ) : errorChart ? (
                            <Alert severity="error" sx={{ my: 2 }}>
                                {errorChart}
                            </Alert>
                        ) : chartData.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                                <Typography color="text.secondary">No quotation data for this period.</Typography>
                            </Box>
                        ) : (
                            // BarChart for clear status comparison
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart 
                                    data={chartData}
                                    margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
                                    // stackOffset property removed to show counts, not percentages
                                >
                                    <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                                    <XAxis dataKey="name" /> 
                                    {/* FIX: Removed dataKey="total" from YAxis if not needed for vertical scaling, 
                                            and rely on Recharts auto-scaling for counts */}
                                    <YAxis tickFormatter={(value) => `${value}`} /> 
                                    <Tooltip 
                                        formatter={(value, name) => [value, name]}
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    />
                                    <Legend />
                                    
                                    {/* Data keys must match your C# QuotationDataPoint DTO properties */}
                                    <Bar dataKey="draft" fill="#FFC107" name="Draft" stackId="a" />
                                    <Bar dataKey="sent" fill="#03A9F4" name="Sent" stackId="a" />
                                    <Bar dataKey="accepted" fill="#4CAF50" name="Accepted" stackId="a" />
                                    <Bar dataKey="rejected" fill="#F44336" name="Rejected" stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Box>

                    {/* Recent Quotations */}
                    <RecentQuotation />
                </Box>
            </Box>
        </div>
    );
};

export default Overview;