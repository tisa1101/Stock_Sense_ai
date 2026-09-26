import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { SIGNALR_HUB_URL } from '../services/api';
import { Bell, AlertTriangle, ArrowRightLeft, X } from 'lucide-react';

export interface LiveNotificationEvent {
  id: string;
  title: string;
  message: string;
  type: 'stock' | 'low_stock' | 'notification';
  priority?: string;
  timestamp: string;
}

interface SignalRContextType {
  isConnected: boolean;
  lastEvent: LiveNotificationEvent | null;
  joinWarehouse: (warehouseId: number) => Promise<void>;
  leaveWarehouse: (warehouseId: number) => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<LiveNotificationEvent | null>(null);
  const [toasts, setToasts] = useState<LiveNotificationEvent[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (toast: Omit<LiveNotificationEvent, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: LiveNotificationEvent = { ...toast, id };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    setLastEvent(newToast);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  };

  useEffect(() => {
    const token = localStorage.getItem('stocksense_token');
    
    // Create SignalR connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL, {
        accessTokenFactory: () => token || '',
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    newConnection.on('StockChanged', (data: { productName: string; newQuantity: number; transactionType: string }) => {
      addToast({
        title: 'Stock Updated',
        message: `${data.productName} updated: ${data.newQuantity} units (${data.transactionType})`,
        type: 'stock',
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    newConnection.on('LowStockAlert', (data: { productName: string; message: string; alertLevel: string }) => {
      addToast({
        title: data.alertLevel === 'OUT_OF_STOCK' ? 'Out of Stock Alert!' : 'Low Stock Warning',
        message: data.message,
        type: 'low_stock',
        priority: 'Urgent',
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    newConnection.on('NewNotification', (data: { title: string; message: string; priority: string }) => {
      addToast({
        title: data.title,
        message: data.message,
        type: 'notification',
        priority: data.priority,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    // Start connection
    newConnection
      .start()
      .then(() => {
        setIsConnected(true);
      })
      .catch(() => {
        setIsConnected(false);
      });

    newConnection.onreconnected(() => setIsConnected(true));
    newConnection.onreconnecting(() => setIsConnected(false));
    newConnection.onclose(() => setIsConnected(false));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const joinWarehouse = useCallback(
    async (warehouseId: number) => {
      if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
          await connection.invoke('JoinWarehouseGroup', warehouseId.toString());
        } catch {
          // ignore
        }
      }
    },
    [connection]
  );

  const leaveWarehouse = useCallback(
    async (warehouseId: number) => {
      if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
          await connection.invoke('LeaveWarehouseGroup', warehouseId.toString());
        } catch {
          // ignore
        }
      }
    },
    [connection]
  );

  return (
    <SignalRContext.Provider value={{ isConnected, lastEvent, joinWarehouse, leaveWarehouse }}>
      {children}

      {/* Live Push Notification Toast Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isLowStock = toast.type === 'low_stock';
          const isStock = toast.type === 'stock';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
                isLowStock
                  ? 'bg-rose-900/90 text-rose-100 border-rose-700/60 shadow-rose-950/40'
                  : isStock
                  ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700/60 shadow-emerald-950/40'
                  : 'bg-slate-900/90 text-slate-100 border-slate-700/60 shadow-slate-950/40'
              }`}
            >
              <div className="p-2 rounded-lg bg-white/10 shrink-0">
                {isLowStock ? (
                  <AlertTriangle className="w-5 h-5 text-rose-300" />
                ) : isStock ? (
                  <ArrowRightLeft className="w-5 h-5 text-emerald-300" />
                ) : (
                  <Bell className="w-5 h-5 text-cyan-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider">{toast.title}</h4>
                  <span className="text-[10px] opacity-70">{toast.timestamp}</span>
                </div>
                <p className="text-xs mt-0.5 opacity-90 leading-snug break-words">{toast.message}</p>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};
