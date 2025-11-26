import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5264/api/Auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response.data);

      // Store token if provided by backend
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      // Store user data if provided
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      
      let errorMessage = "Invalid email or password. Please try again.";

      if (err.response) {
        if (err.response.data) {
           if (typeof err.response.data === 'string') {
             errorMessage = err.response.data;
           } else if (err.response.data.errors) {
             // ASP.NET Core ValidationProblemDetails
             errorMessage = Object.values(err.response.data.errors).flat().join(", ");
           } else if (err.response.data.message) {
             errorMessage = err.response.data.message;
           } else if (err.response.data.error) {
             errorMessage = err.response.data.error;
           } else if (typeof err.response.data === 'object') {
             // Try to extract validation errors
             const values = Object.values(err.response.data);
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
          width: 400,
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Title */}
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Email */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            Email address
          </Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            variant="outlined"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
            sx={{ mb: 3 }}
          />

          {/* Password */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />

          {/* Remember Me + Forgot Password */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <FormControlLabel 
              control={
                <Checkbox 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
              } 
              label="Remember me" 
            />
            <Link href="#" underline="hover">
              Forgot password?
            </Link>
          </Box>

          {/* Login Button */}
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
              "&:hover": { bgcolor: "#333" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>

        {/* Register Link */}
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don’t have an account?{" "}
          <Link href="/register" underline="hover">
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
