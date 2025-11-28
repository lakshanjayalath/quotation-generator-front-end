import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Card,
  CardContent,
  Switch,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function NewQuotationForm() {
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState([]);
  const [inclusiveTaxes, setInclusiveTaxes] = useState(false);
  
  // Form state for quotation details
  const [quoteData, setQuoteData] = useState({
    client: "",
    quoteDate: "",
    validUntil: "",
    partialDeposit: "",
    quoteNumber: "",
    poNumber: "",
    discountType: "amount",
    discount: 0,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle quote data changes
  const handleQuoteDataChange = (field, value) => {
    setQuoteData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.lineTotal) || 0), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (quoteData.discountType === "percentage") {
      return (subtotal * (parseFloat(quoteData.discount) || 0)) / 100;
    }
    return parseFloat(quoteData.discount) || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  // Generate PDF
  const handleGeneratePDF = () => {
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
    
    // Quote Details (Right Side)
    doc.setFont("helvetica", "bold");
    doc.text("Quote Details", 140, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`Quote #: ${quoteData.quoteNumber || "N/A"}`, 140, 51);
    doc.text(`Date: ${quoteData.quoteDate || new Date().toLocaleDateString()}`, 140, 57);
    doc.text(`Valid Until: ${quoteData.validUntil || "N/A"}`, 140, 63);
    doc.text(`PO #: ${quoteData.poNumber || "N/A"}`, 140, 69);
    
    // Client Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 14, 85);
    doc.setFont("helvetica", "normal");
    doc.text(quoteData.client || "Client Name", 14, 91);
    
    // Horizontal Line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 98, 196, 98);
    
    // Items Table
    const tableData = items.map((item) => [
      item.item || "",
      item.description || "",
      parseFloat(item.unitCost || 0).toFixed(2),
      item.quantity || 0,
      parseFloat(item.lineTotal || 0).toFixed(2),
    ]);
    
    autoTable(doc, {
      startY: 105,
      head: [["Item", "Description", "Unit Cost", "Qty", "Line Total"]],
      body: tableData.length > 0 ? tableData : [["No items added", "", "", "", ""]],
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
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();
    
    doc.setFontSize(10);
    doc.text("Subtotal:", 140, finalY);
    doc.text(`$${subtotal.toFixed(2)}`, 196, finalY, { align: "right" });
    
    if (discount > 0) {
      doc.text(`Discount (${quoteData.discountType === "percentage" ? quoteData.discount + "%" : "$" + quoteData.discount}):`, 140, finalY + 6);
      doc.text(`-$${discount.toFixed(2)}`, 196, finalY + 6, { align: "right" });
    }
    
    doc.setDrawColor(0, 0, 0);
    doc.line(140, finalY + (discount > 0 ? 10 : 4), 196, finalY + (discount > 0 ? 10 : 4));
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, finalY + (discount > 0 ? 18 : 12));
    doc.text(`$${total.toFixed(2)}`, 196, finalY + (discount > 0 ? 18 : 12), { align: "right" });
    
    // Partial/Deposit
    if (quoteData.partialDeposit) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Deposit Required: $${parseFloat(quoteData.partialDeposit).toFixed(2)}`, 140, finalY + (discount > 0 ? 26 : 20));
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", 105, pageHeight - 20, { align: "center" });
    doc.text("This quotation is valid for 30 days from the date of issue.", 105, pageHeight - 14, { align: "center" });
    
    // Open PDF in new tab
    try {
      const pdfDataUri = doc.output("datauristring");
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<iframe width="100%" height="100%" src="${pdfDataUri}" style="border:none;"></iframe>`
        );
        newWindow.document.title = `Quotation_${quoteData.quoteNumber || "draft"}`;
      } else {
        // Fallback: download if popup blocked
        alert("Popup blocked! Downloading PDF instead.");
        doc.save(`Quotation_${quoteData.quoteNumber || "draft"}_${new Date().toISOString().split("T")[0]}.pdf`);
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF: " + error.message);
    }
  };

  // Add a new product row
  const handleAddItem = () => {
    setItems([
      ...items,
      { item: "", description: "", unitCost: "", quantity: "", lineTotal: "" },
    ]);
  };

  // Update field values in a product row
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "unitCost" || field === "quantity") {
      const unitCost = parseFloat(updatedItems[index].unitCost) || 0;
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      updatedItems[index].lineTotal = unitCost * quantity;
    }

    setItems(updatedItems);
  };

  // Delete a product row
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", pb: 5 }}>
      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <HomeIcon fontSize="small" />
        <Typography variant="body2" color="text.secondary">
          / Quotes / New Quote
        </Typography>
      </Box>

  
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="Create" />
          <Tab label="Documents" />
          <Tab label="Settings" />
        </Tabs>
      </Paper>

      {/* CREATE TAB */}
      {tabValue === 0 && (
        <Box>
          {/* Client Box */}
          <Card
            variant="outlined"
            sx={{ borderRadius: 2, mb: 2, width: "60%" }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Client
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Select Client</InputLabel>
                <Select
                  value={quoteData.client}
                  onChange={(e) => handleQuoteDataChange("client", e.target.value)}
                  displayEmpty
                  label="Select Client"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Client 1">Client 1</MenuItem>
                  <MenuItem value="Client 2">Client 2</MenuItem>
                </Select>
          </FormControl>

            </CardContent>
          </Card>

          {/* Quote Info Box */}
          <Card
            variant="outlined"
            sx={{ borderRadius: 2, mb: 2, width: "60%" }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Quote Info
              </Typography>
              <TextField
                label="Quote Date"
                type="date"
                fullWidth
                value={quoteData.quoteDate}
                onChange={(e) => handleQuoteDataChange("quoteDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Valid Until"
                type="date"
                fullWidth
                value={quoteData.validUntil}
                onChange={(e) => handleQuoteDataChange("validUntil", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField 
                label="Partial/Deposit" 
                fullWidth 
                type="number"
                value={quoteData.partialDeposit}
                onChange={(e) => handleQuoteDataChange("partialDeposit", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Metadata Box */}
          <Card
            variant="outlined"
            sx={{ borderRadius: 2, mb: 2, width: "60%" }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Metadata
              </Typography>
              <TextField 
                label="Quote #" 
                fullWidth 
                sx={{ mb: 2 }}
                value={quoteData.quoteNumber}
                onChange={(e) => handleQuoteDataChange("quoteNumber", e.target.value)}
              />
              <TextField 
                label="PO #" 
                fullWidth 
                sx={{ mb: 2 }}
                value={quoteData.poNumber}
                onChange={(e) => handleQuoteDataChange("poNumber", e.target.value)}
              />
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel shrink>Discount Type</InputLabel>
                <Select 
                  value={quoteData.discountType}
                  onChange={(e) => handleQuoteDataChange("discountType", e.target.value)}
                  label="Discount Type"
                >
                  <MenuItem value="amount">Amount</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </Select>
              </FormControl>
              <TextField 
                label={quoteData.discountType === "percentage" ? "Discount (%)" : "Discount ($)"} 
                fullWidth 
                type="number"
                value={quoteData.discount}
                onChange={(e) => handleQuoteDataChange("discount", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Products Section */}
          <Box sx={{ width: "100%", mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Products
            </Typography>
            <Paper
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                width: "100%",
                overflowX: "auto",
              }}
            >
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Unit Cost</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Line Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        No items added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            placeholder="Item"
                            value={row.item}
                            onChange={(e) =>
                              handleItemChange(index, "item", e.target.value)
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            placeholder="Description"
                            value={row.description}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            placeholder="Unit Cost"
                            type="number"
                            value={row.unitCost}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "unitCost",
                                e.target.value
                              )
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            placeholder="Quantity"
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">
                            {row.lineTotal}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteItem(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <Divider />
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#f5f5f5",
                    color: "black",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                >
                  Add Product
                </Button>
              </Box>
            </Paper>

            {/* Totals Section */}
            <Paper sx={{ mt: 2, p: 2, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box sx={{ width: "300px" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography fontWeight="bold">${calculateSubtotal().toFixed(2)}</Typography>
                  </Box>
                  {calculateDiscount() > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography>
                        Discount ({quoteData.discountType === "percentage" ? `${quoteData.discount}%` : `$${quoteData.discount}`}):
                      </Typography>
                      <Typography color="error">-${calculateDiscount().toFixed(2)}</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold">${calculateTotal().toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleGeneratePDF}
                sx={{
                  backgroundColor: "#d32f2f",
                  color: "white",
                  textTransform: "none",
                  px: 3,
                  "&:hover": { backgroundColor: "#b71c1c" },
                }}
              >
                Generate PDF
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4a7c59",
                  color: "white",
                  textTransform: "none",
                  px: 3,
                  "&:hover": { backgroundColor: "#386641" },
                }}
              >
                Save Quote
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* DOCUMENTS TAB */}
      {tabValue === 1 && (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Documents
            </Typography>
            <Typography color="text.secondary">
              Save the record to upload documents.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* SETTINGS TAB */}
      {tabValue === 2 && (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Settings
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField label="Project" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Assigned User" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Exchange Rate" fullWidth type="number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Vendor" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Design" fullWidth />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Typography>Inclusive Taxes</Typography>
                <Switch
                  checked={inclusiveTaxes}
                  onChange={(e) => setInclusiveTaxes(e.target.checked)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}