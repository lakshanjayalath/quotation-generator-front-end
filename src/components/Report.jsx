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
    startDate: "",
    endDate: "",
    actionType: "All",
    quotationType: "All",
    output: "PDF",
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

  // Build request payload matching ReportRequestDto on backend
  const buildPayload = (includeOptions = true, overrideSort = null) => {
    // normalize dates: send null instead of empty string
    const startDate = formData.startDate && formData.startDate.length > 0 ? formData.startDate : null;
    const endDate = formData.endDate && formData.endDate.length > 0 ? formData.endDate : null;

    const payload = {
      reportType: formData.reportType,
      filters: {
        startDate: startDate,
        endDate: endDate,
        includeDeleted: !!formData.includeDeleted,
      },
      options: includeOptions
        ? {
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

      // Use ActivityLog API for Activity report type
      if (formData.reportType === "Activity") {
        await fetchActivityLogData();
        return;
      }

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

  // Fetch Activity Log data from dedicated API
  const fetchActivityLogData = async () => {
    try {
      // Build payload for activity log filter API
      const payload = {
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      const response = await axios.post("http://localhost:5264/api/activitylogs/filter", payload);
      
      // Map response data to table format
      const mappedData = Array.isArray(response.data) 
        ? response.data.map((log) => ({
            Date: log.timestamp ? new Date(log.timestamp).toLocaleString() : "-",
            User: log.userName || log.user || "-",
            ActionType: log.actionType || log.action || "-",
            EntityName: log.entityName || log.entity || "-",
            Description: log.description || log.details || "-",
          }))
        : [];

      setReportData(mappedData);
      setViewDialogOpen(true);
      setSnackbar({ open: true, message: "Activity log data loaded successfully", severity: "success" });
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      const msg = error?.response?.data?.message || error?.message || "Unknown error";
      setSnackbar({ open: true, message: `Failed to load activity logs: ${msg}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Export report data
  const handleExport = async () => {
    try {
      setLoading(true);

      // If header sorting is set, send it in options; otherwise dropdown sort is used
      const headerSort = tableSortBy ? `${tableSortBy} ${tableSortDir}` : null;
      const payload = buildPayload(true, headerSort);

      const response = await axios.post("http://localhost:5264/api/reports/export", payload, {
        responseType: "blob",
      });

      // determine file extension from output type (formData.output)
      const ext = getFileExtension(formData.output);
      const filename = `report_${formData.reportType}_${new Date().getTime()}.${ext}`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
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

  // Print report: open a new printable window synchronously (user gesture) to avoid popup blocking.
  const handlePrint = () => {
    if (!reportData || reportData.length === 0) {
      setSnackbar({ open: true, message: "No data to print", severity: "info" });
      return;
    }

    const cols = getTableColumns(formData.reportType);
    const html = buildPrintableHtml(cols, reportData, formData.reportType);

    // Open synchronously from the click handler (no features string)
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setSnackbar({ open: true, message: "Unable to open print window (popup blocked?)", severity: "error" });
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    try {
      printWindow.focus();
      printWindow.print();
      // optionally close after printing:
      // printWindow.close();
    } catch (e) {
      setSnackbar({ open: true, message: "Print dialog may be blocked by browser policy", severity: "warning" });
    }
  };

  // Helper to build printable HTML
  const buildPrintableHtml = (columns, data, title) => {
    const style = `
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 20px; color: #222; }
        h1 { font-size: 20px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #f5f5f5; font-weight: bold; color: #BC4749; }
        tr:nth-child(even) { background: #fbfbfb; }
        .nowrap { white-space: nowrap; }
      </style>
    `;

    const header = `<h1>${escapeHtml(title)} Report</h1><div>Generated: ${new Date().toLocaleString()}</div><br/>`;
    const thead = `<thead><tr>${columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>`;
    const rows = data
      .map(
        (r) =>
          `<tr>${columns
            .map((c) => `<td>${escapeHtml(cellToString(r?.[c]))}</td>`)
            .join("")}</tr>`
      )
      .join("");

    return `<!doctype html><html><head><meta charset="utf-8">${style}</head><body>${header}<table>${thead}<tbody>${rows}</tbody></table></body></html>`;
  };

  const cellToString = (v) => {
    if (v === null || v === undefined) return "-";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  // Escape HTML entities
  const escapeHtml = (unsafe) => {
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
      User: "User",
      Action: "Action",
      Description: "Description",
    };
    return map[displayColumn] || displayColumn;
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

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 4 }}>
          <Box>
            <TextField select label="Report" fullWidth value={formData.reportType} onChange={handleChange("reportType")} sx={textFieldStyle}>
              <MenuItem value="Activity">Activity</MenuItem>
              <MenuItem value="Quotes">Quotes</MenuItem>
              <MenuItem value="Clients">Clients</MenuItem>
              <MenuItem value="Products">Products</MenuItem>
              <MenuItem value="Users">Users</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
              <FormControlLabel control={<Switch checked={formData.sendEmail} onChange={handleChange("sendEmail")} sx={switchStyle} />} label="Send Email" />
              <FormControlLabel control={<Switch checked={formData.includeDeleted} onChange={handleChange("includeDeleted")} sx={switchStyle} />} label="Include Deleted" />
            </Box>

            <TextField select label="Action Type" fullWidth value={formData.actionType} onChange={handleChange("actionType")} sx={{ mt: 3, ...textFieldStyle }}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Created">Created</MenuItem>
              <MenuItem value="Updated">Updated</MenuItem>
              <MenuItem value="Deleted">Deleted</MenuItem>
              <MenuItem value="Login">Login</MenuItem>
            </TextField>

            {formData.reportType === "Quotes" && (
              <TextField select label="Quotation Type" fullWidth value={formData.quotationType} onChange={handleChange("quotationType")} sx={{ mt: 3, ...textFieldStyle }}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Sent">Sent</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Declined">Declined</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
              </TextField>
            )}
          </Box>

          <Box>
            <TextField label="Start Date" type="date" fullWidth value={formData.startDate} onChange={handleChange("startDate")} sx={{ ...textFieldStyle }} InputLabelProps={{ shrink: true }} />
            <TextField label="End Date" type="date" fullWidth value={formData.endDate} onChange={handleChange("endDate")} sx={{ mt: 3, ...textFieldStyle }} InputLabelProps={{ shrink: true }} />

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
    ActionType: "ActionType",
    EntityName: "EntityName",
    Description: "Description",
  };
  return map[displayColumn] || displayColumn;
}

// Helper function to get table columns based on report type
function getTableColumns(reportType) {
  const columnMap = {
    Activity: ["Date", "User", "ActionType", "EntityName", "Description"],
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