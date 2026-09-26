using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Entities;
using StockSense.Domain.Enums;

namespace StockSense.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IApplicationDbContext _db;
        private readonly IStockRealTimeNotifier? _realTimeNotifier;

        public NotificationService(IApplicationDbContext db, IStockRealTimeNotifier? realTimeNotifier = null)
        {
            _db = db;
            _realTimeNotifier = realTimeNotifier;
        }

        public async Task CreateAsync(int userId, string title, string message, NotificationType type, NotificationPriority priority, string? relatedEntityType = null, int? relatedEntityId = null)
        {
            var notification = new Notification
            {
                UserId = userId, Title = title, Message = message,
                Type = type, Priority = priority,
                RelatedEntityType = relatedEntityType, RelatedEntityId = relatedEntityId,
                CreatedAt = DateTime.UtcNow
            };
            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();

            if (_realTimeNotifier != null)
            {
                await _realTimeNotifier.NotifyNewNotificationAsync(title, message, type.ToString(), priority.ToString());
            }
        }

        public async Task CreateForUsersAsync(IEnumerable<int> userIds, string title, string message, NotificationType type, NotificationPriority priority, string? relatedEntityType = null, int? relatedEntityId = null)
        {
            var notifications = userIds.Select(uid => new Notification
            {
                UserId = uid, Title = title, Message = message,
                Type = type, Priority = priority,
                RelatedEntityType = relatedEntityType, RelatedEntityId = relatedEntityId,
                CreatedAt = DateTime.UtcNow
            }).ToList();
            _db.Notifications.AddRange(notifications);
            await _db.SaveChangesAsync();

            if (_realTimeNotifier != null)
            {
                await _realTimeNotifier.NotifyNewNotificationAsync(title, message, type.ToString(), priority.ToString());
            }
        }

        public async Task<NotificationListDto> GetUserNotificationsAsync(int userId, int page = 1, int pageSize = 20)
        {
            var query = _db.Notifications.Where(n => n.UserId == userId);
            var total = await query.CountAsync();
            var unread = await query.CountAsync(n => !n.IsRead);
            var items = await query
                .OrderByDescending(n => n.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(n => new NotificationDto(n.Id, n.UserId, n.Title, n.Message, n.Type, n.Priority, n.IsRead, n.RelatedEntityType, n.RelatedEntityId, n.CreatedAt))
                .ToListAsync();
            return new NotificationListDto(items, total, unread);
        }

        public async Task<int> GetUnreadCountAsync(int userId)
            => await _db.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);

        public async Task MarkAsReadAsync(int notificationId, int userId)
        {
            var n = await _db.Notifications.FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
            if (n != null) { n.IsRead = true; await _db.SaveChangesAsync(); }
        }

        public async Task MarkAllAsReadAsync(int userId)
        {
            var notifications = await _db.Notifications.Where(n => n.UserId == userId && !n.IsRead).ToListAsync();
            foreach (var n in notifications) n.IsRead = true;
            await _db.SaveChangesAsync();
        }
    }
}
