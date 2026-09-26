using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StockSense.Application.Common;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;

namespace StockSense.API.Controllers
{
    public class FileUploadDto
    {
        public IFormFile File { get; set; } = null!;
    }

    [ApiController]
    [Route("api/import")]
    public class BulkImportController : ControllerBase
    {
        private readonly IBulkImportService _bulkImportService;
        private readonly IStockRealTimeNotifier _realTimeNotifier;

        public BulkImportController(IBulkImportService bulkImportService, IStockRealTimeNotifier realTimeNotifier)
        {
            _bulkImportService = bulkImportService;
            _realTimeNotifier = realTimeNotifier;
        }

        [HttpPost("products")]
        [Authorize(Roles = "Admin,InventoryManager")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ApiResponse<BulkImportResultDto>>> ImportProducts([FromForm] FileUploadDto dto)
        {
            var file = dto?.File;
            if (file == null || file.Length == 0)
            {
                return BadRequest(ApiResponse<BulkImportResultDto>.Fail("No file was uploaded."));
            }

            var allowedExts = new[] { ".csv", ".xlsx", ".xls" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (Array.IndexOf(allowedExts, ext) < 0)
            {
                return BadRequest(ApiResponse<BulkImportResultDto>.Fail("Invalid file type. Supported formats: .csv, .xlsx, .xls"));
            }

            var userId = GetCurrentUserId();
            using var stream = file.OpenReadStream();
            var result = await _bulkImportService.ImportProductsAsync(stream, file.FileName, userId);

            if (result.SuccessCount > 0)
            {
                await _realTimeNotifier.NotifyNewNotificationAsync(
                    "Bulk Products Imported",
                    $"Successfully imported {result.SuccessCount} product(s) via batch catalog upload.",
                    "Product",
                    "Normal"
                );
            }

            return Ok(ApiResponse<BulkImportResultDto>.Ok(result, $"Bulk import processed: {result.SuccessCount} succeeded, {result.FailedCount} failed."));
        }

        [HttpPost("opening-stock")]
        [Authorize(Roles = "Admin,InventoryManager")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ApiResponse<BulkImportResultDto>>> ImportOpeningStock([FromForm] FileUploadDto dto)
        {
            var file = dto?.File;
            if (file == null || file.Length == 0)
            {
                return BadRequest(ApiResponse<BulkImportResultDto>.Fail("No file was uploaded."));
            }

            var allowedExts = new[] { ".csv", ".xlsx", ".xls" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (Array.IndexOf(allowedExts, ext) < 0)
            {
                return BadRequest(ApiResponse<BulkImportResultDto>.Fail("Invalid file type. Supported formats: .csv, .xlsx, .xls"));
            }

            var userId = GetCurrentUserId();
            using var stream = file.OpenReadStream();
            var result = await _bulkImportService.ImportOpeningStockAsync(stream, file.FileName, userId);

            if (result.SuccessCount > 0)
            {
                await _realTimeNotifier.NotifyNewNotificationAsync(
                    "Opening Stock Initialized",
                    $"Successfully updated opening inventory for {result.SuccessCount} stock position(s).",
                    "Inventory",
                    "High"
                );
            }

            return Ok(ApiResponse<BulkImportResultDto>.Ok(result, $"Opening stock import processed: {result.SuccessCount} positions updated, {result.FailedCount} errors."));
        }

        [HttpGet("templates/products")]
        public IActionResult DownloadProductTemplate()
        {
            var bytes = _bulkImportService.GetProductTemplateCsv();
            return File(bytes, "text/csv", "StockSense_Products_Import_Template.csv");
        }

        [HttpGet("templates/opening-stock")]
        public IActionResult DownloadOpeningStockTemplate()
        {
            var bytes = _bulkImportService.GetOpeningStockTemplateCsv();
            return File(bytes, "text/csv", "StockSense_Opening_Stock_Template.csv");
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 1;
        }
    }
}
