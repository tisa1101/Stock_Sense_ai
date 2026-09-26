import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, getUnreadCount, markAllNotificationsRead, markNotificationRead } from '../services/api';
import { NotificationItem } from '../types';

const getTypeIcon = (type: number) => {
  switch (type) {
    case 1: return <TrendingDown className="w-4 h-4 text-orange-500" />;
    case 2: return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 3: case 4: case 5: case 6: return <CheckCircle className="w-4 h-4 text-green-500" />;
    default: return <Bell className="w-4 h-4 text-blue-500" />;
  }
};

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 4: return 'border-l-red-500';
    case 3: return 'border-l-orange-500';
    case 2: return 'border-l-blue-500';
    default: return 'border-l-gray-300';
  }
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const fetchUnread = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data?.count ?? res.data ?? 0);
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications(1);
      const data = res.data?.data || res.data;
      setNotifications(data?.items ?? []);
      setUnreadCount(data?.unreadCount ?? 0);
    } catch {}
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No notifications
              </div>
            ) : notifications.slice(0, 8).map(n => (
              <div
                key={n.id}
                className={`px-4 py-3 border-l-4 ${getPriorityColor(n.priority)} ${
                  n.isRead ? 'bg-white dark:bg-slate-800' : 'bg-indigo-50 dark:bg-indigo-900/20'
                } cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors`}
                onClick={() => { if (!n.isRead) handleMarkRead(n.id); }}
              >
                <div className="flex items-start gap-2">
                  {getTypeIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{n.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { navigate('/notifications'); setOpen(false); }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
