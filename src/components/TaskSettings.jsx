// src/components/settings/TaskSettings.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";

export default function TaskSettings() {
  const [tab, setTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [settings, setSettings] = useState({
    defaultTaskRate: "",
    autoStartTasks: false,
    showTaskEndDate: false,
    showTaskItemDescription: false,
    allowBillableTaskRate: false,
    showTaskTable: false,
    invoiceTaskDialog: false,
    invoiceTaskTiming: false,
    invoiceTaskProject: false,
    invoiceTaskType: false,
    lockInvoiceTasks: false,
    addDocumentToInvoice: false,
    showTasksInClientPortal: false,
    taskRecordAsWord: "Invoiced",
    taskRoundingDirection: "Round Up",
    roundToNearest: "1 second (Disabled)",
  });

  const [taskStatuses, setTaskStatuses] = useState([
    { name: "Pending", color: "#F1C40F" },
    { name: "Ready to go", color: "#E67E22" },
    { name: "In progress", color: "#3498DB" },
    { name: "Done", color: "#2ECC71" },
  ]);

  const handleChange = (field) => (e) => {
    setSettings({ ...settings, [field]: e.target.value });
  };

  const handleToggle = (field) => (e) => {
    setSettings({ ...settings, [field]: e.target.checked });
  };

  const handleStatusChange = (index, field, value) => {
    const updated = [...taskStatuses];
    updated[index][field] = value;
    setTaskStatuses(updated);
  };

  const handleAddStatus = () => {
    setTaskStatuses([...taskStatuses, { name: "", color: "#000000" }]);
  };

  const handleDeleteStatus = (index) => {
    const updated = taskStatuses.filter((_, i) => i !== index);
    setTaskStatuses(updated);
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
        <Typography color="text.primary">Task Settings</Typography>
      </Breadcrumbs>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#f7f9f7",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" fontWeight={600} color="#386641">
            Task Settings
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
          <Tab label="Basic Settings" />
          <Tab label="Advanced Settings" />
        </Tabs>

        {/* BASIC SETTINGS */}
        {tab === 0 && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Settings
            </Typography>

            <Grid2>
              <TextField
                label="Default Task Rate"
                value={settings.defaultTaskRate}
                onChange={handleChange("defaultTaskRate")}
                sx={textFieldStyle}
              />
            </Grid2>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.autoStartTasks}
                    onChange={handleToggle("autoStartTasks")}
                  />
                }
                label="Auto Start Tasks"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.showTaskEndDate}
                    onChange={handleToggle("showTaskEndDate")}
                  />
                }
                label="Show Task End Date"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.showTaskItemDescription}
                    onChange={handleToggle("showTaskItemDescription")}
                  />
                }
                label="Show Task Item Description"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.allowBillableTaskRate}
                    onChange={handleToggle("allowBillableTaskRate")}
                  />
                }
                label="Allow Billable Task Rate"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.showTaskTable}
                    onChange={handleToggle("showTaskTable")}
                  />
                }
                label="Show Task Table"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.invoiceTaskDialog}
                    onChange={handleToggle("invoiceTaskDialog")}
                  />
                }
                label="Invoice Task Dialog"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.invoiceTaskTiming}
                    onChange={handleToggle("invoiceTaskTiming")}
                  />
                }
                label="Invoice Task Timing"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.invoiceTaskProject}
                    onChange={handleToggle("invoiceTaskProject")}
                  />
                }
                label="Invoice Task Project"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.invoiceTaskType}
                    onChange={handleToggle("invoiceTaskType")}
                  />
                }
                label="Invoice Task Type"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.lockInvoiceTasks}
                    onChange={handleToggle("lockInvoiceTasks")}
                  />
                }
                label="Lock Invoice Tasks"
              />
              <FormControlLabel
                control={
                  <Switch
                    sx={switchStyle}
                    checked={settings.addDocumentToInvoice}
                    onChange={handleToggle("addDocumentToInvoice")}
                  />
                }
                label="Add Documents to Invoices"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid2>
              <TextField
                select
                label="Task Record As Word"
                value={settings.taskRecordAsWord}
                onChange={handleChange("taskRecordAsWord")}
                sx={textFieldStyle}
              >
                <MenuItem value="Invoiced">Invoiced</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Billed">Billed</MenuItem>
              </TextField>

              <TextField
                select
                label="Task Rounding Direction"
                value={settings.taskRoundingDirection}
                onChange={handleChange("taskRoundingDirection")}
                sx={textFieldStyle}
              >
                <MenuItem value="Round Up">Round Up</MenuItem>
                <MenuItem value="Round Down">Round Down</MenuItem>
              </TextField>

              <TextField
                select
                label="Round To Nearest"
                value={settings.roundToNearest}
                onChange={handleChange("roundToNearest")}
                sx={textFieldStyle}
              >
                <MenuItem value="1 second (Disabled)">
                  1 second (Disabled)
                </MenuItem>
                <MenuItem value="30 seconds">30 seconds</MenuItem>
                <MenuItem value="1 minute">1 minute</MenuItem>
              </TextField>
            </Grid2>
          </Box>
        )}

        {/* ADVANCED SETTINGS */}
        {tab === 1 && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              New Task Status
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskStatuses.map((status, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        value={status.name}
                        onChange={(e) =>
                          handleStatusChange(index, "name", e.target.value)
                        }
                        sx={textFieldStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="color"
                        value={status.color}
                        onChange={(e) =>
                          handleStatusChange(index, "color", e.target.value)
                        }
                        style={{
                          width: 50,
                          height: 30,
                          border:"none",
                          
                          
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteStatus(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddStatus}
              sx={{ mt: 2, color: "#386641" }}
            >
              Add New Status
            </Button>
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
          Task settings saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

/* Helper grid layout */
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
