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
}
