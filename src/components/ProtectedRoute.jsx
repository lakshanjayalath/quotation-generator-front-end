import React from 'react';
import { Navigate } from 'react-router-dom';

// Check if user is authenticated
const isAuthenticated = () => {
    return !!localStorage.getItem('authToken'); 
};

// Get user role from localStorage
const getUserRole = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            return userData.role?.toLowerCase() || 'user';
        } catch (e) {
            return 'user';
        }
    }
    return null;
};

// Standard protected route - just checks authentication
const ProtectedRoute = ({ element: Component, ...rest }) => {
    if (isAuthenticated()) {
        return <Component {...rest} />;
    }
    return <Navigate to="/login" replace />;
};

// Admin-only protected route - checks authentication AND admin role
export const AdminRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    
    const role = getUserRole();
    if (role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

export default ProtectedRoute;