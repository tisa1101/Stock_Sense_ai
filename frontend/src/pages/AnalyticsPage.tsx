import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { 
  getCategoryBreakdown, getWarehouseComparison, getMovementTrends, 
  getTopProducts, getStockOverTime, getOperationSummary 
} from '../services/api';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line 
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6'];

export const AnalyticsPage: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [trends, setTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);

  useEffect(() => {
    getCategoryBreakdown().then(res => setCategories(res.data?.data || []));
    getWarehouseComparison().then(res => setWarehouses(res.data?.data || []));
    getMovementTrends(30).then(res => setTrends(res.data?.data || []));
    getTopProducts(10).then(res => setTopProducts(res.data?.data || []));
    getStockOverTime(30).then(res => setStockHistory(res.data?.data || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Advanced Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Stock by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="totalStock" nameKey="categoryName" cx="50%" cy="50%" outerRadius={100} label>
                  {categories.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Comparison */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Warehouse Utilization</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouses}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="warehouseName" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Legend />
                <Bar dataKey="totalStock" name="Total Stock" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lowStockCount" name="Low Stock Items" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Movement Trends */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Movement Trends (30 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={str => new Date(str).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="receipts" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="deliveries" stroke="#f43f5e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="transfersIn" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="adjustments" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Top Products by Movement</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="productName" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Bar dataKey="totalMovements" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Over Time */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Total Stock Volume Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockHistory}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={str => new Date(str).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Area type="monotone" dataKey="totalStock" stroke="#6366f1" fillOpacity={1} fill="url(#colorStock)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
