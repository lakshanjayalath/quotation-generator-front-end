import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Switch,
  Breadcrumbs,
  Link,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function ProductSettings() {
  const settingsList = [
    {
      title: "Track Inventory",
      description:
        "Display a product stock field and update when invoices are sent",
    },
    {
      title: "Stock Notifications",
      description: "Send an email when the stock reaches the threshold",
    },
    {
      title: "Show Product Discount",
      description: "Display a line item discount field",
    },
    {
      title: "Show Product Cost",
      description: "Display a product cost field to track the markup/profit",
    },
    {
      title: "Show Product Quantity",
      description:
        "Display a product quantity field, otherwise default to one",
    },
    {
      title: "Auto-fill products",
      description:
        "Selecting a product will automatically fill in the description and cost",
    },
    {
      title: "Convert Products",
      description:
        "Automatically convert product prices to the client’s currency",
    },
  ];

  const [toggles, setToggles] = useState(
    Object.fromEntries(settingsList.map((item) => [item.title, false]))
  );

  const handleToggle = (title) => {
    setToggles((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center", fontWeight: 500 }}
          href="#"
        >
          <HomeOutlinedIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Settings
        </Link>
        <Typography color="text.primary" fontWeight={500}>
          Product Settings
        </Typography>
      </Breadcrumbs>

      {/* Settings Card */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          overflow: "hidden",
          maxWidth: 800,
          mx: "auto",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Product Settings
          </Typography>

          {settingsList.map((setting, index) => (
            <Box key={index}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: 1.5 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 0.3 }}
                  >
                    {setting.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.4 }}
                  >
                    {setting.description}
                  </Typography>
                </Box>

                <Switch
                  checked={toggles[setting.title]}
                  onChange={() => handleToggle(setting.title)}
                  color="default"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#1976d2",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#1976d2",
                    },
                  }}
                />
              </Stack>

              {index < settingsList.length - 1 && (
                <Divider sx={{ borderColor: "#eee" }} />
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
