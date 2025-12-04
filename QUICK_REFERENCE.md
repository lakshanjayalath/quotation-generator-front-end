# Quick Reference - Report API Integration

## Frontend Component Files Modified:
- ✅ `src/components/Report.jsx` - Updated with View, Print, Export functionality

## New Files Created:
- ✅ `src/services/reportService.js` - Helper service for API calls
- ✅ `BACKEND_SETUP_GUIDE.md` - Backend requirements
- ✅ `IMPLEMENTATION_GUIDE.md` - Complete C# implementation guide
- ✅ `REPORT_FEATURE_SUMMARY.md` - Feature overview

---

## Frontend API Calls Made:

### 1. View Report - Calls this endpoint:
```
POST http://localhost:5264/api/reports/generate
```

**Request:**
```json
{
  "reportType": "Activity|Invoices|Quotes|Clients|Products|Users",
  "filters": {
    "activity": "string",
    "status": "string",
    "client": "string",
    "user": "string",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "minAmount": 0,
    "maxAmount": 10000,
    "search": "string",
    "includeDeleted": false
  },
  "options": {
    "groupBy": "None|Client|Date|User|Status",
    "sortBy": "Newest|Oldest|HighAmount|LowAmount"
  }
}
```

**Expected Response:**
```json
[
  {
    "Date": "2025-12-04",
    "User": "Admin",
    "Action": "Created",
    "Description": "Client added",
    "Status": "Completed"
  },
  ...
]
```

### 2. Export Report - Calls this endpoint:
```
POST http://localhost:5264/api/reports/export
```

**Request:** (Same as above + format option)
```json
{
  "reportType": "Activity",
  "filters": {...},
  "options": {
    "groupBy": "None",
    "sortBy": "Newest",
    "format": "PDF|Excel|CSV",  // ← Added for export
    "sendEmail": false
  }
}
```

**Expected Response:** Binary file (PDF, XLSX, or CSV)

---

## Frontend Button Behavior:

### VIEW Button
```
State: Enabled always (if not loading)
Action: Fetches data from /api/reports/generate
Result: Opens dialog with data table
```

### PRINT Button
```
State: Disabled until VIEW clicked (reportData.length > 0)
Action: Calls window.print()
Result: Opens browser print dialog
```

### EXPORT Button
```
State: Disabled until VIEW clicked (reportData.length > 0)
Action: Fetches file from /api/reports/export
Result: Downloads file with name: report_[type]_[timestamp].[ext]
```

---

## Minimal Backend Implementation (Quick Start)

If you just need a quick test, here's a minimal implementation:

### Controller:
```csharp
[HttpPost("generate")]
public async Task<ActionResult> GenerateReport([FromBody] ReportRequest request)
{
    // For testing - return dummy data
    var dummyData = new List<dynamic>
    {
        new { Date = DateTime.Now, User = "Admin", Action = "Created", 
              Description = "Sample data", Status = "Completed" },
        new { Date = DateTime.Now.AddDays(-1), User = "User1", Action = "Updated", 
              Description = "Another sample", Status = "Pending" }
    };
    
    return Ok(dummyData);
}

[HttpPost("export")]
public IActionResult ExportReport([FromBody] ReportRequest request)
{
    // Return a sample CSV for testing
    string csv = "Date,User,Action,Description,Status\n" +
                 "2025-12-04,Admin,Created,Sample data,Completed\n" +
                 "2025-12-03,User1,Updated,Another sample,Pending";
    
    var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(csv));
    return File(stream, "text/csv", "report_Activity_test.csv");
}
```

---

## Testing Checklist:

- [ ] Frontend compiles without errors
- [ ] Backend API endpoints are created
- [ ] `/api/reports/generate` returns sample data
- [ ] `/api/reports/export` returns a file
- [ ] Click VIEW button → Dialog opens with data
- [ ] Click PRINT button → Print dialog opens
- [ ] Click EXPORT button → File downloads
- [ ] Export works for PDF format
- [ ] Export works for Excel format
- [ ] Export works for CSV format
- [ ] Error messages display correctly
- [ ] Loading spinner shows during fetch

---

## Troubleshooting:

### "Failed to load report"
- Check backend is running on localhost:5264
- Check `/api/reports/generate` endpoint exists
- Check browser console for exact error

### "Failed to export report"
- Check `/api/reports/export` endpoint exists
- Check format parameter is PDF/Excel/CSV
- Check file download wasn't blocked by browser

### Print button is disabled
- Click VIEW first to populate reportData
- Print button should then enable

### Dialog won't open
- Check browser console for JavaScript errors
- Verify axios is installed: `npm list axios`

---

## Files Overview:

| File | Purpose | Status |
|------|---------|--------|
| Report.jsx | Main UI component | ✅ Complete |
| reportService.js | API helper service | ✅ Complete |
| BACKEND_SETUP_GUIDE.md | Backend requirements | ✅ Reference |
| IMPLEMENTATION_GUIDE.md | Full C# code | ✅ Reference |
| REPORT_FEATURE_SUMMARY.md | Feature overview | ✅ Reference |

---

## Support:

**Frontend Issues:** Check Report.jsx comments and reportService.js

**Backend Issues:** See IMPLEMENTATION_GUIDE.md for complete C# examples

**Database Issues:** See BACKEND_SETUP_GUIDE.md for SQL queries

**Need to modify?** All functions are well-commented for easy updates!
