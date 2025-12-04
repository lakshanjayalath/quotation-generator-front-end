# Report Generation Feature - Implementation Guide

## Frontend Implementation Complete ✓

The Report.jsx component now includes:

### Features Added:
1. **View Button** - Preview report data in a dialog before exporting
2. **Print Button** - Print the current view using browser's print dialog
3. **Export Button** - Export to PDF, Excel, or CSV formats
4. **Dynamic Tables** - Shows different columns based on report type
5. **Loading States** - Shows loading indicator during data fetch
6. **Notifications** - Toast notifications for success/error messages

### User Flow:

```
1. Select Filters & Options
   ↓
2. Click "VIEW" Button
   ↓
3. Report Dialog Opens with Data Table
   ↓
4. User Can:
   - Review the data
   - Click "PRINT" to print
   - Click "EXPORT FROM PREVIEW" to save file
   - Or Click "CLOSE" to go back
```

---

## Backend Implementation Required

### Step 1: Create Report Models (C#)

File: `Models/ReportModels.cs`

```csharp
public class ReportRequest
{
    public string ReportType { get; set; } // Activity, Invoices, Quotes, Clients, Products, Users
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
    public string GroupBy { get; set; } // None, Client, Date, User, Status
    public string SortBy { get; set; } // Newest, Oldest, HighAmount, LowAmount
    public string Format { get; set; } // PDF, Excel, CSV (only for export)
    public bool SendEmail { get; set; }
}
```

### Step 2: Create Report Service (C#)

File: `Services/IReportService.cs`

```csharp
public interface IReportService
{
    Task<List<dynamic>> GenerateReport(ReportRequest request);
    Task<MemoryStream> ExportReport(ReportRequest request);
}
```

File: `Services/ReportService.cs`

```csharp
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using YourApp.Models;
using OfficeOpenXml;
using iText7.Kernel.Pdf;
using iText7.Layout;
using CsvHelper;
using System.Globalization;

public class ReportService : IReportService
{
    private readonly string _connectionString;

    public ReportService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<List<dynamic>> GenerateReport(ReportRequest request)
    {
        return request.ReportType switch
        {
            "Activity" => await GetActivityReport(request),
            "Invoices" => await GetInvoicesReport(request),
            "Quotes" => await GetQuotesReport(request),
            "Clients" => await GetClientsReport(request),
            "Products" => await GetProductsReport(request),
            "Users" => await GetUsersReport(request),
            _ => throw new ArgumentException("Invalid report type")
        };
    }

    public async Task<MemoryStream> ExportReport(ReportRequest request)
    {
        var data = await GenerateReport(request);

        return request.Options.Format switch
        {
            "PDF" => ExportToPdf(data, request.ReportType),
            "Excel" => ExportToExcel(data, request.ReportType),
            "CSV" => ExportToCsv(data),
            _ => throw new ArgumentException("Invalid export format")
        };
    }

    private async Task<List<dynamic>> GetActivityReport(ReportRequest request)
    {
        var query = @"
            SELECT 
                CreatedAt as 'Date',
                CreatedBy as 'User',
                ActivityType as 'Action',
                Description,
                Status
            FROM ActivityLogs
            WHERE 1=1
        ";

        query = ApplyFilters(query, request.Filters);
        query = ApplyOrdering(query, request.Options.SortBy, "CreatedAt");

        return await ExecuteQuery(query);
    }

    private async Task<List<dynamic>> GetInvoicesReport(ReportRequest request)
    {
        var query = @"
            SELECT 
                InvoiceNumber as 'Invoice ID',
                ClientName as 'Client',
                TotalAmount as 'Amount',
                InvoiceDate as 'Date',
                Status,
                DueDate as 'Due Date'
            FROM Invoices
            WHERE 1=1
        ";

        query = ApplyFilters(query, request.Filters);
        query = ApplyOrdering(query, request.Options.SortBy, "TotalAmount");

        return await ExecuteQuery(query);
    }

    private async Task<List<dynamic>> GetQuotesReport(ReportRequest request)
    {
        var query = @"
            SELECT 
                QuoteNumber as 'Quote ID',
                ClientName as 'Client',
                TotalAmount as 'Amount',
                QuoteDate as 'Date',
                Status,
                ExpiryDate as 'Expiry Date'
            FROM Quotations
            WHERE 1=1
        ";

        query = ApplyFilters(query, request.Filters);
        query = ApplyOrdering(query, request.Options.SortBy, "TotalAmount");

        return await ExecuteQuery(query);
    }

    private async Task<List<dynamic>> GetClientsReport(ReportRequest request)
    {
        var query = @"
            SELECT 
                ClientName as 'Client Name',
                ClientEmail as 'Email',
                ClientContactNumber as 'Phone',
                ClientAddress as 'Address',
                Status
            FROM Clients
            WHERE IsDeleted = 0
        ";

        if (request.Filters.IncludeDeleted)
            query = query.Replace("WHERE IsDeleted = 0", "WHERE 1=1");

        return await ExecuteQuery(query);
    }

    private async Task<List<dynamic>> GetProductsReport(ReportRequest request)
    {
        var query = @"
            SELECT 
                ItemName as 'Product Name',
                ItemCode as 'SKU',
                Category,
                UnitPrice as 'Price',
                Quantity as 'Stock'
            FROM Items
            WHERE IsDeleted = 0
        ";

        if (request.Filters.IncludeDeleted)
            query = query.Replace("WHERE IsDeleted = 0", "WHERE 1=1");

        return await ExecuteQuery(query);
    }

    private async Task<List<dynamic>> GetUsersReport(ReportRequest request)
    {
        var query = @"
            SELECT 
                UserName as 'User Name',
                Email,
                Role,
                Status,
                LastLoginDate as 'Last Login'
            FROM Users
            WHERE 1=1
        ";

        return await ExecuteQuery(query);
    }

    private string ApplyFilters(string query, FilterOptions filters)
    {
        if (filters.StartDate.HasValue)
            query += $" AND CreatedAt >= '{filters.StartDate:yyyy-MM-dd}'";

        if (filters.EndDate.HasValue)
            query += $" AND CreatedAt <= '{filters.EndDate:yyyy-MM-dd} 23:59:59'";

        if (filters.MinAmount.HasValue)
            query += $" AND TotalAmount >= {filters.MinAmount}";

        if (filters.MaxAmount.HasValue)
            query += $" AND TotalAmount <= {filters.MaxAmount}";

        if (!string.IsNullOrEmpty(filters.Search))
            query += $" AND Description LIKE '%{filters.Search}%'";

        if (filters.Status != "All" && !string.IsNullOrEmpty(filters.Status))
            query += $" AND Status = '{filters.Status}'";

        return query;
    }

    private string ApplyOrdering(string query, string sortBy, string amountColumn = "")
    {
        return sortBy switch
        {
            "Oldest" => query + " ORDER BY CreatedAt ASC",
            "HighAmount" => query + $" ORDER BY {amountColumn} DESC",
            "LowAmount" => query + $" ORDER BY {amountColumn} ASC",
            _ => query + " ORDER BY CreatedAt DESC" // Newest (default)
        };
    }

    private async Task<List<dynamic>> ExecuteQuery(string query)
    {
        var result = new List<dynamic>();

        using (var connection = new SqlConnection(_connectionString))
        {
            await connection.OpenAsync();

            using (var command = new SqlCommand(query, connection))
            {
                command.CommandTimeout = 300;
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row.Add(reader.GetName(i), reader.GetValue(i));
                        }
                        result.Add(row);
                    }
                }
            }
        }

        return result;
    }

    private MemoryStream ExportToPdf(List<dynamic> data, string reportType)
    {
        var stream = new MemoryStream();
        var writer = new PdfWriter(stream);
        var pdf = new PdfDocument(writer);
        var document = new Document(pdf);

        // Add title
        document.Add(new Paragraph($"{reportType} Report").SetFontSize(18).SetBold());
        document.Add(new Paragraph($"Generated: {DateTime.Now:yyyy-MM-dd HH:mm:ss}").SetFontSize(10));
        document.Add(new Paragraph(""));

        // Create table from data
        if (data.Count > 0)
        {
            var firstRow = (IDictionary<string, object>)data[0];
            var table = new iText7.Layout.Element.Table(firstRow.Count);

            // Add headers
            foreach (var column in firstRow.Keys)
            {
                table.AddHeaderCell(column);
            }

            // Add data rows
            foreach (var item in data)
            {
                var dict = (IDictionary<string, object>)item;
                foreach (var value in dict.Values)
                {
                    table.AddCell(value?.ToString() ?? "-");
                }
            }

            document.Add(table);
        }

        document.Close();
        stream.Position = 0;
        return stream;
    }

    private MemoryStream ExportToExcel(List<dynamic> data, string reportType)
    {
        var stream = new MemoryStream();
        
        using (var package = new ExcelPackage(stream))
        {
            var worksheet = package.Workbook.Worksheets.Add(reportType);

            if (data.Count > 0)
            {
                var firstRow = (IDictionary<string, object>)data[0];
                var columnIndex = 1;

                // Add headers
                foreach (var column in firstRow.Keys)
                {
                    worksheet.Cells[1, columnIndex].Value = column;
                    worksheet.Cells[1, columnIndex].Style.Font.Bold = true;
                    worksheet.Cells[1, columnIndex].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[1, columnIndex].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                    columnIndex++;
                }

                // Add data rows
                var rowIndex = 2;
                foreach (var item in data)
                {
                    var dict = (IDictionary<string, object>)item;
                    columnIndex = 1;
                    foreach (var value in dict.Values)
                    {
                        worksheet.Cells[rowIndex, columnIndex].Value = value;
                        columnIndex++;
                    }
                    rowIndex++;
                }

                worksheet.Cells.AutoFitColumns();
            }

            package.Save();
        }

        stream.Position = 0;
        return stream;
    }

    private MemoryStream ExportToCsv(List<dynamic> data)
    {
        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);

        if (data.Count > 0)
        {
            var firstRow = (IDictionary<string, object>)data[0];

            // Write headers
            writer.WriteLine(string.Join(",", firstRow.Keys));

            // Write data
            foreach (var item in data)
            {
                var dict = (IDictionary<string, object>)item;
                var values = dict.Values.Select(v => 
                    $"\"{v?.ToString()?.Replace("\"", "\"\"")}\"");
                writer.WriteLine(string.Join(",", values));
            }
        }

        writer.Flush();
        stream.Position = 0;
        return stream;
    }
}
```

### Step 3: Register Service in Startup.cs

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // ... other services
    services.AddScoped<IReportService, ReportService>();
}
```

### Step 4: Create Report Controller

File: `Controllers/ReportsController.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using YourApp.Services;
using YourApp.Models;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowAll")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(IReportService reportService, ILogger<ReportsController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [HttpPost("generate")]
    public async Task<ActionResult<List<dynamic>>> GenerateReport([FromBody] ReportRequest request)
    {
        try
        {
            _logger.LogInformation($"Generating {request.ReportType} report");
            var reportData = await _reportService.GenerateReport(request);
            return Ok(reportData);
        }
        catch (ArgumentException ex)
        {
            _logger.LogError($"Invalid report request: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error generating report: {ex.Message}");
            return StatusCode(500, new { message = "Failed to generate report" });
        }
    }

    [HttpPost("export")]
    public async Task<IActionResult> ExportReport([FromBody] ReportRequest request)
    {
        try
        {
            _logger.LogInformation($"Exporting {request.ReportType} report as {request.Options.Format}");
            var fileStream = await _reportService.ExportReport(request);
            var contentType = GetContentType(request.Options.Format);
            var fileExtension = request.Options.Format.ToLower();

            return File(fileStream, contentType, 
                $"report_{request.ReportType}_{DateTime.Now:yyyyMMdd_HHmmss}.{fileExtension}");
        }
        catch (ArgumentException ex)
        {
            _logger.LogError($"Invalid export request: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error exporting report: {ex.Message}");
            return StatusCode(500, new { message = "Failed to export report" });
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
```

### Step 5: Install Required NuGet Packages

```bash
dotnet add package iText7 --version 7.2.5
dotnet add package EPPlus --version 7.0.0
dotnet add package CsvHelper --version 30.0.0
```

---

## Testing

### Frontend Testing:
1. Fill in report filters
2. Click "View" button
3. Should see report data in dialog
4. Click "Print" - should open browser print dialog
5. Click "Export from Preview" - should download file

### Backend Testing:
1. Test `/api/reports/generate` endpoint with Postman
2. Test `/api/reports/export` endpoint with different formats
3. Verify data accuracy from database

---

## Notes:
- Make sure your backend is running on `http://localhost:5264`
- Update connection strings and database queries for your schema
- Add appropriate error handling and logging
- Consider adding pagination for large reports
- Add authentication/authorization as needed
