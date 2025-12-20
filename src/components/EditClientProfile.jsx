import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Divider,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Card,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

export default function EditClientProfile() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [addressTab, setAddressTab] = useState(0);
  const [profileImage, setProfileImage] = useState(null);

  const [client, setClient] = useState({
    name: "",
    clientName: "",
    clientId: "",
    clientIdNumber: "",
    status: "Active",
    email: "",
    clientEmail: "",
    phone: "",
    clientContactNumber: "",
    website: "",
    routingId: "",
    companyType: "Company",
    vatNumber: "",
    creditLimit: "",
    currency: "LKR",
    paymentTerms: "Net 30",
    validVat: false,
    taxExempt: false,
    classification: "",
    group: "",
    assignedUser: "",
    billingStreet: "",
    billingSuite: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
    billingCountry: "",
    billingDistrict: "",
    shippingStreet: "",
    shippingSuite: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "",
    shippingDistrict: "",
    contacts: [
      { firstName: "", lastName: "", email: "", phone: "", role: "", addToInvoices: false, primary: false },
    ],
    businessRegNo: "",
    industry: "",
    contactPerson: "",
    whatsapp: "",
    discount: "",
    internalNotes: "",
    clientNotes: "",
    lastContacted: "",
    followUpDate: "",
    preferredTemplate: "",
    language: "English",
    preferredContactMethod: "Email",
    autoExpiryDays: 30,
    notifications: true,
    assignedSalesRep: "",
    accessLevel: "Standard",
    attachments: [],
  });

  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5264/api/clients/profile");
        setClient(prev => ({
          ...prev,
          ...res.data,
          contacts: res.data.contacts || prev.contacts,
        }));
        setQuotations(res.data.quotations || []);
      } catch (err) {
        console.error("Profile load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = field => e => setClient({ ...client, [field]: e.target.value });
  const handleSwitch = field => e => setClient({ ...client, [field]: e.target.checked });

  const handleContactChange = (i, field, value) => {
    const updated = [...client.contacts];
    updated[i][field] = value;
    setClient({ ...client, contacts: updated });
  };

  const addContact = () => {
    setClient({
      ...client,
      contacts: [...client.contacts, { firstName: "", lastName: "", email: "", phone: "", role: "", addToInvoices: false, primary: false }],
    });
  };

  const removeContact = i => {
    const updated = [...client.contacts];
    updated.splice(i, 1);
    setClient({ ...client, contacts: updated });
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleCopyBillingToShipping = () => {
    setClient({
      ...client,
      shippingStreet: client.billingStreet,
      shippingSuite: client.billingSuite,
      shippingCity: client.billingCity,
      shippingState: client.billingState,
      shippingPostalCode: client.billingPostalCode,
      shippingCountry: client.billingCountry,
      shippingDistrict: client.billingDistrict,
    });
  };

  const handleAttachmentUpload = e => {
    const files = Array.from(e.target.files);
    setClient(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleViewDetails = () => {
    alert("Viewing detailed profile page (implement navigation as needed)");
  };

  if (loading) return <Container sx={{ py: 6 }}>Loading profile...</Container>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/"><HomeIcon fontSize="small" /></Link>
        <Typography>My Profile</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar src={profileImage} sx={{ width: 100, height: 100, mb: 1 }} />
          <Typography variant="h5">{client.clientName}</Typography>
          <Typography>ID: {client.clientIdNumber}</Typography>
          <Chip label={client.status} size="small" color="success" sx={{ mt: 1 }} />
          <Button component="label" size="small" sx={{ mt: 1 }}>
            Upload Photo
            <input hidden type="file" onChange={handleImageUpload} />
          </Button>
          <LinearProgress value={85} variant="determinate" sx={{ mt: 2, width: "100%" }} />
        </Box>
      </Paper>

      {/* Quotation Summary */}
      <Typography variant="h6" sx={{ mb: 2 }}>Quotation Summary</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 3, overflowX: "auto" }}>
        {["Total", "Pending", "Approved", "Rejected", "Value"].map(t => (
          <Card key={t} sx={{ p: 2, minWidth: 120, flex: "0 0 auto" }}>
            <Typography variant="subtitle2">{t}</Typography>
            <Typography variant="h5">0</Typography>
          </Card>
        ))}
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Profile Details" />
        <Tab label="Quotation History" />
        <Tab label="Notes & Activity" />
      </Tabs>

      {/* Profile Details */}
      {tab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Client Details</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField label="Client Name" fullWidth value={client.clientName} onChange={handleChange("clientName")} />
            <TextField label="Client ID" fullWidth value={client.clientIdNumber} />
            <TextField label="Routing ID" fullWidth value={client.routingId} onChange={handleChange("routingId")} />
            <TextField label="Email" fullWidth value={client.clientEmail} onChange={handleChange("clientEmail")} />
            <TextField label="Phone" fullWidth value={client.clientContactNumber} onChange={handleChange("clientContactNumber")} />
            <TextField label="Website" fullWidth value={client.website} onChange={handleChange("website")} />
            <TextField select label="Status" fullWidth value={client.status} onChange={handleChange("status")}>
              {["Active", "Inactive", "Suspended"].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
            <TextField select label="Company Type" fullWidth value={client.companyType} onChange={handleChange("companyType")}>
              {["Company", "Individual"].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Business Details */}
          <Typography variant="h6">Business Details</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField label="Business Registration No" fullWidth value={client.businessRegNo} onChange={handleChange("businessRegNo")} />
            <TextField select label="Industry" fullWidth value={client.industry} onChange={handleChange("industry")}>
              {["Technology", "Finance", "Retail", "Manufacturing"].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
            <TextField label="Contact Person" fullWidth value={client.contactPerson} onChange={handleChange("contactPerson")} />
            <TextField label="WhatsApp" fullWidth value={client.whatsapp} onChange={handleChange("whatsapp")} />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Tax & Payment */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <FormControlLabel control={<Switch checked={client.validVat} onChange={handleSwitch("validVat")} />} label="Valid VAT" />
            <FormControlLabel control={<Switch checked={client.taxExempt} onChange={handleSwitch("taxExempt")} />} label="Tax Exempt" />
            <TextField label="VAT Number" fullWidth value={client.vatNumber} onChange={handleChange("vatNumber")} />
            <TextField label="Credit Limit" fullWidth value={client.creditLimit} onChange={handleChange("creditLimit")} />
            <TextField select label="Currency" fullWidth value={client.currency} onChange={handleChange("currency")}>
              {["LKR", "USD", "EUR"].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
            <TextField select label="Payment Terms" fullWidth value={client.paymentTerms} onChange={handleChange("paymentTerms")}>
              {["Net 30", "Net 60", "Due on Receipt"].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Contacts */}
          <Typography variant="h6">Contacts</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {client.contacts.map((c, i) => (
              <Paper key={i} sx={{ p: 2 }}>
                <TextField label="First Name" fullWidth value={c.firstName} onChange={e => handleContactChange(i, "firstName", e.target.value)} sx={{ mb: 1 }} />
                <TextField label="Last Name" fullWidth value={c.lastName} onChange={e => handleContactChange(i, "lastName", e.target.value)} sx={{ mb: 1 }} />
                <TextField label="Email" fullWidth value={c.email} onChange={e => handleContactChange(i, "email", e.target.value)} sx={{ mb: 1 }} />
                <TextField label="Phone" fullWidth value={c.phone} onChange={e => handleContactChange(i, "phone", e.target.value)} sx={{ mb: 1 }} />
                <TextField label="Role" fullWidth value={c.role} onChange={e => handleContactChange(i, "role", e.target.value)} sx={{ mb: 1 }} />
                <FormControlLabel control={<Switch checked={c.primary} onChange={e => handleContactChange(i, "primary", e.target.checked)} />} label="Primary Contact" />
                <FormControlLabel control={<Switch checked={c.addToInvoices} onChange={e => handleContactChange(i, "addToInvoices", e.target.checked)} />} label="Add to Invoices" />
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => removeContact(i)}>Remove Contact</Button>
              </Paper>
            ))}
            <Button startIcon={<AddIcon />} variant="outlined" onClick={addContact}>Add Contact</Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Address */}
          <Typography variant="h6">Address</Typography>
          <Tabs value={addressTab} onChange={(e, v) => setAddressTab(v)} sx={{ mb: 2 }}>
            <Tab label="Billing" />
            <Tab label="Shipping" />
          </Tabs>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {addressTab === 0 && (
              <>
                <TextField label="Street" fullWidth value={client.billingStreet} onChange={handleChange("billingStreet")} />
                <TextField label="Suite" fullWidth value={client.billingSuite} onChange={handleChange("billingSuite")} />
                <TextField label="City" fullWidth value={client.billingCity} onChange={handleChange("billingCity")} />
                <TextField label="State" fullWidth value={client.billingState} onChange={handleChange("billingState")} />
                <TextField label="Postal Code" fullWidth value={client.billingPostalCode} onChange={handleChange("billingPostalCode")} />
                <TextField label="Country" fullWidth value={client.billingCountry} onChange={handleChange("billingCountry")} />
                <TextField label="District" fullWidth value={client.billingDistrict} onChange={handleChange("billingDistrict")} />
                <Button variant="outlined" onClick={handleCopyBillingToShipping}>Copy to Shipping</Button>
              </>
            )}
            {addressTab === 1 && (
              <>
                <TextField label="Street" fullWidth value={client.shippingStreet} onChange={handleChange("shippingStreet")} />
                <TextField label="Suite" fullWidth value={client.shippingSuite} onChange={handleChange("shippingSuite")} />
                <TextField label="City" fullWidth value={client.shippingCity} onChange={handleChange("shippingCity")} />
                <TextField label="State" fullWidth value={client.shippingState} onChange={handleChange("shippingState")} />
                <TextField label="Postal Code" fullWidth value={client.shippingPostalCode} onChange={handleChange("shippingPostalCode")} />
                <TextField label="Country" fullWidth value={client.shippingCountry} onChange={handleChange("shippingCountry")} />
                <TextField label="District" fullWidth value={client.shippingDistrict} onChange={handleChange("shippingDistrict")} />
              </>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Preferences & Security */}
          <Typography variant="h6">Preferences & Security</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField select label="Preferred Contact Method" fullWidth value={client.preferredContactMethod} onChange={handleChange("preferredContactMethod")}>
              {["Email", "Phone", "WhatsApp"].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
            <TextField select label="Access Level" fullWidth value={client.accessLevel} onChange={handleChange("accessLevel")}>
              {["Standard", "Admin", "Read-only"].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
            <FormControlLabel control={<Switch checked={client.notifications} onChange={handleSwitch("notifications")} />} label="Enable Notifications" />
            <TextField label="Assigned Sales Rep" fullWidth value={client.assignedSalesRep} onChange={handleChange("assignedSalesRep")} />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Attachments */}
          <Typography variant="h6">Attachments</Typography>
          <Button component="label" variant="outlined">
            Upload Files
            <input hidden multiple type="file" onChange={handleAttachmentUpload} />
          </Button>
          <Box mt={1}>
            {client.attachments.map((file, i) => <Typography key={i}>{file.name || file}</Typography>)}
          </Box>

          {/* Action Buttons */}
          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={() => alert("Saved changes")}>Save Changes</Button>
            <Button variant="outlined" onClick={handleViewDetails}>View Details</Button>
            <Button variant="text" color="error" onClick={handleCancel}>Cancel</Button>
          </Box>
        </Paper>
      )}

      {/* Quotation History */}
      {tab === 1 && (
        <Paper sx={{ p: 4, mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotations.map(q => (
                <TableRow key={q.id}>
                  <TableCell>{q.quoteNo}</TableCell>
                  <TableCell>{q.date}</TableCell>
                  <TableCell>{q.status}</TableCell>
                  <TableCell>{q.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Notes & Activity */}
      {tab === 2 && (
        <Paper sx={{ p: 4, mt: 3 }}>
          <TextField label="Internal Notes" multiline rows={3} fullWidth sx={{ mb: 2 }} value={client.internalNotes} onChange={handleChange("internalNotes")} />
          <TextField label="Client Notes" multiline rows={3} fullWidth value={client.clientNotes} onChange={handleChange("clientNotes")} />
        </Paper>
      )}
    </Container>
  );
}
