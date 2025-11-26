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
    includeDeleted: false,

    // Filters
    activity: "All",
    range: "All",
    startDate: "",
    endDate: "",
    status: "All",
    client: "All",
    user: "All",
    minAmount: "",
    maxAmount: "",
    groupBy: "None",
    sortBy: "Newest",
    output: "PDF",
    search: "",
  });

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setFormData({ ...formData, [field]: value });
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

        {/* Grid Layout */}
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
              <MenuItem value="Users">Users</MenuItem>
            </TextField>

            {/* SWITCHES IN A ROW (Aligned) */}
            <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.sendEmail}
                    onChange={handleChange("sendEmail")}
                    sx={switchStyle}
                  />
                }
                label="Send Email"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.includeDeleted}
                    onChange={handleChange("includeDeleted")}
                    sx={switchStyle}
                  />
                }
                label="Include Deleted"
              />
            </Box>

            {/* Search */}
            <TextField
              label="Search"
              fullWidth
              value={formData.search}
              onChange={handleChange("search")}
              sx={{ mt: 3, ...textFieldStyle }}
            />

            {/* Status */}
            <TextField
              select
              label="Status"
              fullWidth
              value={formData.status}
              onChange={handleChange("status")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Sent">Sent</MenuItem>
            </TextField>

            {/* Activity Filter */}
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
              <MenuItem value="Login">Login</MenuItem>
            </TextField>

            {/* Client Selector */}
            <TextField
              select
              label="Client"
              fullWidth
              value={formData.client}
              onChange={handleChange("client")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All Clients</MenuItem>
              <MenuItem value="ClientA">Client A</MenuItem>
              <MenuItem value="ClientB">Client B</MenuItem>
              <MenuItem value="ClientC">Client C</MenuItem>
            </TextField>

            {/* User Selector */}
            <TextField
              select
              label="User / Staff"
              fullWidth
              value={formData.user}
              onChange={handleChange("user")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All Users</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff1">Staff 1</MenuItem>
              <MenuItem value="Staff2">Staff 2</MenuItem>
            </TextField>
          </Box>

          {/* RIGHT SECTION */}
          <Box>
            {/* Date Range */}
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={formData.startDate}
              onChange={handleChange("startDate")}
              sx={{ ...textFieldStyle }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={formData.endDate}
              onChange={handleChange("endDate")}
              sx={{ mt: 3, ...textFieldStyle }}
              InputLabelProps={{ shrink: true }}
            />

            {/* Range Presets */}
            <TextField
              select
              label="Range"
              fullWidth
              value={formData.range}
              onChange={handleChange("range")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="Custom">Custom Range</MenuItem>
            </TextField>

            {/* Amount Range */}
            <TextField
              label="Min Amount"
              fullWidth
              value={formData.minAmount}
              onChange={handleChange("minAmount")}
              sx={{ mt: 3, ...textFieldStyle }}
            />

            <TextField
              label="Max Amount"
              fullWidth
              value={formData.maxAmount}
              onChange={handleChange("maxAmount")}
              sx={{ mt: 3, ...textFieldStyle }}
            />

            {/* Group By */}
            <TextField
              select
              label="Group By"
              fullWidth
              value={formData.groupBy}
              onChange={handleChange("groupBy")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
              <MenuItem value="Date">Date</MenuItem>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Status">Status</MenuItem>
            </TextField>

            {/* Sort By */}
            <TextField
              select
              label="Sort By"
              fullWidth
              value={formData.sortBy}
              onChange={handleChange("sortBy")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="Newest">Newest First</MenuItem>
              <MenuItem value="Oldest">Oldest First</MenuItem>
              <MenuItem value="HighAmount">High Amount</MenuItem>
              <MenuItem value="LowAmount">Low Amount</MenuItem>
            </TextField>

            {/* Output Format */}
            <TextField
              select
              label="Output Format"
              fullWidth
              value={formData.output}
              onChange={handleChange("output")}
              sx={{ mt: 3, ...textFieldStyle }}
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="Excel">Excel</MenuItem>
              <MenuItem value="CSV">CSV</MenuItem>
              <MenuItem value="Print">Print</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Export Button */}
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
