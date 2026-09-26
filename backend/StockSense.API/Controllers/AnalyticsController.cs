using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockSense.Application.Interfaces;

namespace StockSense.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _svc;
    public AnalyticsController(IAnalyticsService svc) => _svc = svc;

    [HttpGet("category-breakdown")]
    public async Task<IActionResult> CategoryBreakdown() => Ok(await _svc.GetCategoryBreakdownAsync());

    [HttpGet("warehouse-comparison")]
    public async Task<IActionResult> WarehouseComparison() => Ok(await _svc.GetWarehouseComparisonAsync());

    [HttpGet("movement-trends")]
    public async Task<IActionResult> MovementTrends([FromQuery] int days = 30) => Ok(await _svc.GetMovementTrendsAsync(days));

    [HttpGet("top-products")]
    public async Task<IActionResult> TopProducts([FromQuery] int limit = 10) => Ok(await _svc.GetTopProductsAsync(limit));

    [HttpGet("stock-value-over-time")]
    public async Task<IActionResult> StockOverTime([FromQuery] int days = 30) => Ok(await _svc.GetStockOverTimeAsync(days));

    [HttpGet("operation-summary")]
    public async Task<IActionResult> OperationSummary([FromQuery] int days = 30) => Ok(await _svc.GetOperationSummaryAsync(days));
}
