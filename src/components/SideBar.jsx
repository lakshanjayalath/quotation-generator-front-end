import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Box,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentsIcon from "@mui/icons-material/Payments";
import WidgetsIcon from "@mui/icons-material/Widgets";
import StoreIcon from "@mui/icons-material/Store";
import PaidIcon from "@mui/icons-material/Paid";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import WarningIcon from "@mui/icons-material/Warning";
import RestoreIcon from "@mui/icons-material/Restore";
import EditIcon from "@mui/icons-material/Edit";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// --- Menu Definitions ---
const topMenuItems = [
  { label: "Dashboard", icon: <HomeIcon />, link: "/dashboard" },
  { label: "Clients", icon: <PeopleAltIcon />, link: "/dashboard/clients" },
  { label: "Products", icon: <InventoryIcon />, link: "/dashboard/items" },
  // { label: "Invoices", icon: <PaymentsIcon />, link: "/dashboard/invoices" },
  // { label: "Payments", icon: <PaidIcon />, link: "/dashboard/payments" },
  { label: "Quotes", icon: <WidgetsIcon />, link: "/dashboard/quotes" },
  // { label: "Vendors", icon: <StoreIcon />, link: "/dashboard/vendors" },
  // { label: "Purchase Orders", icon: <ShoppingCartIcon />, link: "/dashboard/purchase-orders" },
  // { label: "Transaction", icon: <PaidIcon />, link: "/dashboard/transaction" },
  { label: "Reports", icon: <SummarizeIcon />, link: "/dashboard/reports" },
  { label: "Settings", icon: <SettingsIcon />, link: "/dashboard/setting" },
];

const bottomMenuItems = [
  { label: "Edit Profile", icon: <EditIcon />, link: "/edit-profile" },
  { label: "Help", icon: <HelpIcon />, link: "/help" },
  { label: "Feedback", icon: <WarningIcon />, link: "/feedback" },
  { label: "Audit Log", icon: <RestoreIcon />, link: "/audit-log" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to body
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  // Handlers
  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Colors
  const textColor = darkMode ? "#333" : "#F2E8CF";
  const bgColor = darkMode ? "#F2F2F2" : "#386641";
  const hoverColor = darkMode ? "#4a7c59" : "#4a7c59";

  return (
    <Drawer
      variant="permanent"
      open={!collapsed}
      sx={{
        width: collapsed ? "60px" : "240px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? "60px" : "240px",
          height: "calc(100vh - 65px)",
          top: 65,
          boxSizing: "border-box",
          transition: "width 0.3s",
          backgroundColor: bgColor,
          color: textColor,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      {/* --- Top Section --- */}
      <Box>
        {/* Collapse Button */}
        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"} placement="right">
          <IconButton sx={{ margin: "10px", color: textColor }} onClick={toggleSidebar}>
            <DragHandleIcon />
          </IconButton>
        </Tooltip>

        {/* Main Menu */}
        <List>
          {topMenuItems.map((item, index) => (
            <Tooltip key={index} title={collapsed ? item.label : ""} placement="right" arrow>
              <ListItem
                button
                component={Link}
                to={item.link}
                sx={{
                  padding: collapsed ? "10px 0" : "10px 20px",
                  "&:hover": { backgroundColor: hoverColor },
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Icon + Label */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon
                    sx={{
                      minWidth: "40px",
                      justifyContent: "center",
                      color: textColor,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: { color: textColor, fontWeight: 500 },
                      }}
                    />
                  )}
                </Box>

                {/* Add Button (skip Dashboard) */}
                {!collapsed && item.label !== "Dashboard" && (
                  <IconButton
                    size="small"
                    sx={{ color: textColor }}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(`Add clicked for ${item.label}`);
                    }}
                  >
                    <AddCircleIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* --- Bottom Section --- */}
      <Box>
        <Divider sx={{ bgcolor: darkMode ? "#0e0e0dff" : "#ccc", my: 1 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* Bottom Menu Items */}
          {bottomMenuItems.map((item, index) => {
            const button = (
              <IconButton component={Link} to={item.link} sx={{ color: textColor }}>
                {item.icon}
              </IconButton>
            );
            return collapsed ? (
              <Tooltip key={index} title={item.label} placement="right" arrow>
                {button}
              </Tooltip>
            ) : (
              <Box key={index}>{button}</Box>
            );
          })}

          {/* Theme Toggle */}
          {collapsed ? (
            <Tooltip title="Toggle Theme" placement="right" arrow>
              <IconButton sx={{ color: textColor }} onClick={toggleTheme}>
                {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton sx={{ color: textColor }} onClick={toggleTheme}>
              {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
