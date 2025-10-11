import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const menuItems = [
  { label: "Company Details", icon: <BusinessIcon />, link: "/dashboard/setting/company-details" },
  { label: "User Details", icon: <PersonIcon />, link: "/dashboard/setting/user-details" },
  { label: "Product Settings", icon: <CategoryIcon />, link: "/dashboard/setting/product-settings" },
  { label: "Task Settings", icon: <AssignmentIcon />, link: "/dashboard/setting/task-settings" },
  { label: "Account Management", icon: <ManageAccountsIcon />, link: "/dashboard/setting/account-management" },
];

const SettingSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const textColor = "#F2E8CF";
  const bgColor = "#61903D";
  const hoverColor = "#78A438";

  return (
    <Box
      sx={{
        width: collapsed ? 60 : 240,
        transition: "width 0.3s",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: bgColor,
        color: textColor,
        height: "100%", // full height of parent container
        position: "relative", // fixed inside container
      }}
    >
      {/* Top Section */}
      <Box>
        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"} placement="right">
          <IconButton sx={{ m: 1, color: textColor }} onClick={toggleSidebar}>
            <ArrowBackIcon
              sx={{
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
        </Tooltip>

        <Divider sx={{ bgcolor: "#ccc", my: 1 }} />

        {/* Sidebar Menu */}
        <List>
          {menuItems.map((item, index) => (
            <Tooltip key={index} title={collapsed ? item.label : ""} placement="right" arrow>
              <ListItem
                button
                component={Link}
                to={item.link}
                sx={{
                  padding: collapsed ? "10px 0" : "10px 20px",
                  "&:hover": { backgroundColor: hoverColor },
                  backgroundColor: location.pathname === item.link ? hoverColor : "transparent",
                  color: textColor,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 40 : 56,
                      justifyContent: "center",
                      color: textColor,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ sx: { color: textColor, fontWeight: 500 } }}
                    />
                  )}
                </Box>

                {!collapsed && (
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
    </Box>
  );
};

export default SettingSidebar;
