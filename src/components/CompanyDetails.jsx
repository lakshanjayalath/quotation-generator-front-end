// src/components/CompanyDetails.jsx
import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function CompanyDetails() {
  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Company Details
      </Typography>
      <TextField fullWidth label="Company Name" margin="normal" />
      <TextField fullWidth label="ID Number" margin="normal" />
      <TextField fullWidth label="VAT Number" margin="normal" />
      <TextField fullWidth label="Website" margin="normal" />
      <TextField fullWidth label="Email" margin="normal" />
      <TextField fullWidth label="Company Phone" margin="normal" />
      <Button variant="contained" sx={{ mt: 2, backgroundColor: "#BC4749" }}>
        Save
      </Button>
    </Box>
  );
}
