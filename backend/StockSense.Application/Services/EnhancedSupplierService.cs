using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockSense.Application.Common;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Entities;

namespace StockSense.Application.Services
{
    public class EnhancedSupplierService : IEnhancedSupplierService
    {
        private readonly IApplicationDbContext _db;
        public EnhancedSupplierService(IApplicationDbContext db) => _db = db;

        public async Task<List<SupplierDto>> GetAllAsync(string? search = null)
        {
            var query = _db.Suppliers.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(s => s.Name.Contains(search) || s.ContactPerson.Contains(search) || s.Email.Contains(search));
            return await query
                .Select(s => new SupplierDto(s.Id, s.Name, s.ContactPerson, s.Email, s.Phone, s.Address))
                .ToListAsync();
        }

        public async Task<SupplierDetailDto> GetByIdAsync(int id)
        {
            var supplier = await _db.Suppliers.FirstOrDefaultAsync(s => s.Id == id)
                ?? throw new NotFoundException($"Supplier {id} not found.");

            var receipts = await _db.Receipts
                .Include(r => r.Supplier).Include(r => r.Warehouse).Include(r => r.Items).ThenInclude(i => i.Product)
                .Where(r => r.SupplierId == id)
                .OrderByDescending(r => r.CreatedAt)
                .Take(10)
                .ToListAsync();

            var totalQty = receipts.Where(r => r.Status == Domain.Enums.OperationStatus.Done)
                .Sum(r => r.Items.Sum(i => i.Quantity));

            var receiptDtos = receipts.Select(r => new ReceiptDto(
                r.Id, r.ReceiptNumber, r.SupplierId,
                r.Supplier != null ? r.Supplier.Name : "",
                r.WarehouseId,
                r.Warehouse != null ? r.Warehouse.Name : "",
                r.Status, r.ReceiptDate, r.CreatedAt,
                r.Items.Select(i => new ReceiptItemDto(i.Id, i.ProductId, i.Product != null ? i.Product.Name : "", i.Product != null ? i.Product.SKU : "", i.Quantity)).ToList()
            )).ToList();

            return new SupplierDetailDto(
                supplier.Id, supplier.Name, supplier.ContactPerson, supplier.Email,
                supplier.Phone, supplier.Address, supplier.Rating, supplier.IsActive,
                supplier.Notes, supplier.UpdatedAt, receipts.Count, totalQty, receiptDtos
            );
        }

        public async Task<SupplierDto> CreateAsync(CreateSupplierDto dto)
        {
            var supplier = new Supplier
            {
                Name = dto.Name.Trim(), ContactPerson = dto.ContactPerson?.Trim() ?? "",
                Email = dto.Email?.Trim() ?? "", Phone = dto.Phone?.Trim() ?? "",
                Address = dto.Address?.Trim() ?? "", IsActive = true, Rating = 3,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Suppliers.Add(supplier);
            await _db.SaveChangesAsync();
            return new SupplierDto(supplier.Id, supplier.Name, supplier.ContactPerson, supplier.Email, supplier.Phone, supplier.Address);
        }

        public async Task<SupplierDto> UpdateAsync(int id, UpdateSupplierDto dto)
        {
            var supplier = await _db.Suppliers.FirstOrDefaultAsync(s => s.Id == id)
                ?? throw new NotFoundException($"Supplier {id} not found.");
            supplier.Name = dto.Name.Trim();
            supplier.ContactPerson = dto.ContactPerson?.Trim() ?? "";
            supplier.Email = dto.Email?.Trim() ?? "";
            supplier.Phone = dto.Phone?.Trim() ?? "";
            supplier.Address = dto.Address?.Trim() ?? "";
            supplier.Rating = Math.Clamp(dto.Rating, 1, 5);
            supplier.IsActive = dto.IsActive;
            supplier.Notes = dto.Notes?.Trim();
            supplier.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return new SupplierDto(supplier.Id, supplier.Name, supplier.ContactPerson, supplier.Email, supplier.Phone, supplier.Address);
        }

        public async Task DeleteAsync(int id)
        {
            var supplier = await _db.Suppliers.FirstOrDefaultAsync(s => s.Id == id)
                ?? throw new NotFoundException($"Supplier {id} not found.");
            supplier.IsActive = false;
            supplier.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        public async Task<List<ReceiptDto>> GetSupplierReceiptsAsync(int supplierId)
        {
            return await _db.Receipts
                .Include(r => r.Supplier).Include(r => r.Warehouse)
                .Include(r => r.Items).ThenInclude(i => i.Product)
                .Where(r => r.SupplierId == supplierId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReceiptDto(
                    r.Id, r.ReceiptNumber, r.SupplierId,
                    r.Supplier != null ? r.Supplier.Name : "",
                    r.WarehouseId, r.Warehouse != null ? r.Warehouse.Name : "",
                    r.Status, r.ReceiptDate, r.CreatedAt,
                    r.Items.Select(i => new ReceiptItemDto(i.Id, i.ProductId, i.Product != null ? i.Product.Name : "", i.Product != null ? i.Product.SKU : "", i.Quantity)).ToList()
                ))
                .ToListAsync();
        }

        public async Task<SupplierStatsDto> GetStatsAsync()
        {
            var total = await _db.Suppliers.CountAsync();
            var active = await _db.Suppliers.CountAsync(s => s.IsActive);
            var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var thisMonthReceipts = await _db.Receipts.CountAsync(r => r.CreatedAt >= monthStart);

            var top = await _db.Suppliers
                .Where(s => s.IsActive)
                .Select(s => new
                {
                    s.Id, s.Name, s.Rating,
                    TotalReceipts = _db.Receipts.Count(r => r.SupplierId == s.Id),
                    TotalQty = _db.Receipts
                        .Where(r => r.SupplierId == s.Id && r.Status == Domain.Enums.OperationStatus.Done)
                        .SelectMany(r => r.Items).Sum(i => (int?)i.Quantity) ?? 0,
                    LastReceipt = _db.Receipts.Where(r => r.SupplierId == s.Id)
                        .OrderByDescending(r => r.CreatedAt).Select(r => (DateTime?)r.CreatedAt).FirstOrDefault()
                })
                .OrderByDescending(s => s.TotalReceipts)
                .Take(5)
                .ToListAsync();

            var topDtos = top.Select(s => new TopSupplierDto(
                s.Id, s.Name, s.TotalReceipts, s.TotalQty, s.Rating,
                s.LastReceipt.HasValue ? s.LastReceipt.Value.ToString("yyyy-MM-dd") : "Never"
            )).ToList();

            return new SupplierStatsDto(total, active, thisMonthReceipts, topDtos);
        }
    }
}
