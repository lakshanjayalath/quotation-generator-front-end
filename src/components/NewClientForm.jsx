import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Container,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  MenuItem,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewClientForm({ initialData = null, onSave }) {
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);

  const [formData, setFormData] = useState(
    initialData || {
      // Company Details
      name: "",
      number: "",
      group: "",
      assignedUser: "",
      idNumber: "",
      vatNumber: "",
      website: "",
      phone: "",
      routingId: "",
      validVat: false,
      taxExempt: false,
      classification: "",

      // Contacts
      contacts: [{ firstName: "", lastName: "", email: "", phone: "", addToInvoices: false }],

      // Billing Address
      billingStreet: "",
      billingSuite: "",
      billingCity: "",
      billingState: "",
      billingPostalCode: "",
      billingCountry: "",

      // Shipping Address
      shippingStreet: "",
      shippingSuite: "",
      shippingCity: "",
      shippingState: "",
      shippingPostalCode: "",
      shippingCountry: "",
    }
  );

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.contacts];
    newContacts[index][field] = value;
    setFormData({ ...formData, contacts: newContacts });
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { firstName: "", lastName: "", email: "", phone: "", addToInvoices: false }],
    });
  };

  const copyBillingToShipping = () => {
    setFormData({
      ...formData,
      shippingStreet: formData.billingStreet,
      shippingSuite: formData.billingSuite,
      shippingCity: formData.billingCity,
      shippingState: formData.billingState,
      shippingPostalCode: formData.billingPostalCode,
      shippingCountry: formData.billingCountry,
    });
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/clients", formData);
      setShowSuccess(true);
      if (onSave) onSave(formData);
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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

        {/* Updated navigation: Client routes to /ClientPage */}
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/ClientPage"
        >
          Client
        </Link>

        <Typography color="text.primary">{initialData ? "Edit Client" : "New Client"}</Typography>
      </Breadcrumbs>

      {/* Main Form */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" fontWeight={500}>
            {initialData ? "Edit Client" : "New Client"}
          </Typography>
          <Box>
            <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mr: 2, borderColor: "#4a7c59", color: "#4a7c59" }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#4a7c59", "&:hover": { bgcolor: "#386641" } }}>
              Save
            </Button>
          </Box>
        </Box>

        {/* Company Details */}
        <Typography variant="h6" sx={{ mb: 2 }}>Company Details</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 4 }}>
          <TextField label="Name" value={formData.name} onChange={handleChange("name")} fullWidth />
          <TextField label="Number" value={formData.number} onChange={handleChange("number")} fullWidth />
          <TextField select label="Group" value={formData.group} onChange={handleChange("group")} fullWidth>
            <MenuItem value="Group A">Group A</MenuItem>
            <MenuItem value="Group B">Group B</MenuItem>
          </TextField>
          <TextField select label="Assigned User" value={formData.assignedUser} onChange={handleChange("assignedUser")} fullWidth>
            <MenuItem value="User 1">User 1</MenuItem>
            <MenuItem value="User 2">User 2</MenuItem>
          </TextField>
          <TextField label="ID Number" value={formData.idNumber} onChange={handleChange("idNumber")} fullWidth />
          <TextField label="VAT Number" value={formData.vatNumber} onChange={handleChange("vatNumber")} fullWidth />
          <TextField label="Website" value={formData.website} onChange={handleChange("website")} fullWidth />
          <TextField label="Phone" value={formData.phone} onChange={handleChange("phone")} fullWidth />
          <TextField label="Routing ID" value={formData.routingId} onChange={handleChange("routingId")} fullWidth />
          <TextField select label="Classification" value={formData.classification} onChange={handleChange("classification")} fullWidth>
            <MenuItem value="Type A">Type A</MenuItem>
            <MenuItem value="Type B">Type B</MenuItem>
          </TextField>
        </Box>
        <FormControlLabel control={<Switch checked={formData.validVat} onChange={handleChange("validVat")} />} label="Valid VAT Number" />
        <FormControlLabel control={<Switch checked={formData.taxExempt} onChange={handleChange("taxExempt")} />} label="Tax Exempt" />

        <Divider sx={{ my: 3 }} />

        {/* Contacts */}
        <Typography variant="h6" sx={{ mb: 2 }}>Contacts</Typography>
        {formData.contacts.map((contact, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField label="First Name" value={contact.firstName} onChange={(e) => handleContactChange(index, "firstName", e.target.value)} />
              <TextField label="Last Name" value={contact.lastName} onChange={(e) => handleContactChange(index, "lastName", e.target.value)} />
              <TextField label="Email" value={contact.email} onChange={(e) => handleContactChange(index, "email", e.target.value)} />
              <TextField label="Phone" value={contact.phone} onChange={(e) => handleContactChange(index, "phone", e.target.value)} />
            </Box>
            <FormControlLabel
              control={<Switch checked={contact.addToInvoices} onChange={(e) => handleContactChange(index, "addToInvoices", e.target.checked)} />}
              label="Add To Invoices"
              sx={{ mt: 1 }}
            />
          </Paper>
        ))}
        <Button variant="outlined" onClick={addContact} sx={{ mr: 2, borderColor: "#4a7c59", color: "#4a7c59" }}>+ Add Contact</Button>

        <Divider sx={{ my: 3 }} />

        {/* Address Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>Address</Typography>
        <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ mb: 2 }}>
          <Tab label="Billing Address" />
          <Tab label="Shipping Address" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Street" value={formData.billingStreet} onChange={handleChange("billingStreet")} />
            <TextField label="Apt/Suite" value={formData.billingSuite} onChange={handleChange("billingSuite")} />
            <TextField label="City" value={formData.billingCity} onChange={handleChange("billingCity")} />
            <TextField label="State/Province" value={formData.billingState} onChange={handleChange("billingState")} />
            <TextField label="Postal Code" value={formData.billingPostalCode} onChange={handleChange("billingPostalCode")} />
            <TextField select label="Country" value={formData.billingCountry} onChange={handleChange("billingCountry")}>
              <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
              <MenuItem value="India">India</MenuItem>
            </TextField>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Street" value={formData.shippingStreet} onChange={handleChange("shippingStreet")} />
            <TextField label="Apt/Suite" value={formData.shippingSuite} onChange={handleChange("shippingSuite")} />
            <TextField label="City" value={formData.shippingCity} onChange={handleChange("shippingCity")} />
            <TextField label="State/Province" value={formData.shippingState} onChange={handleChange("shippingState")} />
            <TextField label="Postal Code" value={formData.shippingPostalCode} onChange={handleChange("shippingPostalCode")} />
            <TextField select label="Country" value={formData.shippingCountry} onChange={handleChange("shippingCountry")}>
              <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
              <MenuItem value="India">India</MenuItem>
            </TextField>
          </Box>
        )}
        <Button variant="outlined" onClick={copyBillingToShipping} sx={{ mt: 2, borderColor: "#4a7c59", color: "#4a7c59" }}>Copy Billing</Button>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" sx={{ width: "100%" }}>Client saved successfully!</Alert>
      </Snackbar>
    </Container>
  );
}
