import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterForm";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute"; // 👈 Import the guard

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Products page - public */}
        <Route path="/products" element={<ProductsPage />} />

        {/* Authentication routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard routes - PROTECTED */}
        <Route 
          path="/dashboard/*" 
          element={<ProtectedRoute element={Dashboard} />} // 👈 Use the ProtectedRoute
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}