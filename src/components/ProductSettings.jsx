// src/components/settings/ProductSettings.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function ProductSettings() {
  return (
    <Box>
      <Typography variant="h5">Product Settings</Typography>
      <Typography variant="body2" color="text.secondary">
        Configure product details and default tax rules here.
      </Typography>
    </Box>
  );
}
