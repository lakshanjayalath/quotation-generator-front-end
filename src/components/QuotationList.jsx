import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  Typography,
  TextField,
  FormControl,
  Select,
  TablePagination,
  Chip,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Status Chip Component
function StatusChip({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case "Sent":
        return { bg: "#CADF9A", color: "#555555" };
      case "Accepted":
        return { bg: "#4CAF50", color: "#FFFFFF" };
      case "Declined":
        return { bg: "#F44336", color: "#FFFFFF" };
      case "Expired":
        return { bg: "#DEA3A4", color: "#555555" };
      default:
        return { bg: "#E0E0E0", color: "#555555" };
    }
  };

  const colors = getStatusColor();

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 500,
      }}
    />
  );
}

// Row Component
function QuotationRow({
  row,
  isSelected,
  handleClick,
  handleMenuOpen,
  anchorEl,
  menuRowId,
  handleMenuClose,
  onView,
  onEdit,
  onDelete,
  onChangeStatus,
}) {
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TableRow hover role="checkbox" selected={isSelected} aria-checked={isSelected}>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected}
          onClick={() => handleClick(row.quotationId || row.id)}
        />
      </TableCell>
      <TableCell>
        <StatusChip status={row.status || "Sent"} />
      </TableCell>
      <TableCell>{row.quoteNumber || row.quotationNumber || row.number || "N/A"}</TableCell>
      <TableCell>{row.clientName || row.client || "N/A"}</TableCell>
      <TableCell>{(row.netAmount || row.NetAmount || row.amount || row.Amount || 0).toLocaleString()}</TableCell>
      <TableCell>{formatDate(row.quoteDate || row.date)}</TableCell>
      <TableCell>{formatDate(row.validUntil)}</TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          endIcon={<ArrowDropDownIcon />}
          sx={{
            backgroundColor: "#000000",
            color: "white",
            textTransform: "none",
            "&:hover": { backgroundColor: "#333333" },
          }}
          onClick={(e) => handleMenuOpen(e, row.quotationId || row.id)}
        >
          Actions
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={menuRowId === (row.quotationId || row.id)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleMenuClose(); onView(row); }}>View</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onEdit(row); }}>Edit</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onChangeStatus(row, "Sent"); }}>Mark as Sent</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onChangeStatus(row, "Accepted"); }}>Mark as Accepted</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onChangeStatus(row, "Declined"); }}>Mark as Declined</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onChangeStatus(row, "Expired"); }}>Mark as Expired</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onDelete(row); }} sx={{ color: "red" }}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default function QuotationList() {
  const [rows, setRows] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuRowId, setMenuRowId] = React.useState(null);
  const [filter, setFilter] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  // Fetch quotations from API
  React.useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5264/api/Quotations");
        console.log("Quotations data:", response.data);
        setRows(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching quotations:", err);
        setError(err.response?.data?.message || "Failed to fetch quotations");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  // Filter Logic
  const filteredRows = rows.filter(
    (row) =>
      (row.clientName || row.client || "").toLowerCase().includes(filter.toLowerCase()) ||
      (row.quotationNumber || row.number || "").toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination Logic
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Selection Handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((s) => s !== id);
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Get row ID (handles different field names)
  const getRowId = (row) => row.quotationId || row.id;

  // Menu Handlers
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  // Generate PDF for a quotation
  const generateQuotationPDF = (quotation) => {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("QUOTATION", 105, 25, { align: "center" });
    
    // Company Info (Left Side)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Your Company Name", 14, 45);
    doc.text("123 Business Street", 14, 51);
    doc.text("City, State 12345", 14, 57);
    doc.text("Phone: (123) 456-7890", 14, 63);
    doc.text("Email: info@company.com", 14, 69);
    
    // Format date helper
    const formatPdfDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };
    
    // Quote Details (Right Side)
    doc.setFont("helvetica", "bold");
    doc.text("Quote Details", 140, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`Quote #: ${quotation.quotationNumber || quotation.quoteNumber || "N/A"}`, 140, 51);
    doc.text(`Date: ${formatPdfDate(quotation.quoteDate)}`, 140, 57);
    doc.text(`Valid Until: ${formatPdfDate(quotation.validUntil)}`, 140, 63);
    doc.text(`PO #: ${quotation.poNumber || "N/A"}`, 140, 69);
    
    // Client Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 14, 85);
    doc.setFont("helvetica", "normal");
    doc.text(quotation.clientName || "Client Name", 14, 91);
    
    // Horizontal Line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 98, 196, 98);
    
    // Items Table
    const items = quotation.items || quotation.Items || [];
    const tableData = items.map((item) => [
      item.itemName || item.ItemName || item.item || "",
      item.description || item.Description || "",
      parseFloat(item.unitCost || item.UnitCost || 0).toFixed(2),
      item.quantity || item.Quantity || 0,
      parseFloat(item.lineTotal || item.LineTotal || 0).toFixed(2),
    ]);
    
    autoTable(doc, {
      startY: 105,
      head: [["Item", "Description", "Unit Cost", "Qty", "Line Total"]],
      body: tableData.length > 0 ? tableData : [["No items", "", "", "", ""]],
      theme: "striped",
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 60 },
        2: { cellWidth: 25, halign: "right" },
        3: { cellWidth: 20, halign: "center" },
        4: { cellWidth: 30, halign: "right" },
      },
    });
    
    // Totals Section
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Calculate subtotal from items if not provided
    const calculatedSubtotal = items.reduce((sum, item) => {
      return sum + parseFloat(item.lineTotal || item.LineTotal || 0);
    }, 0);
    
    const subtotal = quotation.subtotal || quotation.Subtotal || calculatedSubtotal || 0;
    const discountAmount = quotation.discountAmount || quotation.DiscountAmount || 0;
    const total = quotation.netAmount || quotation.NetAmount || quotation.amount || quotation.Amount || (subtotal - discountAmount) || 0;
    
    doc.setFontSize(10);
    doc.text("Subtotal:", 140, finalY);
    doc.text(`LKR ${parseFloat(subtotal).toFixed(2)}`, 196, finalY, { align: "right" });
    
    if (discountAmount > 0) {
      doc.text("Discount:", 140, finalY + 6);
      doc.text(`-LKR ${parseFloat(discountAmount).toFixed(2)}`, 196, finalY + 6, { align: "right" });
    }
    
    doc.setDrawColor(0, 0, 0);
    doc.line(140, finalY + (discountAmount > 0 ? 10 : 4), 196, finalY + (discountAmount > 0 ? 10 : 4));
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, finalY + (discountAmount > 0 ? 18 : 12));
    doc.text(`LKR ${parseFloat(total).toFixed(2)}`, 196, finalY + (discountAmount > 0 ? 18 : 12), { align: "right" });
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", 105, pageHeight - 20, { align: "center" });
    doc.text("This quotation is valid for 30 days from the date of issue.", 105, pageHeight - 14, { align: "center" });
    
    return doc;
  };

  // View quotation - open PDF in new tab
  const handleView = async (row) => {
    try {
      // Fetch full quotation details if needed
      const response = await axios.get(`http://localhost:5264/api/Quotations/${row.quotationId || row.id}`);
      const quotation = response.data;
      
      const doc = generateQuotationPDF(quotation);
      
      // Open PDF in new tab
      const pdfDataUri = doc.output("datauristring");
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<iframe width="100%" height="100%" src="${pdfDataUri}" style="border:none;"></iframe>`
        );
        newWindow.document.title = `Quotation_${quotation.quotationNumber || quotation.quoteNumber || "view"}`;
      } else {
        alert("Popup blocked! Please allow popups for this site.");
      }
    } catch (error) {
      console.error("Error viewing quotation:", error);
      alert("Failed to load quotation details.");
    }
  };

  // Edit quotation - navigate to edit form with quotation data
  const handleEdit = async (row) => {
    try {
      // Fetch full quotation details
      const response = await axios.get(`http://localhost:5264/api/Quotations/${row.quotationId || row.id}`);
      const quotation = response.data;
      navigate(`/dashboard/edit-quote/${row.quotationId || row.id}`, { state: { quotation } });
    } catch (error) {
      console.error("Error fetching quotation for edit:", error);
      alert("Failed to load quotation details for editing.");
    }
  };

  // Delete quotation
  const handleDelete = async (row) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete quotation #${row.quotationNumber || row.quoteNumber || row.id}?\n\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5264/api/Quotations/${row.quotationId || row.id}`);
        // Remove from state
        setRows((prevRows) => prevRows.filter((r) => (r.quotationId || r.id) !== (row.quotationId || row.id)));
        alert("Quotation deleted successfully!");
      } catch (error) {
        console.error("Error deleting quotation:", error);
        alert("Failed to delete quotation. Please try again.");
      }
    }
  };

  // Change quotation status
  const handleChangeStatus = async (row, newStatus) => {
    try {
      await axios.patch(`http://localhost:5264/api/Quotations/${row.quotationId || row.id}/status`, {
        Status: newStatus
      });
      // Update in state
      setRows((prevRows) =>
        prevRows.map((r) =>
          (r.quotationId || r.id) === (row.quotationId || row.id)
            ? { ...r, status: newStatus }
            : r
        )
      );
      alert(`Quotation status changed to ${newStatus}!`);
    } catch (error) {
      console.error("Error changing quotation status:", error);
      alert("Failed to change quotation status. Please try again.");
    }
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HomeIcon fontSize="small" />
          <Typography variant="body1">/ Quotations</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <FormControl size="small">
            <Select defaultValue="all">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="sent">Sent</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#f5f5f5",
              color: "black",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
            onClick={() => navigate("/dashboard/new-quote")}
          >
            New Quotation
          </Button>
        </Box>
      </Box>

      {/* Table Section */}
      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < paginatedRows.length
                    }
                    checked={
                      paginatedRows.length > 0 &&
                      selected.length === paginatedRows.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Net Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: "red" }}>
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No quotations available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <QuotationRow
                    key={getRowId(row)}
                    row={row}
                    isSelected={isSelected(getRowId(row))}
                    handleClick={handleClick}
                    handleMenuOpen={handleMenuOpen}
                    anchorEl={anchorEl}
                    menuRowId={menuRowId}
                    handleMenuClose={handleMenuClose}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onChangeStatus={handleChangeStatus}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Paper>
    </Box>
  );
}
