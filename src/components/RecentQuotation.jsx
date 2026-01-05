import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    CircularProgress, Alert
} from "@mui/material";

import { useQuotationRefresh } from "../context/QuotationRefreshContext";

const API_URL = "http://localhost:5264/api/Dashboard/recent-quotations";

const RecentQuotation = () => {
    const { quotationRefreshKey } = useQuotationRefresh();

    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const formatCurrency = (amount) =>
        `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Authentication required.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch quotations");

                const data = await res.json();

                // Normalize and validate: ensure non-empty ID and non-null date
                const normalized = (Array.isArray(data) ? data : []).map((q) => {
                    const id = q.quotationId ?? q.id ?? q.QuoteId ?? q.QuoteID ?? q.quotationID;
                    const clientName = q.clientName ?? q.ClientName ?? q.client ?? "";
                    const date = q.quotationDate ?? q.quoteDate ?? q.QuoteDate ?? q.date ?? q.Date ?? null;
                    const total = q.total ?? q.amount ?? q.Amount ?? q.NetAmount ?? 0;
                    return { id, clientName, date, total };
                }).filter(q => q.id && q.date);

                // Sort ascending by ID (numeric when possible, else lexicographic)
                const parseId = (val) => {
                    const n = Number(val);
                    return Number.isNaN(n) ? null : n;
                };
                const sorted = normalized.slice().sort((a, b) => {
                    const ai = parseId(a.id);
                    const bi = parseId(b.id);
                    if (ai != null && bi != null) return ai - bi;
                    return String(a.id).localeCompare(String(b.id));
                });

                setQuotations(sorted);
            } catch (err) {
                setError("Unable to load quotations.");
                setQuotations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [quotationRefreshKey]);

    return (
        <Box sx={{ background: "#fff", borderRadius: 2, p: 3, boxShadow: 1, height: 350 }}>
            <Typography variant="h6" mb={2}>
                Recent Quotations 📝
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : quotations.length === 0 ? (
                <Typography color="text.secondary">
                    No quotations found.
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Client</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell align="right"><b>Total</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotations.map((q, idx) => (
                                <TableRow key={q.id || idx}>
                                    <TableCell>{q.id}</TableCell>
                                    <TableCell>{q.clientName}</TableCell>
                                    <TableCell>{formatDate(q.date)}</TableCell>
                                    <TableCell align="right">{formatCurrency(Number(q.total) || 0)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default RecentQuotation;
