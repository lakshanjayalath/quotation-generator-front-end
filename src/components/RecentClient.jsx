import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress
} from "@mui/material";

// Ensure this URL is correct
const API_URL = "http://localhost:5264/api/Dashboard/recent-clients"; 

const RecentClient = ({ refreshKey }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientData = async () => {
            setLoading(true);
            setError(null);
            const authToken = localStorage.getItem("authToken");

            if (!authToken) {
                setError("Authentication failed. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(API_URL, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setClients(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching recent clients:", err);
                const errorMessage = err.message.includes("Unauthorized") 
                    ? "Session expired. Please log in again." 
                    : "Failed to load clients. Check API URL and server status.";
                setError(errorMessage);
                setClients([]);
            } finally {
                setLoading(false);
            }
        };

        // refreshKey triggers a new fetch when a new client is saved
        fetchClientData();
    }, [refreshKey]);

    const formatClientDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return dateString; 
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                marginTop: 0.5,
                p: 3,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                minHeight: 300
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Clients 👥
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress size={24} />
                    <Typography ml={2}>Loading data...</Typography>
                </Box>
            ) : error ? (
                <Typography color="error" align="center" py={4}>
                    {error}
                </Typography>
            ) : clients.length === 0 ? (
                <Typography color="text.secondary" align="center" py={4}>
                    No recent clients found.
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Contact No.</TableCell>
                                <TableCell>Date Joined</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id}> 
                                    {/* ✅ FIX: Use camelCase property names */}
                                    <TableCell>{client.id}</TableCell>
                                    <TableCell>{client.clientName}</TableCell> 
                                    <TableCell>{client.clientEmail}</TableCell>
                                    <TableCell>{client.clientContactNumber}</TableCell>
                                    <TableCell>
                                        {formatClientDate(client.createdDate)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default RecentClient;