import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  MenuItem,
  Paper
} from "@mui/material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import HomeIcon from "@mui/icons-material/Home";
import { Breadcrumbs, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const CompanyDetails = () => {
  const [tabValue, setTabValue] = useState(0);

  const [companyData, setCompanyData] = useState({
    companyName: "",
    idNumber: "",
    vatNumber: "",
    website: "",
    email: "",
    companyPhone: "",
    companySize: "",
    industry: "",
    classification: "",
    street: "",
    aptSuite: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    country: "",
    logo: "",
    emailSignature: "",
    emailFooter: "",
    invoiceTerms: "",
    invoiceFooter: "",
    quoteTerms: "",
    quoteFooter: "",
    creditTerms: "",
    creditFooter: "",
    purchaseOrderTerms: "",
    purchaseOrderFooter: "",
    documents: [],
    customFields: [
      { label: "Company Field 1", type: "Single-line text", value: "" },
      { label: "Company Field 2", type: "Single-line text", value: "" },
      { label: "Company Field 3", type: "Single-line text", value: "" },
      { label: "Company Field 4", type: "Single-line text", value: "" }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (field) => (event) => {
    setCompanyData({ ...companyData, [field]: event.target.value });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCompanyData({ ...companyData, logo: URL.createObjectURL(file) });
    }
  };

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocs = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: `${Math.round(file.size / 1024)} KB`
    }));
    setCompanyData({ ...companyData, documents: [...companyData.documents, ...newDocs] });
  };

  const handleCustomFieldChange = (index, field) => (event) => {
    const newFields = [...companyData.customFields];
    newFields[index][field] = event.target.value;
    setCompanyData({ ...companyData, customFields: newFields });
  };

  return (
    <Box sx={{ p: 4 }}>

      <Breadcrumbs sx={{ mb: 3 }} separator="/">
              <Link
                component={RouterLink}
                underline="hover"
                color="inherit"
                to="/"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
                Home
              </Link>
              <Typography color="text.primary">Settings</Typography>
              <Typography color="text.primary">Company Details</Typography>
            </Breadcrumbs>

      {/* Content Card */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Company
        </Typography>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Details" />
          <Tab label="Address" />
          <Tab label="Logo" />
          <Tab label="Defaults" />
          <Tab label="Documents" />
          <Tab label="Custom Fields" />
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ mt: 4, maxWidth: 600 }}>
          {/* Details Tab */}
          {tabValue === 0 && (
            <Box sx={{ display: "grid", gap: 3 }}>
              <TextField
                label="Company Name"
                fullWidth
                value={companyData.companyName}
                onChange={handleChange("companyName")}
              />
              <TextField
                label="ID Number"
                fullWidth
                value={companyData.idNumber}
                onChange={handleChange("idNumber")}
              />
              <TextField
                label="VAT Number"
                fullWidth
                value={companyData.vatNumber}
                onChange={handleChange("vatNumber")}
              />
              <TextField
                label="Website"
                fullWidth
                value={companyData.website}
                onChange={handleChange("website")}
              />
              <TextField
                label="Email"
                fullWidth
                value={companyData.email}
                onChange={handleChange("email")}
              />
              <TextField
                label="Company Phone"
                fullWidth
                value={companyData.companyPhone}
                onChange={handleChange("companyPhone")}
              />
              <TextField
                select
                label="Company Size"
                fullWidth
                value={companyData.companySize}
                onChange={handleChange("companySize")}
              >
                <MenuItem value="1-3">1-3</MenuItem>
                <MenuItem value="4-10">4-10</MenuItem>
                <MenuItem value="11-50">11-50</MenuItem>
              </TextField>
              <TextField
                select
                label="Industry"
                fullWidth
                value={companyData.industry}
                onChange={handleChange("industry")}
              >
                <MenuItem value="Accounting & Legal">Accounting & Legal</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
              </TextField>
              <TextField
                label="Classification"
                fullWidth
                value={companyData.classification}
                onChange={handleChange("classification")}
              />
            </Box>
          )}

          {/* Address Tab */}
          {tabValue === 1 && (
            <Box sx={{ display: "grid", gap: 3 }}>
              <TextField
                label="Street"
                fullWidth
                value={companyData.street}
                onChange={handleChange("street")}
              />
              <TextField
                label="Apt/Suite"
                fullWidth
                value={companyData.aptSuite}
                onChange={handleChange("aptSuite")}
              />
              <TextField
                label="City"
                fullWidth
                value={companyData.city}
                onChange={handleChange("city")}
              />
              <TextField
                label="State"
                fullWidth
                value={companyData.state}
                onChange={handleChange("state")}
              />
              <TextField
                label="Postal Code"
                fullWidth
                value={companyData.postalCode}
                onChange={handleChange("postalCode")}
              />
              <TextField
                label="Phone"
                fullWidth
                value={companyData.phone}
                onChange={handleChange("phone")}
              />
              <TextField
                select
                label="Country"
                fullWidth
                value={companyData.country}
                onChange={handleChange("country")}
              >
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                <MenuItem value="India">India</MenuItem>
              </TextField>
            </Box>
          )}

          {/* Logo Tab */}
          {tabValue === 2 && (
            <Box sx={{ display: "grid", gap: 2 }}>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  color: "#888"
                }}
              >
                {companyData.logo ? (
                  <img
                    src={companyData.logo}
                    alt="Company Logo"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                ) : (
                  <Typography>Drop files here or click to upload</Typography>
                )}
              </Box>
              <Button variant="contained" component="label">
                Upload Your Company Logo
                <input type="file" hidden onChange={handleLogoUpload} />
              </Button>
              {companyData.logo && (
                <Button
                  variant="text"
                  color="error"
                  onClick={() => setCompanyData({ ...companyData, logo: "" })}
                >
                  Remove Logo
                </Button>
              )}
            </Box>
          )}

          {/* Defaults Tab */}
          {tabValue === 3 && (
            <Box sx={{ display: "grid", gap: 4 }}>
              {[
                { label: "Invoice Terms", field: "invoiceTerms" },
                { label: "Invoice Footer", field: "invoiceFooter" },
                { label: "Quote Terms", field: "quoteTerms" },
                { label: "Quote Footer", field: "quoteFooter" },
                { label: "Credit Terms", field: "creditTerms" },
                { label: "Credit Footer", field: "creditFooter" },
                { label: "Purchase Order Terms", field: "purchaseOrderTerms" },
                { label: "Purchase Order Footer", field: "purchaseOrderFooter" }
              ].map((item) => (
                <Box key={item.field}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {item.label}
                  </Typography>
                  <ReactQuill
                    theme="snow"
                    value={companyData[item.field]}
                    onChange={(value) =>
                      setCompanyData({ ...companyData, [item.field]: value })
                    }
                  />
                </Box>
              ))}
            </Box>
          )}

          {/* Documents Tab */}
          {tabValue === 4 && (
            <Box sx={{ display: "grid", gap: 3 }}>
              <Button variant="contained" component="label">
                Upload Documents
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleDocumentUpload}
                />
              </Button>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Uploaded Documents
                </Typography>
                <Box sx={{ border: "1px solid #ddd", borderRadius: 1 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr  1fr",
                      p: 2,
                      bgcolor: "#f9f9f9",
                      fontWeight: "bold"
                    }}
                  >
                    <Typography>Name</Typography>
                    <Typography>Date</Typography>
                    <Typography>Type</Typography>
                    <Typography>Size</Typography>
                  </Box>
                  {companyData.documents.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: "center", color: "#aaa" }}>
                      No records found
                    </Box>
                  ) : (
                    companyData.documents.map((doc, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          p: 2,
                          borderTop: "1px solid #eee"
                        }}
                      >
                        <Typography>{doc.name}</Typography>
                        <Typography>{doc.date}</Typography>
                        <Typography>{doc.type}</Typography>
                        <Typography>{doc.size}</Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* Custom Fields Tab */}
{tabValue === 5 && (
  <Box sx={{ display: "grid", gap: 3 }}>
    {companyData.customFields.map((field, index) => (
      <Box
        key={index}
        sx={{
          display: "grid",
          gridTemplateColumns: "100px 1fr 100px",
          alignItems: "center",
          gap: 2
        }}
      >
        {/* Field Label */}
        <Typography>{field.label}</Typography>

        
        {/* Type Selector */}
        <TextField
          select
          fullWidth
          value={field.type}
          onChange={handleCustomFieldChange(index, "type")}
        >
          <MenuItem value="Single-line text">Single-line text</MenuItem>
          <MenuItem value="Multi-line text">Multi-line text</MenuItem>
          <MenuItem value="Dropdown">Dropdown</MenuItem>
          <MenuItem value="Checkbox">Checkbox</MenuItem>
        </TextField>
      </Box>
    ))}
  </Box>
)}

        </Box>
      </Paper>
    </Box>
  );
};

export default CompanyDetails;
