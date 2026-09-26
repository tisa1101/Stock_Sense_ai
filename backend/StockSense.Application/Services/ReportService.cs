using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Enums;

namespace StockSense.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IApplicationDbContext _db;
        public ReportService(IApplicationDbContext db) => _db = db;

        // ===== INVENTORY REPORT =====
        public async Task<byte[]> GenerateInventoryReportAsync(ReportFilterDto filter, string format)
        {
            var query = _db.Inventories
                .Include(i => i.Product).ThenInclude(p => p != null ? p.Category : null)
                .Include(i => i.Warehouse)
                .AsQueryable();
            if (filter.WarehouseId.HasValue) query = query.Where(i => i.WarehouseId == filter.WarehouseId);
            if (filter.CategoryId.HasValue) query = query.Where(i => i.Product != null && i.Product.CategoryId == filter.CategoryId);
            var data = await query.ToListAsync();

            if (format.ToLower() == "excel")
            {
                using var wb = new XLWorkbook();
                var ws = wb.Worksheets.Add("Inventory Report");
                var headers = new[] { "Product", "SKU", "Category", "Warehouse", "Quantity", "Reserved", "Available", "Reorder Level", "Status" };
                for (int i = 0; i < headers.Length; i++) { ws.Cell(1, i + 1).Value = headers[i]; ws.Cell(1, i + 1).Style.Font.Bold = true; ws.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#4F46E5"); ws.Cell(1, i + 1).Style.Font.FontColor = XLColor.White; }
                int row = 2;
                foreach (var inv in data)
                {
                    var avail = inv.Quantity - inv.ReservedQuantity;
                    var status = inv.Quantity == 0 ? "Out of Stock" : inv.Product != null && inv.Quantity <= inv.Product.ReorderLevel ? "Low Stock" : "In Stock";
                    ws.Cell(row, 1).Value = inv.Product != null ? inv.Product.Name : "";
                    ws.Cell(row, 2).Value = inv.Product != null ? inv.Product.SKU : "";
                    ws.Cell(row, 3).Value = inv.Product != null && inv.Product.Category != null ? inv.Product.Category.Name : "";
                    ws.Cell(row, 4).Value = inv.Warehouse != null ? inv.Warehouse.Name : "";
                    ws.Cell(row, 5).Value = inv.Quantity;
                    ws.Cell(row, 6).Value = inv.ReservedQuantity;
                    ws.Cell(row, 7).Value = avail;
                    ws.Cell(row, 8).Value = inv.Product != null ? inv.Product.ReorderLevel : 0;
                    ws.Cell(row, 9).Value = status;
                    row++;
                }
                ws.Columns().AdjustToContents();
                ws.Cell(row, 4).Value = "TOTAL";
                ws.Cell(row, 4).Style.Font.Bold = true;
                ws.Cell(row, 5).Value = data.Sum(i => i.Quantity);
                ws.Cell(row, 5).Style.Font.Bold = true;
                using var ms = new MemoryStream(); wb.SaveAs(ms); return ms.ToArray();
            }
            else
            {
                return GeneratePdf("Inventory Report", $"Generated: {DateTime.Now:yyyy-MM-dd HH:mm}", new[] { "Product", "SKU", "Warehouse", "Qty", "Avail", "Status" },
                    data.Select(inv => new[] {
                        inv.Product != null ? inv.Product.Name : "",
                        inv.Product != null ? inv.Product.SKU : "",
                        inv.Warehouse != null ? inv.Warehouse.Name : "",
                        inv.Quantity.ToString(),
                        (inv.Quantity - inv.ReservedQuantity).ToString(),
                        inv.Quantity == 0 ? "Out" : inv.Product != null && inv.Quantity <= inv.Product.ReorderLevel ? "Low" : "OK"
                    }).ToList(),
                    $"Total Records: {data.Count} | Total Stock: {data.Sum(i => i.Quantity)}");
            }
        }

        // ===== LEDGER REPORT =====
        public async Task<byte[]> GenerateLedgerReportAsync(ReportFilterDto filter, string format)
        {
            var query = _db.StockLedgers.Include(l => l.Product).Include(l => l.Warehouse).AsQueryable();
            if (filter.StartDate.HasValue) query = query.Where(l => l.CreatedAt >= filter.StartDate.Value);
            if (filter.EndDate.HasValue) query = query.Where(l => l.CreatedAt <= filter.EndDate.Value.AddDays(1));
            if (filter.ProductId.HasValue) query = query.Where(l => l.ProductId == filter.ProductId);
            var data = await query.OrderByDescending(l => l.CreatedAt).ToListAsync();

            if (format.ToLower() == "excel")
            {
                using var wb = new XLWorkbook();
                var ws = wb.Worksheets.Add("Stock Ledger");
                var headers = new[] { "Date", "Product", "SKU", "Warehouse", "Transaction", "Reference", "Qty Before", "Change", "Qty After", "Description" };
                for (int i = 0; i < headers.Length; i++) { ws.Cell(1, i + 1).Value = headers[i]; ws.Cell(1, i + 1).Style.Font.Bold = true; ws.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#4F46E5"); ws.Cell(1, i + 1).Style.Font.FontColor = XLColor.White; }
                int row = 2;
                foreach (var l in data)
                {
                    ws.Cell(row, 1).Value = l.CreatedAt.ToString("yyyy-MM-dd HH:mm");
                    ws.Cell(row, 2).Value = l.Product != null ? l.Product.Name : "";
                    ws.Cell(row, 3).Value = l.Product != null ? l.Product.SKU : "";
                    ws.Cell(row, 4).Value = l.Warehouse != null ? l.Warehouse.Name : "";
                    ws.Cell(row, 5).Value = l.TransactionType.ToString();
                    ws.Cell(row, 6).Value = l.ReferenceId;
                    ws.Cell(row, 7).Value = l.QuantityBefore;
                    ws.Cell(row, 8).Value = l.QuantityChange;
                    ws.Cell(row, 9).Value = l.QuantityAfter;
                    ws.Cell(row, 10).Value = l.Description;
                    row++;
                }
                ws.Columns().AdjustToContents();
                using var ms = new MemoryStream(); wb.SaveAs(ms); return ms.ToArray();
            }
            else
            {
                return GeneratePdf("Stock Ledger Report", $"Period: {filter.StartDate?.ToString("yyyy-MM-dd") ?? "All"} to {filter.EndDate?.ToString("yyyy-MM-dd") ?? "Now"}",
                    new[] { "Date", "Product", "Warehouse", "Type", "Change", "After" },
                    data.Select(l => new[] {
                        l.CreatedAt.ToString("MM/dd"),
                        l.Product != null ? l.Product.Name : "",
                        l.Warehouse != null ? l.Warehouse.Name : "",
                        l.TransactionType.ToString(),
                        l.QuantityChange.ToString("+0;-0"),
                        l.QuantityAfter.ToString()
                    }).ToList(),
                    $"Total Records: {data.Count}");
            }
        }

        // ===== LOW STOCK REPORT =====
        public async Task<byte[]> GenerateLowStockReportAsync(string format)
        {
            var data = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Inventories)
                .Where(p => p.IsActive)
                .ToListAsync();
            var lowStock = data.Where(p => p.Inventories.Sum(i => i.Quantity) <= p.ReorderLevel).ToList();

            if (format.ToLower() == "excel")
            {
                using var wb = new XLWorkbook();
                var ws = wb.Worksheets.Add("Low Stock Report");
                var headers = new[] { "Product", "SKU", "Category", "Total Stock", "Reorder Level", "Shortage", "Status" };
                for (int i = 0; i < headers.Length; i++) { ws.Cell(1, i + 1).Value = headers[i]; ws.Cell(1, i + 1).Style.Font.Bold = true; ws.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#DC2626"); ws.Cell(1, i + 1).Style.Font.FontColor = XLColor.White; }
                int row = 2;
                foreach (var p in lowStock.OrderBy(p => p.Inventories.Sum(i => i.Quantity)))
                {
                    var stock = p.Inventories.Sum(i => i.Quantity);
                    ws.Cell(row, 1).Value = p.Name; ws.Cell(row, 2).Value = p.SKU;
                    ws.Cell(row, 3).Value = p.Category != null ? p.Category.Name : "";
                    ws.Cell(row, 4).Value = stock; ws.Cell(row, 5).Value = p.ReorderLevel;
                    ws.Cell(row, 6).Value = p.ReorderLevel - stock;
                    ws.Cell(row, 7).Value = stock == 0 ? "OUT OF STOCK" : "LOW STOCK";
                    row++;
                }
                ws.Columns().AdjustToContents();
                using var ms = new MemoryStream(); wb.SaveAs(ms); return ms.ToArray();
            }
            else
            {
                return GeneratePdf("Low Stock Alert Report", $"Generated: {DateTime.Now:yyyy-MM-dd HH:mm} | {lowStock.Count} items need attention",
                    new[] { "Product", "SKU", "Stock", "Reorder Level", "Shortage", "Status" },
                    lowStock.Select(p => {
                        var stock = p.Inventories.Sum(i => i.Quantity);
                        return new[] { p.Name, p.SKU, stock.ToString(), p.ReorderLevel.ToString(), (p.ReorderLevel - stock).ToString(), stock == 0 ? "OUT" : "LOW" };
                    }).ToList(),
                    $"Total critical items: {lowStock.Count}");
            }
        }

        // ===== RECEIPTS REPORT =====
        public async Task<byte[]> GenerateReceiptsReportAsync(ReportFilterDto filter, string format)
        {
            var query = _db.Receipts.Include(r => r.Supplier).Include(r => r.Warehouse).Include(r => r.Items).AsQueryable();
            if (filter.StartDate.HasValue) query = query.Where(r => r.CreatedAt >= filter.StartDate.Value);
            if (filter.EndDate.HasValue) query = query.Where(r => r.CreatedAt <= filter.EndDate.Value.AddDays(1));
            var data = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

            if (format.ToLower() == "excel")
            {
                using var wb = new XLWorkbook();
                var ws = wb.Worksheets.Add("Receipts Report");
                var headers = new[] { "Receipt#", "Date", "Supplier", "Warehouse", "Total Items", "Total Qty", "Status" };
                for (int i = 0; i < headers.Length; i++) { ws.Cell(1, i + 1).Value = headers[i]; ws.Cell(1, i + 1).Style.Font.Bold = true; ws.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#059669"); ws.Cell(1, i + 1).Style.Font.FontColor = XLColor.White; }
                int row = 2;
                foreach (var r in data) { ws.Cell(row, 1).Value = r.ReceiptNumber; ws.Cell(row, 2).Value = r.ReceiptDate.ToString("yyyy-MM-dd"); ws.Cell(row, 3).Value = r.Supplier != null ? r.Supplier.Name : ""; ws.Cell(row, 4).Value = r.Warehouse != null ? r.Warehouse.Name : ""; ws.Cell(row, 5).Value = r.Items.Count; ws.Cell(row, 6).Value = r.Items.Sum(i => i.Quantity); ws.Cell(row, 7).Value = r.Status.ToString(); row++; }
                ws.Columns().AdjustToContents();
                using var ms = new MemoryStream(); wb.SaveAs(ms); return ms.ToArray();
            }
            else
            {
                return GeneratePdf("Receipts Report", $"Total: {data.Count} receipts",
                    new[] { "Receipt#", "Date", "Supplier", "Warehouse", "Qty", "Status" },
                    data.Select(r => new[] { r.ReceiptNumber, r.ReceiptDate.ToString("MM/dd"), r.Supplier != null ? r.Supplier.Name : "", r.Warehouse != null ? r.Warehouse.Name : "", r.Items.Sum(i => i.Quantity).ToString(), r.Status.ToString() }).ToList(),
                    $"Validated: {data.Count(r => r.Status == OperationStatus.Done)} | Total Qty In: {data.Where(r => r.Status == OperationStatus.Done).Sum(r => r.Items.Sum(i => i.Quantity))}");
            }
        }

        // ===== DELIVERIES REPORT =====
        public async Task<byte[]> GenerateDeliveriesReportAsync(ReportFilterDto filter, string format)
        {
            var query = _db.DeliveryOrders.Include(d => d.Warehouse).Include(d => d.Items).AsQueryable();
            if (filter.StartDate.HasValue) query = query.Where(d => d.CreatedAt >= filter.StartDate.Value);
            if (filter.EndDate.HasValue) query = query.Where(d => d.CreatedAt <= filter.EndDate.Value.AddDays(1));
            var data = await query.OrderByDescending(d => d.CreatedAt).ToListAsync();

            if (format.ToLower() == "excel")
            {
                using var wb = new XLWorkbook();
                var ws = wb.Worksheets.Add("Deliveries Report");
                var headers = new[] { "Delivery#", "Date", "Warehouse", "Items", "Total Qty", "Status" };
                for (int i = 0; i < headers.Length; i++) { ws.Cell(1, i + 1).Value = headers[i]; ws.Cell(1, i + 1).Style.Font.Bold = true; ws.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#D97706"); ws.Cell(1, i + 1).Style.Font.FontColor = XLColor.White; }
                int row = 2;
                foreach (var d in data) { ws.Cell(row, 1).Value = d.DeliveryNumber; ws.Cell(row, 2).Value = d.DeliveryDate.ToString("yyyy-MM-dd"); ws.Cell(row, 3).Value = d.Warehouse != null ? d.Warehouse.Name : ""; ws.Cell(row, 4).Value = d.Items.Count; ws.Cell(row, 5).Value = d.Items.Sum(i => i.Quantity); ws.Cell(row, 6).Value = d.Status.ToString(); row++; }
                ws.Columns().AdjustToContents();
                using var ms = new MemoryStream(); wb.SaveAs(ms); return ms.ToArray();
            }
            else
            {
                return GeneratePdf("Deliveries Report", $"Total: {data.Count} deliveries",
                    new[] { "Delivery#", "Date", "Warehouse", "Qty", "Status" },
                    data.Select(d => new[] { d.DeliveryNumber, d.DeliveryDate.ToString("MM/dd"), d.Warehouse != null ? d.Warehouse.Name : "", d.Items.Sum(i => i.Quantity).ToString(), d.Status.ToString() }).ToList(),
                    $"Completed: {data.Count(d => d.Status == OperationStatus.Done)}");
            }
        }

        // ===== SUMMARY REPORT =====
        public async Task<byte[]> GenerateSummaryReportAsync(ReportFilterDto filter, string format)
        {
            var month = filter.Month ?? DateTime.UtcNow.Month;
            var year = filter.Year ?? DateTime.UtcNow.Year;
            var start = new DateTime(year, month, 1);
            var end = start.AddMonths(1);

            var totalProducts = await _db.Products.CountAsync(p => p.IsActive);
            var totalStock = await _db.Inventories.SumAsync(i => i.Quantity);
            var receiptsCount = await _db.Receipts.CountAsync(r => r.CreatedAt >= start && r.CreatedAt < end);
            var deliveriesCount = await _db.DeliveryOrders.CountAsync(d => d.CreatedAt >= start && d.CreatedAt < end);
            var transfersCount = await _db.InternalTransfers.CountAsync(t => t.CreatedAt >= start && t.CreatedAt < end);
            var adjustmentsCount = await _db.StockAdjustments.CountAsync(a => a.CreatedAt >= start && a.CreatedAt < end);
            var lowStock = await _db.Products.Include(p => p.Inventories).CountAsync(p => p.IsActive && p.Inventories.Sum(i => i.Quantity) <= p.ReorderLevel);

            var rows = new List<string[]>
            {
                new[] { "Total Active Products", totalProducts.ToString() },
                new[] { "Total Stock Quantity", totalStock.ToString() },
                new[] { "Low Stock Items", lowStock.ToString() },
                new[] { "Receipts This Month", receiptsCount.ToString() },
                new[] { "Deliveries This Month", deliveriesCount.ToString() },
                new[] { "Transfers This Month", transfersCount.ToString() },
                new[] { "Adjustments This Month", adjustmentsCount.ToString() }
            };

            if (format.ToLower() == "excel")
            {
                using var wb = new XLWorkbook();
                var ws = wb.Worksheets.Add("Monthly Summary");
                ws.Cell(1, 1).Value = "StockSense Monthly Summary";
                ws.Cell(1, 1).Style.Font.Bold = true; ws.Cell(1, 1).Style.Font.FontSize = 16;
                ws.Cell(2, 1).Value = $"{start:MMMM yyyy}";
                ws.Cell(3, 1).Value = "Metric"; ws.Cell(3, 2).Value = "Value";
                ws.Cell(3, 1).Style.Font.Bold = true; ws.Cell(3, 2).Style.Font.Bold = true;
                for (int i = 0; i < rows.Count; i++) { ws.Cell(4 + i, 1).Value = rows[i][0]; ws.Cell(4 + i, 2).Value = rows[i][1]; }
                ws.Columns().AdjustToContents();
                using var ms = new MemoryStream(); wb.SaveAs(ms); return ms.ToArray();
            }
            else
            {
                return GeneratePdf($"Monthly Summary — {start:MMMM yyyy}", $"Generated: {DateTime.Now:yyyy-MM-dd HH:mm}",
                    new[] { "Metric", "Value" }, rows, "");
            }
        }

        // ===== PDF HELPER =====
        private static byte[] GeneratePdf(string title, string subtitle, string[] headers, List<string[]> rows, string footer)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header().Column(col =>
                    {
                        col.Item().Text("StockSense").Bold().FontSize(20).FontColor("#4F46E5");
                        col.Item().Text(title).Bold().FontSize(14);
                        col.Item().Text(subtitle).FontSize(9).FontColor("#6B7280");
                        col.Item().PaddingTop(5).LineHorizontal(1).LineColor("#E5E7EB");
                    });

                    page.Content().PaddingTop(10).Table(table =>
                    {
                        table.ColumnsDefinition(cols =>
                        {
                            foreach (var _ in headers)
                                cols.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            foreach (var h in headers)
                                header.Cell().Background("#4F46E5").Padding(6)
                                    .Text(h).FontColor(Colors.White).Bold().FontSize(9);
                        });

                        for (int i = 0; i < rows.Count; i++)
                        {
                            var row = rows[i];
                            var bgColor = i % 2 == 0 ? "#FFFFFF" : "#F9FAFB";
                            foreach (var cell in row)
                                table.Cell().Background(bgColor).Padding(5).Text(cell ?? "").FontSize(9);
                        }
                    });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span(footer.Length > 0 ? footer + " | " : "").FontSize(8).FontColor("#6B7280");
                        text.Span("Page ").FontSize(8).FontColor("#6B7280");
                        text.CurrentPageNumber().FontSize(8).FontColor("#6B7280");
                        text.Span(" of ").FontSize(8).FontColor("#6B7280");
                        text.TotalPages().FontSize(8).FontColor("#6B7280");
                    });
                });
            });
            return document.GeneratePdf();
        }
    }
}
