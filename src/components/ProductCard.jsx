import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Get the image URL from various possible field names
  const imageUrl = product.imageUrl || product.image_url || product.ImageUrl || "";
  
  // Get product name from various possible field names
  const productName = product.item || product.name || product.title || product.Item || product.Title || "Unnamed Product";
  
  // Get price with fallback and ensure it's a number - remove commas before parsing
  const rawPrice = String(product.price || product.Price || product.unitPrice || product.UnitPrice || 0);
  const price = parseFloat(rawPrice.replace(/,/g, "")) || 0;
  
  // Get quantity from various possible field names and ensure it's a number
  const rawQty = String(product.qty || product.quantity || product.Qty || product.Quantity || 0);
  const quantity = parseInt(rawQty.replace(/,/g, "")) || 0;
  
  // Get description
  const description = product.description || product.Description || "No description available";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
          bgcolor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!imageUrl && (
          <Typography
            variant="h2"
            sx={{ color: "#ccc", fontWeight: "bold" }}
          >
            {productName.charAt(0).toUpperCase()}
          </Typography>
        )}
      </CardMedia>

      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
          {productName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
            minHeight: 40,
          }}
        >
          {description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#4a7c59" }}
          >
            LKR {price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          {quantity > 0 ? (
            <Chip
              label={`In Stock (${quantity})`}
              size="small"
              sx={{
                bgcolor: "#e8f5e9",
                color: "#2e7d32",
                fontWeight: 500,
              }}
            />
          ) : (
            <Chip
              label="Out of Stock"
              size="small"
              sx={{
                bgcolor: "#ffebee",
                color: "#c62828",
                fontWeight: 500,
              }}
            />
          )}
        </Box>
      </CardContent>

      {/* Product Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          disabled={quantity <= 0}
          sx={{
            bgcolor: "#4a7c59",
            borderRadius: 2,
            py: 1,
            "&:hover": { bgcolor: "#386641" },
            "&.Mui-disabled": {
              bgcolor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
          onClick={() => navigate("/login")}
        >
          Request Quote
        </Button>
      </CardActions>
    </Card>
  );
}
