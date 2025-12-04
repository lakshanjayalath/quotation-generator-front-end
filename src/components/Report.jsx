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
  TablePagination,
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

  const [tableSortBy, setTableSortBy] = useState(""); // optional: header click sort
  const [tableSortDir, setTableSortDir] = useState("ASC");
  const [pageNum, setPageNum] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChange = (field) => (event) => {
    const value =
      event?.target?.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Convert empty strings to null or numeric values
  const toNullableNumber = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // Map UI sortBy dropdown to backend column name (optional helper)
  const mapSortByToColumn = (uiSortBy) => {
    const map = {
      Newest: "Date DESC",
      Oldest: "Date ASC",
      HighAmount: "Amount DESC",
      LowAmount: "Amount ASC",
    };
    return map[uiSortBy] || "";
  };

  // Build request payload matching ReportRequestDto on backend
  const buildPayload = (includeOptions = true, overrideSort = null) => {
    // normalize dates: send null instead of empty string
    const startDate = formData.startDate && formData.startDate.length > 0 ? formData.startDate : null;
    const endDate = formData.endDate && formData.endDate.length > 0 ? formData.endDate : null;

    // numbers
    const minAmount = toNullableNumber(formData.minAmount);
    const maxAmount = toNullableNumber(formData.maxAmount);

    // pick sort: header click takes precedence
    let sortValue = overrideSort ?? mapSortByToColumn(formData.sortBy);
    if (!sortValue) sortValue = undefined;

    const payload = {
      reportType: formData.reportType,
      filters: {
        activity: formData.activity || null,
        status: formData.status || null,
        client: formData.client || null,
        user: formData.user || null,
        startDate: startDate,
        endDate: endDate,
        minAmount: minAmount,
        maxAmount: maxAmount,
        search: formData.search || null,
        includeDeleted: !!formData.includeDeleted,
      },
      options: includeOptions
        ? {
            groupBy: formData.groupBy || null,
            sortBy: sortValue,
            format: formData.output || null,
            sendEmail: !!formData.sendEmail,
          }
        : undefined,
    };

    return payload;
  };

  // Fetch report data from backend (preview). Pass overrideSort if header click used.
  const fetchReportData = async (overrideSort = null) => {
    try {
      setLoading(true);
      setReportData([]);
      setPageNum(0);

      const payload = buildPayload(true, overrideSort); // include options for sorting
      const response = await axios.post("http://localhost:5264/api/reports/generate", payload);

      setReportData(Array.isArray(response.data) ? response.data : []);
      setViewDialogOpen(true);
      setSnackbar({ open: true, message: "Report data loaded successfully", severity: "success" });
    } catch (error) {
      console.error("Error fetching report:", error);
      const msg = error?.response?.data?.message || error?.message || "Unknown error";
      setSnackbar({ open: true, message: `Failed to load report: ${msg}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Export report data
  const handleExport = async () => {
    try {
      setLoading(true);

      const headerSort = tableSortBy ? `${tableSortBy} ${tableSortDir}` : null;
      const payload = buildPayload(true, headerSort);

      const response = await axios.post("http://localhost:5264/api/reports/export", payload, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${formData.reportType}_${new Date().getTime()}.${getFileExtension(formData.output)}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSnackbar({ open: true, message: `Report exported as ${formData.output}`, severity: "success" });
    } catch (error) {
      console.error("Error exporting report:", error);
      const msg = error?.response?.data?.message || error?.message || "Unknown error";
      setSnackbar({ open: true, message: `Failed to export report: ${msg}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Print report
  const handlePrint = () => {
    window.print();
  };

  // File extension helper
  const getFileExtension = (format) => {
    const extensions = {
      PDF: "pdf",
      Excel: "xlsx",
      CSV: "csv",
      Print: "pdf",
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

  // Optional: header click sort handler (maps displayed column to actual column name)
  // If your backend uses different column names, you can adapt `mapColumnNameForBackend`.
  const mapColumnNameForBackend = (displayColumn) => {
    const map = {
      // map display names to backend column names (exactly match DataTable column names)
      "Invoice ID": "Invoice ID",
      Client: "Client",
      Amount: "Amount",
      Date: "Date",
      Status: "Status",
      "Due Date": "Due Date",
      "Quote ID": "Quote ID",
      "Expiry Date": "Expiry Date",
      "Client Name": "Client Name",
      Email: "Email",
      Phone: "Phone",
      Address: "Address",
      "Product Name": "Product Name",
      SKU: "SKU",
      Category: "Category",
      Price: "Price",
      Stock: "Stock",
      "User Name": "User Name",
      Role: "Role",
      "Last Login": "Last Login",
      // Activity report columns:
      Date: "Date",
      User: "User",
      Action: "Action",
      Description: "Description",
      // fallback
      default: displayColumn,
    };
    return map[displayColumn] || map.default;
  };

  const handleTableHeaderClick = (displayColumn) => {
    const backendColumn = mapColumnNameForBackend(displayColumn);
    let nextDir = "ASC";
    if (tableSortBy === backendColumn && tableSortDir === "ASC") nextDir = "DESC";

    setTableSortBy(backendColumn);
    setTableSortDir(nextDir);
    setPageNum(0);

    // Build backend sort string like "Amount DESC"
    const sortStr = `${backendColumn} ${nextDir}`;
    fetchReportData(sortStr);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPageNum(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageNum(0);
  };

  const paginatedData = reportData.slice(pageNum * rowsPerPage, pageNum * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }} separator="/">
        <Link component={RouterLink} underline="hover" color="inherit" to="/" sx={{ display: "flex", alignItems: "center" }}>
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Typography color="text.primary">Reports</Typography>
      </Breadcrumbs>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
          Reports
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <Box>
            <TextField select label="Report" fullWidth value={formData.reportType} onChange={handleChange("reportType")} sx={textFieldStyle}>
              <MenuItem value="Activity">Activity</MenuItem>
              <MenuItem value="Invoices">Invoices</MenuItem>
              <MenuItem value="Quotes">Quotes</MenuItem>
              <MenuItem value="Clients">Clients</MenuItem>
              <MenuItem value="Products">Products</MenuItem>
              <MenuItem value="Users">Users</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
              <FormControlLabel control={<Switch checked={formData.sendEmail} onChange={handleChange("sendEmail")} sx={switchStyle} />} label="Send Email" />
              <FormControlLabel control={<Switch checked={formData.includeDeleted} onChange={handleChange("includeDeleted")} sx={switchStyle} />} label="Include Deleted" />
            </Box>

            <TextField label="Search" fullWidth value={formData.search} onChange={handleChange("search")} sx={{ mt: 3, ...textFieldStyle }} />

            <TextField select label="Status" fullWidth value={formData.status} onChange={handleChange("status")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Sent">Sent</MenuItem>
            </TextField>

            <TextField select label="Activity" fullWidth value={formData.activity} onChange={handleChange("activity")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Created">Created</MenuItem>
              <MenuItem value="Updated">Updated</MenuItem>
              <MenuItem value="Deleted">Deleted</MenuItem>
              <MenuItem value="Login">Login</MenuItem>
            </TextField>

            <TextField select label="Client" fullWidth value={formData.client} onChange={handleChange("client")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="All">All Clients</MenuItem>
              <MenuItem value="ClientA">Client A</MenuItem>
              <MenuItem value="ClientB">Client B</MenuItem>
              <MenuItem value="ClientC">Client C</MenuItem>
            </TextField>

            <TextField select label="User / Staff" fullWidth value={formData.user} onChange={handleChange("user")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="All">All Users</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff1">Staff 1</MenuItem>
              <MenuItem value="Staff2">Staff 2</MenuItem>
            </TextField>
          </Box>

          <Box>
            <TextField label="Start Date" type="date" fullWidth value={formData.startDate} onChange={handleChange("startDate")} sx={{ ...textFieldStyle }} InputLabelProps={{ shrink: true }} />
            <TextField label="End Date" type="date" fullWidth value={formData.endDate} onChange={handleChange("endDate")} sx={{ mt: 3, ...textFieldStyle }} InputLabelProps={{ shrink: true }} />

            <TextField select label="Range" fullWidth value={formData.range} onChange={handleChange("range")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="Custom">Custom Range</MenuItem>
            </TextField>

            <TextField label="Min Amount" fullWidth value={formData.minAmount} onChange={handleChange("minAmount")} sx={{ mt: 3, ...textFieldStyle }} />
            <TextField label="Max Amount" fullWidth value={formData.maxAmount} onChange={handleChange("maxAmount")} sx={{ mt: 3, ...textFieldStyle }} />

            <TextField select label="Group By" fullWidth value={formData.groupBy} onChange={handleChange("groupBy")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
              <MenuItem value="Date">Date</MenuItem>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Status">Status</MenuItem>
            </TextField>

            <TextField select label="Sort By" fullWidth value={formData.sortBy} onChange={handleChange("sortBy")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="Newest">Newest First</MenuItem>
              <MenuItem value="Oldest">Oldest First</MenuItem>
              <MenuItem value="HighAmount">High Amount</MenuItem>
              <MenuItem value="LowAmount">Low Amount</MenuItem>
            </TextField>

            <TextField select label="Output Format" fullWidth value={formData.output} onChange={handleChange("output")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="Excel">Excel</MenuItem>
              <MenuItem value="CSV">CSV</MenuItem>
              <MenuItem value="Print">Print</MenuItem>
            </TextField>
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: "right", display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={() => fetchReportData()} disabled={loading} sx={{ borderColor: "#BC4749", color: "#BC4749", "&:hover": { borderColor: "#a43a3f", color: "#a43a3f" } }}>
            {loading ? <CircularProgress size={18} /> : "View"}
          </Button>

          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} disabled={reportData.length === 0} sx={{ borderColor: "#4a7c59", color: "#4a7c59", "&:hover": { borderColor: "#386641", color: "#386641" } }}>
            Print
          </Button>

          <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={handleExport} disabled={loading || reportData.length === 0} sx={{ bgcolor: "#4a7c59", "&:hover": { bgcolor: "#386641" } }}>
            {loading ? <CircularProgress size={18} color="inherit" /> : "Export"}
          </Button>
        </Box>

        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { maxHeight: "90vh" } }}>
          <DialogTitle>
            <Typography variant="h6">{formData.reportType} Report</Typography>
          </DialogTitle>
          <DialogContent dividers>
            {reportData.length === 0 ? (
              <Alert severity="info">No data available for this report</Alert>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        {getTableColumns(formData.reportType).map((column) => (
                          <TableCell key={column} sx={{ fontWeight: "bold", color: "#BC4749", cursor: "pointer" }} onClick={() => handleTableHeaderClick(column)}>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <span>{column}</span>
                              {tableSortBy === mapColumnNameForBackend(column) && <span style={{ fontSize: 12 }}>{tableSortDir === "ASC" ? "↑" : "↓"}</span>}
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((row, idx) => (
                        <TableRow key={idx} hover>
                          {getTableColumns(formData.reportType).map((column) => (
                            <TableCell key={`${idx}-${column}`}>{formatCellValue(row?.[column])}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={reportData.length}
                  rowsPerPage={rowsPerPage}
                  page={pageNum}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    "& .MuiTablePagination-select": { color: "#BC4749" },
                    "& .MuiIconButton-root": { color: "#BC4749" },
                  }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)} sx={{ color: "#BC4749" }}>
              Close
            </Button>
            <Button variant="contained" onClick={handleExport} disabled={loading} sx={{ bgcolor: "#4a7c59", "&:hover": { bgcolor: "#386641" } }}>
              Export from Preview
            </Button>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderColor: "#4a7c59", color: "#4a7c59", "&:hover": { borderColor: "#386641" } }}>
              Print
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

// Helper function to map display column to backend column
function mapColumnNameForBackend(displayColumn) {
  const map = {
    "Invoice ID": "Invoice ID",
    Client: "Client",
    Amount: "Amount",
    Date: "Date",
    Status: "Status",
    "Due Date": "Due Date",
    "Quote ID": "Quote ID",
    "Expiry Date": "Expiry Date",
    "Client Name": "Client Name",
    Email: "Email",
    Phone: "Phone",
    Address: "Address",
    "Product Name": "Product Name",
    SKU: "SKU",
    Category: "Category",
    Price: "Price",
    Stock: "Stock",
    "User Name": "User Name",
    Role: "Role",
    "Last Login": "Last Login",
    User: "User",
    Action: "Action",
    Description: "Description",
  };
  return map[displayColumn] || displayColumn;
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
  if (typeof value === "number") {
    // show 2 decimals for floats
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  }
  return value;
}