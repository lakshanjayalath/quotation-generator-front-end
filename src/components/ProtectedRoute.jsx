import React from 'react';
import { Navigate } from 'react-router-dom';

// NOTE: You must replace 'isAuthenticated' with your actual authentication logic (e.g., checking a token in localStorage or context state).
const isAuthenticated = () => {
    // Basic check: See if a user token exists
    return !!localStorage.getItem('authToken'); 
};

const ProtectedRoute = ({ element: Component, ...rest }) => {
    // If the user is authenticated, render the Dashboard component
    if (isAuthenticated()) {
        return <Component {...rest} />;
    }
    
    // Otherwise, redirect them to the login page
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;