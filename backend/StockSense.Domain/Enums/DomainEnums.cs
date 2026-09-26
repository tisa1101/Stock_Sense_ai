namespace StockSense.Domain.Enums
{
    public enum UserRole
    {
        Admin = 1,
        InventoryManager = 2,
        WarehouseStaff = 3
    }

    public enum TransactionType
    {
        RECEIPT = 1,
        DELIVERY = 2,
        TRANSFER_IN = 3,
        TRANSFER_OUT = 4,
        ADJUSTMENT = 5
    }

    public enum OperationStatus
    {
        Draft = 1,
        Waiting = 2,
        Ready = 3,
        Done = 4,
        Canceled = 5
    }

    public enum NotificationType
    {
        LowStock = 1,
        OutOfStock = 2,
        ReceiptValidated = 3,
        DeliveryValidated = 4,
        TransferCompleted = 5,
        AdjustmentDone = 6,
        SystemAlert = 7
    }

    public enum NotificationPriority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }
}
