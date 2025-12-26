import React, { useState, useRef } from "react";
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
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { uploadImage } from "../services/supabaseClient";

export default function NewItemForm({ initialData = null, onSave }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // Check if we're in edit mode (either via props or route params)
  const isEditMode = !!(initialData || id);
  const itemFromState = location.state?.item;

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        item: initialData.item || initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        qty: initialData.qty || initialData.quantity || 0,
        imageUrl: initialData.imageUrl || "",
      };
    }
    if (itemFromState) {
      return {
        item: itemFromState.item || itemFromState.title || "",
        description: itemFromState.description || "",
        price: itemFromState.price || 0,
        qty: itemFromState.qty || itemFromState.quantity || 0,
        imageUrl: itemFromState.imageUrl || "",
      };
    }
    return {
      item: "",
      description: "",
      price: 0,
      qty: 0,
      imageUrl: "",
    };
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(
    initialData?.imageUrl || itemFromState?.imageUrl || null
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: field === "price" || field === "qty"
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

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    setImageError("");
    setImageUploading(true);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const result = await uploadImage(file);

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          imageUrl: result.url,
        }));
      } else {
        setImageError(result.error || "Failed to upload image");
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setImageError("Failed to upload image. Please try again.");
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: "",
    }));
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.item.trim()) {
      newErrors.item = "Item name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!Number.isFinite(formData.qty) || formData.qty <= 0) {
      newErrors.qty = "Quantity must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const itemId = id || initialData?.id || itemFromState?.id;
        // Normalize payload keys to match backend contract (Title/Quantity expected)
        const payload = {
          Title: formData.item,
          Description: formData.description,
          Price: Number(formData.price),
          Quantity: Number(formData.qty),
          ImageUrl: formData.imageUrl,
        };
        
        if (isEditMode && itemId) {
          // Update existing item
          await axios.put(`http://localhost:5264/api/items/${itemId}`, payload);
        } else {
          // Create new item
          await axios.post("http://localhost:5264/api/items", payload);
        }
        
        setShowSuccess(true);

        if (onSave) onSave(formData);

        // Reset form only if it's a new item, not editing
        if (!isEditMode) {
          setFormData({
            item: "",
            description: "",
            price: 0,
            qty: 0,
            imageUrl: "",
          });
          setImagePreview(null);
        }

        // Navigate back to items page after successful save
        setTimeout(() => {
          navigate("/dashboard/items");
        }, 1500);
      } catch (error) {
        console.error("Error saving item:", error);
        const apiMessage = error.response?.data?.message
          || (error.response?.data ? JSON.stringify(error.response.data) : null)
          || error.message;
        alert(`Failed to ${isEditMode ? 'update' : 'save'} item. ${apiMessage || 'Please try again.'}`);
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
        <Link component={RouterLink} underline="hover" color="inherit" to="/dashboard/items">
          Items
        </Link>
        <Typography color="text.primary">
          {isEditMode ? "Edit Item" : "New Item"}
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
            {isEditMode ? "Edit Item" : "New Item"}
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
              {isEditMode ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>

        {/* Form Fields */}
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* Image Upload Section */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
            <Typography
              variant="body1"
              sx={{ minWidth: 120, fontWeight: 500, pt: 1 }}
            >
              Product Image
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Image Preview */}
                <Avatar
                  src={imagePreview}
                  variant="rounded"
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "#f5f5f5",
                    border: "2px dashed #ccc",
                  }}
                >
                  {!imagePreview && (
                    <CloudUploadIcon sx={{ fontSize: 40, color: "#999" }} />
                  )}
                </Avatar>

                {/* Upload Controls */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    id="image-upload-input"
                  />
                  <label htmlFor="image-upload-input">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={imageUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                      disabled={imageUploading}
                      sx={{
                        borderColor: "#4a7c59",
                        color: "#4a7c59",
                        "&:hover": { borderColor: "#386641", bgcolor: "rgba(74, 124, 89, 0.04)" },
                      }}
                    >
                      {imageUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  </label>
                  {imagePreview && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveImage}
                      disabled={imageUploading}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
              {imageError && (
                <Typography variant="caption" color="error">
                  {imageError}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              variant="body1"
              sx={{ minWidth: 120, fontWeight: 500 }}
            >
              Item Name
            </Typography>
            <TextField
              fullWidth
              value={formData.item}
              onChange={handleChange("item")}
              error={!!errors.item}
              helperText={errors.item}
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
              value={formData.qty}
              onChange={handleChange("qty")}
              error={!!errors.qty}
              helperText={errors.qty}
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
          Item {isEditMode ? "updated" : "saved"} successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
