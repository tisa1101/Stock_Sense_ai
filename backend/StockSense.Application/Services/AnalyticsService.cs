using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Enums;

namespace StockSense.Application.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IApplicationDbContext _db;
        public AnalyticsService(IApplicationDbContext db) => _db = db;

        public async Task<List<CategoryBreakdownDto>> GetCategoryBreakdownAsync()
        {
            var data = await _db.Categories
                .Select(c => new
                {
                    c.Name,
                    ProductCount = c.Products.Count(p => p.IsActive),
                    TotalStock = c.Products.Where(p => p.IsActive)
                        .SelectMany(p => p.Inventories)
                        .Sum(i => (int?)i.Quantity) ?? 0
                }).ToListAsync();
            var grandTotal = data.Sum(d => d.TotalStock);
            return data.Select(d => new CategoryBreakdownDto(
                d.Name, d.ProductCount, d.TotalStock,
                grandTotal > 0 ? Math.Round((double)d.TotalStock / grandTotal * 100, 1) : 0
            )).OrderByDescending(d => d.TotalStock).ToList();
        }

        public async Task<List<WarehouseComparisonDto>> GetWarehouseComparisonAsync()
        {
            var warehouses = await _db.Warehouses.Where(w => w.IsActive).ToListAsync();
            var result = new List<WarehouseComparisonDto>();
            foreach (var w in warehouses)
            {
                var invs = await _db.Inventories.Include(i => i.Product)
                    .Where(i => i.WarehouseId == w.Id).ToListAsync();
                var totalStock = invs.Sum(i => i.Quantity);
                var productCount = invs.Count;
                var lowStock = invs.Count(i => i.Product != null && i.Quantity <= i.Product.ReorderLevel && i.Quantity > 0);
                result.Add(new WarehouseComparisonDto(w.Name, w.Code, productCount, totalStock, lowStock,
                    productCount > 0 ? Math.Round((double)(productCount - lowStock) / productCount * 100, 1) : 0));
            }
            return result;
        }

        public async Task<List<MovementTrendDto>> GetMovementTrendsAsync(int days = 30)
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-days);
            var ledgers = await _db.StockLedgers
                .Where(l => l.CreatedAt >= startDate)
                .ToListAsync();
            var result = new List<MovementTrendDto>();
            for (int i = 0; i < days; i++)
            {
                var date = startDate.AddDays(i);
                var dayLedgers = ledgers.Where(l => l.CreatedAt.Date == date).ToList();
                var receipts = dayLedgers.Where(l => l.TransactionType == TransactionType.RECEIPT).Sum(l => Math.Abs(l.QuantityChange));
                var deliveries = dayLedgers.Where(l => l.TransactionType == TransactionType.DELIVERY).Sum(l => Math.Abs(l.QuantityChange));
                var transfersIn = dayLedgers.Where(l => l.TransactionType == TransactionType.TRANSFER_IN).Sum(l => Math.Abs(l.QuantityChange));
                var transfersOut = dayLedgers.Where(l => l.TransactionType == TransactionType.TRANSFER_OUT).Sum(l => Math.Abs(l.QuantityChange));
                var adjustments = dayLedgers.Where(l => l.TransactionType == TransactionType.ADJUSTMENT).Sum(l => Math.Abs(l.QuantityChange));
                result.Add(new MovementTrendDto(date.ToString("yyyy-MM-dd"), receipts, deliveries, transfersIn, transfersOut, adjustments, receipts - deliveries - transfersOut + transfersIn));
            }
            return result;
        }

        public async Task<List<TopProductMovementDto>> GetTopProductsAsync(int limit = 10)
        {
            return await _db.StockLedgers
                .GroupBy(l => l.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalMovements = g.Count(),
                    TotalQuantityMoved = g.Sum(l => Math.Abs(l.QuantityChange)),
                    AvgMovement = g.Average(l => (double)Math.Abs(l.QuantityChange))
                })
                .OrderByDescending(g => g.TotalMovements)
                .Take(limit)
                .Join(_db.Products, g => g.ProductId, p => p.Id,
                    (g, p) => new TopProductMovementDto(p.Id, p.Name, p.SKU, g.TotalMovements, g.TotalQuantityMoved, Math.Round(g.AvgMovement, 1)))
                .ToListAsync();
        }

        public async Task<List<StockOverTimeDto>> GetStockOverTimeAsync(int days = 30)
        {
            var startDate = DateTime.UtcNow.Date.AddDays(-days);
            var ledgers = await _db.StockLedgers.Where(l => l.CreatedAt >= startDate).OrderBy(l => l.CreatedAt).ToListAsync();
            var currentStock = await _db.Inventories.SumAsync(i => i.Quantity);
            // Walk backwards from current stock
            var result = new List<StockOverTimeDto>();
            var stockByDate = new Dictionary<DateTime, int>();
            for (int i = 0; i < days; i++)
            {
                var date = DateTime.UtcNow.Date.AddDays(-i);
                var dayChange = ledgers.Where(l => l.CreatedAt.Date == date).Sum(l => l.QuantityChange);
                stockByDate[date] = currentStock;
                currentStock -= dayChange;
            }
            return stockByDate.OrderBy(kv => kv.Key)
                .Select(kv => new StockOverTimeDto(kv.Key.ToString("yyyy-MM-dd"), Math.Max(0, kv.Value)))
                .ToList();
        }

        public async Task<List<OperationSummaryDto>> GetOperationSummaryAsync(int days = 30)
        {
            var since = DateTime.UtcNow.AddDays(-days);
            var result = new List<OperationSummaryDto>();

            var receipts = await _db.Receipts.Where(r => r.CreatedAt >= since).ToListAsync();
            result.Add(new OperationSummaryDto("Receipts",
                receipts.Count(r => r.Status == OperationStatus.Draft),
                receipts.Count(r => r.Status == OperationStatus.Waiting),
                receipts.Count(r => r.Status == OperationStatus.Ready),
                receipts.Count(r => r.Status == OperationStatus.Done),
                receipts.Count(r => r.Status == OperationStatus.Canceled),
                receipts.Count));

            var deliveries = await _db.DeliveryOrders.Where(d => d.CreatedAt >= since).ToListAsync();
            result.Add(new OperationSummaryDto("Deliveries",
                deliveries.Count(d => d.Status == OperationStatus.Draft),
                deliveries.Count(d => d.Status == OperationStatus.Waiting),
                deliveries.Count(d => d.Status == OperationStatus.Ready),
                deliveries.Count(d => d.Status == OperationStatus.Done),
                deliveries.Count(d => d.Status == OperationStatus.Canceled),
                deliveries.Count));

            var transfers = await _db.InternalTransfers.Where(t => t.CreatedAt >= since).ToListAsync();
            result.Add(new OperationSummaryDto("Transfers",
                transfers.Count(t => t.Status == OperationStatus.Draft),
                transfers.Count(t => t.Status == OperationStatus.Waiting),
                transfers.Count(t => t.Status == OperationStatus.Ready),
                transfers.Count(t => t.Status == OperationStatus.Done),
                transfers.Count(t => t.Status == OperationStatus.Canceled),
                transfers.Count));

            var adjustments = await _db.StockAdjustments.Where(a => a.CreatedAt >= since).ToListAsync();
            result.Add(new OperationSummaryDto("Adjustments",
                adjustments.Count(a => a.Status == OperationStatus.Draft),
                adjustments.Count(a => a.Status == OperationStatus.Waiting),
                adjustments.Count(a => a.Status == OperationStatus.Ready),
                adjustments.Count(a => a.Status == OperationStatus.Done),
                adjustments.Count(a => a.Status == OperationStatus.Canceled),
                adjustments.Count));

            return result;
        }
    }
}
