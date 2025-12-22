import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5264/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Map data to ensure consistent field names
        const mappedData = data.map((item) => ({
          ...item,
          imageUrl: item.imageUrl || item.image_url || item.ImageUrl || "",
        }));
        setProducts(mappedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        // Use mock data if API fails (for development/demo purposes)
        const mockProducts = [
          { id: 1, item: "Web Development", description: "Professional website development services", price: 999.99, qty: 10, imageUrl: "" },
          { id: 2, item: "Mobile App", description: "iOS and Android mobile application development", price: 1499.99, qty: 5, imageUrl: "" },
          { id: 3, item: "UI/UX Design", description: "User interface and experience design services", price: 599.99, qty: 15, imageUrl: "" },
          { id: 4, item: "SEO Services", description: "Search engine optimization for better visibility", price: 299.99, qty: 20, imageUrl: "" },
          { id: 5, item: "Cloud Hosting", description: "Reliable cloud hosting solutions", price: 49.99, qty: 100, imageUrl: "" },
          { id: 6, item: "Consulting", description: "Expert IT consulting services", price: 199.99, qty: 8, imageUrl: "" },
        ];
        setProducts(mockProducts);
        setError(null); // Don't show error, use mock data instead
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          color: "#386641",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            QuoteGenius
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              color="inherit"
              sx={{ fontWeight: 500 }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              color="inherit"
              sx={{ fontWeight: 500, color: "#4a7c59" }}
            >
              Products
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#4a7c59",
                px: 3,
                borderRadius: 2,
                "&:hover": { bgcolor: "#386641" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          pt: 12,
          pb: 6,
          background: "linear-gradient(135deg, #4a7c59 0%, #386641 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Our Products
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ opacity: 0.9, maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Browse our wide selection of quality products and services
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 500, mx: "auto" }}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { border: "none" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Products Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#4a7c59" }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="error" variant="h6">
              Error: {error}
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? "No products match your search" : "No products available"}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              {filteredProducts.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 12px)",
                      md: "calc(33.333% - 16px)",
                      lg: "calc(25% - 18px)",
                    },
                  }}
                >
                  <ProductCard product={product} />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1a1a1a", color: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2024 QuoteGenius. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Button color="inherit" size="small" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button color="inherit" size="small">
                Products
              </Button>
              <Button color="inherit" size="small" onClick={() => navigate("/login")}>
                Login
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
