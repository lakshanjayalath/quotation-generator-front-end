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
    CircularProgress,
    Alert
} from "@mui/material";

// CRITICAL ADDITION: Import the context hook
import { useQuotationRefresh } from "../context/QuotationRefreshContext"; 

const API_URL = "http://localhost:5264/api/Dashboard/recent-quotations";

const RecentQuotation = () => {
    // 1. Get the refresh key from context 
    const { quotationRefreshKey } = useQuotationRefresh(); 

    // 2. State definitions
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function for reliable date formatting
    const formatQuotationDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Helper function for reliable currency formatting
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return 'N/A';
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    // 3. Data fetching logic
    useEffect(() => {
        const fetchQuotationData = async () => {
            setLoading(true);
            setError(null);
            
            const authToken = localStorage.getItem('authToken'); 

            if (!authToken) {
                setError("Authentication failed. Please log in.");
                setLoading(false);
                return; 
            }

            try {
                const response = await fetch(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                }); 
                
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Unauthorized. Your session may have expired.");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json(); 
                setQuotations(data);
                setError(null);

            } catch (err) {
                console.error("Error fetching recent quotations:", err);
                const errorMessage = err.message.includes("Unauthorized") 
                    ? "Session expired. Please log in again."
                    : "Failed to load quotations. Check API URL and server status.";
                setError(errorMessage);
                setQuotations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotationData();
    // CRITICAL FIX: Add quotationRefreshKey to the dependency array
    }, [quotationRefreshKey]); 

    // 4. Render content 
    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                p: 3,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                minHeight: 300,
                // Ensure TableContainer doesn't introduce scroll if not needed
                overflowX: 'hidden' 
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Quotations 📝
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress size={24} />
                    <Typography ml={2}>Loading data...</Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ py: 2 }}>
                    {error}
                </Alert>
            ) : quotations.length === 0 ? (
                <Typography color="text.secondary" align="center" py={4}>
                    No recent quotations found.
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {/* Adjusted column headers for clarity/completeness */}
                                <TableCell sx={{ fontWeight: 'bold' }}>Quote ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total ($)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotations.map((quote) => (
                                <TableRow key={quote.id || quote.quotationId || quote._id}> 
                                    {/* FIX: Use quotationId/id for robustness */}
                                    <TableCell>{quote.quotationId || quote.id || 'N/A'}</TableCell>
                                    {/* FIX: Use clientName property */}
                                    <TableCell>{quote.clientName || 'N/A'}</TableCell> 
                                    {/* FIX: Use quotationDate property */}
                                    <TableCell>{formatQuotationDate(quote.quotationDate || quote.quoteDate)}</TableCell> 
                                    {/* FIX: Use formatCurrency helper */}
                                    <TableCell align="right">
                                        {formatCurrency(quote.total || quote.quotationTotal)}
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

export default RecentQuotation;