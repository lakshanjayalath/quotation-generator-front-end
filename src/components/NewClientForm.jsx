import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Container,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// 🎯 IMPORT THE REFRESH HOOK
import { useClientRefresh } from "../context/ClientRefreshContext"; // Ensure the path is correct

export default function NewClientForm({ initialData = null, onSave }) {
  const navigate = useNavigate();
  const { id } = useParams();
  // 🎯 USE THE REFRESH HOOK
  const { triggerClientRefresh } = useClientRefresh();
  
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(
    initialData || {
      id: "", // 🎯 Auto-generated Client ID from backend
      clientName: "",
      clientIdNumber: "",
      clientContactNumber: "",
      clientAddress: "",
      clientEmail: "",
      name: "",
      number: "",
      group: "",
      assignedUser: "",
      idNumber: "",
      vatNumber: "",
      website: "",
      phone: "",
      routingId: "",
      validVat: false,
      taxExempt: false,
      classification: "",
      contacts: [{ firstName: "", lastName: "", email: "", phone: "", addToInvoices: false }],
      billingStreet: "",
      billingSuite: "",
      billingCity: "",
      billingState: "",
      billingPostalCode: "",
      billingCountry: "",
      shippingStreet: "",
      shippingSuite: "",
      shippingCity: "",
      shippingState: "",
      shippingPostalCode: "",
      shippingCountry: "",
    }
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [nextClientIdLoading, setNextClientIdLoading] = useState(false);
  const [nextClientIdError, setNextClientIdError] = useState(false);

  // 🎯 Fetch the next Client ID from backend when creating a new client
  useEffect(() => {
    if (!id) {
      const fetchNextClientId = async () => {
        try {
          setNextClientIdLoading(true);
          setNextClientIdError(false);
          
          // Call the backend endpoint to get the next Client ID
          const response = await axios.get("http://localhost:5264/api/clients/next-id");
          const nextId = response.data.nextId || response.data.id;
          
          // Update formData with the fetched Client ID
          setFormData(prevData => ({
            ...prevData,
            id: nextId
          }));
          
          console.log("✓ Next Client ID fetched:", nextId);
        } catch (error) {
          console.error("Error fetching next Client ID:", error);
          setNextClientIdError(true);
        } finally {
          setNextClientIdLoading(false);
        }
      };
      
      fetchNextClientId();
    }
  }, []);

  // Fetch client data if editing
  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5264/api/clients/${id}`);
          console.log("Fetched client data:", response.data);

          // Ensure contacts array exists
          const clientData = {
            ...response.data,
            contacts: response.data.contacts || [{ firstName: "", lastName: "", email: "", phone: "", addToInvoices: false }]
          };

          setFormData(clientData);
        } catch (error) {
          console.error("Error fetching client:", error);
          console.error("Error details:", error.response?.data || error.message);

          if (error.response?.status === 500) {
            alert("Server error: Please check your backend API and database connection.");
          } else if (error.response?.status === 404) {
            alert("Client not found. It may have been deleted.");
            navigate("/dashboard/clients");
          } else {
            alert(`Failed to load client data: ${error.response?.statusText || error.message}`);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchClient();
    }
  }, [id, navigate]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.contacts];
    newContacts[index][field] = value;
    setFormData({ ...formData, contacts: newContacts });
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [
        ...formData.contacts,
        { firstName: "", lastName: "", email: "", phone: "", addToInvoices: false },
      ],
    });
  };

  const copyBillingToShipping = () => {
    setFormData({
      ...formData,
      shippingStreet: formData.billingStreet,
      shippingSuite: formData.billingSuite,
      shippingCity: formData.billingCity,
      shippingState: formData.billingState,
      shippingPostalCode: formData.billingPostalCode,
      shippingCountry: formData.billingCountry,
    });
  };

  const handleSave = async () => {
    try {
      // 🎯 IMPORTANT: For new clients, explicitly exclude any ID field from payload
      // Only the backend/database generates the Client ID
      const payload = id ? formData : {
        clientName: formData.clientName,
        clientIdNumber: formData.clientIdNumber,
        clientContactNumber: formData.clientContactNumber,
        clientAddress: formData.clientAddress,
        clientEmail: formData.clientEmail,
        name: formData.name,
        number: formData.number,
        group: formData.group,
        assignedUser: formData.assignedUser,
        idNumber: formData.idNumber,
        vatNumber: formData.vatNumber,
        website: formData.website,
        phone: formData.phone,
        routingId: formData.routingId,
        validVat: formData.validVat,
        taxExempt: formData.taxExempt,
        classification: formData.classification,
        contacts: formData.contacts.map(c => ({
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          addToInvoices: c.addToInvoices
        })),
        billingStreet: formData.billingStreet,
        billingSuite: formData.billingSuite,
        billingCity: formData.billingCity,
        billingState: formData.billingState,
        billingPostalCode: formData.billingPostalCode,
        billingCountry: formData.billingCountry,
        shippingStreet: formData.shippingStreet,
        shippingSuite: formData.shippingSuite,
        shippingCity: formData.shippingCity,
        shippingState: formData.shippingState,
        shippingPostalCode: formData.shippingPostalCode,
        shippingCountry: formData.shippingCountry,
      };

      if (id) {
        // Update existing client
        await axios.put(`http://localhost:5264/api/clients/${id}`, payload);
      } else {
        // 🎯 Create new client and capture the response with generated ID
        const response = await axios.post("http://localhost:5264/api/clients", payload);
        
        // 🎯 Extract the auto-generated Client ID from the backend response
        const generatedClientId = response.data.id;
        
        // 🎯 Update formData with the returned ID for future operations
        setFormData(prevData => ({
          ...prevData,
          id: generatedClientId
        }));
        
        console.log("✓ Client created successfully with ID:", generatedClientId);
        
        // 🎯 CRITICAL FIX: Trigger the dashboard refresh after successful creation
        triggerClientRefresh();
      }
      
      setShowSuccess(true);
      if (onSave) onSave(formData);

      // Reset form only if it's a new client, not editing
      if (!id && !initialData) {
        setFormData({
          id: "", // Reset ID, will be fetched again on next page load
          clientName: "",
          clientIdNumber: "",
          clientContactNumber: "",
          clientAddress: "",
          clientEmail: "",
          name: "",
          number: "",
          group: "",
          assignedUser: "",
          idNumber: "",
          vatNumber: "",
          website: "",
          phone: "",
          routingId: "",
          validVat: false,
          taxExempt: false,
          classification: "",
          contacts: [{ firstName: "", lastName: "", email: "", phone: "", addToInvoices: false }],
          billingStreet: "",
          billingSuite: "",
          billingCity: "",
          billingState: "",
          billingPostalCode: "",
          billingCountry: "",
          shippingStreet: "",
          shippingSuite: "",
          shippingCity: "",
          shippingState: "",
          shippingPostalCode: "",
          shippingCountry: "",
        });
      }

      // Navigate back to clients page after successful save
      setTimeout(() => {
        navigate("/dashboard/clients");
      }, 1500);
    } catch (error) {
      console.error("Error saving client:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message;
      alert(`Failed to save client: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Common style for focused color
  const textFieldStyle = {
    "& label.Mui-focused": {
      color: "#BC4749",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#BC4749",
      },
    },
  };

  // Switch active color style
  const switchStyle = {
    "& .Mui-checked": {
      color: "#4a7c59",
    },
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#4a7c59",
    },
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
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

        <Link component={RouterLink} underline="hover" color="inherit" to="/ClientPage">
          Client
        </Link>

        <Typography color="text.primary">
          {id || initialData ? "Edit Client" : "New Client"}
        </Typography>
      </Breadcrumbs>

      {/* Main Form */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
        >
          <Typography variant="h5" fontWeight={500}>
            {id || initialData ? "Edit Client" : "New Client"}
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ mr: 2, bgcolor: "#BC4749", color: "#ffffff", "&:hover": { bgcolor: "#a43a3f" } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ bgcolor: "#4a7c59", "&:hover": { bgcolor: "#386641" } }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {/* Auto-generated Client ID */}
        <Box sx={{ mb: 4, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <TextField
            label="Client ID (Auto-generated)"
            value={nextClientIdLoading ? "Loading..." : nextClientIdError ? "Error loading ID" : formData.id}
            disabled
            fullWidth
            sx={{
              ...textFieldStyle,
              "& .MuiOutlinedInput-root.Mui-disabled": {
                backgroundColor: "#ffffff",
              },
            }}
            helperText="This ID is auto-generated by the system. Not editable."
          />
        </Box>

        {/* Client Details */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Client Details
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 4 }}>
          <TextField label="Client Name" value={formData.clientName} onChange={handleChange("clientName")} fullWidth sx={textFieldStyle} />
          <TextField label="Client ID Number" value={formData.clientIdNumber} onChange={handleChange("clientIdNumber")} fullWidth sx={textFieldStyle} />
          <TextField label="Client Contact Number" value={formData.clientContactNumber} onChange={handleChange("clientContactNumber")} fullWidth sx={textFieldStyle} />
          <TextField label="Client Address" value={formData.clientAddress} onChange={handleChange("clientAddress")} fullWidth sx={textFieldStyle} />
          <TextField label="Client Email" value={formData.clientEmail} onChange={handleChange("clientEmail")} fullWidth sx={textFieldStyle} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Company Details */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Company Details
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 4 }}>
          <TextField label="Name" value={formData.name} onChange={handleChange("name")} fullWidth sx={textFieldStyle} />
          <TextField label="Number" value={formData.number} onChange={handleChange("number")} fullWidth sx={textFieldStyle} />
          <TextField select label="Group" value={formData.group} onChange={handleChange("group")} fullWidth sx={textFieldStyle}>
            <MenuItem value="">Select Industry</MenuItem>
            <MenuItem value="Information Technology (IT)">Information Technology (IT)</MenuItem>
            <MenuItem value="Software Development">Software Development</MenuItem>
            <MenuItem value="Telecommunications">Telecommunications</MenuItem>
            <MenuItem value="Finance & Banking">Finance & Banking</MenuItem>
            <MenuItem value="Insurance">Insurance</MenuItem>
            <MenuItem value="Accounting / Auditing">Accounting / Auditing</MenuItem>
            <MenuItem value="Healthcare / Medical">Healthcare / Medical</MenuItem>
            <MenuItem value="Pharmaceuticals">Pharmaceuticals</MenuItem>
            <MenuItem value="Education / Training">Education / Training</MenuItem>
            <MenuItem value="Manufacturing">Manufacturing</MenuItem>
            <MenuItem value="Construction">Construction</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Real Estate">Real Estate</MenuItem>
            <MenuItem value="Architecture">Architecture</MenuItem>
            <MenuItem value="Retail">Retail</MenuItem>
            <MenuItem value="Wholesale / Distribution">Wholesale / Distribution</MenuItem>
            <MenuItem value="E-commerce">E-commerce</MenuItem>
            <MenuItem value="Logistics / Transportation">Logistics / Transportation</MenuItem>
            <MenuItem value="Import / Export">Import / Export</MenuItem>
            <MenuItem value="Hospitality (Hotel / Restaurant)">Hospitality (Hotel / Restaurant)</MenuItem>
            <MenuItem value="Travel & Tourism">Travel & Tourism</MenuItem>
            <MenuItem value="Media & Advertising">Media & Advertising</MenuItem>
            <MenuItem value="Marketing / Digital Marketing">Marketing / Digital Marketing</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
            <MenuItem value="Legal Services">Legal Services</MenuItem>
            <MenuItem value="Consulting">Consulting</MenuItem>
            <MenuItem value="Human Resources">Human Resources</MenuItem>
            <MenuItem value="Security Services">Security Services</MenuItem>
            <MenuItem value="Agriculture">Agriculture</MenuItem>
            <MenuItem value="Food & Beverage">Food & Beverage</MenuItem>
            <MenuItem value="Energy / Utilities">Energy / Utilities</MenuItem>
            <MenuItem value="Automotive">Automotive</MenuItem>
            <MenuItem value="NGO / Non-Profit">NGO / Non-Profit</MenuItem>
            <MenuItem value="Government / Public Sector">Government / Public Sector</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField select label="Assigned User" value={formData.assignedUser} onChange={handleChange("assignedUser")} fullWidth sx={textFieldStyle}>
            <MenuItem value="User 1">User 1</MenuItem>
            <MenuItem value="User 2">User 2</MenuItem>
          </TextField>
          <TextField label="ID Number" value={formData.idNumber} onChange={handleChange("idNumber")} fullWidth sx={textFieldStyle} />
          <TextField label="VAT Number" value={formData.vatNumber} onChange={handleChange("vatNumber")} fullWidth sx={textFieldStyle} />
          <TextField label="Website" value={formData.website} onChange={handleChange("website")} fullWidth sx={textFieldStyle} />
          <TextField label="Phone" value={formData.phone} onChange={handleChange("phone")} fullWidth sx={textFieldStyle} />
          <TextField label="Routing ID" value={formData.routingId} onChange={handleChange("routingId")} fullWidth sx={textFieldStyle} />
          <TextField select label="Classification" value={formData.classification} onChange={handleChange("classification")} fullWidth sx={textFieldStyle}>
            <MenuItem value="">Select Classification</MenuItem>
            <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
            <MenuItem value="Partnership">Partnership</MenuItem>
            <MenuItem value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</MenuItem>
            <MenuItem value="Private Limited Company (Pvt Ltd)">Private Limited Company (Pvt Ltd)</MenuItem>
            <MenuItem value="Public Limited Company (PLC)">Public Limited Company (PLC)</MenuItem>
            <MenuItem value="One Person Company (OPC)">One Person Company (OPC)</MenuItem>
            <MenuItem value="Corporation">Corporation</MenuItem>
            <MenuItem value="Cooperative Society">Cooperative Society</MenuItem>
            <MenuItem value="State-Owned Enterprise">State-Owned Enterprise</MenuItem>
            <MenuItem value="Non-Profit Organization">Non-Profit Organization</MenuItem>
            <MenuItem value="Trust / Foundation">Trust / Foundation</MenuItem>
          </TextField>
        </Box>

        <FormControlLabel
          control={<Switch checked={formData.validVat} onChange={handleChange("validVat")} sx={switchStyle} />}
          label="Valid VAT Number"
        />
        <FormControlLabel
          control={<Switch checked={formData.taxExempt} onChange={handleChange("taxExempt")} sx={switchStyle} />}
          label="Tax Exempt"
        />

        <Divider sx={{ my: 3 }} />

        {/* Contacts */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Contacts
        </Typography>
        {formData.contacts.map((contact, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField label="First Name" value={contact.firstName} onChange={(e) => handleContactChange(index, "firstName", e.target.value)} sx={textFieldStyle} />
              <TextField label="Last Name" value={contact.lastName} onChange={(e) => handleContactChange(index, "lastName", e.target.value)} sx={textFieldStyle} />
              <TextField label="Email" value={contact.email} onChange={(e) => handleContactChange(index, "email", e.target.value)} sx={textFieldStyle} />
              <TextField label="Phone" value={contact.phone} onChange={(e) => handleContactChange(index, "phone", e.target.value)} sx={textFieldStyle} />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={contact.addToInvoices}
                  onChange={(e) => handleContactChange(index, "addToInvoices", e.target.checked)}
                  sx={switchStyle}
                />
              }
              label="Add To Invoices"
              sx={{ mt: 1 }}
            />
          </Paper>
        ))}
        <Button variant="outlined" onClick={addContact} sx={{ mr: 2, borderColor: "#4a7c59", color: "#4a7c59" }}>
          + Add Contact
        </Button>

        <Divider sx={{ my: 3 }} />

        {/* Address Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Address
        </Typography>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          sx={{
            mb: 2,
            "& .MuiTab-root.Mui-selected": { color: "#BC4749" },
            "& .MuiTabs-indicator": { backgroundColor: "#BC4749" },
          }}
        >
          <Tab label="Billing Address" />
          <Tab label="Shipping Address" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Street" value={formData.billingStreet} onChange={handleChange("billingStreet")} sx={textFieldStyle} />
            <TextField label="Apt/Suite" value={formData.billingSuite} onChange={handleChange("billingSuite")} sx={textFieldStyle} />
            <TextField label="City" value={formData.billingCity} onChange={handleChange("billingCity")} sx={textFieldStyle} />
            <TextField label="State/Province" value={formData.billingState} onChange={handleChange("billingState")} sx={textFieldStyle} />
            <TextField label="Postal Code" value={formData.billingPostalCode} onChange={handleChange("billingPostalCode")} sx={textFieldStyle} />
            <TextField select label="Country" value={formData.billingCountry} onChange={handleChange("billingCountry")} sx={textFieldStyle}>
              <MenuItem value="">Select Country</MenuItem>
              <MenuItem value="Afghanistan">Afghanistan</MenuItem>
              <MenuItem value="Albania">Albania</MenuItem>
              <MenuItem value="Algeria">Algeria</MenuItem>
              <MenuItem value="Andorra">Andorra</MenuItem>
              <MenuItem value="Angola">Angola</MenuItem>
              <MenuItem value="Antigua and Barbuda">Antigua and Barbuda</MenuItem>
              <MenuItem value="Argentina">Argentina</MenuItem>
              <MenuItem value="Armenia">Armenia</MenuItem>
              <MenuItem value="Australia">Australia</MenuItem>
              <MenuItem value="Austria">Austria</MenuItem>
              <MenuItem value="Azerbaijan">Azerbaijan</MenuItem>
              <MenuItem value="Bahamas">Bahamas</MenuItem>
              <MenuItem value="Bahrain">Bahrain</MenuItem>
              <MenuItem value="Bangladesh">Bangladesh</MenuItem>
              <MenuItem value="Barbados">Barbados</MenuItem>
              <MenuItem value="Belarus">Belarus</MenuItem>
              <MenuItem value="Belgium">Belgium</MenuItem>
              <MenuItem value="Belize">Belize</MenuItem>
              <MenuItem value="Benin">Benin</MenuItem>
              <MenuItem value="Bhutan">Bhutan</MenuItem>
              <MenuItem value="Bolivia">Bolivia</MenuItem>
              <MenuItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</MenuItem>
              <MenuItem value="Botswana">Botswana</MenuItem>
              <MenuItem value="Brazil">Brazil</MenuItem>
              <MenuItem value="Brunei">Brunei</MenuItem>
              <MenuItem value="Bulgaria">Bulgaria</MenuItem>
              <MenuItem value="Burkina Faso">Burkina Faso</MenuItem>
              <MenuItem value="Burundi">Burundi</MenuItem>
              <MenuItem value="Cabo Verde">Cabo Verde</MenuItem>
              <MenuItem value="Cambodia">Cambodia</MenuItem>
              <MenuItem value="Cameroon">Cameroon</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="Central African Republic">Central African Republic</MenuItem>
              <MenuItem value="Chad">Chad</MenuItem>
              <MenuItem value="Chile">Chile</MenuItem>
              <MenuItem value="China">China</MenuItem>
              <MenuItem value="Colombia">Colombia</MenuItem>
              <MenuItem value="Comoros">Comoros</MenuItem>
              <MenuItem value="Congo">Congo</MenuItem>
              <MenuItem value="Costa Rica">Costa Rica</MenuItem>
              <MenuItem value="Croatia">Croatia</MenuItem>
              <MenuItem value="Cuba">Cuba</MenuItem>
              <MenuItem value="Cyprus">Cyprus</MenuItem>
              <MenuItem value="Czech Republic">Czech Republic</MenuItem>
              <MenuItem value="Denmark">Denmark</MenuItem>
              <MenuItem value="Djibouti">Djibouti</MenuItem>
              <MenuItem value="Dominica">Dominica</MenuItem>
              <MenuItem value="Dominican Republic">Dominican Republic</MenuItem>
              <MenuItem value="Ecuador">Ecuador</MenuItem>
              <MenuItem value="Egypt">Egypt</MenuItem>
              <MenuItem value="El Salvador">El Salvador</MenuItem>
              <MenuItem value="Equatorial Guinea">Equatorial Guinea</MenuItem>
              <MenuItem value="Eritrea">Eritrea</MenuItem>
              <MenuItem value="Estonia">Estonia</MenuItem>
              <MenuItem value="Eswatini">Eswatini</MenuItem>
              <MenuItem value="Ethiopia">Ethiopia</MenuItem>
              <MenuItem value="Fiji">Fiji</MenuItem>
              <MenuItem value="Finland">Finland</MenuItem>
              <MenuItem value="France">France</MenuItem>
              <MenuItem value="Gabon">Gabon</MenuItem>
              <MenuItem value="Gambia">Gambia</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
              <MenuItem value="Germany">Germany</MenuItem>
              <MenuItem value="Ghana">Ghana</MenuItem>
              <MenuItem value="Greece">Greece</MenuItem>
              <MenuItem value="Grenada">Grenada</MenuItem>
              <MenuItem value="Guatemala">Guatemala</MenuItem>
              <MenuItem value="Guinea">Guinea</MenuItem>
              <MenuItem value="Guinea-Bissau">Guinea-Bissau</MenuItem>
              <MenuItem value="Guyana">Guyana</MenuItem>
              <MenuItem value="Haiti">Haiti</MenuItem>
              <MenuItem value="Honduras">Honduras</MenuItem>
              <MenuItem value="Hungary">Hungary</MenuItem>
              <MenuItem value="Iceland">Iceland</MenuItem>
              <MenuItem value="India">India</MenuItem>
              <MenuItem value="Indonesia">Indonesia</MenuItem>
              <MenuItem value="Iran">Iran</MenuItem>
              <MenuItem value="Iraq">Iraq</MenuItem>
              <MenuItem value="Ireland">Ireland</MenuItem>
              <MenuItem value="Israel">Israel</MenuItem>
              <MenuItem value="Italy">Italy</MenuItem>
              <MenuItem value="Jamaica">Jamaica</MenuItem>
              <MenuItem value="Japan">Japan</MenuItem>
              <MenuItem value="Jordan">Jordan</MenuItem>
              <MenuItem value="Kazakhstan">Kazakhstan</MenuItem>
              <MenuItem value="Kenya">Kenya</MenuItem>
              <MenuItem value="Kiribati">Kiribati</MenuItem>
              <MenuItem value="Kuwait">Kuwait</MenuItem>
              <MenuItem value="Kyrgyzstan">Kyrgyzstan</MenuItem>
              <MenuItem value="Laos">Laos</MenuItem>
              <MenuItem value="Latvia">Latvia</MenuItem>
              <MenuItem value="Lebanon">Lebanon</MenuItem>
              <MenuItem value="Lesotho">Lesotho</MenuItem>
              <MenuItem value="Liberia">Liberia</MenuItem>
              <MenuItem value="Libya">Libya</MenuItem>
              <MenuItem value="Liechtenstein">Liechtenstein</MenuItem>
              <MenuItem value="Lithuania">Lithuania</MenuItem>
              <MenuItem value="Luxembourg">Luxembourg</MenuItem>
              <MenuItem value="Madagascar">Madagascar</MenuItem>
              <MenuItem value="Malawi">Malawi</MenuItem>
              <MenuItem value="Malaysia">Malaysia</MenuItem>
              <MenuItem value="Maldives">Maldives</MenuItem>
              <MenuItem value="Mali">Mali</MenuItem>
              <MenuItem value="Malta">Malta</MenuItem>
              <MenuItem value="Marshall Islands">Marshall Islands</MenuItem>
              <MenuItem value="Mauritania">Mauritania</MenuItem>
              <MenuItem value="Mauritius">Mauritius</MenuItem>
              <MenuItem value="Mexico">Mexico</MenuItem>
              <MenuItem value="Micronesia">Micronesia</MenuItem>
              <MenuItem value="Moldova">Moldova</MenuItem>
              <MenuItem value="Monaco">Monaco</MenuItem>
              <MenuItem value="Mongolia">Mongolia</MenuItem>
              <MenuItem value="Montenegro">Montenegro</MenuItem>
              <MenuItem value="Morocco">Morocco</MenuItem>
              <MenuItem value="Mozambique">Mozambique</MenuItem>
              <MenuItem value="Myanmar">Myanmar</MenuItem>
              <MenuItem value="Namibia">Namibia</MenuItem>
              <MenuItem value="Nauru">Nauru</MenuItem>
              <MenuItem value="Nepal">Nepal</MenuItem>
              <MenuItem value="Netherlands">Netherlands</MenuItem>
              <MenuItem value="New Zealand">New Zealand</MenuItem>
              <MenuItem value="Nicaragua">Nicaragua</MenuItem>
              <MenuItem value="Niger">Niger</MenuItem>
              <MenuItem value="Nigeria">Nigeria</MenuItem>
              <MenuItem value="North Korea">North Korea</MenuItem>
              <MenuItem value="North Macedonia">North Macedonia</MenuItem>
              <MenuItem value="Norway">Norway</MenuItem>
              <MenuItem value="Oman">Oman</MenuItem>
              <MenuItem value="Pakistan">Pakistan</MenuItem>
              <MenuItem value="Palau">Palau</MenuItem>
              <MenuItem value="Palestine">Palestine</MenuItem>
              <MenuItem value="Panama">Panama</MenuItem>
              <MenuItem value="Papua New Guinea">Papua New Guinea</MenuItem>
              <MenuItem value="Paraguay">Paraguay</MenuItem>
              <MenuItem value="Peru">Peru</MenuItem>
              <MenuItem value="Philippines">Philippines</MenuItem>
              <MenuItem value="Poland">Poland</MenuItem>
              <MenuItem value="Portugal">Portugal</MenuItem>
              <MenuItem value="Qatar">Qatar</MenuItem>
              <MenuItem value="Romania">Romania</MenuItem>
              <MenuItem value="Russia">Russia</MenuItem>
              <MenuItem value="Rwanda">Rwanda</MenuItem>
              <MenuItem value="Saint Kitts and Nevis">Saint Kitts and Nevis</MenuItem>
              <MenuItem value="Saint Lucia">Saint Lucia</MenuItem>
              <MenuItem value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</MenuItem>
              <MenuItem value="Samoa">Samoa</MenuItem>
              <MenuItem value="San Marino">San Marino</MenuItem>
              <MenuItem value="Sao Tome and Principe">Sao Tome and Principe</MenuItem>
              <MenuItem value="Saudi Arabia">Saudi Arabia</MenuItem>
              <MenuItem value="Senegal">Senegal</MenuItem>
              <MenuItem value="Serbia">Serbia</MenuItem>
              <MenuItem value="Seychelles">Seychelles</MenuItem>
              <MenuItem value="Sierra Leone">Sierra Leone</MenuItem>
              <MenuItem value="Singapore">Singapore</MenuItem>
              <MenuItem value="Slovakia">Slovakia</MenuItem>
              <MenuItem value="Slovenia">Slovenia</MenuItem>
              <MenuItem value="Solomon Islands">Solomon Islands</MenuItem>
              <MenuItem value="Somalia">Somalia</MenuItem>
              <MenuItem value="South Africa">South Africa</MenuItem>
              <MenuItem value="South Korea">South Korea</MenuItem>
              <MenuItem value="South Sudan">South Sudan</MenuItem>
              <MenuItem value="Spain">Spain</MenuItem>
              <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
              <MenuItem value="Sudan">Sudan</MenuItem>
              <MenuItem value="Suriname">Suriname</MenuItem>
              <MenuItem value="Sweden">Sweden</MenuItem>
              <MenuItem value="Switzerland">Switzerland</MenuItem>
              <MenuItem value="Syria">Syria</MenuItem>
              <MenuItem value="Taiwan">Taiwan</MenuItem>
              <MenuItem value="Tajikistan">Tajikistan</MenuItem>
              <MenuItem value="Tanzania">Tanzania</MenuItem>
              <MenuItem value="Thailand">Thailand</MenuItem>
              <MenuItem value="Timor-Leste">Timor-Leste</MenuItem>
              <MenuItem value="Togo">Togo</MenuItem>
              <MenuItem value="Tonga">Tonga</MenuItem>
              <MenuItem value="Trinidad and Tobago">Trinidad and Tobago</MenuItem>
              <MenuItem value="Tunisia">Tunisia</MenuItem>
              <MenuItem value="Turkey">Turkey</MenuItem>
              <MenuItem value="Turkmenistan">Turkmenistan</MenuItem>
              <MenuItem value="Tuvalu">Tuvalu</MenuItem>
              <MenuItem value="Uganda">Uganda</MenuItem>
              <MenuItem value="Ukraine">Ukraine</MenuItem>
              <MenuItem value="United Arab Emirates">United Arab Emirates</MenuItem>
              <MenuItem value="United Kingdom">United Kingdom</MenuItem>
              <MenuItem value="United States">United States</MenuItem>
              <MenuItem value="Uruguay">Uruguay</MenuItem>
              <MenuItem value="Uzbekistan">Uzbekistan</MenuItem>
              <MenuItem value="Vanuatu">Vanuatu</MenuItem>
              <MenuItem value="Vatican City">Vatican City</MenuItem>
              <MenuItem value="Venezuela">Venezuela</MenuItem>
              <MenuItem value="Vietnam">Vietnam</MenuItem>
              <MenuItem value="Yemen">Yemen</MenuItem>
              <MenuItem value="Zambia">Zambia</MenuItem>
              <MenuItem value="Zimbabwe">Zimbabwe</MenuItem>
            </TextField>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Street" value={formData.shippingStreet} onChange={handleChange("shippingStreet")} sx={textFieldStyle} />
            <TextField label="Apt/Suite" value={formData.shippingSuite} onChange={handleChange("shippingSuite")} sx={textFieldStyle} />
            <TextField label="City" value={formData.shippingCity} onChange={handleChange("shippingCity")} sx={textFieldStyle} />
            <TextField label="State/Province" value={formData.shippingState} onChange={handleChange("shippingState")} sx={textFieldStyle} />
            <TextField label="Postal Code" value={formData.shippingPostalCode} onChange={handleChange("shippingPostalCode")} sx={textFieldStyle} />
            <TextField select label="Country" value={formData.shippingCountry} onChange={handleChange("shippingCountry")} sx={textFieldStyle}>
              <MenuItem value="">Select Country</MenuItem>
              <MenuItem value="Afghanistan">Afghanistan</MenuItem>
              <MenuItem value="Albania">Albania</MenuItem>
              <MenuItem value="Algeria">Algeria</MenuItem>
              <MenuItem value="Andorra">Andorra</MenuItem>
              <MenuItem value="Angola">Angola</MenuItem>
              <MenuItem value="Antigua and Barbuda">Antigua and Barbuda</MenuItem>
              <MenuItem value="Argentina">Argentina</MenuItem>
              <MenuItem value="Armenia">Armenia</MenuItem>
              <MenuItem value="Australia">Australia</MenuItem>
              <MenuItem value="Austria">Austria</MenuItem>
              <MenuItem value="Azerbaijan">Azerbaijan</MenuItem>
              <MenuItem value="Bahamas">Bahamas</MenuItem>
              <MenuItem value="Bahrain">Bahrain</MenuItem>
              <MenuItem value="Bangladesh">Bangladesh</MenuItem>
              <MenuItem value="Barbados">Barbados</MenuItem>
              <MenuItem value="Belarus">Belarus</MenuItem>
              <MenuItem value="Belgium">Belgium</MenuItem>
              <MenuItem value="Belize">Belize</MenuItem>
              <MenuItem value="Benin">Benin</MenuItem>
              <MenuItem value="Bhutan">Bhutan</MenuItem>
              <MenuItem value="Bolivia">Bolivia</MenuItem>
              <MenuItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</MenuItem>
              <MenuItem value="Botswana">Botswana</MenuItem>
              <MenuItem value="Brazil">Brazil</MenuItem>
              <MenuItem value="Brunei">Brunei</MenuItem>
              <MenuItem value="Bulgaria">Bulgaria</MenuItem>
              <MenuItem value="Burkina Faso">Burkina Faso</MenuItem>
              <MenuItem value="Burundi">Burundi</MenuItem>
              <MenuItem value="Cabo Verde">Cabo Verde</MenuItem>
              <MenuItem value="Cambodia">Cambodia</MenuItem>
              <MenuItem value="Cameroon">Cameroon</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="Central African Republic">Central African Republic</MenuItem>
              <MenuItem value="Chad">Chad</MenuItem>
              <MenuItem value="Chile">Chile</MenuItem>
              <MenuItem value="China">China</MenuItem>
              <MenuItem value="Colombia">Colombia</MenuItem>
              <MenuItem value="Comoros">Comoros</MenuItem>
              <MenuItem value="Congo">Congo</MenuItem>
              <MenuItem value="Costa Rica">Costa Rica</MenuItem>
              <MenuItem value="Croatia">Croatia</MenuItem>
              <MenuItem value="Cuba">Cuba</MenuItem>
              <MenuItem value="Cyprus">Cyprus</MenuItem>
              <MenuItem value="Czech Republic">Czech Republic</MenuItem>
              <MenuItem value="Denmark">Denmark</MenuItem>
              <MenuItem value="Djibouti">Djibouti</MenuItem>
              <MenuItem value="Dominica">Dominica</MenuItem>
              <MenuItem value="Dominican Republic">Dominican Republic</MenuItem>
              <MenuItem value="Ecuador">Ecuador</MenuItem>
              <MenuItem value="Egypt">Egypt</MenuItem>
              <MenuItem value="El Salvador">El Salvador</MenuItem>
              <MenuItem value="Equatorial Guinea">Equatorial Guinea</MenuItem>
              <MenuItem value="Eritrea">Eritrea</MenuItem>
              <MenuItem value="Estonia">Estonia</MenuItem>
              <MenuItem value="Eswatini">Eswatini</MenuItem>
              <MenuItem value="Ethiopia">Ethiopia</MenuItem>
              <MenuItem value="Fiji">Fiji</MenuItem>
              <MenuItem value="Finland">Finland</MenuItem>
              <MenuItem value="France">France</MenuItem>
              <MenuItem value="Gabon">Gabon</MenuItem>
              <MenuItem value="Gambia">Gambia</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
              <MenuItem value="Germany">Germany</MenuItem>
              <MenuItem value="Ghana">Ghana</MenuItem>
              <MenuItem value="Greece">Greece</MenuItem>
              <MenuItem value="Grenada">Grenada</MenuItem>
              <MenuItem value="Guatemala">Guatemala</MenuItem>
              <MenuItem value="Guinea">Guinea</MenuItem>
              <MenuItem value="Guinea-Bissau">Guinea-Bissau</MenuItem>
              <MenuItem value="Guyana">Guyana</MenuItem>
              <MenuItem value="Haiti">Haiti</MenuItem>
              <MenuItem value="Honduras">Honduras</MenuItem>
              <MenuItem value="Hungary">Hungary</MenuItem>
              <MenuItem value="Iceland">Iceland</MenuItem>
              <MenuItem value="India">India</MenuItem>
              <MenuItem value="Indonesia">Indonesia</MenuItem>
              <MenuItem value="Iran">Iran</MenuItem>
              <MenuItem value="Iraq">Iraq</MenuItem>
              <MenuItem value="Ireland">Ireland</MenuItem>
              <MenuItem value="Israel">Israel</MenuItem>
              <MenuItem value="Italy">Italy</MenuItem>
              <MenuItem value="Jamaica">Jamaica</MenuItem>
              <MenuItem value="Japan">Japan</MenuItem>
              <MenuItem value="Jordan">Jordan</MenuItem>
              <MenuItem value="Kazakhstan">Kazakhstan</MenuItem>
              <MenuItem value="Kenya">Kenya</MenuItem>
              <MenuItem value="Kiribati">Kiribati</MenuItem>
              <MenuItem value="Kuwait">Kuwait</MenuItem>
              <MenuItem value="Kyrgyzstan">Kyrgyzstan</MenuItem>
              <MenuItem value="Laos">Laos</MenuItem>
              <MenuItem value="Latvia">Latvia</MenuItem>
              <MenuItem value="Lebanon">Lebanon</MenuItem>
              <MenuItem value="Lesotho">Lesotho</MenuItem>
              <MenuItem value="Liberia">Liberia</MenuItem>
              <MenuItem value="Libya">Libya</MenuItem>
              <MenuItem value="Liechtenstein">Liechtenstein</MenuItem>
              <MenuItem value="Lithuania">Lithuania</MenuItem>
              <MenuItem value="Luxembourg">Luxembourg</MenuItem>
              <MenuItem value="Madagascar">Madagascar</MenuItem>
              <MenuItem value="Malawi">Malawi</MenuItem>
              <MenuItem value="Malaysia">Malaysia</MenuItem>
              <MenuItem value="Maldives">Maldives</MenuItem>
              <MenuItem value="Mali">Mali</MenuItem>
              <MenuItem value="Malta">Malta</MenuItem>
              <MenuItem value="Marshall Islands">Marshall Islands</MenuItem>
              <MenuItem value="Mauritania">Mauritania</MenuItem>
              <MenuItem value="Mauritius">Mauritius</MenuItem>
              <MenuItem value="Mexico">Mexico</MenuItem>
              <MenuItem value="Micronesia">Micronesia</MenuItem>
              <MenuItem value="Moldova">Moldova</MenuItem>
              <MenuItem value="Monaco">Monaco</MenuItem>
              <MenuItem value="Mongolia">Mongolia</MenuItem>
              <MenuItem value="Montenegro">Montenegro</MenuItem>
              <MenuItem value="Morocco">Morocco</MenuItem>
              <MenuItem value="Mozambique">Mozambique</MenuItem>
              <MenuItem value="Myanmar">Myanmar</MenuItem>
              <MenuItem value="Namibia">Namibia</MenuItem>
              <MenuItem value="Nauru">Nauru</MenuItem>
              <MenuItem value="Nepal">Nepal</MenuItem>
              <MenuItem value="Netherlands">Netherlands</MenuItem>
              <MenuItem value="New Zealand">New Zealand</MenuItem>
              <MenuItem value="Nicaragua">Nicaragua</MenuItem>
              <MenuItem value="Niger">Niger</MenuItem>
              <MenuItem value="Nigeria">Nigeria</MenuItem>
              <MenuItem value="North Korea">North Korea</MenuItem>
              <MenuItem value="North Macedonia">North Macedonia</MenuItem>
              <MenuItem value="Norway">Norway</MenuItem>
              <MenuItem value="Oman">Oman</MenuItem>
              <MenuItem value="Pakistan">Pakistan</MenuItem>
              <MenuItem value="Palau">Palau</MenuItem>
              <MenuItem value="Palestine">Palestine</MenuItem>
              <MenuItem value="Panama">Panama</MenuItem>
              <MenuItem value="Papua New Guinea">Papua New Guinea</MenuItem>
              <MenuItem value="Paraguay">Paraguay</MenuItem>
              <MenuItem value="Peru">Peru</MenuItem>
              <MenuItem value="Philippines">Philippines</MenuItem>
              <MenuItem value="Poland">Poland</MenuItem>
              <MenuItem value="Portugal">Portugal</MenuItem>
              <MenuItem value="Qatar">Qatar</MenuItem>
              <MenuItem value="Romania">Romania</MenuItem>
              <MenuItem value="Russia">Russia</MenuItem>
              <MenuItem value="Rwanda">Rwanda</MenuItem>
              <MenuItem value="Saint Kitts and Nevis">Saint Kitts and Nevis</MenuItem>
              <MenuItem value="Saint Lucia">Saint Lucia</MenuItem>
              <MenuItem value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</MenuItem>
              <MenuItem value="Samoa">Samoa</MenuItem>
              <MenuItem value="San Marino">San Marino</MenuItem>
              <MenuItem value="Sao Tome and Principe">Sao Tome and Principe</MenuItem>
              <MenuItem value="Saudi Arabia">Saudi Arabia</MenuItem>
              <MenuItem value="Senegal">Senegal</MenuItem>
              <MenuItem value="Serbia">Serbia</MenuItem>
              <MenuItem value="Seychelles">Seychelles</MenuItem>
              <MenuItem value="Sierra Leone">Sierra Leone</MenuItem>
              <MenuItem value="Singapore">Singapore</MenuItem>
              <MenuItem value="Slovakia">Slovakia</MenuItem>
              <MenuItem value="Slovenia">Slovenia</MenuItem>
              <MenuItem value="Solomon Islands">Solomon Islands</MenuItem>
              <MenuItem value="Somalia">Somalia</MenuItem>
              <MenuItem value="South Africa">South Africa</MenuItem>
              <MenuItem value="South Korea">South Korea</MenuItem>
              <MenuItem value="South Sudan">South Sudan</MenuItem>
              <MenuItem value="Spain">Spain</MenuItem>
              <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
              <MenuItem value="Sudan">Sudan</MenuItem>
              <MenuItem value="Suriname">Suriname</MenuItem>
              <MenuItem value="Sweden">Sweden</MenuItem>
              <MenuItem value="Switzerland">Switzerland</MenuItem>
              <MenuItem value="Syria">Syria</MenuItem>
              <MenuItem value="Taiwan">Taiwan</MenuItem>
              <MenuItem value="Tajikistan">Tajikistan</MenuItem>
              <MenuItem value="Tanzania">Tanzania</MenuItem>
              <MenuItem value="Thailand">Thailand</MenuItem>
              <MenuItem value="Timor-Leste">Timor-Leste</MenuItem>
              <MenuItem value="Togo">Togo</MenuItem>
              <MenuItem value="Tonga">Tonga</MenuItem>
              <MenuItem value="Trinidad and Tobago">Trinidad and Tobago</MenuItem>
              <MenuItem value="Tunisia">Tunisia</MenuItem>
              <MenuItem value="Turkey">Turkey</MenuItem>
              <MenuItem value="Turkmenistan">Turkmenistan</MenuItem>
              <MenuItem value="Tuvalu">Tuvalu</MenuItem>
              <MenuItem value="Uganda">Uganda</MenuItem>
              <MenuItem value="Ukraine">Ukraine</MenuItem>
              <MenuItem value="United Arab Emirates">United Arab Emirates</MenuItem>
              <MenuItem value="United Kingdom">United Kingdom</MenuItem>
              <MenuItem value="United States">United States</MenuItem>
              <MenuItem value="Uruguay">Uruguay</MenuItem>
              <MenuItem value="Uzbekistan">Uzbekistan</MenuItem>
              <MenuItem value="Vanuatu">Vanuatu</MenuItem>
              <MenuItem value="Vatican City">Vatican City</MenuItem>
              <MenuItem value="Venezuela">Venezuela</MenuItem>
              <MenuItem value="Vietnam">Vietnam</MenuItem>
              <MenuItem value="Yemen">Yemen</MenuItem>
              <MenuItem value="Zambia">Zambia</MenuItem>
              <MenuItem value="Zimbabwe">Zimbabwe</MenuItem>
            </TextField>
          </Box>
        )}

        <Button variant="outlined" onClick={copyBillingToShipping} sx={{ mt: 2, borderColor: "#4a7c59", color: "#4a7c59" }}>
          Copy Billing
        </Button>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Client saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}