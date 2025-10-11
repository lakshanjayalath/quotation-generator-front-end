import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Map routes to page titles
const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/clients": "Clients",
  "/dashboard/items": "Products",
  "/dashboard/invoices": "Invoices",
  "/dashboard/payments": "Payments",
  "/dashboard/quotes": "Quotes",
  "/dashboard/vendors": "Vendors",
  "/dashboard/purchase-orders": "Purchase Orders",
  "/dashboard/transaction": "Transaction",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
  "/dashboard/edit-profile": "Edit Profile",
  "/dashboard/help": "Help",
  "/dashboard/feedback": "Feedback",
  "/dashboard/audit-log": "Audit Log",
};

const TopBar = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard"; // default if not mapped

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#6A994E", // updated color
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
        {/* Page Title + Add button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "white" }} // text color changed to white for contrast
          >
            {title}
          </Typography>
          <IconButton>
            <AddCircleIcon sx={{ color: "white" }} /> {/* icon color updated */}
          </IconButton>
        </Box>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          sx={{
            bgcolor: "#6A994E", // search bar background matches topbar
            borderRadius: 2,
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              paddingRight: 0,
              "& fieldset": {
                borderColor: "white", // border color for search box
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
              color: "white",
            },
            input: { color: "white" }, // input text color
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

