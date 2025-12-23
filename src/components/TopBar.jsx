import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAuth } from "../context/AuthContext";

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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const title = pageTitles[location.pathname] || "Dashboard";

  // 🔹 Avatar menu state
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // 🔹 Get user data from auth context
  const userName = user?.firstName || user?.name || user?.email || "";
  const userImage = user?.profileImageUrl || user?.profileImage || "";

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#6A994E",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        {/* Page Title + Add button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            {title}
          </Typography>
          <IconButton>
            <AddCircleIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          sx={{
            bgcolor: "#6A994E",
            borderRadius: 2,
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
              color: "white",
            },
            input: { color: "white" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* 🔹 Spacer (keeps layout unchanged, pushes avatar right) */}
        <Box sx={{ flexGrow: 1 }} />

        {/* 🔹 Avatar Section (NEW) */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Account settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                src={userImage}
                alt={userName}
                sx={{ bgcolor: "#386641", color: "white" }}
              >
                {!userImage && userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={() => navigate("/dashboard/edit-profile")}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;


