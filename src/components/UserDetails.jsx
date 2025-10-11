import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Tabs,
  Tab,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Breadcrumbs, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function UserSettings() {
  const [tab, setTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    language: "",
    phoneNumber: "",
    address: "",
    idNumber: "",
    currentPassword: "",
    newPassword: "",
    twoFactorAuth: false,
    loginNotification: false,
    taskAssignNotification: false,
    disableRecurringPaymentNotification: false,
    allEvents: "Custom",
    invoiceCreated: "None",
    invoiceSent: "All Records",
    quoteCreated: "None",
    quoteSent: "None",
    quoteView: "None",
    paymentDetails: "All Records",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleToggle = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.checked });
  };

  const handleSave = () => {
    // Save logic here (API call etc.)
    setShowSuccess(true);
  };

  const textFieldStyle = {
    "& label.Mui-focused": { color: "#BC4749" },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#BC4749" },
    },
  };

  const switchStyle = {
    "& .Mui-checked": {
      color: "#386641",
    },
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#386641",
    },
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
        <Typography color="text.primary">Settings</Typography>
        <Typography color="text.primary">User Details</Typography>
      </Breadcrumbs>

      {/* Main Card */}
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, backgroundColor: "#f7f9f7" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" fontWeight={600} color="#386641">
            User Details
          </Typography>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#4a7c59",
              "&:hover": { bgcolor: "#386641" },
            }}
          >
            Save
          </Button>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, val) => setTab(val)}
          sx={{
            mb: 3,
            "& .MuiTab-root.Mui-selected": { color: "#BC4749" },
            "& .MuiTabs-indicator": { backgroundColor: "#BC4749" },
          }}
        >
          <Tab label="Details" />
          <Tab label="Passwords" />
          <Tab label="Authentication" />
          <Tab label="Notification" />
        </Tabs>

        {/* --- DETAILS TAB --- */}
        {tab === 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              User Details
            </Typography>
            <Grid2>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                sx={textFieldStyle}
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                sx={textFieldStyle}
              />
              <TextField
                label="Email"
                value={formData.email}
                onChange={handleChange("email")}
                sx={textFieldStyle}
              />
              <TextField
                select
                label="Language"
                value={formData.language}
                onChange={handleChange("language")}
                sx={textFieldStyle}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Sinhala">Sinhala</MenuItem>
                <MenuItem value="Tamil">Tamil</MenuItem>
              </TextField>
              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                sx={textFieldStyle}
              />
              <TextField
                label="Address"
                value={formData.address}
                onChange={handleChange("address")}
                sx={textFieldStyle}
              />
              <TextField
                label="ID Number"
                value={formData.idNumber}
                onChange={handleChange("idNumber")}
                sx={textFieldStyle}
              />
            </Grid2>
          </Box>
        )}

        {/* --- PASSWORD TAB --- */}
        {tab === 1 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Password Details
            </Typography>
            <Grid2>
              <TextField
                type="password"
                label="Current Password"
                value={formData.currentPassword}
                onChange={handleChange("currentPassword")}
                sx={textFieldStyle}
              />
              <TextField
                type="password"
                label="New Password"
                value={formData.newPassword}
                onChange={handleChange("newPassword")}
                sx={textFieldStyle}
              />
            </Grid2>
          </Box>
        )}

        {/* --- AUTHENTICATION TAB --- */}
        {tab === 2 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Authentication Settings
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Configure two-factor authentication and secure login preferences.
            </Typography>
            <Grid2>
              <TextField
                select
                label="Two-Factor Authentication"
                value={formData.twoFactorAuth ? "Enabled" : "Disabled"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    twoFactorAuth: e.target.value === "Enabled",
                  })
                }
                sx={textFieldStyle}
              >
                <MenuItem value="Enabled">Enabled</MenuItem>
                <MenuItem value="Disabled">Disabled</MenuItem>
              </TextField>
            </Grid2>
          </Box>
        )}

        {/* --- NOTIFICATION TAB --- */}
        {tab === 3 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Notification
            </Typography>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}
            >
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={formData.loginNotification}
                    onChange={handleToggle("loginNotification")}
                  />
                }
                label="Login Notification"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={formData.taskAssignNotification}
                    onChange={handleToggle("taskAssignNotification")}
                  />
                }
                label="Task Assign Notification"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={formData.disableRecurringPaymentNotification}
                    onChange={handleToggle(
                      "disableRecurringPaymentNotification"
                    )}
                  />
                }
                label="Disable Recurring Payment Notification"
              />
            </Box>

            <Grid2>
              <TextField
                select
                label="All Events"
                value={formData.allEvents}
                onChange={handleChange("allEvents")}
                sx={textFieldStyle}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
                <MenuItem value="All Records">All Records</MenuItem>
              </TextField>

              <TextField
                select
                label="Invoice Created"
                value={formData.invoiceCreated}
                onChange={handleChange("invoiceCreated")}
                sx={textFieldStyle}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="All Records">All Records</MenuItem>
              </TextField>

              <TextField
                select
                label="Invoice Sent"
                value={formData.invoiceSent}
                onChange={handleChange("invoiceSent")}
                sx={textFieldStyle}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="All Records">All Records</MenuItem>
              </TextField>

              <TextField
                select
                label="Quote Created"
                value={formData.quoteCreated}
                onChange={handleChange("quoteCreated")}
                sx={textFieldStyle}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="All Records">All Records</MenuItem>
              </TextField>

              <TextField
                select
                label="Quote Sent"
                value={formData.quoteSent}
                onChange={handleChange("quoteSent")}
                sx={textFieldStyle}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="All Records">All Records</MenuItem>
              </TextField>

              <TextField
                select
                label="Quote View"
                value={formData.quoteView}
                onChange={handleChange("quoteView")}
                sx={textFieldStyle}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="All Records">All Records</MenuItem>
              </TextField>

              <TextField
                select
                label="Payment Details"
                value={formData.paymentDetails}
                onChange={handleChange("paymentDetails")}
                sx={textFieldStyle}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="All Records">All Records</MenuItem>
              </TextField>
            </Grid2>
          </Box>
        )}

        <Divider sx={{ mt: 3 }} />
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

/* Helper Grid layout */
const Grid2 = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 2,
      mb: 2,
    }}
  >
    {children}
  </Box>
);

