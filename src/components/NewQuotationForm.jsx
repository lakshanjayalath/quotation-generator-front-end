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

export default function NewQuotationForm() {
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState([]);
  const [inclusiveTaxes, setInclusiveTaxes] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                  defaultValue=""
                  displayEmpty
                  label="Select Client"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="client1">Client 1</MenuItem>
                  <MenuItem value="client2">Client 2</MenuItem>
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
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Valid Until"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField label="Partial/Deposit" fullWidth type="number" />
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
              <TextField label="Quote #" fullWidth sx={{ mb: 2 }} />
              <TextField label="PO #" fullWidth sx={{ mb: 2 }} />
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Discount</InputLabel>
                <Select 
                  defaultValue="amount"
                  label="Discount"
                >
                  <MenuItem value="amount">Amount</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </Select>
              </FormControl>
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