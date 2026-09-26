using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockSense.Application.Common;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Entities;
using StockSense.Domain.Enums;

namespace StockSense.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IApplicationDbContext _db;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(IApplicationDbContext db, IPasswordHasher passwordHasher, IJwtTokenGenerator jwtTokenGenerator)
        {
            _db = db;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.Name))
                throw new BusinessException("Name, Email and Password are required.");

            var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (existing != null)
                throw new BusinessException("Email address is already registered.");

            var user = new User
            {
                Name = dto.Name.Trim(),
                Email = dto.Email.Trim().ToLower(),
                PasswordHash = _passwordHasher.HashPassword(dto.Password),
                Role = dto.Role,
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwtTokenGenerator.GenerateToken(user);
            return new AuthResponseDto(token, new UserDto(user.Id, user.Name, user.Email, user.Role, user.CreatedAt));
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                throw new BusinessException("Invalid email or password.");

            var token = _jwtTokenGenerator.GenerateToken(user);
            return new AuthResponseDto(token, new UserDto(user.Id, user.Name, user.Email, user.Role, user.CreatedAt));
        }
    }

    public class CategoryService : ICategoryService
    {
        private readonly IApplicationDbContext _db;
        public CategoryService(IApplicationDbContext db) => _db = db;

        public async Task<List<CategoryDto>> GetAllAsync()
        {
            return await _db.Categories
                .Select(c => new CategoryDto(c.Id, c.Name, c.Description))
                .ToListAsync();
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new BusinessException("Category name cannot be empty.");

            var category = new Category { Name = dto.Name.Trim(), Description = dto.Description?.Trim() ?? "" };
            _db.Categories.Add(category);
            await _db.SaveChangesAsync();
            return new CategoryDto(category.Id, category.Name, category.Description);
        }
    }

    public class WarehouseService : IWarehouseService
    {
        private readonly IApplicationDbContext _db;
        public WarehouseService(IApplicationDbContext db) => _db = db;

        public async Task<List<WarehouseDto>> GetAllAsync()
        {
            return await _db.Warehouses
                .Select(w => new WarehouseDto(w.Id, w.Name, w.Code, w.Location, w.IsActive))
                .ToListAsync();
        }

        public async Task<WarehouseDto> CreateAsync(CreateWarehouseDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Code))
                throw new BusinessException("Warehouse name and code are required.");

            var code = dto.Code.Trim().ToUpper();
            if (await _db.Warehouses.AnyAsync(w => w.Code == code))
                throw new BusinessException($"Warehouse code '{code}' already exists.");

            var warehouse = new Warehouse
            {
                Name = dto.Name.Trim(),
                Code = code,
                Location = dto.Location?.Trim() ?? "",
                IsActive = true
            };

            _db.Warehouses.Add(warehouse);
            await _db.SaveChangesAsync();
            return new WarehouseDto(warehouse.Id, warehouse.Name, warehouse.Code, warehouse.Location, warehouse.IsActive);
        }

        public async Task<WarehouseDto> UpdateAsync(int id, UpdateWarehouseDto dto)
        {
            var warehouse = await _db.Warehouses.FindAsync(id)
                ?? throw new NotFoundException($"Warehouse with ID {id} not found.");

            var code = dto.Code.Trim().ToUpper();
            if (await _db.Warehouses.AnyAsync(w => w.Code == code && w.Id != id))
                throw new BusinessException($"Warehouse code '{code}' already exists.");

            warehouse.Name = dto.Name.Trim();
            warehouse.Code = code;
            warehouse.Location = dto.Location?.Trim() ?? "";
            warehouse.IsActive = dto.IsActive;

            await _db.SaveChangesAsync();
            return new WarehouseDto(warehouse.Id, warehouse.Name, warehouse.Code, warehouse.Location, warehouse.IsActive);
        }
    }

    public class SupplierService : ISupplierService
    {
        private readonly IApplicationDbContext _db;
        public SupplierService(IApplicationDbContext db) => _db = db;

        public async Task<List<SupplierDto>> GetAllAsync()
        {
            return await _db.Suppliers
                .Select(s => new SupplierDto(s.Id, s.Name, s.ContactPerson, s.Email, s.Phone, s.Address))
                .ToListAsync();
        }

        public async Task<SupplierDto> CreateAsync(CreateSupplierDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new BusinessException("Supplier name is required.");

            var supplier = new Supplier
            {
                Name = dto.Name.Trim(),
                ContactPerson = dto.ContactPerson?.Trim() ?? "",
                Email = dto.Email?.Trim() ?? "",
                Phone = dto.Phone?.Trim() ?? "",
                Address = dto.Address?.Trim() ?? ""
            };

            _db.Suppliers.Add(supplier);
            await _db.SaveChangesAsync();
            return new SupplierDto(supplier.Id, supplier.Name, supplier.ContactPerson, supplier.Email, supplier.Phone, supplier.Address);
        }
    }

    public class ProductService : IProductService
    {
        private readonly IApplicationDbContext _db;
        public ProductService(IApplicationDbContext db) => _db = db;

        public async Task<List<ProductDto>> GetAllAsync(int? categoryId = null, string? search = null)
        {
            var query = _db.Products
                .Include(p => p.Category)
                .Include(p => p.Inventories)
                .AsQueryable();

            if (categoryId.HasValue && categoryId.Value > 0)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(term) || p.SKU.ToLower().Contains(term));
            }

            var products = await query.ToListAsync();

            return products.Select(p =>
            {
                int totalStock = p.Inventories.Sum(i => i.Quantity);
                string stockStatus = totalStock == 0 ? "Out of Stock" : (totalStock <= p.ReorderLevel ? "Low Stock" : "In Stock");
                return new ProductDto(
                    p.Id,
                    p.Name,
                    p.SKU,
                    p.CategoryId,
                    p.Category?.Name ?? "Uncategorized",
                    p.UnitOfMeasure,
                    p.InitialStock,
                    p.ReorderLevel,
                    totalStock,
                    stockStatus,
                    p.CreatedAt,
                    p.UpdatedAt,
                    p.IsActive
                );
            }).ToList();
        }

        public async Task<ProductDto> GetByIdAsync(int id)
        {
            var p = await _db.Products
                .Include(prod => prod.Category)
                .Include(prod => prod.Inventories)
                .FirstOrDefaultAsync(prod => prod.Id == id)
                ?? throw new NotFoundException($"Product with ID {id} not found.");

            int totalStock = p.Inventories.Sum(i => i.Quantity);
            string stockStatus = totalStock == 0 ? "Out of Stock" : (totalStock <= p.ReorderLevel ? "Low Stock" : "In Stock");

            return new ProductDto(
                p.Id,
                p.Name,
                p.SKU,
                p.CategoryId,
                p.Category?.Name ?? "Uncategorized",
                p.UnitOfMeasure,
                p.InitialStock,
                p.ReorderLevel,
                totalStock,
                stockStatus,
                p.CreatedAt,
                p.UpdatedAt,
                p.IsActive
            );
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new BusinessException("Product name cannot be empty.");

            if (string.IsNullOrWhiteSpace(dto.SKU))
                throw new BusinessException("Product SKU cannot be empty.");

            var sku = dto.SKU.Trim().ToUpper();
            if (await _db.Products.AnyAsync(p => p.SKU == sku))
                throw new BusinessException($"Product with SKU '{sku}' already exists.");

            var categoryExists = await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
                throw new BusinessException("Invalid category ID.");

            var product = new Product
            {
                Name = dto.Name.Trim(),
                SKU = sku,
                CategoryId = dto.CategoryId,
                UnitOfMeasure = string.IsNullOrWhiteSpace(dto.UnitOfMeasure) ? "PCS" : dto.UnitOfMeasure.Trim().ToUpper(),
                InitialStock = dto.InitialStock < 0 ? 0 : dto.InitialStock,
                ReorderLevel = dto.ReorderLevel < 0 ? 0 : dto.ReorderLevel,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            // Note: Initial stock will be updated when initial stock receipts are processed or assigned to warehouses.
            return await GetByIdAsync(product.Id);
        }

        public async Task<ProductDto> UpdateAsync(int id, UpdateProductDto dto)
        {
            var product = await _db.Products.FindAsync(id)
                ?? throw new NotFoundException($"Product with ID {id} not found.");

            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new BusinessException("Product name cannot be empty.");

            var sku = dto.SKU.Trim().ToUpper();
            if (await _db.Products.AnyAsync(p => p.SKU == sku && p.Id != id))
                throw new BusinessException($"Product with SKU '{sku}' already exists.");

            product.Name = dto.Name.Trim();
            product.SKU = sku;
            product.CategoryId = dto.CategoryId;
            product.UnitOfMeasure = dto.UnitOfMeasure.Trim().ToUpper();
            product.ReorderLevel = dto.ReorderLevel;
            product.IsActive = dto.IsActive;
            product.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return await GetByIdAsync(product.Id);
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _db.Products.FindAsync(id)
                ?? throw new NotFoundException($"Product with ID {id} not found.");

            bool hasLedgerHistory = await _db.StockLedgers.AnyAsync(l => l.ProductId == id);
            if (hasLedgerHistory)
                throw new BusinessException("Cannot delete products that have historical stock transactions.");

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
        }
    }

    public class InventoryService : IInventoryService
    {
        private readonly IApplicationDbContext _db;
        public InventoryService(IApplicationDbContext db) => _db = db;

        public async Task<List<InventoryDto>> GetAllAsync(int? categoryId = null, int? warehouseId = null, string? stockStatus = null, string? search = null)
        {
            var query = _db.Inventories
                .Include(i => i.Product)
                .ThenInclude(p => p!.Category)
                .Include(i => i.Warehouse)
                .AsQueryable();

            if (categoryId.HasValue && categoryId.Value > 0)
                query = query.Where(i => i.Product != null && i.Product.CategoryId == categoryId.Value);

            if (warehouseId.HasValue && warehouseId.Value > 0)
                query = query.Where(i => i.WarehouseId == warehouseId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(i => (i.Product != null && (i.Product.Name.ToLower().Contains(term) || i.Product.SKU.ToLower().Contains(term)))
                                      || (i.Warehouse != null && i.Warehouse.Name.ToLower().Contains(term)));
            }

            var items = await query.ToListAsync();

            var dtos = items.Select(i =>
            {
                int reorderLevel = i.Product?.ReorderLevel ?? 10;
                string status = i.Quantity == 0 ? "Out of Stock" : (i.Quantity <= reorderLevel ? "Low Stock" : "In Stock");
                return new InventoryDto(
                    i.Id,
                    i.ProductId,
                    i.Product?.Name ?? "Unknown",
                    i.Product?.SKU ?? "N/A",
                    i.WarehouseId,
                    i.Warehouse?.Name ?? "Unknown",
                    i.Quantity,
                    i.ReservedQuantity,
                    i.AvailableQuantity,
                    reorderLevel,
                    status,
                    i.UpdatedAt
                );
            }).ToList();

            if (!string.IsNullOrWhiteSpace(stockStatus))
            {
                dtos = dtos.Where(d => d.Status.Equals(stockStatus.Trim(), StringComparison.OrdinalIgnoreCase)).ToList();
            }

            return dtos;
        }

        public async Task<List<InventoryDto>> GetByProductIdAsync(int productId)
        {
            return await GetAllAsync(categoryId: null, warehouseId: null, stockStatus: null, search: null)
                .ContinueWith(t => t.Result.Where(i => i.ProductId == productId).ToList());
        }

        public async Task<List<InventoryDto>> GetByWarehouseIdAsync(int warehouseId)
        {
            return await GetAllAsync(categoryId: null, warehouseId: warehouseId, stockStatus: null, search: null);
        }
    }

    public class ReceiptService : IReceiptService
    {
        private readonly IApplicationDbContext _db;
        public ReceiptService(IApplicationDbContext db) => _db = db;

        public async Task<List<ReceiptDto>> GetAllAsync()
        {
            var receipts = await _db.Receipts
                .Include(r => r.Supplier)
                .Include(r => r.Warehouse)
                .Include(r => r.Items)
                .ThenInclude(ri => ri.Product)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return receipts.Select(MapToDto).ToList();
        }

        public async Task<ReceiptDto> GetByIdAsync(int id)
        {
            var r = await _db.Receipts
                .Include(r => r.Supplier)
                .Include(r => r.Warehouse)
                .Include(r => r.Items)
                .ThenInclude(ri => ri.Product)
                .FirstOrDefaultAsync(r => r.Id == id)
                ?? throw new NotFoundException($"Receipt with ID {id} not found.");

            return MapToDto(r);
        }

        public async Task<ReceiptDto> CreateAsync(CreateReceiptDto dto)
        {
            if (dto.Items == null || !dto.Items.Any())
                throw new BusinessException("Receipt must contain at least one item.");

            if (dto.Items.Any(i => i.Quantity <= 0))
                throw new BusinessException("Quantity must be greater than 0 for all receipt items.");

            var supplier = await _db.Suppliers.FindAsync(dto.SupplierId)
                ?? throw new BusinessException("Invalid supplier.");

            var warehouse = await _db.Warehouses.FindAsync(dto.WarehouseId)
                ?? throw new BusinessException("Invalid warehouse.");

            var receiptNumber = $"REC-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()}";

            var receipt = new Receipt
            {
                ReceiptNumber = receiptNumber,
                SupplierId = dto.SupplierId,
                WarehouseId = dto.WarehouseId,
                Status = OperationStatus.Draft,
                ReceiptDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                Items = dto.Items.Select(i => new ReceiptItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };

            _db.Receipts.Add(receipt);
            await _db.SaveChangesAsync();

            return await GetByIdAsync(receipt.Id);
        }

        public async Task<ReceiptDto> ValidateAsync(int id, string currentUser)
        {
            var receipt = await _db.Receipts
                .Include(r => r.Warehouse)
                .Include(r => r.Items)
                .ThenInclude(ri => ri.Product)
                .FirstOrDefaultAsync(r => r.Id == id)
                ?? throw new NotFoundException($"Receipt with ID {id} not found.");

            if (receipt.Status == OperationStatus.Done)
                throw new BusinessException($"Receipt '{receipt.ReceiptNumber}' has already been validated.");

            if (receipt.Status == OperationStatus.Canceled)
                throw new BusinessException($"Receipt '{receipt.ReceiptNumber}' is canceled and cannot be validated.");

            // Update inventory and log stock ledger
            foreach (var item in receipt.Items)
            {
                var inventory = await _db.Inventories
                    .FirstOrDefaultAsync(i => i.ProductId == item.ProductId && i.WarehouseId == receipt.WarehouseId);

                if (inventory == null)
                {
                    inventory = new Inventory
                    {
                        ProductId = item.ProductId,
                        WarehouseId = receipt.WarehouseId,
                        Quantity = 0,
                        ReservedQuantity = 0,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _db.Inventories.Add(inventory);
                }

                int qtyBefore = inventory.Quantity;
                inventory.Quantity += item.Quantity;
                inventory.UpdatedAt = DateTime.UtcNow;

                var ledger = new StockLedger
                {
                    ProductId = item.ProductId,
                    WarehouseId = receipt.WarehouseId,
                    TransactionType = TransactionType.RECEIPT,
                    ReferenceId = receipt.ReceiptNumber,
                    QuantityBefore = qtyBefore,
                    QuantityChange = item.Quantity,
                    QuantityAfter = inventory.Quantity,
                    Description = $"Received {item.Quantity} {item.Product?.UnitOfMeasure ?? "PCS"} via {receipt.ReceiptNumber}",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = currentUser
                };
                _db.StockLedgers.Add(ledger);
            }

            receipt.Status = OperationStatus.Done;
            await _db.SaveChangesAsync();

            return await GetByIdAsync(receipt.Id);
        }

        private static ReceiptDto MapToDto(Receipt r)
        {
            return new ReceiptDto(
                r.Id,
                r.ReceiptNumber,
                r.SupplierId,
                r.Supplier?.Name ?? "Unknown Supplier",
                r.WarehouseId,
                r.Warehouse?.Name ?? "Unknown Warehouse",
                r.Status,
                r.ReceiptDate,
                r.CreatedAt,
                r.Items.Select(i => new ReceiptItemDto(
                    i.Id,
                    i.ProductId,
                    i.Product?.Name ?? "Unknown",
                    i.Product?.SKU ?? "N/A",
                    i.Quantity
                )).ToList()
            );
        }
    }

    public class DeliveryService : IDeliveryService
    {
        private readonly IApplicationDbContext _db;
        public DeliveryService(IApplicationDbContext db) => _db = db;

        public async Task<List<DeliveryDto>> GetAllAsync()
        {
            var deliveries = await _db.DeliveryOrders
                .Include(d => d.Warehouse)
                .Include(d => d.Items)
                .ThenInclude(di => di.Product)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return deliveries.Select(MapToDto).ToList();
        }

        public async Task<DeliveryDto> GetByIdAsync(int id)
        {
            var d = await _db.DeliveryOrders
                .Include(d => d.Warehouse)
                .Include(d => d.Items)
                .ThenInclude(di => di.Product)
                .FirstOrDefaultAsync(d => d.Id == id)
                ?? throw new NotFoundException($"Delivery Order with ID {id} not found.");

            return MapToDto(d);
        }

        public async Task<DeliveryDto> CreateAsync(CreateDeliveryDto dto)
        {
            if (dto.Items == null || !dto.Items.Any())
                throw new BusinessException("Delivery order must contain at least one item.");

            if (dto.Items.Any(i => i.Quantity <= 0))
                throw new BusinessException("Quantity must be greater than 0 for all delivery items.");

            var warehouse = await _db.Warehouses.FindAsync(dto.WarehouseId)
                ?? throw new BusinessException("Invalid warehouse.");

            var deliveryNumber = $"DEL-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()}";

            var delivery = new DeliveryOrder
            {
                DeliveryNumber = deliveryNumber,
                WarehouseId = dto.WarehouseId,
                Status = OperationStatus.Draft,
                DeliveryDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                Items = dto.Items.Select(i => new DeliveryItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };

            _db.DeliveryOrders.Add(delivery);
            await _db.SaveChangesAsync();

            return await GetByIdAsync(delivery.Id);
        }

        public async Task<DeliveryDto> ValidateAsync(int id, string currentUser)
        {
            var delivery = await _db.DeliveryOrders
                .Include(d => d.Warehouse)
                .Include(d => d.Items)
                .ThenInclude(di => di.Product)
                .FirstOrDefaultAsync(d => d.Id == id)
                ?? throw new NotFoundException($"Delivery Order with ID {id} not found.");

            if (delivery.Status == OperationStatus.Done)
                throw new BusinessException($"Delivery order '{delivery.DeliveryNumber}' has already been validated.");

            if (delivery.Status == OperationStatus.Canceled)
                throw new BusinessException($"Delivery order '{delivery.DeliveryNumber}' is canceled and cannot be validated.");

            // Business Validation: Check available stock for each product
            foreach (var item in delivery.Items)
            {
                var inventory = await _db.Inventories
                    .FirstOrDefaultAsync(i => i.ProductId == item.ProductId && i.WarehouseId == delivery.WarehouseId);

                int availableStock = inventory?.AvailableQuantity ?? 0;
                if (item.Quantity > availableStock)
                {
                    var productName = item.Product?.Name ?? $"Product #{item.ProductId}";
                    throw new BusinessException($"Insufficient stock for {productName}. Available stock at {delivery.Warehouse?.Name} is {availableStock}, requested is {item.Quantity}.");
                }
            }

            // Execute inventory reduction and write StockLedger
            foreach (var item in delivery.Items)
            {
                var inventory = await _db.Inventories
                    .FirstAsync(i => i.ProductId == item.ProductId && i.WarehouseId == delivery.WarehouseId);

                int qtyBefore = inventory.Quantity;
                inventory.Quantity -= item.Quantity;
                inventory.UpdatedAt = DateTime.UtcNow;

                var ledger = new StockLedger
                {
                    ProductId = item.ProductId,
                    WarehouseId = delivery.WarehouseId,
                    TransactionType = TransactionType.DELIVERY,
                    ReferenceId = delivery.DeliveryNumber,
                    QuantityBefore = qtyBefore,
                    QuantityChange = -item.Quantity,
                    QuantityAfter = inventory.Quantity,
                    Description = $"Shipped {item.Quantity} {item.Product?.UnitOfMeasure ?? "PCS"} via {delivery.DeliveryNumber}",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = currentUser
                };
                _db.StockLedgers.Add(ledger);
            }

            delivery.Status = OperationStatus.Done;
            await _db.SaveChangesAsync();

            return await GetByIdAsync(delivery.Id);
        }

        private static DeliveryDto MapToDto(DeliveryOrder d)
        {
            return new DeliveryDto(
                d.Id,
                d.DeliveryNumber,
                d.WarehouseId,
                d.Warehouse?.Name ?? "Unknown Warehouse",
                d.Status,
                d.DeliveryDate,
                d.CreatedAt,
                d.Items.Select(i => new DeliveryItemDto(
                    i.Id,
                    i.ProductId,
                    i.Product?.Name ?? "Unknown",
                    i.Product?.SKU ?? "N/A",
                    i.Quantity,
                    0
                )).ToList()
            );
        }
    }

    public class TransferService : ITransferService
    {
        private readonly IApplicationDbContext _db;
        public TransferService(IApplicationDbContext db) => _db = db;

        public async Task<List<TransferDto>> GetAllAsync()
        {
            var transfers = await _db.InternalTransfers
                .Include(t => t.SourceWarehouse)
                .Include(t => t.DestinationWarehouse)
                .Include(t => t.Items)
                .ThenInclude(ti => ti.Product)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return transfers.Select(MapToDto).ToList();
        }

        public async Task<TransferDto> GetByIdAsync(int id)
        {
            var t = await _db.InternalTransfers
                .Include(t => t.SourceWarehouse)
                .Include(t => t.DestinationWarehouse)
                .Include(t => t.Items)
                .ThenInclude(ti => ti.Product)
                .FirstOrDefaultAsync(t => t.Id == id)
                ?? throw new NotFoundException($"Transfer with ID {id} not found.");

            return MapToDto(t);
        }

        public async Task<TransferDto> CreateAsync(CreateTransferDto dto)
        {
            if (dto.SourceWarehouseId == dto.DestinationWarehouseId)
                throw new BusinessException("Source and destination warehouse cannot be the same.");

            if (dto.Items == null || !dto.Items.Any())
                throw new BusinessException("Transfer must contain at least one item.");

            if (dto.Items.Any(i => i.Quantity <= 0))
                throw new BusinessException("Quantity must be greater than 0 for all transfer items.");

            var sourceWh = await _db.Warehouses.FindAsync(dto.SourceWarehouseId)
                ?? throw new BusinessException("Invalid source warehouse.");

            var destWh = await _db.Warehouses.FindAsync(dto.DestinationWarehouseId)
                ?? throw new BusinessException("Invalid destination warehouse.");

            var transferNumber = $"TRF-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()}";

            var transfer = new InternalTransfer
            {
                TransferNumber = transferNumber,
                SourceWarehouseId = dto.SourceWarehouseId,
                DestinationWarehouseId = dto.DestinationWarehouseId,
                Status = OperationStatus.Draft,
                TransferDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                Items = dto.Items.Select(i => new TransferItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };

            _db.InternalTransfers.Add(transfer);
            await _db.SaveChangesAsync();

            return await GetByIdAsync(transfer.Id);
        }

        public async Task<TransferDto> ValidateAsync(int id, string currentUser)
        {
            var transfer = await _db.InternalTransfers
                .Include(t => t.SourceWarehouse)
                .Include(t => t.DestinationWarehouse)
                .Include(t => t.Items)
                .ThenInclude(ti => ti.Product)
                .FirstOrDefaultAsync(t => t.Id == id)
                ?? throw new NotFoundException($"Transfer with ID {id} not found.");

            if (transfer.Status == OperationStatus.Done)
                throw new BusinessException($"Transfer '{transfer.TransferNumber}' has already been validated.");

            if (transfer.Status == OperationStatus.Canceled)
                throw new BusinessException($"Transfer '{transfer.TransferNumber}' is canceled and cannot be validated.");

            // Check stock at source warehouse
            foreach (var item in transfer.Items)
            {
                var sourceInv = await _db.Inventories
                    .FirstOrDefaultAsync(i => i.ProductId == item.ProductId && i.WarehouseId == transfer.SourceWarehouseId);

                int avail = sourceInv?.AvailableQuantity ?? 0;
                if (item.Quantity > avail)
                {
                    var productName = item.Product?.Name ?? $"Product #{item.ProductId}";
                    throw new BusinessException($"Transfer quantity ({item.Quantity}) exceeds available stock ({avail}) for {productName} at source warehouse {transfer.SourceWarehouse?.Name}.");
                }
            }

            // Perform transfer & generate TWO ledger records per item
            foreach (var item in transfer.Items)
            {
                // 1. Source Warehouse (Decrease)
                var sourceInv = await _db.Inventories
                    .FirstAsync(i => i.ProductId == item.ProductId && i.WarehouseId == transfer.SourceWarehouseId);

                int sourceBefore = sourceInv.Quantity;
                sourceInv.Quantity -= item.Quantity;
                sourceInv.UpdatedAt = DateTime.UtcNow;

                var sourceLedger = new StockLedger
                {
                    ProductId = item.ProductId,
                    WarehouseId = transfer.SourceWarehouseId,
                    TransactionType = TransactionType.TRANSFER_OUT,
                    ReferenceId = transfer.TransferNumber,
                    QuantityBefore = sourceBefore,
                    QuantityChange = -item.Quantity,
                    QuantityAfter = sourceInv.Quantity,
                    Description = $"Transferred OUT {item.Quantity} {item.Product?.UnitOfMeasure ?? "PCS"} to {transfer.DestinationWarehouse?.Name}",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = currentUser
                };
                _db.StockLedgers.Add(sourceLedger);

                // 2. Destination Warehouse (Increase)
                var destInv = await _db.Inventories
                    .FirstOrDefaultAsync(i => i.ProductId == item.ProductId && i.WarehouseId == transfer.DestinationWarehouseId);

                if (destInv == null)
                {
                    destInv = new Inventory
                    {
                        ProductId = item.ProductId,
                        WarehouseId = transfer.DestinationWarehouseId,
                        Quantity = 0,
                        ReservedQuantity = 0,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _db.Inventories.Add(destInv);
                }

                int destBefore = destInv.Quantity;
                destInv.Quantity += item.Quantity;
                destInv.UpdatedAt = DateTime.UtcNow;

                var destLedger = new StockLedger
                {
                    ProductId = item.ProductId,
                    WarehouseId = transfer.DestinationWarehouseId,
                    TransactionType = TransactionType.TRANSFER_IN,
                    ReferenceId = transfer.TransferNumber,
                    QuantityBefore = destBefore,
                    QuantityChange = item.Quantity,
                    QuantityAfter = destInv.Quantity,
                    Description = $"Transferred IN {item.Quantity} {item.Product?.UnitOfMeasure ?? "PCS"} from {transfer.SourceWarehouse?.Name}",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = currentUser
                };
                _db.StockLedgers.Add(destLedger);
            }

            transfer.Status = OperationStatus.Done;
            await _db.SaveChangesAsync();

            return await GetByIdAsync(transfer.Id);
        }

        private static TransferDto MapToDto(InternalTransfer t)
        {
            return new TransferDto(
                t.Id,
                t.TransferNumber,
                t.SourceWarehouseId,
                t.SourceWarehouse?.Name ?? "Unknown Source",
                t.DestinationWarehouseId,
                t.DestinationWarehouse?.Name ?? "Unknown Destination",
                t.Status,
                t.TransferDate,
                t.CreatedAt,
                t.Items.Select(i => new TransferItemDto(
                    i.Id,
                    i.ProductId,
                    i.Product?.Name ?? "Unknown",
                    i.Product?.SKU ?? "N/A",
                    i.Quantity,
                    0
                )).ToList()
            );
        }
    }

    public class StockAdjustmentService : IStockAdjustmentService
    {
        private readonly IApplicationDbContext _db;
        public StockAdjustmentService(IApplicationDbContext db) => _db = db;

        public async Task<List<AdjustmentDto>> GetAllAsync()
        {
            var adjustments = await _db.StockAdjustments
                .Include(a => a.Warehouse)
                .Include(a => a.Items)
                .ThenInclude(ai => ai.Product)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return adjustments.Select(MapToDto).ToList();
        }

        public async Task<AdjustmentDto> GetByIdAsync(int id)
        {
            var a = await _db.StockAdjustments
                .Include(a => a.Warehouse)
                .Include(a => a.Items)
                .ThenInclude(ai => ai.Product)
                .FirstOrDefaultAsync(a => a.Id == id)
                ?? throw new NotFoundException($"Stock Adjustment with ID {id} not found.");

            return MapToDto(a);
        }

        public async Task<AdjustmentDto> CreateAsync(CreateAdjustmentDto dto)
        {
            if (dto.Items == null || !dto.Items.Any())
                throw new BusinessException("Stock adjustment must contain at least one item.");

            var warehouse = await _db.Warehouses.FindAsync(dto.WarehouseId)
                ?? throw new BusinessException("Invalid warehouse.");

            var adjNumber = $"ADJ-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()}";

            var adjustment = new StockAdjustment
            {
                AdjustmentNumber = adjNumber,
                WarehouseId = dto.WarehouseId,
                Reason = dto.Reason?.Trim() ?? "Physical count adjustment",
                Status = OperationStatus.Draft,
                AdjustmentDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var itemDto in dto.Items)
            {
                var inventory = await _db.Inventories
                    .FirstOrDefaultAsync(i => i.ProductId == itemDto.ProductId && i.WarehouseId == dto.WarehouseId);

                int systemQty = inventory?.Quantity ?? 0;
                int difference = itemDto.CountedQuantity - systemQty;

                adjustment.Items.Add(new StockAdjustmentItem
                {
                    ProductId = itemDto.ProductId,
                    SystemQuantity = systemQty,
                    CountedQuantity = itemDto.CountedQuantity,
                    Difference = difference
                });
            }

            _db.StockAdjustments.Add(adjustment);
            await _db.SaveChangesAsync();

            return await GetByIdAsync(adjustment.Id);
        }

        public async Task<AdjustmentDto> ValidateAsync(int id, string currentUser)
        {
            var adjustment = await _db.StockAdjustments
                .Include(a => a.Warehouse)
                .Include(a => a.Items)
                .ThenInclude(ai => ai.Product)
                .FirstOrDefaultAsync(a => a.Id == id)
                ?? throw new NotFoundException($"Stock Adjustment with ID {id} not found.");

            if (adjustment.Status == OperationStatus.Done)
                throw new BusinessException($"Stock Adjustment '{adjustment.AdjustmentNumber}' has already been validated.");

            if (adjustment.Status == OperationStatus.Canceled)
                throw new BusinessException($"Stock Adjustment '{adjustment.AdjustmentNumber}' is canceled and cannot be validated.");

            foreach (var item in adjustment.Items)
            {
                var inventory = await _db.Inventories
                    .FirstOrDefaultAsync(i => i.ProductId == item.ProductId && i.WarehouseId == adjustment.WarehouseId);

                if (inventory == null)
                {
                    inventory = new Inventory
                    {
                        ProductId = item.ProductId,
                        WarehouseId = adjustment.WarehouseId,
                        Quantity = 0,
                        ReservedQuantity = 0,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _db.Inventories.Add(inventory);
                }

                int qtyBefore = inventory.Quantity;
                inventory.Quantity = item.CountedQuantity;
                inventory.UpdatedAt = DateTime.UtcNow;

                var ledger = new StockLedger
                {
                    ProductId = item.ProductId,
                    WarehouseId = adjustment.WarehouseId,
                    TransactionType = TransactionType.ADJUSTMENT,
                    ReferenceId = adjustment.AdjustmentNumber,
                    QuantityBefore = qtyBefore,
                    QuantityChange = item.Difference,
                    QuantityAfter = inventory.Quantity,
                    Description = $"Stock adjustment reason: {adjustment.Reason} (Counted: {item.CountedQuantity}, Diff: {item.Difference})",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = currentUser
                };
                _db.StockLedgers.Add(ledger);
            }

            adjustment.Status = OperationStatus.Done;
            await _db.SaveChangesAsync();

            return await GetByIdAsync(adjustment.Id);
        }

        private static AdjustmentDto MapToDto(StockAdjustment a)
        {
            return new AdjustmentDto(
                a.Id,
                a.AdjustmentNumber,
                a.WarehouseId,
                a.Warehouse?.Name ?? "Unknown Warehouse",
                a.Reason,
                a.Status,
                a.AdjustmentDate,
                a.CreatedAt,
                a.Items.Select(i => new AdjustmentItemDto(
                    i.Id,
                    i.ProductId,
                    i.Product?.Name ?? "Unknown",
                    i.Product?.SKU ?? "N/A",
                    i.SystemQuantity,
                    i.CountedQuantity,
                    i.Difference
                )).ToList()
            );
        }
    }

    public class StockLedgerService : IStockLedgerService
    {
        private readonly IApplicationDbContext _db;
        public StockLedgerService(IApplicationDbContext db) => _db = db;

        public async Task<List<StockLedgerDto>> GetAllAsync(int? productId = null, int? warehouseId = null, TransactionType? transactionType = null)
        {
            var query = _db.StockLedgers
                .Include(l => l.Product)
                .Include(l => l.Warehouse)
                .AsQueryable();

            if (productId.HasValue && productId.Value > 0)
                query = query.Where(l => l.ProductId == productId.Value);

            if (warehouseId.HasValue && warehouseId.Value > 0)
                query = query.Where(l => l.WarehouseId == warehouseId.Value);

            if (transactionType.HasValue)
                query = query.Where(l => l.TransactionType == transactionType.Value);

            var ledgers = await query.OrderByDescending(l => l.CreatedAt).ToListAsync();

            return ledgers.Select(l => new StockLedgerDto(
                l.Id,
                l.ProductId,
                l.Product?.Name ?? "Unknown",
                l.Product?.SKU ?? "N/A",
                l.WarehouseId,
                l.Warehouse?.Name ?? "Unknown",
                l.TransactionType,
                l.ReferenceId,
                l.QuantityBefore,
                l.QuantityChange,
                l.QuantityAfter,
                l.Description,
                l.CreatedAt,
                l.CreatedBy
            )).ToList();
        }

        public async Task<List<StockLedgerDto>> GetByProductIdAsync(int productId)
        {
            return await GetAllAsync(productId: productId);
        }

        public async Task<List<StockLedgerDto>> GetByWarehouseIdAsync(int warehouseId)
        {
            return await GetAllAsync(warehouseId: warehouseId);
        }
    }

    public class DashboardService : IDashboardService
    {
        private readonly IApplicationDbContext _db;
        public DashboardService(IApplicationDbContext db) => _db = db;

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            int totalProducts = await _db.Products.CountAsync(p => p.IsActive);

            var inventories = await _db.Inventories
                .Include(i => i.Product)
                .ThenInclude(p => p!.Category)
                .ToListAsync();

            int totalStockQuantity = inventories.Sum(i => i.Quantity);

            // Group inventory quantity per product to evaluate overall stock status
            var productStockTotals = await _db.Products
                .Where(p => p.IsActive)
                .Include(p => p.Category)
                .Include(p => p.Inventories)
                .Select(p => new
                {
                    Product = p,
                    TotalStock = p.Inventories.Sum(i => i.Quantity)
                })
                .ToListAsync();

            int lowStockCount = productStockTotals.Count(x => x.TotalStock > 0 && x.TotalStock <= x.Product.ReorderLevel);
            int outOfStockCount = productStockTotals.Count(x => x.TotalStock == 0);

            int pendingReceipts = await _db.Receipts.CountAsync(r => r.Status == OperationStatus.Draft || r.Status == OperationStatus.Waiting || r.Status == OperationStatus.Ready);
            int pendingDeliveries = await _db.DeliveryOrders.CountAsync(d => d.Status == OperationStatus.Draft || d.Status == OperationStatus.Waiting || d.Status == OperationStatus.Ready);
            int pendingTransfers = await _db.InternalTransfers.CountAsync(t => t.Status == OperationStatus.Draft || t.Status == OperationStatus.Waiting || t.Status == OperationStatus.Ready);

            var lowStockProducts = productStockTotals
                .Where(x => x.TotalStock <= x.Product.ReorderLevel)
                .OrderBy(x => x.TotalStock)
                .Take(10)
                .Select(x => new LowStockItemDto(
                    x.Product.Id,
                    x.Product.Name,
                    x.Product.SKU,
                    x.Product.Category?.Name ?? "Uncategorized",
                    x.TotalStock,
                    x.Product.ReorderLevel,
                    x.TotalStock == 0 ? "Out of Stock" : "Low Stock"
                ))
                .ToList();

            var recentMovements = await _db.StockLedgers
                .Include(l => l.Product)
                .Include(l => l.Warehouse)
                .OrderByDescending(l => l.CreatedAt)
                .Take(10)
                .Select(l => new StockLedgerDto(
                    l.Id,
                    l.ProductId,
                    l.Product != null ? l.Product.Name : "Unknown",
                    l.Product != null ? l.Product.SKU : "N/A",
                    l.WarehouseId,
                    l.Warehouse != null ? l.Warehouse.Name : "Unknown",
                    l.TransactionType,
                    l.ReferenceId,
                    l.QuantityBefore,
                    l.QuantityChange,
                    l.QuantityAfter,
                    l.Description,
                    l.CreatedAt,
                    l.CreatedBy
                ))
                .ToListAsync();

            // Aggregated movement trends over the last 7 days
            var startDate = DateTime.UtcNow.Date.AddDays(-6);
            var ledgersLast7Days = await _db.StockLedgers
                .Where(l => l.CreatedAt >= startDate)
                .ToListAsync();

            var historyPoints = new List<StockMovementPointDto>();
            for (int i = 0; i < 7; i++)
            {
                var day = startDate.AddDays(i);
                var dayLedgers = ledgersLast7Days.Where(l => l.CreatedAt.Date == day).ToList();

                int receiptQty = dayLedgers.Where(l => l.TransactionType == TransactionType.RECEIPT).Sum(l => l.QuantityChange);
                int deliveryQty = Math.Abs(dayLedgers.Where(l => l.TransactionType == TransactionType.DELIVERY).Sum(l => l.QuantityChange));
                int transferQty = dayLedgers.Where(l => l.TransactionType == TransactionType.TRANSFER_IN).Sum(l => l.QuantityChange);
                int adjustmentQty = dayLedgers.Where(l => l.TransactionType == TransactionType.ADJUSTMENT).Sum(l => Math.Abs(l.QuantityChange));

                historyPoints.Add(new StockMovementPointDto(
                    day.ToString("MMM dd"),
                    receiptQty,
                    deliveryQty,
                    transferQty,
                    adjustmentQty
                ));
            }

            return new DashboardSummaryDto(
                totalProducts,
                totalStockQuantity,
                lowStockCount,
                outOfStockCount,
                pendingReceipts,
                pendingDeliveries,
                pendingTransfers,
                lowStockProducts,
                recentMovements,
                historyPoints
            );
        }
    }
}
