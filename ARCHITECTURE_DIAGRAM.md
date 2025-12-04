# Report Generation - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REACT FRONTEND                             │
│                      (localhost:3000/5173)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Report Component (Report.jsx)                   │  │
│  │                                                              │  │
│  │  [SELECT FILTERS]  [VIEW]  [PRINT]  [EXPORT]              │  │
│  │                      ↓         ↓         ↓                 │  │
│  │                   Dialog    Browser    Download             │  │
│  │                   Preview   Print      File                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Report Service (reportService.js)                    │  │
│  │      - API calls                                             │  │
│  │      - File handling                                         │  │
│  │      - Error management                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                      ↓ axios calls                                  │
└─────────────────────────────────────────────────────────────────────┘
                            ↓ HTTP
                    ┌───────────────────┐
                    │   CORS Enabled    │
                    │  REST API Gateway │
                    └───────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     .NET BACKEND                                   │
│               (localhost:5264/api/reports)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         ReportsController                                     │  │
│  │  • POST /api/reports/generate                               │  │
│  │  • POST /api/reports/export                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            ↓                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         ReportService (Business Logic)                        │  │
│  │  • GenerateReport()                                          │  │
│  │  • ExportReport()                                            │  │
│  │  • Get[Type]Report()                                         │  │
│  │  • ExportTo[Format]()                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                     ↓ SQL Queries                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │      Data Access Layer (ExecuteQuery)                         │  │
│  │  • Build SQL queries                                         │  │
│  │  • Apply filters                                             │  │
│  │  • Apply sorting                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     SQL SERVER                                      │
│               (Database Connection)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ActivityLogs  │  Invoices  │  Quotations  │  Clients  │  Items   │
│  Users         │  ...                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### 1. VIEW REPORT FLOW

```
User Sets Filters
    ↓
[VIEW] Button Clicked
    ↓
fetchReportData()
    ↓
axios.post("/api/reports/generate", {
  reportType: "Activity",
  filters: {...},
  options: {...}
})
    ↓
Backend receives request
    ↓
ReportService.GenerateReport()
    ↓
Fetch data from database
    ↓
Format data
    ↓
Return JSON array
    ↓
Frontend receives data
    ↓
setReportData(response.data)
    ↓
Dialog Opens with Table
    ↓
User Sees Report Preview
```

### 2. EXPORT REPORT FLOW

```
User Views Report
    ↓
[EXPORT] Button Clicked
    ↓
handleExport()
    ↓
axios.post("/api/reports/export", {
  reportType: "Activity",
  filters: {...},
  options: {
    format: "PDF|Excel|CSV",  ← User selected format
    ...
  }
}, { responseType: "blob" })
    ↓
Backend receives request
    ↓
ReportService.ExportReport()
    ↓
Get report data (same as View)
    ↓
Convert to selected format:
  • PDF → iText7
  • Excel → EPPlus
  • CSV → CsvHelper
    ↓
Return binary file
    ↓
Frontend receives blob
    ↓
Create download link
    ↓
Trigger download
    ↓
File saved to downloads folder
```

### 3. PRINT FLOW

```
Report Dialog Open
    ↓
[PRINT] Button Clicked
    ↓
handlePrint()
    ↓
window.print()
    ↓
Browser Print Dialog Opens
    ↓
User selects printer
    ↓
User clicks Print
    ↓
Browser sends to printer
```

---

## Request/Response Structure

### VIEW REQUEST (POST /api/reports/generate)

```
{
  "reportType": "Activity",
  "filters": {
    "activity": "All",
    "status": "All",
    "client": "All",
    "user": "All",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "minAmount": null,
    "maxAmount": null,
    "search": "",
    "includeDeleted": false
  },
  "options": {
    "groupBy": "None",
    "sortBy": "Newest"
  }
}
```

### VIEW RESPONSE (200 OK)

```
[
  {
    "Date": "2025-12-04T10:30:00",
    "User": "Admin",
    "Action": "Created",
    "Description": "Invoice #001 created",
    "Status": "Completed"
  },
  {
    "Date": "2025-12-03T14:15:00",
    "User": "Staff1",
    "Action": "Updated",
    "Description": "Client details updated",
    "Status": "Pending"
  },
  ...
]
```

### EXPORT REQUEST (POST /api/reports/export)

```
{
  "reportType": "Activity",
  "filters": {...},
  "options": {
    "groupBy": "None",
    "sortBy": "Newest",
    "format": "PDF",           ← Different from View
    "sendEmail": false
  }
}
```

### EXPORT RESPONSE (200 OK)

```
Binary Data (PDF/XLSX/CSV file)
Content-Type: application/pdf (or xlsx, csv)
Content-Disposition: attachment; filename="report_Activity_20251204_142530.pdf"
```

---

## Component State Management

```
┌─────────────────────────────────────────────┐
│         Report Component State              │
├─────────────────────────────────────────────┤
│                                             │
│ formData = {                                │
│   reportType: string                        │
│   filters: {...}                            │
│   options: {...}                            │
│   output: "PDF|Excel|CSV"                   │
│ }                                           │
│                                             │
│ reportData = [] (from API response)         │
│ viewDialogOpen = boolean (dialog state)     │
│ loading = boolean (API loading)             │
│ snackbar = {open, message, severity}        │
│                                             │
│ Handlers:                                   │
│ • handleChange() - update formData          │
│ • fetchReportData() - GET view              │
│ • handleExport() - POST export              │
│ • handlePrint() - window.print()            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Database Schema Requirements

### Tables Needed:

#### ActivityLogs
```sql
CREATE TABLE ActivityLogs (
    Id INT PRIMARY KEY,
    CreatedAt DATETIME,
    CreatedBy NVARCHAR(100),
    ActivityType NVARCHAR(50),
    Description NVARCHAR(500),
    Status NVARCHAR(50),
    IsDeleted BIT
);
```

#### Invoices
```sql
CREATE TABLE Invoices (
    Id INT PRIMARY KEY,
    InvoiceNumber NVARCHAR(50),
    ClientName NVARCHAR(100),
    TotalAmount DECIMAL(18,2),
    InvoiceDate DATE,
    Status NVARCHAR(50),
    DueDate DATE,
    IsDeleted BIT
);
```

#### Quotations
```sql
CREATE TABLE Quotations (
    Id INT PRIMARY KEY,
    QuoteNumber NVARCHAR(50),
    ClientName NVARCHAR(100),
    TotalAmount DECIMAL(18,2),
    QuoteDate DATE,
    Status NVARCHAR(50),
    ExpiryDate DATE,
    IsDeleted BIT
);
```

#### Clients
```sql
CREATE TABLE Clients (
    Id INT PRIMARY KEY,
    ClientName NVARCHAR(100),
    ClientEmail NVARCHAR(100),
    ClientContactNumber NVARCHAR(20),
    ClientAddress NVARCHAR(500),
    Status NVARCHAR(50),
    IsDeleted BIT
);
```

#### Items
```sql
CREATE TABLE Items (
    Id INT PRIMARY KEY,
    ItemName NVARCHAR(100),
    ItemCode NVARCHAR(50),
    Category NVARCHAR(100),
    UnitPrice DECIMAL(18,2),
    Quantity INT,
    IsDeleted BIT
);
```

#### Users
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY,
    UserName NVARCHAR(100),
    Email NVARCHAR(100),
    Role NVARCHAR(50),
    Status NVARCHAR(50),
    LastLoginDate DATETIME
);
```

---

## Error Handling Flow

```
Frontend Request
    ↓
Backend Throws Exception
    ↓
ReportsController Catches Exception
    ↓
HttpStatusCode returned:
  • 400 Bad Request (validation error)
  • 404 Not Found (resource not found)
  • 500 Internal Server Error (database error)
    ↓
Frontend axios error handler catches
    ↓
Extract error message from response
    ↓
Display in Snackbar notification
    ↓
Show to user
```

---

## Summary

- **Frontend:** React with Material-UI
- **Backend:** .NET Core with Entity Framework
- **Database:** SQL Server
- **Communication:** REST API with axios
- **File Formats:** PDF (iText7), Excel (EPPlus), CSV (CsvHelper)
- **State Management:** React useState hooks
- **UI Feedback:** Snackbar notifications + loading states

All pieces work together to provide a complete report generation system!
