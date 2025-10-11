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
    Paper,
} from "@mui/material";
import { CheckCircle, Speed, Security, Devices } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {

    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: "#F9FAFB", minHeight: "100vh" }}>
            {/* 🌟 Navbar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    color: "#386641",
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        QuoteGenius
                    </Typography>
                    <Box>
                        {["Features", "How It Works", "Pricing", "Contact"].map((item) => (
                            <Button key={item} color="inherit" sx={{ mx: 1, fontWeight: 500 }}>
                                {item}
                            </Button>
                        ))}
                        <Button
                            variant="contained"
                            sx={{
                                ml: 2,
                                bgcolor: "#4a7c59",
                                px: 3,
                                borderRadius: 2,
                                "&:hover": { bgcolor: "#386641" },
                            }}
                            onClick={() => navigate("/register")}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* 🌅 Hero Section */}
            <Container
                maxWidth="lg"
                sx={{
                    pt: 16,
                    pb: 10,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" }, // column on mobile, row on desktop
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 4,
                    height: "100vh"
                }}
            >
                {/* Left Column: Text + Buttons */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                            background: "linear-gradient(90deg, #4a7c59, #386641)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Create Professional Quotes Effortlessly
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: 700 }}
                    >
                        Speed up your sales process with beautiful, accurate quotes that impress your clients —
                        in just minutes.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: { xs: "center", md: "flex-start" },
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.2,
                                borderRadius: 3,
                                fontWeight: "bold",
                                bgcolor: "#4a7c59",
                                "&:hover": { bgcolor: "#386641" },
                            }}
                        >
                            Start Free Trial
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.2,
                                borderRadius: 3,
                                fontWeight: "bold",
                                borderColor: "#4a7c59",
                                color: "#4a7c59",
                                "&:hover": { borderColor: "#386641", color: "#386641" },
                            }}
                            onClick={() => navigate("/dashboard")}
                        >
                            Watch Demo
                        </Button>
                    </Box>
                </Box>

                {/* Right Column: Image */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        mt: { xs: 6, md: 0 },
                    }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            maxWidth: 800,
                            width: "100%",
                        }}
                    >
                        <img
                            src="../public/hero-image.jpg"
                            alt="QuoteGenius demo"
                            style={{ width: "100%", display: "block" }}
                        />
                    </Paper>
                </Box>
            </Container>
            {/* ⚡ Features Section */}
            <Container sx={{ py: 12 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 10 }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ letterSpacing: 0.5 }}
                    >
                        Powerful Features Built for Speed
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ maxWidth: 600, mx: "auto", fontSize: { xs: 15, md: 16 } }}
                    >
                        Everything you need to create, send, and track professional quotes — effortlessly.
                    </Typography>
                </Box>

                {/* Features Grid */}
                <Grid
                    container
                    spacing={{ xs: 4, md: 6 }}
                    justifyContent="center" // ✅ Centers the cards horizontally
                    alignItems="stretch" // ✅ Makes all cards equal height
                >
                    {[
                        {
                            icon: <Speed fontSize="large" />,
                            title: "Lightning Fast",
                            desc: "Generate quotes in minutes with smart automation.",
                        },
                        // {
                        //     icon: <CheckCircle fontSize="large" />,
                        //     title: "Smart Templates",
                        //     desc: "Pick templates or design your own in seconds.",
                        // },
                        {
                            icon: <Security fontSize="large" />,
                            title: "Enterprise Security",
                            desc: "Your data is encrypted and securely stored.",
                        },
                        {
                            icon: <Devices fontSize="large" />,
                            title: "Cross-Platform",
                            desc: "Access anywhere — desktop, tablet, or mobile.",
                        },
                    ].map((feature, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i} sx={{ display: "flex", justifyContent: "center" }}>
                            <Card
                                sx={{
                                    p: 4,
                                    borderRadius: 3,
                                    textAlign: "center",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                                    transition: "all 0.4s ease",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    bgcolor: "background.paper",
                                    cursor: "pointer",
                                    maxWidth: 300, // ✅ Keeps consistent card width when centered
                                    "&:hover": {
                                        transform: "translateY(-10px)",
                                        background: "linear-gradient(135deg, #4a7c59, #386641)",
                                        color: "white",
                                        boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
                                        "& .MuiTypography-root": { color: "white" },
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: "#4a7c59",
                                        width: 64,
                                        height: 64,
                                        mb: 3,
                                        fontSize: 32,
                                        transition: "all 0.4s ease",
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                        },
                                    }}
                                >
                                    {feature.icon}
                                </Avatar>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{ mb: 1.5, fontSize: { xs: 16, md: 18 } }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: 14, md: 15 } }}
                                >
                                    {feature.desc}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* 🚀 CTA Section */}
            <Box
                sx={{
                    py: 8,
                    textAlign: "center",
                    background: "linear-gradient(90deg, #4a7c59, #386641)",
                    color: "white",
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Join 2,000+ businesses already using QuoteGenius
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        mt: 2,
                        bgcolor: "white",
                        color: "#4a7c59",
                        fontWeight: "bold",
                        px: 4,
                        py: 1.2,
                        borderRadius: 3,
                        "&:hover": { bgcolor: "#F3F4F6" },
                    }}
                >
                    Start Free Trial
                </Button>
            </Box>

        </Box>
    );
};