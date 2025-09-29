import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// Sample data
const payments = [
  { id: 1, name: "John Doe", date: "2025-09-25", amount: "$120.00", status: "Completed" },
  { id: 2, name: "Jane Smith", date: "2025-09-24", amount: "$75.50", status: "Pending" },
  { id: 3, name: "Mike Johnson", date: "2025-09-23", amount: "$200.00", status: "Failed" },
  { id: 4, name: "Emily Brown", date: "2025-09-22", amount: "$50.00", status: "Completed" },
];

export default function RecentPayment() {
  return (
    <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        Recent Payments
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.name}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
