# Backend Setup Guide for Report Generation

## Required API Endpoints

Your backend needs to implement the following endpoints to support the report generation functionality:

### 1. Generate Report (View/Preview)
**Endpoint:** `POST /api/reports/generate`

**Request Body:**
```json
{
  "reportType": "Activity|Invoices|Quotes|Clients|Products|Users",
  "filters": {
    "activity": "All|Created|Updated|Deleted|Login",
    "status": "All|Paid|Unpaid|Overdue|Cancelled|Draft|Sent",
    "client": "All|ClientId",
    "user": "All|UserId",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "minAmount": "number",
    "maxAmount": "number",
    "search": "string",
    "includeDeleted": "boolean"
  },
  "options": {
    "groupBy": "None|Client|Date|User|Status",
    "sortBy": "Newest|Oldest|HighAmount|LowAmount"
  }
}
```

**Response:**
```json
[
  {
    "Date": "2025-12-04",
    "User": "Admin",
    "Action": "Created",
    "Description": "Invoice #001 created",
    "Status": "Completed"
  },
  ...
]
```

### 2. Export Report
**Endpoint:** `POST /api/reports/export`

**Request Body:**
```json
{
  "reportType": "Activity|Invoices|Quotes|Clients|Products|Users",
  "filters": {
    "activity": "All|Created|Updated|Deleted|Login",
    "status": "All|Paid|Unpaid|Overdue|Cancelled|Draft|Sent",
    "client": "All|ClientId",
    "user": "All|UserId",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "minAmount": "number",
    "maxAmount": "number",
    "search": "string",
    "includeDeleted": "boolean"
  },
  "options": {
    "groupBy": "None|Client|Date|User|Status",
    "sortBy": "Newest|Oldest|HighAmount|LowAmount",
    "format": "PDF|Excel|CSV",
    "sendEmail": "boolean"
  }
}
```

**Response:** Binary file (PDF, XLSX, or CSV)

## Example C# Controller Implementation

```csharp
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpPost("generate")]
    public async Task<ActionResult<List<dynamic>>> GenerateReport([FromBody] ReportRequest request)
    {
        try
        {
            var reportData = await _reportService.GenerateReport(request);
            return Ok(reportData);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("export")]
    public async Task<IActionResult> ExportReport([FromBody] ReportRequest request)
    {
        try
        {
            var fileStream = await _reportService.ExportReport(request);
            var fileExtension = request.Options.Format.ToLower();
            var contentType = GetContentType(request.Options.Format);

            return File(fileStream, contentType, 
                $"report_{request.ReportType}_{DateTime.Now:yyyyMMdd_HHmmss}.{fileExtension}");
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private string GetContentType(string format)
    {
        return format switch
        {
            "PDF" => "application/pdf",
            "Excel" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "CSV" => "text/csv",
            _ => "application/octet-stream"
        };
    }
}

public class ReportRequest
{
    public string ReportType { get; set; }
    public FilterOptions Filters { get; set; }
    public ReportOptions Options { get; set; }
}

public class FilterOptions
{
    public string Activity { get; set; }
    public string Status { get; set; }
    public string Client { get; set; }
    public string User { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    public string Search { get; set; }
    public bool IncludeDeleted { get; set; }
}

public class ReportOptions
{
    public string GroupBy { get; set; }
    public string SortBy { get; set; }
    public string Format { get; set; }
    public bool SendEmail { get; set; }
}
```

## Database Query Examples

### Activity Report
```sql
SELECT 
    CreatedAt as Date,
    CreatedBy as User,
    ActivityType as Action,
    Description,
    Status
FROM ActivityLogs
WHERE (@includeDeleted = 1 OR IsDeleted = 0)
    AND (@startDate IS NULL OR CreatedAt >= @startDate)
    AND (@endDate IS NULL OR CreatedAt <= @endDate)
    AND (@search IS NULL OR Description LIKE '%' + @search + '%')
ORDER BY CreatedAt DESC
```

### Invoices Report
```sql
SELECT 
    InvoiceNumber as 'Invoice ID',
    ClientName as Client,
    TotalAmount as Amount,
    InvoiceDate as Date,
    Status,
    DueDate as 'Due Date'
FROM Invoices
WHERE (@includeDeleted = 1 OR IsDeleted = 0)
    AND (@startDate IS NULL OR InvoiceDate >= @startDate)
    AND (@endDate IS NULL OR InvoiceDate <= @endDate)
    AND (@minAmount IS NULL OR TotalAmount >= @minAmount)
    AND (@maxAmount IS NULL OR TotalAmount <= @maxAmount)
```

## Export Libraries (NuGet packages needed)

```xml
<!-- For PDF Export -->
<PackageReference Include="iText7" Version="7.2.5" />

<!-- For Excel Export -->
<PackageReference Include="EPPlus" Version="7.0.0" />

<!-- For CSV Export (built-in, use CsvHelper) -->
<PackageReference Include="CsvHelper" Version="30.0.0" />
```

## Email Integration (Optional)

If `sendEmail` is true, implement email sending:

```csharp
public async Task SendReportEmail(string email, byte[] fileContent, string fileName)
{
    using (var message = new MailMessage())
    {
        message.To.Add(email);
        message.Subject = $"Report: {fileName}";
        message.Body = "Please find attached your requested report.";
        
        using (var attachment = new Attachment(new MemoryStream(fileContent), fileName))
        {
            message.Attachments.Add(attachment);
            
            using (var smtp = new SmtpClient("your-smtp-server"))
            {
                await smtp.SendMailAsync(message);
            }
        }
    }
}
```

## Testing the Endpoints

Use Postman or similar tools to test:

1. **Generate Report:**
   - POST to `http://localhost:5264/api/reports/generate`
   - Body: JSON request as shown above

2. **Export Report:**
   - POST to `http://localhost:5264/api/reports/export`
   - Body: JSON request as shown above
   - Response Type: Binary (file download)
