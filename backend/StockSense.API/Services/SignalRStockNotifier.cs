using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using StockSense.API.Hubs;
using StockSense.Application.Interfaces;

namespace StockSense.API.Services
{
    public class SignalRStockNotifier : IStockRealTimeNotifier
    {
        private readonly IHubContext<StockHub> _hubContext;

        public SignalRStockNotifier(IHubContext<StockHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyStockChangedAsync(int productId, string productName, int warehouseId, int newQuantity, string transactionType)
        {
            try
            {
                var payload = new
                {
                    ProductId = productId,
                    ProductName = productName,
                    WarehouseId = warehouseId,
                    NewQuantity = newQuantity,
                    TransactionType = transactionType,
                    Timestamp = DateTime.UtcNow
                };

                // Broadcast to all connected clients & specific groups
                await _hubContext.Clients.All.SendAsync("StockChanged", payload);
                await _hubContext.Clients.Group($"Warehouse_{warehouseId}").SendAsync("WarehouseStockChanged", payload);
                await _hubContext.Clients.Group($"Product_{productId}").SendAsync("ProductStockChanged", payload);
            }
            catch
            {
                // Silently handle if hub transport encounters non-fatal network disconnect
            }
        }

        public async Task NotifyLowStockAlertAsync(int productId, string productName, int currentQuantity, int reorderLevel)
        {
            try
            {
                var payload = new
                {
                    ProductId = productId,
                    ProductName = productName,
                    CurrentQuantity = currentQuantity,
                    ReorderLevel = reorderLevel,
                    AlertLevel = currentQuantity == 0 ? "OUT_OF_STOCK" : "LOW_STOCK",
                    Message = currentQuantity == 0 
                        ? $"CRITICAL: {productName} is completely out of stock!" 
                        : $"ALERT: {productName} quantity ({currentQuantity}) dropped below reorder level ({reorderLevel}).",
                    Timestamp = DateTime.UtcNow
                };

                await _hubContext.Clients.All.SendAsync("LowStockAlert", payload);
            }
            catch
            {
            }
        }

        public async Task NotifyNewNotificationAsync(string title, string message, string type, string priority)
        {
            try
            {
                var payload = new
                {
                    Title = title,
                    Message = message,
                    Type = type,
                    Priority = priority,
                    Timestamp = DateTime.UtcNow
                };

                await _hubContext.Clients.All.SendAsync("NewNotification", payload);
            }
            catch
            {
            }
        }
    }
}
