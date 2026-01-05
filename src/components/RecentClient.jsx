import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from "@mui/material";
import { useClientRefresh } from "../context/ClientRefreshContext";

const API_URL = "http://localhost:5264/api/Dashboard/recent-clients";

const RecentClient = ({ refreshKey }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { clientRefreshKey } = useClientRefresh();

    useEffect(() => {
        const fetchClientData = async () => {
            console.log("🔄 RecentClient: Fetching data... (refreshKey changed)");
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Authentication failed. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log("✓ RecentClient data loaded:", data);

                // ✅ SAFETY: ensure array
                setClients(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching recent clients:", err);
                setError("Failed to load clients.");
                setClients([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [refreshKey, clientRefreshKey]);

    const formatClientDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "N/A"
            : date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
              });
    };

    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                marginTop: 0.5,
                p: 3,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                minHeight: 350,
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
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Email</b></TableCell>
                                <TableCell><b>Contact No.</b></TableCell>
                                <TableCell><b>Date Joined</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((client, index) => (
                                <TableRow key={client.id ?? index}>
                                    <TableCell>{client.id ?? "-"}</TableCell>
                                    <TableCell>
                                        {client.clientName ?? client.name ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {client.clientEmail ?? client.email ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {client.clientContactNumber ?? client.phone ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {formatClientDate(
                                            client.createdDate ?? client.createdAt
                                        )}
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
