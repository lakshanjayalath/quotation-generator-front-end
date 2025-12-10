import React, { useState, useEffect } from "react";
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    CircularProgress
} from "@mui/material";

// Ensure this URL is correct
const API_URL = "http://localhost:5264/api/Dashboard/recent-activities"; 

// Helper function to format the C# DateTime string into a user-friendly format
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
    } catch (e) {
        return timestamp; 
    }
};

export default function RecentActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivityData = async () => {
            setLoading(true);
            setError(null);
            
            const authToken = localStorage.getItem('authToken'); 

            if (!authToken) {
                setError("Authentication failed. Please log in.");
                setLoading(false);
                return; 
            }

            try {
                const response = await fetch(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`, 
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    throw new Error("Unauthorized. Your session may have expired.");
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setActivities(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching recent activity:", err);
                const errorMessage = err.message.includes("Unauthorized") 
                    ? "Session expired. Please log in again."
                    : "Failed to load activity log. Check API URL and server status.";
                setError(errorMessage);
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActivityData();
    }, []); 

    const renderContent = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                    <CircularProgress size={24} />
                    <Typography ml={2} color="text.secondary">Loading activity...</Typography>
                </Box>
            );
        }

        if (error) {
            return (
                <Typography color="error" align="center" py={4}>
                    {error}
                </Typography>
            );
        }
        
        if (activities.length === 0) {
            return (
                <Typography color="text.secondary" align="center" py={4}>
                    No recent activity recorded.
                </Typography>
            );
        }

        return (
            <List dense>
                {activities.map((activity, index) => (
                    <React.Fragment key={activity.id || index}> 
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                // 🟢 FIX: Simplify primary prop to a single Typography wrapper
                                // The bolding will not work here, but it eliminates the JSX syntax error.
                                primary={
                                    <Typography component="span" variant="body2" color="text.primary">
                                        {`${activity.performedBy || 'System'} ${activity.description}`} 
                                    </Typography>
                                }
                                secondary={formatTimestamp(activity.timestamp)} 
                            />
                        </ListItem>
                        {index < activities.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
        );
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: 415,
                overflowY: "auto",
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
            }}
        >
            <Typography variant="h6" gutterBottom>
                Recent Activity
            </Typography>
            {renderContent()}
        </Box>
    );
}