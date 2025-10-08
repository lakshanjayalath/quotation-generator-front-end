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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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

        {/* Email */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          Email address
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your email"
          sx={{ mb: 3 }}
        />

        {/* Password */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          Password
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          variant="outlined"
          placeholder="Enter your password"
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
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Link href="#" underline="hover">
            Forgot password?
          </Link>
        </Box>

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "black",
            color: "white",
            py: 1.2,
            fontSize: "16px",
            "&:hover": { bgcolor: "#333" },
          }}
        >
          Login
        </Button>

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
