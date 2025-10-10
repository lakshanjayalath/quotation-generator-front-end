import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeIcon from "@mui/icons-material/Home";

// Client Data Creator
function createData(clientId, name, email, contactNumber, createdDate) {
  return { clientId, name, email, contactNumber, createdDate };
}

// Sample Client Data
const rowsData = [
  createData(1, "Lakshan Perera", "lakshan.perera@example.com", "+94711234567", "2025-01-05"),
  createData(2, "Nimali Silva", "nimali.silva@example.com", "+94776543210", "2025-01-10"),
  createData(3, "Ruwani Jayasinghe", "ruwani.jaya@example.com", "+94713456789", "2025-01-15"),
  createData(4, "Sandun Fernando", "sandun.fernando@example.com", "+94772345678", "2025-01-20"),
  createData(5, "Kasun Abeysekera", "kasun.abey@example.com", "+94719876543", "2025-01-25"),
  createData(6, "Dilani Kariyawasam", "dilani.kari@example.com", "+94717788990", "2025-02-01"),
  createData(7, "Chathuri Weerasinghe", "chathuri.weera@example.com", "+94714567890", "2025-02-05"),
  createData(8, "Ishara Senanayake", "ishara.sena@example.com", "+94717654321", "2025-02-10"),
  createData(9, "Sajith Ranasinghe", "sajith.rana@example.com", "+94716789012", "2025-02-15"),
  createData(10, "Malshi Jayawardena", "malshi.jaya@example.com", "+94719812345", "2025-02-20"),
  createData(11, "Tharindu Wickramasinghe", "tharindu.wick@example.com", "+94714561234", "2025-02-25"),
  createData(12, "Hansani Gunasekara", "hansani.guna@example.com", "+94717671234", "2025-03-01"),
  createData(13, "Pasindu Madushanka", "pasindu.madu@example.com", "+94712234567", "2025-03-05"),
  createData(14, "Shehani Rodrigo", "shehani.rodrigo@example.com", "+94715556677", "2025-03-10"),
  createData(15, "Manoj Peris", "manoj.peris@example.com", "+94718887766", "2025-03-15"),
  createData(16, "Rashmi De Silva", "rashmi.desilva@example.com", "+94713334455", "2025-03-20"),
  createData(17, "Nadeesha Fernando", "nadeesha.fernando@example.com", "+94712223344", "2025-03-25"),
  createData(18, "Kavindi Rajapaksha", "kavindi.raja@example.com", "+94714445566", "2025-03-30"),
  createData(19, "Pradeep Jayalath", "pradeep.jaya@example.com", "+94716667788", "2025-04-04"),
  createData(20, "Thushara Perera", "thushara.perera@example.com", "+94719998877", "2025-04-09"),
  createData(21, "Dinithi Wijesinghe", "dinithi.wije@example.com", "+94715554433", "2025-04-14"),
  createData(22, "Isuru Karunaratne", "isuru.karu@example.com", "+94717773322", "2025-04-19"),
  createData(23, "Samantha Hettiarachchi", "samantha.hett@example.com", "+94716664455", "2025-04-24"),
  createData(24, "Amila Jayawardena", "amila.jaya@example.com", "+94718882211", "2025-04-29"),
  createData(25, "Pavithra De Alwis", "pavithra.dealwis@example.com", "+94714443322", "2025-05-04"),
  createData(26, "Rohan Senaratne", "rohan.sena@example.com", "+94717775544", "2025-05-09"),
  createData(27, "Sahan Perera", "sahan.perera@example.com", "+94716663322", "2025-05-14"),
  createData(28, "Menaka Silva", "menaka.silva@example.com", "+94719991122", "2025-05-19"),
  createData(29, "Thilini Rodrigo", "thilini.rodrigo@example.com", "+94714447766", "2025-05-24"),
  createData(30, "Ravindra Jayasinghe", "ravindra.jaya@example.com", "+94718884433", "2025-05-29"),
];

// Row Component
function ClientRow({ row, isSelected, handleClick, handleMenuOpen, anchorEl, menuRowId, handleMenuClose }) {
  return (
    <TableRow hover role="checkbox" selected={isSelected} aria-checked={isSelected}>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected}
          onClick={() => handleClick(row.clientId)}
          inputProps={{ "aria-labelledby": `client-${row.clientId}` }}
        />
      </TableCell>
      <TableCell id={`client-${row.clientId}`}>{row.name}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.contactNumber}</TableCell>
      <TableCell>{row.createdDate}</TableCell>
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
          onClick={(e) => handleMenuOpen(e, row.clientId)}
        >
          Action
        </Button>
        <Menu anchorEl={anchorEl} open={menuRowId === row.clientId} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default function ClientPage() {
  const [rows, setRows] = useState(rowsData);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  // Filter and Pagination
  const filteredRows = rows.filter(
    (row) => row.name.toLowerCase().includes(filter.toLowerCase()) || row.email.toLowerCase().includes(filter.toLowerCase())
  );
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Selection
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(paginatedRows.map((n) => n.clientId));
    } else {
      setSelected([]);
    }
  };
  const handleClick = (clientId) => {
    setSelected((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]));
  };
  const isSelected = (clientId) => selected.includes(clientId);

  // Menu
  const handleMenuOpen = (event, clientId) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(clientId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  // Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          onClick={() => navigate("/ClientPage")}
        >
          <HomeIcon fontSize="small" />
          <Typography variant="body1" sx={{ textDecoration: "underline", "&:hover": { color: "blue" } }}>
            / Clients
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField size="small" placeholder="Search Client" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <FormControl size="small">
            <Select defaultValue="active">
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ textTransform: "none", backgroundColor: "#f5f5f5", color: "black", "&:hover": { backgroundColor: "#e0e0e0" } }}
            onClick={() => navigate("/dashboard/new-client")}
          >
            New Client
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No clients available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <ClientRow
                    key={row.clientId}
                    row={row}
                    isSelected={isSelected(row.clientId)}
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

        {/* Pagination */}
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
