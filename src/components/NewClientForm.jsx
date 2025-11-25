import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function NewClientForm({ initialData = null, onSave }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(
    initialData || {
      clientName: "",
      clientIdNumber: "",
      clientContactNumber: "",
      clientAddress: "",
      clientEmail: "",
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
      contacts: [{ firstName: "", lastName: "", email: "", phone: "", addToInvoices: false }],
      billingStreet: "",
      billingSuite: "",
      billingCity: "",
      billingState: "",
      billingPostalCode: "",
      billingCountry: "",
      shippingStreet: "",
      shippingSuite: "",
      shippingCity: "",
      shippingState: "",
      shippingPostalCode: "",
      shippingCountry: "",
    }
  );

  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch client data if editing
  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5264/api/clients/${id}`);
          console.log("Fetched client data:", response.data);

          // Ensure contacts array exists
          const clientData = {
            ...response.data,
            contacts: response.data.contacts || [{ firstName: "", lastName: "", email: "", phone: "", addToInvoices: false }]
          };

          setFormData(clientData);
        } catch (error) {
          console.error("Error fetching client:", error);
          console.error("Error details:", error.response?.data || error.message);

          if (error.response?.status === 500) {
            alert("Server error: Please check your backend API and database connection.");
          } else if (error.response?.status === 404) {
            alert("Client not found. It may have been deleted.");
            navigate("/dashboard/clients");
          } else {
            alert(`Failed to load client data: ${error.response?.statusText || error.message}`);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchClient();
    }
  }, [id, navigate]);

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
      contacts: [
        ...formData.contacts,
        { firstName: "", lastName: "", email: "", phone: "", addToInvoices: false },
      ],
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
      // Clean up the payload - remove Id from contacts for new clients
      const payload = id ? formData : {
        ...formData,
        contacts: formData.contacts.map(c => ({
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          addToInvoices: c.addToInvoices
        }))
      };

      if (id) {
        // Update existing client
        await axios.put(`http://localhost:5264/api/clients/${id}`, payload);
      } else {
        // Create new client
        await axios.post("http://localhost:5264/api/clients", payload);
      }
      setShowSuccess(true);
      if (onSave) onSave(formData);

      // Reset form only if it's a new client, not editing
      if (!id && !initialData) {
        setFormData({
          clientName: "",
          clientIdNumber: "",
          clientContactNumber: "",
          clientAddress: "",
          clientEmail: "",
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
          contacts: [{ firstName: "", lastName: "", email: "", phone: "", addToInvoices: false }],
          billingStreet: "",
          billingSuite: "",
          billingCity: "",
          billingState: "",
          billingPostalCode: "",
          billingCountry: "",
          shippingStreet: "",
          shippingSuite: "",
          shippingCity: "",
          shippingState: "",
          shippingPostalCode: "",
          shippingCountry: "",
        });
      }

      // Navigate back to clients page after successful save
      setTimeout(() => {
        navigate("/dashboard/clients");
      }, 1500);
    } catch (error) {
      console.error("Error saving client:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message;
      alert(`Failed to save client: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Common style for focused color
  const textFieldStyle = {
    "& label.Mui-focused": {
      color: "#BC4749",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#BC4749",
      },
    },
  };

  // Switch active color style
  const switchStyle = {
    "& .Mui-checked": {
      color: "#4a7c59",
    },
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#4a7c59",
    },
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

        <Link component={RouterLink} underline="hover" color="inherit" to="/ClientPage">
          Client
        </Link>

        <Typography color="text.primary">
          {id || initialData ? "Edit Client" : "New Client"}
        </Typography>
      </Breadcrumbs>

      {/* Main Form */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
        >
          <Typography variant="h5" fontWeight={500}>
            {id || initialData ? "Edit Client" : "New Client"}
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ mr: 2, bgcolor: "#BC4749", color: "#ffffff", "&:hover": { bgcolor: "#a43a3f" } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ bgcolor: "#4a7c59", "&:hover": { bgcolor: "#386641" } }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {/* Client Details */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Client Details
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 4 }}>
          <TextField label="Client Name" value={formData.clientName} onChange={handleChange("clientName")} fullWidth sx={textFieldStyle} />
          <TextField label="Client ID Number" value={formData.clientIdNumber} onChange={handleChange("clientIdNumber")} fullWidth sx={textFieldStyle} />
          <TextField label="Client Contact Number" value={formData.clientContactNumber} onChange={handleChange("clientContactNumber")} fullWidth sx={textFieldStyle} />
          <TextField label="Client Address" value={formData.clientAddress} onChange={handleChange("clientAddress")} fullWidth sx={textFieldStyle} />
          <TextField label="Client Email" value={formData.clientEmail} onChange={handleChange("clientEmail")} fullWidth sx={textFieldStyle} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Company Details */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Company Details
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 4 }}>
          <TextField label="Name" value={formData.name} onChange={handleChange("name")} fullWidth sx={textFieldStyle} />
          <TextField label="Number" value={formData.number} onChange={handleChange("number")} fullWidth sx={textFieldStyle} />
          <TextField select label="Group" value={formData.group} onChange={handleChange("group")} fullWidth sx={textFieldStyle}>
            <MenuItem value="Group A">Group A</MenuItem>
            <MenuItem value="Group B">Group B</MenuItem>
          </TextField>
          <TextField select label="Assigned User" value={formData.assignedUser} onChange={handleChange("assignedUser")} fullWidth sx={textFieldStyle}>
            <MenuItem value="User 1">User 1</MenuItem>
            <MenuItem value="User 2">User 2</MenuItem>
          </TextField>
          <TextField label="ID Number" value={formData.idNumber} onChange={handleChange("idNumber")} fullWidth sx={textFieldStyle} />
          <TextField label="VAT Number" value={formData.vatNumber} onChange={handleChange("vatNumber")} fullWidth sx={textFieldStyle} />
          <TextField label="Website" value={formData.website} onChange={handleChange("website")} fullWidth sx={textFieldStyle} />
          <TextField label="Phone" value={formData.phone} onChange={handleChange("phone")} fullWidth sx={textFieldStyle} />
          <TextField label="Routing ID" value={formData.routingId} onChange={handleChange("routingId")} fullWidth sx={textFieldStyle} />
          <TextField select label="Classification" value={formData.classification} onChange={handleChange("classification")} fullWidth sx={textFieldStyle}>
            <MenuItem value="Type A">Type A</MenuItem>
            <MenuItem value="Type B">Type B</MenuItem>
          </TextField>
        </Box>

        <FormControlLabel
          control={<Switch checked={formData.validVat} onChange={handleChange("validVat")} sx={switchStyle} />}
          label="Valid VAT Number"
        />
        <FormControlLabel
          control={<Switch checked={formData.taxExempt} onChange={handleChange("taxExempt")} sx={switchStyle} />}
          label="Tax Exempt"
        />

        <Divider sx={{ my: 3 }} />

        {/* Contacts */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Contacts
        </Typography>
        {formData.contacts.map((contact, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField label="First Name" value={contact.firstName} onChange={(e) => handleContactChange(index, "firstName", e.target.value)} sx={textFieldStyle} />
              <TextField label="Last Name" value={contact.lastName} onChange={(e) => handleContactChange(index, "lastName", e.target.value)} sx={textFieldStyle} />
              <TextField label="Email" value={contact.email} onChange={(e) => handleContactChange(index, "email", e.target.value)} sx={textFieldStyle} />
              <TextField label="Phone" value={contact.phone} onChange={(e) => handleContactChange(index, "phone", e.target.value)} sx={textFieldStyle} />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={contact.addToInvoices}
                  onChange={(e) => handleContactChange(index, "addToInvoices", e.target.checked)}
                  sx={switchStyle}
                />
              }
              label="Add To Invoices"
              sx={{ mt: 1 }}
            />
          </Paper>
        ))}
        <Button variant="outlined" onClick={addContact} sx={{ mr: 2, borderColor: "#4a7c59", color: "#4a7c59" }}>
          + Add Contact
        </Button>

        <Divider sx={{ my: 3 }} />

        {/* Address Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Address
        </Typography>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          sx={{
            mb: 2,
            "& .MuiTab-root.Mui-selected": { color: "#BC4749" },
            "& .MuiTabs-indicator": { backgroundColor: "#BC4749" },
          }}
        >
          <Tab label="Billing Address" />
          <Tab label="Shipping Address" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Street" value={formData.billingStreet} onChange={handleChange("billingStreet")} sx={textFieldStyle} />
            <TextField label="Apt/Suite" value={formData.billingSuite} onChange={handleChange("billingSuite")} sx={textFieldStyle} />
            <TextField label="City" value={formData.billingCity} onChange={handleChange("billingCity")} sx={textFieldStyle} />
            <TextField label="State/Province" value={formData.billingState} onChange={handleChange("billingState")} sx={textFieldStyle} />
            <TextField label="Postal Code" value={formData.billingPostalCode} onChange={handleChange("billingPostalCode")} sx={textFieldStyle} />
            <TextField select label="Country" value={formData.billingCountry} onChange={handleChange("billingCountry")} sx={textFieldStyle}>
              <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
              <MenuItem value="India">India</MenuItem>
            </TextField>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Street" value={formData.shippingStreet} onChange={handleChange("shippingStreet")} sx={textFieldStyle} />
            <TextField label="Apt/Suite" value={formData.shippingSuite} onChange={handleChange("shippingSuite")} sx={textFieldStyle} />
            <TextField label="City" value={formData.shippingCity} onChange={handleChange("shippingCity")} sx={textFieldStyle} />
            <TextField label="State/Province" value={formData.shippingState} onChange={handleChange("shippingState")} sx={textFieldStyle} />
            <TextField label="Postal Code" value={formData.shippingPostalCode} onChange={handleChange("shippingPostalCode")} sx={textFieldStyle} />
            <TextField select label="Country" value={formData.shippingCountry} onChange={handleChange("shippingCountry")} sx={textFieldStyle}>
              <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
              <MenuItem value="India">India</MenuItem>
            </TextField>
          </Box>
        )}

        <Button variant="outlined" onClick={copyBillingToShipping} sx={{ mt: 2, borderColor: "#4a7c59", color: "#4a7c59" }}>
          Copy Billing
        </Button>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Client saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
