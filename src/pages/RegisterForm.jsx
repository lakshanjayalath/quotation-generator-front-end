import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Link,
  Divider,
  Grid,
} from "@mui/material";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Box
        sx={{
          width: 500,
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Title */}
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Create your account. It’s free and only takes a minute
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Email */}
          <TextField
            fullWidth
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          {/* Password */}
          <TextField
            fullWidth
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          {/* Terms Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
            }
            label={
              <Typography variant="body2">
                I accept the{" "}
                <Link href="#" underline="hover">
                  Terms of Use & Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mt: 2 }}
          />

          {/* Register Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "black",
              color: "white",
              py: 1.2,
              fontSize: "16px",
              mt: 2,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Register Now
          </Button>
        </form>
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
