import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, TrendingDown, AlertTriangle } from 'lucide-react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications(1);
      const data = res.data?.data || res.data;
      setNotifications(data?.items || []);
    } catch {}
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filtered = notifications.filter(n => filter === 'all' || !n.isRead);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Notifications
        </h1>
        <div className="flex gap-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as 'all'|'unread')}
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
          </select>
          <button onClick={handleMarkAllRead} className="text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No notifications found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.map(n => (
              <div key={n.id} className={`p-4 flex gap-4 ${!n.isRead ? 'bg-slate-50 dark:bg-slate-800/80' : ''}`}>
                <div className="mt-1">
                  {n.type === 1 ? <TrendingDown className="w-5 h-5 text-orange-500" /> :
                   n.type === 2 ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                   <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm ${!n.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>{n.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && (
                  <button onClick={() => handleMarkRead(n.id)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline h-fit px-2 py-1">
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
