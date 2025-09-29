// RecentActivity.jsx
import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

// Example data — replace with API or props as needed
const activities = [
  { id: 1, user: "John Doe", action: "added a new product", time: "2 mins ago" },
  { id: 2, user: "Jane Smith", action: "updated order #123", time: "10 mins ago" },
  { id: 3, user: "Alice Brown", action: "deleted a user", time: "30 mins ago" },
  { id: 4, user: "Bob Johnson", action: "processed a payment", time: "1 hour ago" },
  { id: 5, user: "Emma Wilson", action: "added a new category", time: "2 hours ago" },
];

export default function RecentActivity() {
  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: 300, // adjust height as needed
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
      <List>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={`${activity.user} ${activity.action}`}
                secondary={activity.time}
              />
            </ListItem>
            {index < activities.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
