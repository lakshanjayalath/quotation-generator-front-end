import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Switch,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";

export default function AccountManagement() {
  const [tab, setTab] = useState(0);
  const [switches, setSwitches] = useState({
    activeCompanies: true,
    createInvoices: false,
    enableQuickbooks: true,
    invoices: false,
    recurringInvoices: false,
    quotes: true,
    credits: false,
    projects: false,
    tasks: false,
    vendors: false,
    purchaseOrders: false,
    nonBillableTasks: false,
    transactions: false,
  });
  const [form, setForm] = useState({
    platform: "GitHub",
    apiService: "OpenAI API",
    apiKey: "",
    webTimeout: "Never",
  });

  const handleTabChange = (e, newValue) => setTab(newValue);

  const handleSwitchChange = (e) => {
    setSwitches({ ...switches, [e.target.name]: e.target.checked });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Paper elevation={2} sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Account management
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Plan" />
          <Tab label="Overview" />
          <Tab label="Activated modules" />
          <Tab label="Integration" />
          <Tab label="Security settings" />
        </Tabs>

        {/* Tab 1 - Plan */}
        {tab === 0 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 , justifyContent: 'center', display: 'flex'}}>
              Self Hosted(Free)
            </Typography>
            
          </Box>
        )}

        {/* Tab 2 - Overview */}
        {tab === 1 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Active Connections
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography>Active Companies</Typography>
               <Typography variant="body2" color="text.secondary">
            Enable emails, recurring invoices and notifications
          </Typography>
              <Switch
                checked={switches.activeCompanies}
                onChange={handleSwitchChange}
                name="activeCompanies"
              />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography>Enable Markdown</Typography>
               <Typography variant="body2" color="text.secondary">
            Convert markdown to HTML on the PDF
          </Typography>
              <Switch
                checked={switches.createInvoices}
                onChange={handleSwitchChange}
                name="createInvoices"
              />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography>Include Draft</Typography>
              <Typography variant="body2" color="text.secondary">
            Include draft records in reports
          </Typography>
              <Switch
                checked={switches.enableQuickbooks}
                onChange={handleSwitchChange}
                name="enableQuickbooks"
              />
            </Box>
          </Box>
        )}

        {/* Tab 3 - Activated modules */}
        {tab === 2 && (
          <Box>
            {Object.keys(switches)
              .slice(3) // skip first 3 toggles
              .map((key) => (
                <Box
                  key={key}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography textTransform="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Typography>
                  <Switch
                    checked={switches[key]}
                    onChange={handleSwitchChange}
                    name={key}
                  />
                </Box>
              ))}
          </Box>
        )}

        {/* Tab 4 - Integration */}
        {tab === 3 && (
          <Box>
            <TextField
              select
              fullWidth
              label="Integration Platform"
              name="platform"
              value={form.platform}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="GitHub">GitHub</MenuItem>
              <MenuItem value="GitLab">GitLab</MenuItem>
              <MenuItem value="Bitbucket">Bitbucket</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="API Service"
              name="apiService"
              value={form.apiService}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="OpenAI API">OpenAI API</MenuItem>
              <MenuItem value="Google API">Google API</MenuItem>
              <MenuItem value="Azure API">Azure API</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="API Key"
              name="apiKey"
              value={form.apiKey}
              onChange={handleFormChange}
            />
          </Box>
        )}

        {/* Tab 5 - Security settings */}
        {tab === 4 && (
          <Box>
            <TextField
              select
              fullWidth
              label="Web Session Timeout"
              name="webTimeout"
              value={form.webTimeout}
              onChange={handleFormChange}
              sx={{ mb: 3 }}
            >
              <MenuItem value="Never">Never</MenuItem>
              <MenuItem value="15 Minutes">15 Minutes</MenuItem>
              <MenuItem value="1 Hour">1 Hour</MenuItem>
              <MenuItem value="24 Hours">24 Hours</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              color="error"
              sx={{ width: "100%", fontWeight: "bold" }}
            >
              Log Out
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
