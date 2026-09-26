using Microsoft.EntityFrameworkCore;
using StockSense.Application.Interfaces;
using StockSense.Domain.Entities;

namespace StockSense.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Warehouse> Warehouses => Set<Warehouse>();
        public DbSet<Inventory> Inventories => Set<Inventory>();
        public DbSet<Supplier> Suppliers => Set<Supplier>();
        public DbSet<Receipt> Receipts => Set<Receipt>();
        public DbSet<ReceiptItem> ReceiptItems => Set<ReceiptItem>();
        public DbSet<DeliveryOrder> DeliveryOrders => Set<DeliveryOrder>();
        public DbSet<DeliveryItem> DeliveryItems => Set<DeliveryItem>();
        public DbSet<InternalTransfer> InternalTransfers => Set<InternalTransfer>();
        public DbSet<TransferItem> TransferItems => Set<TransferItem>();
        public DbSet<StockAdjustment> StockAdjustments => Set<StockAdjustment>();
        public DbSet<StockAdjustmentItem> StockAdjustmentItems => Set<StockAdjustmentItem>();
        public DbSet<StockLedger> StockLedgers => Set<StockLedger>();
        public DbSet<Notification> Notifications => Set<Notification>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Product constraints
            modelBuilder.Entity<Product>()
                .HasIndex(p => p.SKU)
                .IsUnique();

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Warehouse constraints
            modelBuilder.Entity<Warehouse>()
                .HasIndex(w => w.Code)
                .IsUnique();

            // Inventory constraints & composite index
            modelBuilder.Entity<Inventory>()
                .HasIndex(i => new { i.ProductId, i.WarehouseId })
                .IsUnique();

            modelBuilder.Entity<Inventory>()
                .HasOne(i => i.Product)
                .WithMany(p => p.Inventories)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Inventory>()
                .HasOne(i => i.Warehouse)
                .WithMany(w => w.Inventories)
                .HasForeignKey(i => i.WarehouseId)
                .OnDelete(DeleteBehavior.Restrict);

            // Document Number unique indexes
            modelBuilder.Entity<Receipt>()
                .HasIndex(r => r.ReceiptNumber)
                .IsUnique();

            modelBuilder.Entity<DeliveryOrder>()
                .HasIndex(d => d.DeliveryNumber)
                .IsUnique();

            modelBuilder.Entity<InternalTransfer>()
                .HasIndex(t => t.TransferNumber)
                .IsUnique();

            modelBuilder.Entity<StockAdjustment>()
                .HasIndex(a => a.AdjustmentNumber)
                .IsUnique();

            // Transfer warehouse foreign keys
            modelBuilder.Entity<InternalTransfer>()
                .HasOne(t => t.SourceWarehouse)
                .WithMany()
                .HasForeignKey(t => t.SourceWarehouseId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<InternalTransfer>()
                .HasOne(t => t.DestinationWarehouse)
                .WithMany()
                .HasForeignKey(t => t.DestinationWarehouseId)
                .OnDelete(DeleteBehavior.Restrict);

            // StockLedger indexes for high-performance AI queries & history tracking
            modelBuilder.Entity<StockLedger>()
                .HasIndex(l => l.ProductId);

            modelBuilder.Entity<StockLedger>()
                .HasIndex(l => l.WarehouseId);

            modelBuilder.Entity<StockLedger>()
                .HasIndex(l => l.CreatedAt);

            modelBuilder.Entity<StockLedger>()
                .HasOne(l => l.Product)
                .WithMany()
                .HasForeignKey(l => l.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StockLedger>()
                .HasOne(l => l.Warehouse)
                .WithMany()
                .HasForeignKey(l => l.WarehouseId)
                .OnDelete(DeleteBehavior.Restrict);

            // Notification
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.UserId);

            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.CreatedAt);
        }
    }
}
