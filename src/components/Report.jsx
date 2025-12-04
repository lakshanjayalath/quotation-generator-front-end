import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Container,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

export default function Report() {
  const [formData, setFormData] = useState({
    reportType: "Activity",
    sendEmail: false,
    includeDeleted: false,

    // Filters
    activity: "All",
    range: "All",
    startDate: "",
    endDate: "",
    status: "All",
    client: "All",
    user: "All",
    minAmount: "",
    maxAmount: "",
    groupBy: "None",
    sortBy: "Newest",
    output: "PDF",
    search: "",
  });

  const [reportData, setReportData] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setFormData({ ...formData, [field]: value });
  };

  // Fetch report data from backend
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5264/api/reports/generate", {
        reportType: formData.reportType,
        filters: {
          activity: formData.activity,
          status: formData.status,
          client: formData.client,
          user: formData.user,
          startDate: formData.startDate,
          endDate: formData.endDate,
          minAmount: formData.minAmount,
          maxAmount: formData.maxAmount,
          search: formData.search,
          includeDeleted: formData.includeDeleted,
        },
        options: {
          groupBy: formData.groupBy,
          sortBy: formData.sortBy,
        },
      });
      
      setReportData(response.data);
      setViewDialogOpen(true);
      setSnackbar({ open: true, message: "Report data loaded successfully", severity: "success" });
    } catch (error) {
      console.error("Error fetching report:", error);
      setSnackbar({ 
        open: true, 
        message: `Failed to load report: ${error.response?.data?.message || error.message}`, 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Export report data
  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5264/api/reports/export",
        {
          reportType: formData.reportType,
          filters: {
            activity: formData.activity,
            status: formData.status,
            client: formData.client,
            user: formData.user,
            startDate: formData.startDate,
            endDate: formData.endDate,
            minAmount: formData.minAmount,
            maxAmount: formData.maxAmount,
            search: formData.search,
            includeDeleted: formData.includeDeleted,
          },
          options: {
            groupBy: formData.groupBy,
            sortBy: formData.sortBy,
            format: formData.output,
            sendEmail: formData.sendEmail,
          },
        },
        { responseType: "blob" }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${formData.reportType}_${new Date().getTime()}.${getFileExtension(formData.output)}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setSnackbar({ open: true, message: `Report exported as ${formData.output}`, severity: "success" });
    } catch (error) {
      console.error("Error exporting report:", error);
      setSnackbar({ 
        open: true, 
        message: `Failed to export report: ${error.response?.data?.message || error.message}`, 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Print report
  const handlePrint = () => {
    window.print();
  };

  // Get file extension based on format
  const getFileExtension = (format) => {
    const extensions = {
      PDF: "pdf",
      Excel: "xlsx",
      CSV: "csv",
    };
    return extensions[format] || "txt";
  };

  // TextField styling
  const textFieldStyle = {
    "& label.Mui-focused": { color: "#BC4749" },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#BC4749" },
    },
  };

  // Switch styling
  const switchStyle = {
    "& .Mui-checked": { color: "#4a7c59" },
    "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "#4a7c59" },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }} separator="/">
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Home
        </Link>

        <Typography color="text.primary">Reports</Typography>
      </Breadcrumbs>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
          Reports
        </Typography>

        {/* Grid Layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
          }}
        >
          {/* LEFT SECTION */}
          <Box>
            {/* Report Type */}
            <TextField
              select
              label="Report"
              fullWidth
              value={formData.reportType}
              onChange={handleChange("reportType")}
              sx={textFieldStyle}
            >
              <MenuItem value="Activity">Activity</MenuItem>
              <MenuItem value="Invoices">Invoices</MenuItem>
              <MenuItem value="Quotes">Quotes</MenuItem>
              <MenuItem value="Clients">Clients</MenuItem>
              <MenuItem value="Products">Products</MenuItem>
              <MenuItem value="Users">Users</MenuItem>
            </TextField>

            {/* SWITCHES IN A ROW (Aligned) */}
            <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.sendEmail}
                    onChange={handleChange("sendEmail")}
                    sx={switchStyle}
                  />
                }
                label="Send Email"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.includeDeleted}
                    onChange={handleChange("includeDeleted")}
                    sx={switchStyle}
                  />
                }
                label="Include Deleted"
              />
            </Box>

            {/* Search */}
            <TextField
              label="Search"
              fullWidth
              value={formData.search}
              onChange={handleChange("search")}
              sx={{ mt: 3, ...textFieldStyle }}
            />

            {/* Status */}
            <TextField
              select
              label="Status"
              fullWidth
              value={formData.status}
              onChange={handleChange("status")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Sent">Sent</MenuItem>
            </TextField>

            {/* Activity Filter */}
            <TextField
              select
              label="Activity"
              fullWidth
              value={formData.activity}
              onChange={handleChange("activity")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Created">Created</MenuItem>
              <MenuItem value="Updated">Updated</MenuItem>
              <MenuItem value="Deleted">Deleted</MenuItem>
              <MenuItem value="Login">Login</MenuItem>
            </TextField>

            {/* Client Selector */}
            <TextField
              select
              label="Client"
              fullWidth
              value={formData.client}
              onChange={handleChange("client")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All Clients</MenuItem>
              <MenuItem value="ClientA">Client A</MenuItem>
              <MenuItem value="ClientB">Client B</MenuItem>
              <MenuItem value="ClientC">Client C</MenuItem>
            </TextField>

            {/* User Selector */}
            <TextField
              select
              label="User / Staff"
              fullWidth
              value={formData.user}
              onChange={handleChange("user")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All Users</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff1">Staff 1</MenuItem>
              <MenuItem value="Staff2">Staff 2</MenuItem>
            </TextField>
          </Box>

          {/* RIGHT SECTION */}
          <Box>
            {/* Date Range */}
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={formData.startDate}
              onChange={handleChange("startDate")}
              sx={{ ...textFieldStyle }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={formData.endDate}
              onChange={handleChange("endDate")}
              sx={{ mt: 3, ...textFieldStyle }}
              InputLabelProps={{ shrink: true }}
            />

            {/* Range Presets */}
            <TextField
              select
              label="Range"
              fullWidth
              value={formData.range}
              onChange={handleChange("range")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="Custom">Custom Range</MenuItem>
            </TextField>

            {/* Amount Range */}
            <TextField
              label="Min Amount"
              fullWidth
              value={formData.minAmount}
              onChange={handleChange("minAmount")}
              sx={{ mt: 3, ...textFieldStyle }}
            />

            <TextField
              label="Max Amount"
              fullWidth
              value={formData.maxAmount}
              onChange={handleChange("maxAmount")}
              sx={{ mt: 3, ...textFieldStyle }}
            />

            {/* Group By */}
            <TextField
              select
              label="Group By"
              fullWidth
              value={formData.groupBy}
              onChange={handleChange("groupBy")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
              <MenuItem value="Date">Date</MenuItem>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Status">Status</MenuItem>
            </TextField>

            {/* Sort By */}
            <TextField
              select
              label="Sort By"
              fullWidth
              value={formData.sortBy}
              onChange={handleChange("sortBy")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="Newest">Newest First</MenuItem>
              <MenuItem value="Oldest">Oldest First</MenuItem>
              <MenuItem value="HighAmount">High Amount</MenuItem>
              <MenuItem value="LowAmount">Low Amount</MenuItem>
            </TextField>

            {/* Output Format */}
            <TextField
              select
              label="Output Format"
              fullWidth
              value={formData.output}
              onChange={handleChange("output")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="Excel">Excel</MenuItem>
              <MenuItem value="CSV">CSV</MenuItem>
              <MenuItem value="Print">Print</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Export Button */}
        <Box sx={{ mt: 4, textAlign: "right", display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={fetchReportData}
            disabled={loading}
            sx={{
              borderColor: "#BC4749",
              color: "#BC4749",
              "&:hover": { borderColor: "#a43a3f", color: "#a43a3f" },
            }}
          >
            {loading ? "Loading..." : "View"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={reportData.length === 0}
            sx={{
              borderColor: "#4a7c59",
              color: "#4a7c59",
              "&:hover": { borderColor: "#386641", color: "#386641" },
            }}
          >
            Print
          </Button>

          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={loading || reportData.length === 0}
            sx={{
              bgcolor: "#4a7c59",
              "&:hover": { bgcolor: "#386641" },
            }}
          >
            {loading ? "Exporting..." : "Export"}
          </Button>
        </Box>

        {/* View Report Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: "90vh",
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6">
              {formData.reportType} Report
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {reportData.length === 0 ? (
              <Alert severity="info">No data available for this report</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      {getTableColumns(formData.reportType).map((column) => (
                        <TableCell key={column} sx={{ fontWeight: "bold", color: "#BC4749" }}>
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.map((row, index) => (
                      <TableRow key={index} hover>
                        {getTableColumns(formData.reportType).map((column) => (
                          <TableCell key={`${index}-${column}`}>
                            {formatCellValue(row[column])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setViewDialogOpen(false)}
              sx={{ color: "#BC4749" }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleExport}
              disabled={loading}
              sx={{ bgcolor: "#4a7c59", "&:hover": { bgcolor: "#386641" } }}
            >
              Export from Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{
                borderColor: "#4a7c59",
                color: "#4a7c59",
                "&:hover": { borderColor: "#386641" },
              }}
            >
              Print
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

// Helper function to get table columns based on report type
function getTableColumns(reportType) {
  const columnMap = {
    Activity: ["Date", "User", "Action", "Description", "Status"],
    Invoices: ["Invoice ID", "Client", "Amount", "Date", "Status", "Due Date"],
    Quotes: ["Quote ID", "Client", "Amount", "Date", "Status", "Expiry Date"],
    Clients: ["Client Name", "Email", "Phone", "Address", "Status"],
    Products: ["Product Name", "SKU", "Category", "Price", "Stock"],
    Users: ["User Name", "Email", "Role", "Status", "Last Login"],
  };
  return columnMap[reportType] || ["Data"];
}

// Helper function to format cell values
function formatCellValue(value) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "number" && value.toString().includes(".")) {
    return value.toFixed(2);
  }
  return value;
}
