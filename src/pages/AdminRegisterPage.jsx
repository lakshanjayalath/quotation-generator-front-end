import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeIcon from "@mui/icons-material/Home";

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if current user is admin
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const userRole = userData.role?.toLowerCase();
        if (userRole === "admin") {
          setIsAdmin(true);
        } else {
          // Redirect non-admin users
          navigate("/dashboard");
        }
      } catch (e) {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
    setCheckingAuth(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      
      // Get auth token for admin request
      const token = localStorage.getItem("authToken");
      
      const response = await axios.post(
        "http://localhost:5264/api/Auth/register-admin",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Admin registration successful:", response.data);
      setSuccess(true);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Admin registration error:", err);

      let errorMessage = "Registration failed. Please try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized. Please login as admin.";
          navigate("/login");
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to register users.";
        } else if (err.response.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data.errors) {
            errorMessage = Object.values(err.response.data.errors).flat().join(", ");
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (Array.isArray(err.response.data)) {
            errorMessage = err.response.data.map((e) => e.description || e).join(", ");
          }
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth || !isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink
          component={Link}
          to="/dashboard"
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Dashboard
        </MuiLink>
        <MuiLink component={Link} to="/dashboard/setting" underline="hover" color="inherit">
          Settings
        </MuiLink>
        <Typography color="text.primary">Register New User</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <PersonAddIcon sx={{ fontSize: 32, color: "#386641" }} />
        <Typography variant="h5" fontWeight="bold">
          Register New User (Admin Only)
        </Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              User registered successfully!
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Name Fields */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                variant="outlined"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
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
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
            sx={{ mb: 2 }}
          />

          {/* Role Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Password Fields */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Submit Button */}
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/setting")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#386641",
                "&:hover": { bgcolor: "#2d5234" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register User"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
