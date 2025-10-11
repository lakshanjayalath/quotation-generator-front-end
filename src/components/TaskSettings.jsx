// src/components/settings/TaskSettings.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function TaskSettings() {
  return (
    <Box>
      <Typography variant="h5">Task Settings</Typography>
      <Typography variant="body2" color="text.secondary">
        Manage task categories and workflow settings here.
      </Typography>
    </Box>
  );
}
