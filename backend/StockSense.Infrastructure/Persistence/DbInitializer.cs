using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockSense.Application.Interfaces;
using StockSense.Domain.Entities;
using StockSense.Domain.Enums;

namespace StockSense.Infrastructure.Persistence
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context, IPasswordHasher passwordHasher)
        {
            await context.Database.EnsureCreatedAsync();

            // 1. Seed Users
            if (!await context.Users.AnyAsync())
            {
                var admin = new User
                {
                    Name = "StockSense Admin",
                    Email = "admin@stocksense.com",
                    PasswordHash = passwordHasher.HashPassword("Admin@123"),
                    Role = UserRole.Admin,
                    CreatedAt = DateTime.UtcNow
                };

                var manager = new User
                {
                    Name = "Sarah Connor (Manager)",
                    Email = "manager@stocksense.com",
                    PasswordHash = passwordHasher.HashPassword("Manager@123"),
                    Role = UserRole.InventoryManager,
                    CreatedAt = DateTime.UtcNow
                };

                var staff = new User
                {
                    Name = "John Doe (Staff)",
                    Email = "staff@stocksense.com",
                    PasswordHash = passwordHasher.HashPassword("Staff@123"),
                    Role = UserRole.WarehouseStaff,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.AddRange(admin, manager, staff);
                await context.SaveChangesAsync();
            }

            // 2. Seed Categories
            if (!await context.Categories.AnyAsync())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Electronics", Description = "Electronic components, sensors, microcontrollers" },
                    new Category { Name = "Raw Materials", Description = "Metals, plastics, raw chemical compounds" },
                    new Category { Name = "Finished Goods", Description = "Assembled products ready for customer dispatch" },
                    new Category { Name = "Packaging", Description = "Boxes, pallets, protective wrap materials" },
                    new Category { Name = "Spare Parts", Description = "Replacement components and maintenance parts" }
                };
                context.Categories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            // 3. Seed Warehouses
            if (!await context.Warehouses.AnyAsync())
            {
                var warehouses = new List<Warehouse>
                {
                    new Warehouse { Name = "Main Distribution Center", Code = "WH-MAIN", Location = "Building A, Logistics Park, NY", IsActive = true },
                    new Warehouse { Name = "Regional Warehouse North", Code = "WH-NORTH", Location = "Sector 4, Industrial Zone, NJ", IsActive = true }
                };
                context.Warehouses.AddRange(warehouses);
                await context.SaveChangesAsync();
            }

            // 4. Seed Supplier
            if (!await context.Suppliers.AnyAsync())
            {
                var supplier = new Supplier
                {
                    Name = "Apex Logistics & Components",
                    ContactPerson = "Robert Vance",
                    Email = "contact@apexlogistics.com",
                    Phone = "+1 (555) 234-5678",
                    Address = "100 Supply Chain Way, Chicago, IL"
                };
                context.Suppliers.Add(supplier);
                await context.SaveChangesAsync();
            }

            // 5. Seed 5 Demo Products
            if (!await context.Products.AnyAsync())
            {
                var elecCat = await context.Categories.FirstAsync(c => c.Name == "Electronics");
                var rawCat = await context.Categories.FirstAsync(c => c.Name == "Raw Materials");
                var finCat = await context.Categories.FirstAsync(c => c.Name == "Finished Goods");
                var packCat = await context.Categories.FirstAsync(c => c.Name == "Packaging");
                var spareCat = await context.Categories.FirstAsync(c => c.Name == "Spare Parts");

                var products = new List<Product>
                {
                    new Product { Name = "Industrial Stepper Motor NEMA 23", SKU = "PRD-ELE-001", CategoryId = elecCat.Id, UnitOfMeasure = "PCS", InitialStock = 120, ReorderLevel = 25, CreatedAt = DateTime.UtcNow.AddDays(-30) },
                    new Product { Name = "Precision Ball Bearing 6204-ZZ", SKU = "PRD-SPR-002", CategoryId = spareCat.Id, UnitOfMeasure = "PCS", InitialStock = 450, ReorderLevel = 100, CreatedAt = DateTime.UtcNow.AddDays(-30) },
                    new Product { Name = "Fiber Optic Transceiver 10G", SKU = "PRD-ELE-003", CategoryId = elecCat.Id, UnitOfMeasure = "PCS", InitialStock = 15, ReorderLevel = 30, CreatedAt = DateTime.UtcNow.AddDays(-30) },
                    new Product { Name = "Heavy Duty Corrugated Box 40x40", SKU = "PRD-PKG-004", CategoryId = packCat.Id, UnitOfMeasure = "BOX", InitialStock = 500, ReorderLevel = 150, CreatedAt = DateTime.UtcNow.AddDays(-30) },
                    new Product { Name = "Aluminum Alloy Sheet 6061 2mm", SKU = "PRD-RAW-005", CategoryId = rawCat.Id, UnitOfMeasure = "SHEET", InitialStock = 0, ReorderLevel = 20, CreatedAt = DateTime.UtcNow.AddDays(-30) }
                };

                context.Products.AddRange(products);
                await context.SaveChangesAsync();

                // 6. Seed Initial Inventories & Historical Ledger Rows
                var mainWh = await context.Warehouses.FirstAsync(w => w.Code == "WH-MAIN");
                var northWh = await context.Warehouses.FirstAsync(w => w.Code == "WH-NORTH");

                var prod1 = products[0]; // Motor
                var prod2 = products[1]; // Bearing
                var prod3 = products[2]; // Fiber (Low Stock)
                var prod4 = products[3]; // Box
                var prod5 = products[4]; // Aluminum (Out of Stock)

                // Stock allocations
                var inventories = new List<Inventory>
                {
                    new Inventory { ProductId = prod1.Id, WarehouseId = mainWh.Id, Quantity = 90, ReservedQuantity = 0, UpdatedAt = DateTime.UtcNow },
                    new Inventory { ProductId = prod1.Id, WarehouseId = northWh.Id, Quantity = 30, ReservedQuantity = 0, UpdatedAt = DateTime.UtcNow },
                    new Inventory { ProductId = prod2.Id, WarehouseId = mainWh.Id, Quantity = 300, ReservedQuantity = 0, UpdatedAt = DateTime.UtcNow },
                    new Inventory { ProductId = prod2.Id, WarehouseId = northWh.Id, Quantity = 150, ReservedQuantity = 0, UpdatedAt = DateTime.UtcNow },
                    new Inventory { ProductId = prod3.Id, WarehouseId = mainWh.Id, Quantity = 15, ReservedQuantity = 0, UpdatedAt = DateTime.UtcNow }, // Low stock (total 15 vs reorder 30)
                    new Inventory { ProductId = prod4.Id, WarehouseId = mainWh.Id, Quantity = 500, ReservedQuantity = 0, UpdatedAt = DateTime.UtcNow },
                    new Inventory { ProductId = prod5.Id, WarehouseId = mainWh.Id, Quantity = 0, ReservedQuantity = 0, UpdatedAt = DateTime.UtcNow }  // Out of stock
                };
                context.Inventories.AddRange(inventories);
                await context.SaveChangesAsync();

                // Seed Ledgers
                var ledgers = new List<StockLedger>
                {
                    new StockLedger { ProductId = prod1.Id, WarehouseId = mainWh.Id, TransactionType = TransactionType.RECEIPT, ReferenceId = "REC-20260901-001", QuantityBefore = 0, QuantityChange = 100, QuantityAfter = 100, Description = "Initial Stock Receipt", CreatedAt = DateTime.UtcNow.AddDays(-10), CreatedBy = "System Admin" },
                    new StockLedger { ProductId = prod1.Id, WarehouseId = mainWh.Id, TransactionType = TransactionType.DELIVERY, ReferenceId = "DEL-20260905-001", QuantityBefore = 100, QuantityChange = -10, QuantityAfter = 90, Description = "Shipped to Assembly Line A", CreatedAt = DateTime.UtcNow.AddDays(-5), CreatedBy = "John Doe (Staff)" },
                    new StockLedger { ProductId = prod2.Id, WarehouseId = mainWh.Id, TransactionType = TransactionType.RECEIPT, ReferenceId = "REC-20260902-002", QuantityBefore = 0, QuantityChange = 300, QuantityAfter = 300, Description = "Bulk Receipt from Apex", CreatedAt = DateTime.UtcNow.AddDays(-8), CreatedBy = "System Admin" },
                    new StockLedger { ProductId = prod3.Id, WarehouseId = mainWh.Id, TransactionType = TransactionType.ADJUSTMENT, ReferenceId = "ADJ-20260910-001", QuantityBefore = 20, QuantityChange = -5, QuantityAfter = 15, Description = "Damaged component adjustment", CreatedAt = DateTime.UtcNow.AddDays(-2), CreatedBy = "Sarah Connor (Manager)" },
                    new StockLedger { ProductId = prod4.Id, WarehouseId = mainWh.Id, TransactionType = TransactionType.RECEIPT, ReferenceId = "REC-20260912-003", QuantityBefore = 0, QuantityChange = 500, QuantityAfter = 500, Description = "Packaging Pallet Intake", CreatedAt = DateTime.UtcNow.AddDays(-1), CreatedBy = "John Doe (Staff)" }
                };
                context.StockLedgers.AddRange(ledgers);
                await context.SaveChangesAsync();
            }

            // 7. Seed Commit 3 Data
            var existingSuppliers = await context.Suppliers.ToListAsync();
            foreach (var sup in existingSuppliers)
            {
                if (sup.Rating == 0) sup.Rating = 3;
                sup.IsActive = true;
            }
            await context.SaveChangesAsync();

            if (!await context.Notifications.AnyAsync())
            {
                var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Admin);
                if (adminUser != null)
                {
                    context.Notifications.AddRange(
                        new Notification { UserId = adminUser.Id, Title = "System Update", Message = "Welcome to StockSense Enhanced Edition", Type = NotificationType.SystemAlert, Priority = NotificationPriority.Low, CreatedAt = DateTime.UtcNow },
                        new Notification { UserId = adminUser.Id, Title = "Low Stock Alert", Message = "Item PRD-ELE-003 is below reorder level.", Type = NotificationType.LowStock, Priority = NotificationPriority.High, CreatedAt = DateTime.UtcNow.AddMinutes(-5) }
                    );
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
