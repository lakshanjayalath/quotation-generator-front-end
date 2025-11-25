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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink } from "react-router-dom";

export default function Report() {
  const [formData, setFormData] = useState({
    reportType: "Activity",
    sendEmail: false,
    activity: "All",
    range: "All",
  });

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setFormData({ ...formData, [field]: value });
  };

  // TextField + Focus styling
  const textFieldStyle = {
    "& label.Mui-focused": { color: "#BC4749" },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#BC4749" },
    },
  };

  // Switch color style
  const switchStyle = {
    "& .Mui-checked": { color: "#4a7c59" },
    "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "#4a7c59" },
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

        <Typography color="text.primary">Reports</Typography>
      </Breadcrumbs>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
          Reports
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
          }}
        >
          {/* LEFT SECTION */}
          <Box>
            {/* Report Type */}
            <TextField
              select
              label="Report"
              fullWidth
              value={formData.reportType}
              onChange={handleChange("reportType")}
              sx={textFieldStyle}
            >
              <MenuItem value="Activity">Activity</MenuItem>
              <MenuItem value="Invoices">Invoices</MenuItem>
              <MenuItem value="Quotes">Quotes</MenuItem>
              <MenuItem value="Clients">Clients</MenuItem>
              <MenuItem value="Products">Products</MenuItem>
            </TextField>

            {/* Send Email */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.sendEmail}
                  onChange={handleChange("sendEmail")}
                  sx={switchStyle}
                />
              }
              label="Send Email"
              sx={{ mt: 3 }}
            />

            {/* Activity Dropdown — Always Visible */}
            <TextField
              select
              label="Activity"
              fullWidth
              value={formData.activity}
              onChange={handleChange("activity")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Created">Created</MenuItem>
              <MenuItem value="Updated">Updated</MenuItem>
              <MenuItem value="Deleted">Deleted</MenuItem>
            </TextField>
          </Box>

          {/* RIGHT SECTION */}
          <Box>
            <TextField
              select
              label="Range"
              fullWidth
              value={formData.range}
              onChange={handleChange("range")}
              sx={textFieldStyle}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Export button */}
        <Box sx={{ mt: 4, textAlign: "right" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#4a7c59",
              "&:hover": { bgcolor: "#386641" },
            }}
          >
            Export
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
