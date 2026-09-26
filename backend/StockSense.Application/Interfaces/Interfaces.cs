using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockSense.Application.DTOs;
using StockSense.Domain.Entities;
using StockSense.Domain.Enums;

namespace StockSense.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<Category> Categories { get; }
        DbSet<Product> Products { get; }
        DbSet<Warehouse> Warehouses { get; }
        DbSet<Inventory> Inventories { get; }
        DbSet<Supplier> Suppliers { get; }
        DbSet<Receipt> Receipts { get; }
        DbSet<ReceiptItem> ReceiptItems { get; }
        DbSet<DeliveryOrder> DeliveryOrders { get; }
        DbSet<DeliveryItem> DeliveryItems { get; }
        DbSet<InternalTransfer> InternalTransfers { get; }
        DbSet<TransferItem> TransferItems { get; }
        DbSet<StockAdjustment> StockAdjustments { get; }
        DbSet<StockAdjustmentItem> StockAdjustmentItems { get; }
        DbSet<StockLedger> StockLedgers { get; }
        DbSet<Notification> Notifications { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }

    public interface IPasswordHasher
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string passwordHash);
    }

    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }

    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
    }

    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync();
        Task<CategoryDto> CreateAsync(CreateCategoryDto dto);
    }

    public interface IWarehouseService
    {
        Task<List<WarehouseDto>> GetAllAsync();
        Task<WarehouseDto> CreateAsync(CreateWarehouseDto dto);
        Task<WarehouseDto> UpdateAsync(int id, UpdateWarehouseDto dto);
    }

    public interface ISupplierService
    {
        Task<List<SupplierDto>> GetAllAsync();
        Task<SupplierDto> CreateAsync(CreateSupplierDto dto);
    }

    public interface IProductService
    {
        Task<List<ProductDto>> GetAllAsync(int? categoryId = null, string? search = null);
        Task<ProductDto> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(CreateProductDto dto);
        Task<ProductDto> UpdateAsync(int id, UpdateProductDto dto);
        Task DeleteAsync(int id);
    }

    public interface IInventoryService
    {
        Task<List<InventoryDto>> GetAllAsync(int? categoryId = null, int? warehouseId = null, string? stockStatus = null, string? search = null);
        Task<List<InventoryDto>> GetByProductIdAsync(int productId);
        Task<List<InventoryDto>> GetByWarehouseIdAsync(int warehouseId);
    }

    public interface IReceiptService
    {
        Task<List<ReceiptDto>> GetAllAsync();
        Task<ReceiptDto> GetByIdAsync(int id);
        Task<ReceiptDto> CreateAsync(CreateReceiptDto dto);
        Task<ReceiptDto> ValidateAsync(int id, string currentUser);
    }

    public interface IDeliveryService
    {
        Task<List<DeliveryDto>> GetAllAsync();
        Task<DeliveryDto> GetByIdAsync(int id);
        Task<DeliveryDto> CreateAsync(CreateDeliveryDto dto);
        Task<DeliveryDto> ValidateAsync(int id, string currentUser);
    }

    public interface ITransferService
    {
        Task<List<TransferDto>> GetAllAsync();
        Task<TransferDto> GetByIdAsync(int id);
        Task<TransferDto> CreateAsync(CreateTransferDto dto);
        Task<TransferDto> ValidateAsync(int id, string currentUser);
    }

    public interface IStockAdjustmentService
    {
        Task<List<AdjustmentDto>> GetAllAsync();
        Task<AdjustmentDto> GetByIdAsync(int id);
        Task<AdjustmentDto> CreateAsync(CreateAdjustmentDto dto);
        Task<AdjustmentDto> ValidateAsync(int id, string currentUser);
    }

    public interface IStockLedgerService
    {
        Task<List<StockLedgerDto>> GetAllAsync(int? productId = null, int? warehouseId = null, TransactionType? transactionType = null);
        Task<List<StockLedgerDto>> GetByProductIdAsync(int productId);
        Task<List<StockLedgerDto>> GetByWarehouseIdAsync(int warehouseId);
    }

    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
    }
    public interface IAiService
    {
        Task<DemandForecastDto> GetForecastAsync(int productId, int horizonDays = 30);
        Task<AiAnomalyResultDto> GetAnomaliesAsync(int days = 30);
        Task<CopilotResponseDto> ChatAsync(CopilotRequestDto request);
    }

    public interface INotificationService
    {
        Task CreateAsync(int userId, string title, string message, NotificationType type, NotificationPriority priority, string? relatedEntityType = null, int? relatedEntityId = null);
        Task CreateForUsersAsync(IEnumerable<int> userIds, string title, string message, NotificationType type, NotificationPriority priority, string? relatedEntityType = null, int? relatedEntityId = null);
        Task<NotificationListDto> GetUserNotificationsAsync(int userId, int page = 1, int pageSize = 20);
        Task<int> GetUnreadCountAsync(int userId);
        Task MarkAsReadAsync(int notificationId, int userId);
        Task MarkAllAsReadAsync(int userId);
    }

    public interface IEnhancedSupplierService
    {
        Task<List<SupplierDto>> GetAllAsync(string? search = null);
        Task<SupplierDetailDto> GetByIdAsync(int id);
        Task<SupplierDto> CreateAsync(CreateSupplierDto dto);
        Task<SupplierDto> UpdateAsync(int id, UpdateSupplierDto dto);
        Task DeleteAsync(int id);
        Task<List<ReceiptDto>> GetSupplierReceiptsAsync(int supplierId);
        Task<SupplierStatsDto> GetStatsAsync();
    }

    public interface IAnalyticsService
    {
        Task<List<CategoryBreakdownDto>> GetCategoryBreakdownAsync();
        Task<List<WarehouseComparisonDto>> GetWarehouseComparisonAsync();
        Task<List<MovementTrendDto>> GetMovementTrendsAsync(int days = 30);
        Task<List<TopProductMovementDto>> GetTopProductsAsync(int limit = 10);
        Task<List<StockOverTimeDto>> GetStockOverTimeAsync(int days = 30);
        Task<List<OperationSummaryDto>> GetOperationSummaryAsync(int days = 30);
    }

    public interface IReportService
    {
        Task<byte[]> GenerateInventoryReportAsync(ReportFilterDto filter, string format);
        Task<byte[]> GenerateLedgerReportAsync(ReportFilterDto filter, string format);
        Task<byte[]> GenerateReceiptsReportAsync(ReportFilterDto filter, string format);
        Task<byte[]> GenerateDeliveriesReportAsync(ReportFilterDto filter, string format);
        Task<byte[]> GenerateLowStockReportAsync(string format);
        Task<byte[]> GenerateSummaryReportAsync(ReportFilterDto filter, string format);
    }

    public interface IUserManagementService
    {
        Task<List<UserListDto>> GetAllUsersAsync();
        Task<UserListDto> GetUserByIdAsync(int id);
        Task<UserListDto> ChangeRoleAsync(int id, UserRole role, int currentUserId);
        Task<UserListDto> ToggleStatusAsync(int id, bool isActive, int currentUserId);
        Task DeleteUserAsync(int id, int currentUserId);
        Task<UserDto> GetProfileAsync(int userId);
        Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
        Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}
