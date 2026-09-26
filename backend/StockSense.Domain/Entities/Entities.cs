using System;
using System.Collections.Generic;
using StockSense.Domain.Enums;

namespace StockSense.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public string UnitOfMeasure { get; set; } = "PCS";
        public int InitialStock { get; set; }
        public int ReorderLevel { get; set; } = 10;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }

    public class Warehouse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }

    public class Inventory
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int WarehouseId { get; set; }
        public Warehouse? Warehouse { get; set; }
        public int Quantity { get; set; }
        public int ReservedQuantity { get; set; }
        public int AvailableQuantity => Quantity - ReservedQuantity;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }

    public class Receipt
    {
        public int Id { get; set; }
        public string ReceiptNumber { get; set; } = string.Empty;
        public int SupplierId { get; set; }
        public Supplier? Supplier { get; set; }
        public int WarehouseId { get; set; }
        public Warehouse? Warehouse { get; set; }
        public OperationStatus Status { get; set; } = OperationStatus.Draft;
        public DateTime ReceiptDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ReceiptItem> Items { get; set; } = new List<ReceiptItem>();
    }

    public class ReceiptItem
    {
        public int Id { get; set; }
        public int ReceiptId { get; set; }
        public Receipt? Receipt { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
    }

    public class DeliveryOrder
    {
        public int Id { get; set; }
        public string DeliveryNumber { get; set; } = string.Empty;
        public int WarehouseId { get; set; }
        public Warehouse? Warehouse { get; set; }
        public OperationStatus Status { get; set; } = OperationStatus.Draft;
        public DateTime DeliveryDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<DeliveryItem> Items { get; set; } = new List<DeliveryItem>();
    }

    public class DeliveryItem
    {
        public int Id { get; set; }
        public int DeliveryOrderId { get; set; }
        public DeliveryOrder? DeliveryOrder { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
    }

    public class InternalTransfer
    {
        public int Id { get; set; }
        public string TransferNumber { get; set; } = string.Empty;
        public int SourceWarehouseId { get; set; }
        public Warehouse? SourceWarehouse { get; set; }
        public int DestinationWarehouseId { get; set; }
        public Warehouse? DestinationWarehouse { get; set; }
        public OperationStatus Status { get; set; } = OperationStatus.Draft;
        public DateTime TransferDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<TransferItem> Items { get; set; } = new List<TransferItem>();
    }

    public class TransferItem
    {
        public int Id { get; set; }
        public int TransferId { get; set; }
        public InternalTransfer? Transfer { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
    }

    public class StockAdjustment
    {
        public int Id { get; set; }
        public string AdjustmentNumber { get; set; } = string.Empty;
        public int WarehouseId { get; set; }
        public Warehouse? Warehouse { get; set; }
        public string Reason { get; set; } = string.Empty;
        public OperationStatus Status { get; set; } = OperationStatus.Draft;
        public DateTime AdjustmentDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<StockAdjustmentItem> Items { get; set; } = new List<StockAdjustmentItem>();
    }

    public class StockAdjustmentItem
    {
        public int Id { get; set; }
        public int AdjustmentId { get; set; }
        public StockAdjustment? Adjustment { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int SystemQuantity { get; set; }
        public int CountedQuantity { get; set; }
        public int Difference { get; set; }
    }

    public class StockLedger
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int WarehouseId { get; set; }
        public Warehouse? Warehouse { get; set; }
        public TransactionType TransactionType { get; set; }
        public string ReferenceId { get; set; } = string.Empty;
        public int QuantityBefore { get; set; }
        public int QuantityChange { get; set; }
        public int QuantityAfter { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = "System";
    }
}
