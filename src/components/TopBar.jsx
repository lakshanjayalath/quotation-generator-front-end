import React from "react";
import { AppBar, Toolbar, IconButton, Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const TopBar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#D3D3D3", // ✅ light gray background
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
        {/* Dashboard + Add button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "black" }} // ✅ make text black for contrast
          >
            Dashboard
          </Typography>
          <IconButton>
            <AddCircleIcon sx={{ color: "black" }} /> {/* ✅ icon also black */}
          </IconButton>
        </Box>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          sx={{
            bgcolor: "#D3D3D3", // ✅ match the AppBar background
            borderRadius: 2,
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              paddingRight: 0,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
