import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useClientRefresh } from "../context/ClientRefreshContext";
import { useQuotationRefresh } from "../context/QuotationRefreshContext";

const API_URL = "http://localhost:5264/api/Dashboard/recent-activities";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function RecentActivity() {
  const { clientRefreshKey } = useClientRefresh();
  const { quotationRefreshKey } = useQuotationRefresh();
  const { isAdmin } = useAuth();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status} - ${text}`);
        }

        const data = await response.json();
        setActivities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(`Failed to load recent activity: ${err.message || "Unknown error"}`);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [clientRefreshKey, quotationRefreshKey]);

  return (
    <Box sx={{ width: "100%", height: 415, overflowY: "auto", backgroundColor: "#fff", borderRadius: 2, boxShadow: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>

      {loading && <Box display="flex" justifyContent="center" py={4}><CircularProgress size={24} /><Typography ml={2}>Loading activity...</Typography></Box>}

      {error && <Typography color="error" align="center" py={4}>{error}</Typography>}

      {!loading && !error && activities.length === 0 && <Typography color="text.secondary" align="center" py={4}>No recent activity recorded.</Typography>}

      {!loading && !error && activities.length > 0 && (
        <List dense>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id ?? index}>
              <ListItem>
                <ListItemText
                  primary={<Typography variant="body2"><strong>{activity.performedBy ?? "System"}:</strong> {activity.description}</Typography>}
                  secondary={formatTimestamp(activity.timestamp)}
                />
              </ListItem>
              {index < activities.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default RecentActivity;
