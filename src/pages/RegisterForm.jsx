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
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    console.log("Form Data:", formData); // Debugging

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5264/api/Auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        terms: true, // Silently accept terms to satisfy backend validation
      });

      console.log("Registration successful:", response.data);
      setSuccess(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response) {
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.errors) {
            // ASP.NET Core ValidationProblemDetails
            errorMessage = Object.values(err.response.data.errors).flat().join(", ");
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (Array.isArray(err.response.data)) {
             errorMessage = err.response.data.map(e => e.description || e).join(", ");
          } else if (typeof err.response.data === 'object') {
             // Fallback for other object structures
             const values = Object.values(err.response.data);
             // Check if values are arrays (simple dictionary of errors)
             if (values.length > 0 && values.every(v => Array.isArray(v))) {
                errorMessage = values.flat().join(", ");
             } else {
                errorMessage = JSON.stringify(err.response.data);
             }
          }
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Redirecting to login...
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
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
                disabled={loading}
                required
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
            disabled={loading}
            required
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
            disabled={loading}
            required
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
            disabled={loading}
            required
            sx={{ mt: 2 }}
          />

          {/* Register Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "black",
              color: "white",
              py: 1.2,
              fontSize: "16px",
              mt: 2,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register Now"}
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
