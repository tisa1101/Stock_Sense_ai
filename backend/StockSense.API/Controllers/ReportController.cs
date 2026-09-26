using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;

namespace StockSense.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _svc;
    public ReportsController(IReportService svc) => _svc = svc;

    private (string contentType, string ext) GetFormat(string format)
        => format.ToLower() == "excel"
            ? ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx")
            : ("application/pdf", "pdf");

    [HttpGet("inventory")]
    public async Task<IActionResult> Inventory([FromQuery] int? warehouseId, [FromQuery] int? categoryId, [FromQuery] string format = "pdf")
    {
        var bytes = await _svc.GenerateInventoryReportAsync(new ReportFilterDto(warehouseId, categoryId, null, null, null, null, null, null), format);
        var (ct, ext) = GetFormat(format);
        return File(bytes, ct, $"inventory-report-{DateTime.Now:yyyyMMdd}.{ext}");
    }

    [HttpGet("ledger")]
    public async Task<IActionResult> Ledger([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int? productId, [FromQuery] string format = "pdf")
    {
        var bytes = await _svc.GenerateLedgerReportAsync(new ReportFilterDto(null, null, productId, null, startDate, endDate, null, null), format);
        var (ct, ext) = GetFormat(format);
        return File(bytes, ct, $"ledger-report-{DateTime.Now:yyyyMMdd}.{ext}");
    }

    [HttpGet("receipts")]
    public async Task<IActionResult> Receipts([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string format = "pdf")
    {
        var bytes = await _svc.GenerateReceiptsReportAsync(new ReportFilterDto(null, null, null, null, startDate, endDate, null, null), format);
        var (ct, ext) = GetFormat(format);
        return File(bytes, ct, $"receipts-report-{DateTime.Now:yyyyMMdd}.{ext}");
    }

    [HttpGet("deliveries")]
    public async Task<IActionResult> Deliveries([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string format = "pdf")
    {
        var bytes = await _svc.GenerateDeliveriesReportAsync(new ReportFilterDto(null, null, null, null, startDate, endDate, null, null), format);
        var (ct, ext) = GetFormat(format);
        return File(bytes, ct, $"deliveries-report-{DateTime.Now:yyyyMMdd}.{ext}");
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> LowStock([FromQuery] string format = "pdf")
    {
        var bytes = await _svc.GenerateLowStockReportAsync(format);
        var (ct, ext) = GetFormat(format);
        return File(bytes, ct, $"low-stock-report-{DateTime.Now:yyyyMMdd}.{ext}");
    }

    [HttpGet("summary")]
    public async Task<IActionResult> Summary([FromQuery] int? month, [FromQuery] int? year, [FromQuery] string format = "pdf")
    {
        var bytes = await _svc.GenerateSummaryReportAsync(new ReportFilterDto(null, null, null, null, null, null, month, year), format);
        var (ct, ext) = GetFormat(format);
        return File(bytes, ct, $"summary-report-{DateTime.Now:yyyyMMdd}.{ext}");
    }
}
