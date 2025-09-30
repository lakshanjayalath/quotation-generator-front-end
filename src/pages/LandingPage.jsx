import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SpeedIcon from "@mui/icons-material/Speed";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f9fafb",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 6,
          py: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
          bgcolor: "white",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Quotify
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "#111827",
              color: "#111827",
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
            onClick={() => navigate("/quotations")}
          >
            View Quotations
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#111827",
              color: "white",
              "&:hover": { backgroundColor: "#1f2937" },
            }}
            onClick={() => navigate("/new-quote")}
          >
            Generate Quotation
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 4,
        }}
      >
        <Box maxWidth="700px">
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Create Professional Quotations in Minutes 🚀
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
            Quotify helps you quickly generate, manage, and export quotations as
            PDFs with just a few clicks. No more spreadsheets — only sleek,
            professional documents.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#111827",
              color: "white",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontSize: "1.1rem",
              "&:hover": { backgroundColor: "#1f2937" },
            }}
            onClick={() => navigate("/dashboard")}
          >
            Start Now
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "white", px: { xs: 3, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <ReceiptLongIcon sx={{ fontSize: 40, color: "#111827", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Easy Quotation Management
                </Typography>
                <Typography sx={{ color: "text.secondary", mt: 1 }}>
                  Create, edit, and organize all your client quotations in one
                  place with an intuitive interface.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <PictureAsPdfIcon sx={{ fontSize: 40, color: "#111827", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Instant PDF Export
                </Typography>
                <Typography sx={{ color: "text.secondary", mt: 1 }}>
                  Generate sleek, professional PDF quotations with your company
                  branding in seconds.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <SpeedIcon sx={{ fontSize: 40, color: "#111827", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Fast & Reliable
                </Typography>
                <Typography sx={{ color: "text.secondary", mt: 1 }}>
                  Save time with quick input forms, auto-calculations, and
                  efficient workflows.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          borderTop: "1px solid #e5e7eb",
          color: "text.secondary",
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()} Quotify. All rights reserved.
      </Box>
    </Box>
  );
}
