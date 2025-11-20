import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewItemForm({ initialData = null, onSave }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      price: 0,
      quantity: 0,
    }
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: field === "price" || field === "quantity"
        ? Number(event.target.value)
        : event.target.value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!Number.isInteger(formData.quantity) || formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be a valid positive integer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        await axios.post("http://localhost:5264/api/items", formData);
        setShowSuccess(true);

        if (onSave) onSave(formData);

        // Reset form only if it's a new item, not editing
        if (!initialData) {
          setFormData({
            title: "",
            description: "",
            price: 0,
            quantity: 0,
          });
        }

        // Navigate back to items page after successful save
        setTimeout(() => {
          navigate("/dashboard/items");
        }, 1500);
      } catch (error) {
        console.error("Error saving item:", error);
        alert("Failed to save item. Please try again.");
      }
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }} separator="/">
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon fontSize="small" />
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/items">
          Items
        </Link>
        <Typography color="text.primary">
          {initialData ? "Edit Item" : "New Item"}
        </Typography>
      </Breadcrumbs>

      {/* Main Form */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            pb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" component="h1" fontWeight={500}>
            {initialData ? "Edit Item" : "New Item"}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ mr: 2, borderColor: "#4a7c59", color: "#4a7c59" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: "#4a7c59",
                "&:hover": { bgcolor: "#386641" },
                px: 4,
                py: 1,
                borderRadius: 1,
              }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {/* Form Fields */}
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              variant="body1"
              sx={{ minWidth: 120, fontWeight: 500 }}
            >
              Title
            </Typography>
            <TextField
              fullWidth
              value={formData.title}
              onChange={handleChange("title")}
              error={!!errors.title}
              helperText={errors.title}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f5f5f5",
                  "&:hover": { bgcolor: "#eeeeee" },
                  "&.Mui-focused": { bgcolor: "white" },
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
            <Typography
              variant="body1"
              sx={{ minWidth: 120, fontWeight: 500, pt: 1 }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={errors.description}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f5f5f5",
                  "&:hover": { bgcolor: "#eeeeee" },
                  "&.Mui-focused": { bgcolor: "white" },
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              variant="body1"
              sx={{ minWidth: 120, fontWeight: 500 }}
            >
              Price
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.price}
              onChange={handleChange("price")}
              error={!!errors.price}
              helperText={errors.price}
              variant="outlined"
              inputProps={{ min: 0, step: 0.01 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f5f5f5",
                  "&:hover": { bgcolor: "#eeeeee" },
                  "&.Mui-focused": { bgcolor: "white" },
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              variant="body1"
              sx={{ minWidth: 120, fontWeight: 500 }}
            >
              Quantity
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.quantity}
              onChange={handleChange("quantity")}
              error={!!errors.quantity}
              helperText={errors.quantity}
              variant="outlined"
              inputProps={{ min: 0, step: 1 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f5f5f5",
                  "&:hover": { bgcolor: "#eeeeee" },
                  "&.Mui-focused": { bgcolor: "white" },
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Item saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
