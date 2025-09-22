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
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeIcon from '@mui/icons-material/Home';

function createData(id, item, description, price, qty) {
  return { id, item, description, price, qty };
}

const rowsData = [
  createData(1, "Wireless Mouse", "Ergonomic Bluetooth mouse", "2500 LKR", 12),
  createData(2, "Mechanical Keyboard", "RGB backlit keyboard", "12,500 LKR", 8),
  createData(3, "Laptop Stand", "Adjustable aluminum stand", "4500 LKR", 20),
  createData(4, "USB-C Hub", "Multi-port adapter", "3500 LKR", 15),
  createData(5, "External SSD", "1TB portable SSD", "28,000 LKR", 5),
  createData(6, "Gaming Headset", "Surround sound headphones", "18,000 LKR", 7),
  createData(7, "Smartwatch", "Fitness tracker with GPS", "32,000 LKR", 10),
  createData(8, "Webcam", "1080p HD camera", "7500 LKR", 6),
  createData(9, "Portable Speaker", "Bluetooth waterproof speaker", "14,000 LKR", 9),
  createData(10, "Power Bank", "20,000mAh fast charging", "6500 LKR", 25),
  createData(11, "Wireless Charger", "Fast Qi charger", "4800 LKR", 18),
  createData(12, "LED Monitor", "27-inch Full HD display", "55,000 LKR", 4),
  createData(13, "Graphics Tablet", "Digital drawing pad", "22,000 LKR", 6),
  createData(14, "Noise Cancelling Earbuds", "Wireless ANC earbuds", "19,500 LKR", 8),
  createData(15, "Portable Projector", "Mini home projector", "42,000 LKR", 3),
];

// Row Component
function ItemRow({
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
          inputProps={{ "aria-labelledby": `item-${row.id}` }}
        />
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
            backgroundColor: "primary.main",
            color: "white",
            textTransform: "none",
            "&:hover": { backgroundColor: "primary.dark" },
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
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default function ItemPage() {
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
            onClick={() => navigate("/new-item")}
          >
            New Item
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
                <TableCell>Item</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
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
