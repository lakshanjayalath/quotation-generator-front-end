import React, { useState, useEffect } from "react";
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
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function NewQuotationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState([]);
  const [inclusiveTaxes, setInclusiveTaxes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Clients state
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  
  // Items/Products state
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
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

  // Load quotation data for edit mode
  useEffect(() => {
    const loadQuotationData = async () => {
      if (!isEditMode) return;
      
      // Check if data is passed via location state
      if (location.state?.quotation) {
        const q = location.state.quotation;
        populateFormData(q);
        return;
      }
      
      // Otherwise fetch from API
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5264/api/Quotations/${id}`);
        populateFormData(response.data);
      } catch (error) {
        console.error("Error loading quotation:", error);
        alert("Failed to load quotation data.");
        navigate("/dashboard/quotes");
      } finally {
        setLoading(false);
      }
    };

    const populateFormData = (q) => {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setQuoteData({
        client: q.clientName || q.ClientName || "",
        quoteDate: formatDateForInput(q.quoteDate || q.QuoteDate),
        validUntil: formatDateForInput(q.validUntil || q.ValidUntil),
        partialDeposit: q.partialDeposit || q.PartialDeposit || "",
        quoteNumber: q.quotationNumber || q.quoteNumber || q.QuoteNumber || "",
        poNumber: q.poNumber || q.PoNumber || "",
        discountType: q.discountType || q.DiscountType || "amount",
        discount: q.discount || q.Discount || 0,
      });

      // Load items
      const quotationItems = q.items || q.Items || [];
      const formattedItems = quotationItems.map((item, index) => ({
        id: item.id || item.Id || index + 1,
        item: item.itemName || item.ItemName || item.item || "",
        description: item.description || item.Description || "",
        unitCost: item.unitCost || item.UnitCost || 0,
        quantity: item.quantity || item.Quantity || 0,
        lineTotal: item.lineTotal || item.LineTotal || 0,
        selectedItem: null,
      }));
      setItems(formattedItems);

      setInclusiveTaxes(q.inclusiveTaxes || q.InclusiveTaxes || false);
    };

    loadQuotationData();
  }, [id, isEditMode, location.state, navigate]);

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const response = await axios.get("http://localhost:5264/api/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const response = await axios.get("http://localhost:5264/api/items");
        setAvailableItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, []);

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
    doc.text(`LKR ${subtotal.toFixed(2)}`, 196, finalY, { align: "right" });
    
    if (discount > 0) {
      doc.text(`Discount (${quoteData.discountType === "percentage" ? quoteData.discount + "%" : "LKR " + quoteData.discount}):`, 140, finalY + 6);
      doc.text(`-LKR ${discount.toFixed(2)}`, 196, finalY + 6, { align: "right" });
    }
    
    doc.setDrawColor(0, 0, 0);
    doc.line(140, finalY + (discount > 0 ? 10 : 4), 196, finalY + (discount > 0 ? 10 : 4));
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, finalY + (discount > 0 ? 18 : 12));
    doc.text(`LKR ${total.toFixed(2)}`, 196, finalY + (discount > 0 ? 18 : 12), { align: "right" });
    
    // Partial/Deposit
    if (quoteData.partialDeposit) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Deposit Required: LKR ${parseFloat(quoteData.partialDeposit).toFixed(2)}`, 140, finalY + (discount > 0 ? 26 : 20));
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
      { item: "", description: "", unitCost: "", quantity: "", lineTotal: "", selectedItem: null },
    ]);
  };

  // Handle item selection from autocomplete
  const handleItemSelect = (index, selectedItem) => {
    const updatedItems = [...items];
    if (selectedItem) {
      // Parse price - handle formatted strings like "20,000 LKR"
      let priceValue = selectedItem.price || selectedItem.unitCost || selectedItem.Price || selectedItem.UnitCost || 0;
      if (typeof priceValue === 'string') {
        // Remove currency text and commas, extract numeric value
        priceValue = parseFloat(priceValue.replace(/[^0-9.-]/g, '')) || 0;
      }
      const unitCost = parseFloat(priceValue) || 0;
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      
      updatedItems[index] = {
        ...updatedItems[index],
        item: selectedItem.item || selectedItem.name || "",
        description: selectedItem.description || "",
        unitCost: unitCost,
        selectedItem: selectedItem,
        lineTotal: unitCost * quantity,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        item: "",
        description: "",
        unitCost: "",
        selectedItem: null,
      };
    }
    setItems(updatedItems);
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

  // Save quotation to API
  const handleSaveQuote = async () => {
    // Validation
    if (!quoteData.client) {
      alert("Please select a client");
      return;
    }
    if (!quoteData.quoteNumber) {
      alert("Please enter a quote number");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    try {
      setSaving(true);

      const quotationPayload = {
        QuoteNumber: quoteData.quoteNumber,
        ClientName: quoteData.client,
        QuoteDate: quoteData.quoteDate || new Date().toISOString().split("T")[0],
        ValidUntil: quoteData.validUntil || null,
        PoNumber: quoteData.poNumber || null,
        PartialDeposit: parseFloat(quoteData.partialDeposit) || 0,
        DiscountType: quoteData.discountType,
        Discount: parseFloat(quoteData.discount) || 0,
        Subtotal: calculateSubtotal(),
        DiscountAmount: calculateDiscount(),
        Amount: calculateTotal(),
        NetAmount: calculateTotal(),
        Status: "Sent",
        InclusiveTaxes: inclusiveTaxes,
        Items: items.map((item) => ({
          ItemName: item.item,
          Description: item.description,
          UnitCost: parseFloat(item.unitCost) || 0,
          Quantity: parseInt(item.quantity) || 0,
          LineTotal: parseFloat(item.lineTotal) || 0,
        })),
      };

      console.log("Saving quotation:", quotationPayload);

      let response;
      if (isEditMode) {
        // Update existing quotation
        response = await axios.put(
          `http://localhost:5264/api/Quotations/${id}`,
          quotationPayload
        );
        console.log("Quotation updated:", response.data);
        alert("Quotation updated successfully!");
      } else {
        // Create new quotation
        response = await axios.post(
          "http://localhost:5264/api/Quotations",
          quotationPayload
        );
        console.log("Quotation saved:", response.data);
        alert("Quotation saved successfully!");
      }
      navigate("/dashboard/quotes");
    } catch (error) {
      console.error("Error saving quotation:", error);
      console.error("Error details:", error.response?.data);
      
      let errorMessage = "Failed to save quotation. Please try again.";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(", ");
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", pb: 5 }}>
      {/* Loading state for edit mode */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!loading && (
        <>
          {/* Breadcrumb */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <HomeIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              / Quotes / {isEditMode ? "Edit Quote" : "New Quote"}
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
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => 
                  typeof option === 'string' 
                    ? option 
                    : option.name || option.clientName || ''
                }
                loading={loadingClients}
                value={clients.find(c => (c.name || c.clientName) === quoteData.client) || null}
                onChange={(event, newValue) => {
                  handleQuoteDataChange("client", newValue ? (newValue.name || newValue.clientName) : "");
                }}
                inputValue={quoteData.client}
                onInputChange={(event, newInputValue) => {
                  handleQuoteDataChange("client", newInputValue);
                }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select or Type Client Name"
                    placeholder="Start typing to search..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingClients ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.clientId || option.id}>
                    <Box>
                      <Typography variant="body1">
                        {option.name || option.clientName}
                      </Typography>
                      {option.companyName && (
                        <Typography variant="caption" color="text.secondary">
                          {option.companyName}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
              />
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
                          <Autocomplete
                            options={availableItems}
                            getOptionLabel={(option) =>
                              typeof option === "string"
                                ? option
                                : option.item || ""
                            }
                            loading={loadingItems}
                            value={row.selectedItem || null}
                            onChange={(event, newValue) => {
                              handleItemSelect(index, newValue);
                            }}
                            inputValue={row.item}
                            onInputChange={(event, newInputValue) => {
                              handleItemChange(index, "item", newInputValue);
                            }}
                            freeSolo
                            size="small"
                            sx={{ minWidth: 150 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Type item name..."
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loadingItems ? (
                                        <CircularProgress color="inherit" size={16} />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                            renderOption={(props, option) => {
                              const quantity = option.qty ?? 0;
                              const isLowStock = quantity < 10;
                              return (
                                <li {...props} key={option.id}>
                                  <Box sx={{ width: "100%" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Typography variant="body2">
                                        {option.item}
                                      </Typography>
                                      {isLowStock && (
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: "white",
                                            backgroundColor: "#d32f2f",
                                            px: 1,
                                            py: 0.25,
                                            borderRadius: 1,
                                            fontSize: "10px",
                                          }}
                                        >
                                          Low: {quantity}
                                        </Typography>
                                      )}
                                    </Box>
                                    {option.description && (
                                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                        {option.description.substring(0, 50)}
                                        {option.description.length > 50 ? "..." : ""}
                                      </Typography>
                                    )}
                                  </Box>
                                </li>
                              );
                            }}
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
                    <Typography fontWeight="bold">LKR {calculateSubtotal().toFixed(2)}</Typography>
                  </Box>
                  {calculateDiscount() > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography>
                        Discount ({quoteData.discountType === "percentage" ? `${quoteData.discount}%` : `LKR ${quoteData.discount}`}):
                      </Typography>
                      <Typography color="error">-LKR {calculateDiscount().toFixed(2)}</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold">LKR {calculateTotal().toFixed(2)}</Typography>
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
                onClick={handleSaveQuote}
                disabled={saving}
                sx={{
                  backgroundColor: "#4a7c59",
                  color: "white",
                  textTransform: "none",
                  px: 3,
                  "&:hover": { backgroundColor: "#386641" },
                }}
              >
                {saving ? "Saving..." : isEditMode ? "Update Quote" : "Save Quote"}
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
        </>
      )}
    </Box>
  );
}