import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  Typography,
  TextField,
  FormControl,
  Select,
  TablePagination,
  Chip,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeIcon from "@mui/icons-material/Home";

// Row data factory
function createData(id, status, number, client, amount, netAmount, date, validUntil) {
  return { id, status, number, client, amount, netAmount, date, validUntil };
}

// Sample rows
const rowsData = [
  createData(1, "Sent", "0001", "Lakshan Perera", 2508.58, 2001.05, "18/Aug/2025", "28/Aug/2025"),
  createData(2, "Sent", "0002", "Nimali Silva", 3370.64, 2890.0, "18/Aug/2025", "28/Aug/2025"),
  createData(3, "Sent", "0003", "Ruwan Jayasinghe", 337.07, 250.58, "18/Aug/2025", "28/Aug/2025"),
  createData(4, "Expired", "0004", "Sanduni Fernando", 12508.72, 10200.0, "18/Aug/2025", "28/Aug/2025"),
  createData(5, "Sent", "0005", "Kasun Abeysekera", 2508.58, 2508.58, "18/Aug/2025", "28/Aug/2025"),
  createData(6, "Sent", "0006", "Dilani Kariyawasam", 5500.21, 4420.0, "18/Aug/2025", "28/Aug/2025"),
  createData(7, "Sent", "0007", "Chathura Weerasingha", 4212.23, 4000.0, "18/Aug/2025", "28/Aug/2025"),
  createData(8, "Sent", "0008", "Ishara Senanayake", 2508.0, 2000.0, "18/Aug/2025", "28/Aug/2025"),
  createData(8, "Expired", "0009", "Sajith Ranasinghe", 2508.0, 2000.0, "18/Aug/2025", "28/Aug/2025"),
];

// Status Chip Component
function StatusChip({ status }) {
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: status === "Expired" ? "#DEA3A4" : "#CADF9A",
        color: status === "Expired" ? "#555555" : "#555555",
        fontWeight: 500,
      }}
    />
  );
}

// Row Component
function QuotationRow({
  row,
  isSelected,
  handleClick,
  handleMenuOpen,
  anchorEl,
  menuRowId,
  handleMenuClose,
}) {
  return (
    <TableRow hover role="checkbox" selected={isSelected} aria-checked={isSelected}>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected}
          onClick={() => handleClick(row.id)}
        />
      </TableCell>
      <TableCell>
        <StatusChip status={row.status} />
      </TableCell>
      <TableCell>{row.number}</TableCell>
      <TableCell>{row.client}</TableCell>
      <TableCell>{row.amount.toLocaleString()}</TableCell>
      <TableCell>{row.netAmount.toLocaleString()}</TableCell>
      <TableCell>{row.date}</TableCell>
      <TableCell>{row.validUntil}</TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          endIcon={<ArrowDropDownIcon />}
          sx={{
            backgroundColor: "#000000",
            color: "white",
            textTransform: "none",
            "&:hover": { backgroundColor: "#333333" },
          }}
          onClick={(e) => handleMenuOpen(e, row.id)}
        >
          Actions
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={menuRowId === row.id}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>View</MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default function QuotationList() {
  const [rows, setRows] = React.useState(rowsData);
  const [selected, setSelected] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuRowId, setMenuRowId] = React.useState(null);
  const [filter, setFilter] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();

  // Filter Logic
  const filteredRows = rows.filter(
    (row) =>
      row.client.toLowerCase().includes(filter.toLowerCase()) ||
      row.number.toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination Logic
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Selection Handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((s) => s !== id);
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Menu Handlers
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HomeIcon fontSize="small" />
          <Typography variant="body1">/ Quotations</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <FormControl size="small">
            <Select defaultValue="all">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="sent">Sent</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#f5f5f5",
              color: "black",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
            onClick={() => navigate("/new-quote")}
          >
            New Quotation
          </Button>
        </Box>
      </Box>

      {/* Table Section */}
      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < paginatedRows.length
                    }
                    checked={
                      paginatedRows.length > 0 &&
                      selected.length === paginatedRows.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Net Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No quotations available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <QuotationRow
                    key={row.id}
                    row={row}
                    isSelected={isSelected(row.id)}
                    handleClick={handleClick}
                    handleMenuOpen={handleMenuOpen}
                    anchorEl={anchorEl}
                    menuRowId={menuRowId}
                    handleMenuClose={handleMenuClose}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Paper>
    </Box>
  );
}
