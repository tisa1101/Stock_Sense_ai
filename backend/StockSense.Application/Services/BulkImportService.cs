using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Entities;
using StockSense.Domain.Enums;

namespace StockSense.Application.Services
{
    public class BulkImportService : IBulkImportService
    {
        private readonly IApplicationDbContext _context;

        public BulkImportService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BulkImportResultDto> ImportProductsAsync(Stream fileStream, string fileName, int userId)
        {
            var isExcel = fileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase) || fileName.EndsWith(".xls", StringComparison.OrdinalIgnoreCase);
            var rows = isExcel ? ReadExcelRows(fileStream) : ReadCsvRows(fileStream);

            if (rows.Count == 0)
            {
                return new BulkImportResultDto(0, 0, 0, new List<string>(), new List<BulkImportRowErrorDto>
                {
                    new BulkImportRowErrorDto(1, "", "File", "Uploaded file contains no data rows.")
                });
            }

            var successCount = 0;
            var errors = new List<BulkImportRowErrorDto>();
            var importedItems = new List<string>();

            // Pre-load existing categories and SKU set
            var categories = await _context.Categories.ToListAsync();
            var existingSkus = new HashSet<string>(await _context.Products.Select(p => p.SKU.ToUpper()).ToListAsync());

            var defaultCategory = categories.FirstOrDefault();
            if (defaultCategory == null)
            {
                defaultCategory = new Category { Name = "General", Description = "Default Category" };
                _context.Categories.Add(defaultCategory);
                await _context.SaveChangesAsync();
                categories.Add(defaultCategory);
            }

            for (int i = 0; i < rows.Count; i++)
            {
                var rowNumber = i + 2; // Accounting for 1-based header row
                var row = rows[i];

                var name = row.GetValueOrDefault("Name")?.Trim();
                var sku = row.GetValueOrDefault("SKU")?.Trim();
                var categoryName = row.GetValueOrDefault("Category")?.Trim();
                var unitOfMeasure = row.GetValueOrDefault("UnitOfMeasure")?.Trim();
                var reorderLevelStr = row.GetValueOrDefault("ReorderLevel")?.Trim();

                if (string.IsNullOrWhiteSpace(name))
                {
                    errors.Add(new BulkImportRowErrorDto(rowNumber, sku ?? "", "Name", "Product Name is required."));
                    continue;
                }

                if (string.IsNullOrWhiteSpace(sku))
                {
                    errors.Add(new BulkImportRowErrorDto(rowNumber, "", "SKU", "SKU is required."));
                    continue;
                }

                if (existingSkus.Contains(sku.ToUpper()))
                {
                    errors.Add(new BulkImportRowErrorDto(rowNumber, sku, "SKU", $"Product with SKU '{sku}' already exists."));
                    continue;
                }

                int reorderLevel = 10;
                if (!string.IsNullOrWhiteSpace(reorderLevelStr) && !int.TryParse(reorderLevelStr, out reorderLevel))
                {
                    reorderLevel = 10;
                }

                // Match or auto-create category
                Category? category = null;
                if (!string.IsNullOrWhiteSpace(categoryName))
                {
                    category = categories.FirstOrDefault(c => c.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));
                    if (category == null)
                    {
                        category = new Category { Name = categoryName, Description = $"Auto-created during bulk import" };
                        _context.Categories.Add(category);
                        await _context.SaveChangesAsync();
                        categories.Add(category);
                    }
                }
                else
                {
                    category = defaultCategory;
                }

                var product = new Product
                {
                    Name = name,
                    SKU = sku.ToUpper(),
                    CategoryId = category.Id,
                    UnitOfMeasure = !string.IsNullOrWhiteSpace(unitOfMeasure) ? unitOfMeasure : "PCS",
                    ReorderLevel = reorderLevel > 0 ? reorderLevel : 10,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                existingSkus.Add(sku.ToUpper());
                importedItems.Add($"{name} ({sku})");
                successCount++;
            }

            if (successCount > 0)
            {
                await _context.SaveChangesAsync();
            }

            return new BulkImportResultDto(
                TotalRows: rows.Count,
                SuccessCount: successCount,
                FailedCount: errors.Count,
                ImportedItems: importedItems,
                Errors: errors
            );
        }

        public async Task<BulkImportResultDto> ImportOpeningStockAsync(Stream fileStream, string fileName, int userId)
        {
            var isExcel = fileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase) || fileName.EndsWith(".xls", StringComparison.OrdinalIgnoreCase);
            var rows = isExcel ? ReadExcelRows(fileStream) : ReadCsvRows(fileStream);

            if (rows.Count == 0)
            {
                return new BulkImportResultDto(0, 0, 0, new List<string>(), new List<BulkImportRowErrorDto>
                {
                    new BulkImportRowErrorDto(1, "", "File", "Uploaded file contains no data rows.")
                });
            }

            var successCount = 0;
            var errors = new List<BulkImportRowErrorDto>();
            var importedItems = new List<string>();

            var products = await _context.Products.ToDictionaryAsync(p => p.SKU.ToUpper(), p => p);
            var warehouses = await _context.Warehouses.ToListAsync();
            var defaultWarehouse = warehouses.FirstOrDefault();

            if (defaultWarehouse == null)
            {
                return new BulkImportResultDto(0, 0, rows.Count, new List<string>(), new List<BulkImportRowErrorDto>
                {
                    new BulkImportRowErrorDto(1, "", "Warehouse", "No warehouses exist. Please create a warehouse first.")
                });
            }

            for (int i = 0; i < rows.Count; i++)
            {
                var rowNumber = i + 2;
                var row = rows[i];

                var sku = row.GetValueOrDefault("SKU")?.Trim();
                var warehouseCodeOrName = row.GetValueOrDefault("Warehouse")?.Trim();
                var quantityStr = row.GetValueOrDefault("Quantity")?.Trim();
                var reason = row.GetValueOrDefault("Notes")?.Trim() ?? "Initial Opening Stock Import";

                if (string.IsNullOrWhiteSpace(sku))
                {
                    errors.Add(new BulkImportRowErrorDto(rowNumber, "", "SKU", "SKU is required."));
                    continue;
                }

                if (!products.TryGetValue(sku.ToUpper(), out var product))
                {
                    errors.Add(new BulkImportRowErrorDto(rowNumber, sku, "SKU", $"Product with SKU '{sku}' was not found. Please create the product first."));
                    continue;
                }

                if (!int.TryParse(quantityStr, out var quantity) || quantity < 0)
                {
                    errors.Add(new BulkImportRowErrorDto(rowNumber, sku, "Quantity", "Quantity must be a non-negative integer."));
                    continue;
                }

                Warehouse? warehouse = null;
                if (!string.IsNullOrWhiteSpace(warehouseCodeOrName))
                {
                    warehouse = warehouses.FirstOrDefault(w => 
                        w.Code.Equals(warehouseCodeOrName, StringComparison.OrdinalIgnoreCase) || 
                        w.Name.Equals(warehouseCodeOrName, StringComparison.OrdinalIgnoreCase));
                }

                warehouse ??= defaultWarehouse;

                // Check current inventory record
                var inventory = await _context.Inventories
                    .FirstOrDefaultAsync(inv => inv.ProductId == product.Id && inv.WarehouseId == warehouse.Id);

                var beforeQty = inventory?.Quantity ?? 0;
                var qtyChange = quantity - beforeQty;

                if (inventory == null)
                {
                    inventory = new Inventory
                    {
                        ProductId = product.Id,
                        WarehouseId = warehouse.Id,
                        Quantity = quantity,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Inventories.Add(inventory);
                }
                else
                {
                    inventory.Quantity = quantity;
                    inventory.UpdatedAt = DateTime.UtcNow;
                }

                // Write immutable stock ledger entry
                var ledger = new StockLedger
                {
                    ProductId = product.Id,
                    WarehouseId = warehouse.Id,
                    TransactionType = TransactionType.ADJUSTMENT,
                    ReferenceId = $"OPENING-{product.Id}",
                    QuantityBefore = beforeQty,
                    QuantityChange = qtyChange,
                    QuantityAfter = quantity,
                    Description = $"[Opening Stock] {reason}",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = userId > 0 ? userId.ToString() : "Admin"
                };

                _context.StockLedgers.Add(ledger);
                importedItems.Add($"{product.Name} ({sku}) in {warehouse.Name}: {quantity} units");
                successCount++;
            }

            if (successCount > 0)
            {
                await _context.SaveChangesAsync();
            }

            return new BulkImportResultDto(
                TotalRows: rows.Count,
                SuccessCount: successCount,
                FailedCount: errors.Count,
                ImportedItems: importedItems,
                Errors: errors
            );
        }

        public byte[] GetProductTemplateCsv()
        {
            var csv = "Name,SKU,Category,UnitOfMeasure,ReorderLevel\n" +
                      "\"Smart Industrial Sensor X1\",\"SKU-SENS-001\",\"Electronics\",\"PCS\",20\n" +
                      "\"Heavy Duty Steel Pallet\",\"SKU-PALL-002\",\"Packaging\",\"PCS\",15\n" +
                      "\"Alloy Ingot 5kg\",\"SKU-RAW-003\",\"Raw Materials\",\"KG\",30\n";
            return Encoding.UTF8.GetBytes(csv);
        }

        public byte[] GetOpeningStockTemplateCsv()
        {
            var csv = "SKU,Warehouse,Quantity,Notes\n" +
                      "\"SKU-SENS-001\",\"Main Warehouse\",150,\"Opening balance Q1\"\n" +
                      "\"SKU-PALL-002\",\"East Logistics Hub\",40,\"Verified physical stock count\"\n" +
                      "\"SKU-RAW-003\",\"West Distribution\",85,\"Initial batch receipt\"\n";
            return Encoding.UTF8.GetBytes(csv);
        }

        private List<Dictionary<string, string>> ReadCsvRows(Stream stream)
        {
            var list = new List<Dictionary<string, string>>();
            using var reader = new StreamReader(stream, Encoding.UTF8, true, 1024, true);

            var headerLine = reader.ReadLine();
            if (string.IsNullOrWhiteSpace(headerLine)) return list;

            var headers = ParseCsvLine(headerLine);

            while (!reader.EndOfStream)
            {
                var line = reader.ReadLine();
                if (string.IsNullOrWhiteSpace(line)) continue;

                var values = ParseCsvLine(line);
                var row = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

                for (int i = 0; i < headers.Count; i++)
                {
                    row[headers[i]] = i < values.Count ? values[i] : string.Empty;
                }
                list.Add(row);
            }
            return list;
        }

        private List<Dictionary<string, string>> ReadExcelRows(Stream stream)
        {
            var list = new List<Dictionary<string, string>>();
            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheets.FirstOrDefault();
            if (worksheet == null) return list;

            var rows = worksheet.RowsUsed().ToList();
            if (rows.Count <= 1) return list;

            var headerRow = rows[0];
            var headers = new List<string>();
            foreach (var cell in headerRow.CellsUsed())
            {
                headers.Add(cell.GetString().Trim());
            }

            for (int r = 1; r < rows.Count; r++)
            {
                var row = rows[r];
                var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                for (int c = 0; c < headers.Count; c++)
                {
                    var cell = row.Cell(c + 1);
                    dict[headers[c]] = cell != null ? cell.GetString().Trim() : string.Empty;
                }
                if (dict.Values.Any(v => !string.IsNullOrWhiteSpace(v)))
                {
                    list.Add(dict);
                }
            }
            return list;
        }

        private List<string> ParseCsvLine(string line)
        {
            var result = new List<string>();
            var inQuotes = false;
            var currentField = new StringBuilder();

            for (int i = 0; i < line.Length; i++)
            {
                var c = line[i];
                if (c == '"')
                {
                    if (inQuotes && i + 1 < line.Length && line[i + 1] == '"')
                    {
                        currentField.Append('"');
                        i++; // Skip escaped quote
                    }
                    else
                    {
                        inQuotes = !inQuotes;
                    }
                }
                else if (c == ',' && !inQuotes)
                {
                    result.Add(currentField.ToString().Trim());
                    currentField.Clear();
                }
                else
                {
                    currentField.Append(c);
                }
            }
            result.Add(currentField.ToString().Trim());
            return result;
        }
    }
}
