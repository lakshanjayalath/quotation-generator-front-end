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
        backgroundColor: "#D3D3D3",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
        {/* Page Title + Add button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            {title}
          </Typography>
          <IconButton>
            <AddCircleIcon sx={{ color: "black" }} />
          </IconButton>
        </Box>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          sx={{
            bgcolor: "#D3D3D3",
            borderRadius: 2,
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              paddingRight: 0,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
