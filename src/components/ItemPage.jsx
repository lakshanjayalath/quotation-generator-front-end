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
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeIcon from '@mui/icons-material/Home';
import axios from "axios";

// Row Component
function ItemRow({
  row,
  isSelected,
  handleClick,
  handleMenuOpen,
  anchorEl,
  menuRowId,
  handleMenuClose,
  onEdit,
  onDelete,
}) {
  return (
    <TableRow hover role="checkbox" selected={isSelected} aria-checked={isSelected}>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected}
          onClick={() => handleClick(row.id)}
          inputProps={{ "aria-labelledby": `item-${row.id}` }}
        />
      </TableCell>
      <TableCell>
        <Avatar
          src={row.imageUrl}
          alt={row.item}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        >
          {!row.imageUrl && row.item?.charAt(0).toUpperCase()}
        </Avatar>
      </TableCell>
      <TableCell id={`item-${row.id}`}>{row.item}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.price}</TableCell>
      <TableCell>{row.qty}</TableCell>
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
          Action
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={menuRowId === row.id}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleMenuClose(); onEdit(row); }}>Edit</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onDelete(row); }} sx={{ color: 'error.main' }}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default function ItemPage() {
  const [rows, setRows] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuRowId, setMenuRowId] = React.useState(null);
  const [filter, setFilter] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  // Fetch items from API
  const fetchItems = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5264/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      // Map the data to ensure consistent field names
      const mappedData = data.map(item => ({
        ...item,
        imageUrl: item.imageUrl || item.image_url || item.ImageUrl || "",
      }));
      setRows(mappedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Edit handler - navigate to edit page with item data
  const handleEdit = (item) => {
    navigate(`/dashboard/edit-item/${item.id}`, { state: { item } });
  };

  // Delete handlers
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5264/api/items/${itemToDelete.id}`);
      setSnackbar({ open: true, message: "Item deleted successfully!", severity: "success" });
      // Refresh the items list
      fetchItems();
      // Clear selection if deleted item was selected
      setSelected(prev => prev.filter(id => id !== itemToDelete.id));
    } catch (err) {
      console.error("Error deleting item:", err);
      setSnackbar({ open: true, message: "Failed to delete item. Please try again.", severity: "error" });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Filter Logic
  const filteredRows = rows.filter(
    (row) =>
      row.item.toLowerCase().includes(filter.toLowerCase()) ||
      row.description.toLowerCase().includes(filter.toLowerCase())
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
          <Typography variant="body1">/ Items</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Filter"
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
            onClick={() => navigate("/dashboard/new-item")}
          >
            New Item
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#f5f5f5",
              color: "black",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
            onClick={() => navigate("/dashboard/new-quote")}
          >
            Generate Quotation
          </Button>
        </Box>
      </Box>

      {/* Table Section */}
      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
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
                <TableCell>Image</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Qty</TableCell>
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
                    No items available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <ItemRow
                    key={row.id}
                    row={row}
                    isSelected={isSelected(row.id)}
                    handleClick={handleClick}
                    handleMenuOpen={handleMenuOpen}
                    anchorEl={anchorEl}
                    menuRowId={menuRowId}
                    handleMenuClose={handleMenuClose}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the item "{itemToDelete?.item}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
