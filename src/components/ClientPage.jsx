import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeIcon from "@mui/icons-material/Home";
import { useClientRefresh } from "../context/ClientRefreshContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5264";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : null;
};

  const logClientActivity = async ({ actionType, description, recordId }) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      await fetch(`${API_BASE}/api/activitylogs`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          entityName: "Client",
          recordId,
          actionType,
          description,
        }),
      });
      console.log("✓ Activity logged:", actionType, description);
    } catch (err) {
      console.error("Failed to log client activity:", err);
    }
  };

// ✅ Row Component
function ClientRow({
  row,
  isSelected,
  handleClick,
  handleMenuOpen,
  anchorEl,
  menuRowId,
  handleMenuClose,
  handleEdit,
  handleDelete,
}) {
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
      <TableCell>{row.companyName}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.contactNumber}</TableCell>
      <TableCell>{new Date(row.createdDate).toLocaleString()}</TableCell>
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
          <MenuItem onClick={() => handleEdit(row.clientId)}>Edit</MenuItem>
          <MenuItem onClick={() => handleDelete(row.clientId)}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default function ClientPage() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { triggerClientRefresh } = useClientRefresh();

  // ✅ Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      if (!headers) throw new Error("Authentication failed. Please log in.");

      const response = await fetch(`${API_BASE}/api/clients`, { headers });
      if (!response.ok) throw new Error("Failed to fetch clients");

      const data = await response.json();
      setRows(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ✅ Filter and Pagination
  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(filter.toLowerCase()) ||
      row.email.toLowerCase().includes(filter.toLowerCase()) ||
      row.companyName.toLowerCase().includes(filter.toLowerCase())
  );
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ✅ Selection
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

  // ✅ Menu
  const handleMenuOpen = (event, clientId) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(clientId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  // ✅ Edit Client
  const handleEdit = (clientId) => {
    handleMenuClose();
    navigate(`/dashboard/clients/edit/${clientId}`);
  };

  // ✅ Delete Client
  const handleDelete = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const headers = getAuthHeaders();
        if (!headers) throw new Error("Authentication failed. Please log in.");

        const response = await fetch(`${API_BASE}/api/clients/${clientId}`, {
          method: "DELETE",
          headers,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete client (${response.status}): ${errorText}`);
        }

        // Remove client from state
        setRows((prevRows) => prevRows.filter((row) => row.clientId !== clientId));
        setSelected((prevSelected) => prevSelected.filter((id) => id !== clientId));
        
          // Log activity and refresh dashboard
          await logClientActivity({
            actionType: "Delete",
            description: `Deleted client ID: ${clientId}`,
            recordId: clientId,
          });
        triggerClientRefresh();
        handleMenuClose();
        alert("Client deleted successfully!");
      } catch (err) {
        console.error("Error deleting client:", err);
        alert("Failed to delete client. Please try again.");
      }
    } else {
      handleMenuClose();
    }
  };

  // ✅ Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* ✅ Header */}
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
          <TextField
            size="small"
            placeholder="Search Client"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <FormControl size="small">
            <Select defaultValue="active">
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
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
            onClick={() => navigate("/dashboard/new-client")} // ✅ Original navigation restored
          >
            New Client
          </Button>
        </Box>
      </Box>

      {/* ✅ Table */}
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
                <TableCell>Company Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: "red" }}>
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination */}
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
