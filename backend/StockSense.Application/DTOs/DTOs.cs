using System;
using System.Collections.Generic;
using StockSense.Domain.Enums;

namespace StockSense.Application.DTOs
{
    // Auth DTOs
    public record RegisterRequestDto(string Name, string Email, string Password, UserRole Role);
    public record LoginRequestDto(string Email, string Password);
    public record AuthResponseDto(string AccessToken, UserDto User);
    public record UserDto(int Id, string Name, string Email, UserRole Role, DateTime CreatedAt);

    // Category DTOs
    public record CategoryDto(int Id, string Name, string Description);
    public record CreateCategoryDto(string Name, string Description);

    // Product DTOs
    public record ProductDto(
        int Id,
        string Name,
        string SKU,
        int CategoryId,
        string CategoryName,
        string UnitOfMeasure,
        int InitialStock,
        int ReorderLevel,
        int TotalStock,
        string StockStatus,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        bool IsActive
    );
    public record CreateProductDto(string Name, string SKU, int CategoryId, string UnitOfMeasure, int InitialStock, int ReorderLevel);
    public record UpdateProductDto(string Name, string SKU, int CategoryId, string UnitOfMeasure, int ReorderLevel, bool IsActive);

    // Warehouse DTOs
    public record WarehouseDto(int Id, string Name, string Code, string Location, bool IsActive);
    public record CreateWarehouseDto(string Name, string Code, string Location);
    public record UpdateWarehouseDto(string Name, string Code, string Location, bool IsActive);

    // Supplier DTOs
    public record SupplierDto(int Id, string Name, string ContactPerson, string Email, string Phone, string Address);
    public record CreateSupplierDto(string Name, string ContactPerson, string Email, string Phone, string Address);

    // Inventory DTOs
    public record InventoryDto(
        int Id,
        int ProductId,
        string ProductName,
        string SKU,
        int WarehouseId,
        string WarehouseName,
        int Quantity,
        int ReservedQuantity,
        int AvailableQuantity,
        int ReorderLevel,
        string Status,
        DateTime UpdatedAt
    );

    // Receipt DTOs
    public record ReceiptItemDto(int Id, int ProductId, string ProductName, string SKU, int Quantity);
    public record CreateReceiptItemDto(int ProductId, int Quantity);
    public record ReceiptDto(
        int Id,
        string ReceiptNumber,
        int SupplierId,
        string SupplierName,
        int WarehouseId,
        string WarehouseName,
        OperationStatus Status,
        DateTime ReceiptDate,
        DateTime CreatedAt,
        List<ReceiptItemDto> Items
    );
    public record CreateReceiptDto(int SupplierId, int WarehouseId, List<CreateReceiptItemDto> Items);

    // Delivery DTOs
    public record DeliveryItemDto(int Id, int ProductId, string ProductName, string SKU, int Quantity, int AvailableStockAtWarehouse);
    public record CreateDeliveryItemDto(int ProductId, int Quantity);
    public record DeliveryDto(
        int Id,
        string DeliveryNumber,
        int WarehouseId,
        string WarehouseName,
        OperationStatus Status,
        DateTime DeliveryDate,
        DateTime CreatedAt,
        List<DeliveryItemDto> Items
    );
    public record CreateDeliveryDto(int WarehouseId, List<CreateDeliveryItemDto> Items);

    // Transfer DTOs
    public record TransferItemDto(int Id, int ProductId, string ProductName, string SKU, int Quantity, int SourceWarehouseAvailableStock);
    public record CreateTransferItemDto(int ProductId, int Quantity);
    public record TransferDto(
        int Id,
        string TransferNumber,
        int SourceWarehouseId,
        string SourceWarehouseName,
        int DestinationWarehouseId,
        string DestinationWarehouseName,
        OperationStatus Status,
        DateTime TransferDate,
        DateTime CreatedAt,
        List<TransferItemDto> Items
    );
    public record CreateTransferDto(int SourceWarehouseId, int DestinationWarehouseId, List<CreateTransferItemDto> Items);

    // Adjustment DTOs
    public record AdjustmentItemDto(
        int Id,
        int ProductId,
        string ProductName,
        string SKU,
        int SystemQuantity,
        int CountedQuantity,
        int Difference
    );
    public record CreateAdjustmentItemDto(int ProductId, int CountedQuantity);
    public record AdjustmentDto(
        int Id,
        string AdjustmentNumber,
        int WarehouseId,
        string WarehouseName,
        string Reason,
        OperationStatus Status,
        DateTime AdjustmentDate,
        DateTime CreatedAt,
        List<AdjustmentItemDto> Items
    );
    public record CreateAdjustmentDto(int WarehouseId, string Reason, List<CreateAdjustmentItemDto> Items);

    // Stock Ledger DTOs
    public record StockLedgerDto(
        int Id,
        int ProductId,
        string ProductName,
        string SKU,
        int WarehouseId,
        string WarehouseName,
        TransactionType TransactionType,
        string ReferenceId,
        int QuantityBefore,
        int QuantityChange,
        int QuantityAfter,
        string Description,
        DateTime CreatedAt,
        string CreatedBy
    );

    // Dashboard DTOs
    public record StockMovementPointDto(string Date, int Receipts, int Deliveries, int Transfers, int Adjustments);
    public record LowStockItemDto(int ProductId, string ProductName, string SKU, string CategoryName, int TotalStock, int ReorderLevel, string Status);
    public record DashboardSummaryDto(
        int TotalProducts,
        int TotalStockQuantity,
        int LowStockCount,
        int OutOfStockCount,
        int PendingReceipts,
        int PendingDeliveries,
        int PendingTransfers,
        List<LowStockItemDto> LowStockProducts,
        List<StockLedgerDto> RecentStockMovements,
        List<StockMovementPointDto> StockMovementHistory
    );
    // ──── AI Intelligence DTOs ────
    public record ForecastPointDto(string Date, double Value, double? ForecastValue, double? LowerBound, double? UpperBound);
    public record ReorderSuggestionDto(string SuggestedReorderDate, int SuggestedReorderQuantity, string Reason);
    public record DemandForecastDto(
        int ProductId,
        string ProductName,
        string SKU,
        List<ForecastPointDto> History,
        List<ForecastPointDto> Forecast,
        ReorderSuggestionDto? ReorderSuggestion
    );

    public record AiAnomalyDto(
        int ProductId,
        string ProductName,
        string SKU,
        string Severity,
        string Type,
        string Description,
        int LedgerId,
        int QuantityChange,
        double ZScore,
        DateTime DetectedAt
    );
    public record AiAnomalyResultDto(List<AiAnomalyDto> Anomalies, int TotalCount, DateTime ScannedAt);

    public record CopilotMessageDto(string Role, string Content);
    public record CopilotRequestDto(string Message, List<CopilotMessageDto>? History);
    public record CopilotResponseDto(string Reply, DateTime Timestamp);
}
