import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Product, Category, Warehouse } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner, EmptyState } from '../components/CommonState';
import { Plus, Search, Filter, Trash2, Eye, Edit, Package } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, whRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/warehouses')
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
      setWarehouses(whRes.data.data);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete product.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.categoryId === Number(selectedCategory);
    const matchesStatus = selectedStatus === '' || p.stockStatus === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) return <LoadingSpinner message="Fetching products catalog..." />;

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-xs text-slate-500">Manage SKUs, categories, reorder levels, and stock status</p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === '' ? '' : Number(e.target.value))}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Stock Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description="No products matched your search parameters. Create a new product or clear filters."
          actionLabel="Add Product"
          onAction={() => navigate('/products/new')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Total Stock</th>
                  <th className="p-3.5">Unit</th>
                  <th className="p-3.5">Reorder Level</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <Link to={`/products/${p.id}`} className="hover:text-indigo-600 hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 font-semibold">{p.sku}</td>
                    <td className="p-3.5 text-slate-600">{p.categoryName}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">{p.totalStock}</td>
                    <td className="p-3.5 text-slate-500">{p.unitOfMeasure}</td>
                    <td className="p-3.5 text-slate-500">{p.reorderLevel}</td>
                    <td className="p-3.5">
                      <StatusBadge status={p.stockStatus} />
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/products/${p.id}`}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
