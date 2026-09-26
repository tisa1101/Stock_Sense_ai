using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace StockSense.API.Hubs
{
    public class StockHub : Hub
    {
        public async Task JoinWarehouseGroup(string warehouseId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Warehouse_{warehouseId}");
        }

        public async Task LeaveWarehouseGroup(string warehouseId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Warehouse_{warehouseId}");
        }

        public async Task JoinProductGroup(string productId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Product_{productId}");
        }

        public async Task LeaveProductGroup(string productId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Product_{productId}");
        }
    }
}
