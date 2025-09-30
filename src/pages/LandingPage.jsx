import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { CheckCircle, Speed, Security, Devices } from "@mui/icons-material";

const LandingPage = () => {
  return (
    <Box>
      {/* ✅ Navbar */}
      <AppBar position="static" color="primary" sx={{ background: "#1E40AF" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            QuoteGenius
          </Typography>
          <Box>
            <Button color="inherit">Features</Button>
            <Button color="inherit">How It Works</Button>
            <Button color="inherit">Pricing</Button>
            <Button color="inherit">Contact</Button>
            <Button
              variant="contained"
              sx={{ ml: 2, bgcolor: "#2563EB" }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Hero Section */}
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Create Professional Quotes in Minutes
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Streamline your quotation process with our intuitive, powerful
          generation tool designed for modern businesses.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="contained" size="large">
            Start Free Trial
          </Button>
          <Button variant="outlined" size="large">
            Watch Demo
          </Button>
        </Box>
        {/* Hero Image */}
        <Box sx={{ mt: 5 }}>
          <img
            src="https://via.placeholder.com/600x300"
            alt="Hero Demo"
            style={{ borderRadius: 12, maxWidth: "100%" }}
          />
        </Box>
      </Container>

      {/* ✅ Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          Everything You Need for Efficient Quote Generation
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            { icon: <Speed />, title: "Lightning Fast", desc: "Create quotes in minutes with our fast workflow." },
            { icon: <CheckCircle />, title: "Smart Templates", desc: "Choose from industry templates or customize your own." },
            { icon: <Security />, title: "Enterprise Security", desc: "Secure data with advanced encryption." },
            { icon: <Devices />, title: "Cross-Platform", desc: "Access from desktop, tablet, or mobile." },
          ].map((feature, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <CardContent>
                  <Avatar sx={{ bgcolor: "#2563EB", mx: "auto", mb: 2 }}>
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ How It Works Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          Create Quotes in Four Simple Steps
        </Typography>
        <Grid container spacing={6} sx={{ mt: 3 }}>
          {[
            { step: "1", title: "Select a Template", img: "https://via.placeholder.com/400x250" },
            { step: "2", title: "Customize Your Quote", img: "https://via.placeholder.com/400x250" },
            { step: "3", title: "Review and Approve", img: "https://via.placeholder.com/400x250" },
            { step: "4", title: "Send and Track", img: "https://via.placeholder.com/400x250" },
          ].map((s, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={s.img}
                  alt={s.title}
                  style={{ borderRadius: 12, maxWidth: "100%" }}
                />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                  {s.step}. {s.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ Testimonials */}
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Trusted by Businesses Everywhere
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            { name: "Sarah Johnson", text: "QuoteGenius transformed our sales process!" },
            { name: "Michael Chen", text: "Super fast, easy to use, and professional." },
            { name: "Emily Rodriguez", text: "Clients love how professional our quotes look." },
          ].map((t, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ borderRadius: 3, p: 2 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    "{t.text}"
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    – {t.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ CTA Banner */}
      <Box sx={{ py: 6, bgcolor: "#2563EB", color: "white", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">
          Join 2,000+ businesses that trust QuoteGenius
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, bgcolor: "white", color: "#2563EB", fontWeight: "bold" }}
        >
          Start Free Trial
        </Button>
      </Box>

      {/* ✅ Footer */}
      <Box sx={{ py: 4, bgcolor: "#111827", color: "white", textAlign: "center" }}>
        <Typography variant="body2">
          © 2025 QuoteGenius. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
