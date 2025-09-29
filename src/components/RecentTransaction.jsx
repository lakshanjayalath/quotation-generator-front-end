import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Box,
} from "@mui/material";

const dummyTransactions = [
  { id: 1, date: "2025-09-20", description: "Payment Received", amount: 1200, status: "Completed" },
  { id: 2, date: "2025-09-21", description: "Invoice #1045", amount: -450, status: "Pending" },
  { id: 3, date: "2025-09-22", description: "Refund Issued", amount: -200, status: "Completed" },
];

export default function RecentTransaction() {
  return (
    <Card className="shadow-lg rounded-2xl">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <List>
          {dummyTransactions.map((tx, index) => (
            <React.Fragment key={tx.id}>
              <ListItem>
                <ListItemText
                  primary={`${tx.description}`}
                  secondary={`${tx.date}`}
                />
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography
                    variant="body1"
                    color={tx.amount > 0 ? "success.main" : "error.main"}
                  >
                    {tx.amount > 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
                  </Typography>
                  <Chip
                    label={tx.status}
                    size="small"
                    color={tx.status === "Completed" ? "success" : "warning"}
                  />
                </Box>
              </ListItem>
              {index < dummyTransactions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
