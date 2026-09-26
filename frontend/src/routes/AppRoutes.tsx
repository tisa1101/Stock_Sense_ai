import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductFormPage } from '../pages/ProductFormPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ReceiptsPage } from '../pages/ReceiptsPage';
import { CreateReceiptPage } from '../pages/CreateReceiptPage';
import { DeliveriesPage } from '../pages/DeliveriesPage';
import { CreateDeliveryPage } from '../pages/CreateDeliveryPage';
import { TransfersPage } from '../pages/TransfersPage';
import { CreateTransferPage } from '../pages/CreateTransferPage';
import { AdjustmentsPage } from '../pages/AdjustmentsPage';
import { CreateAdjustmentPage } from '../pages/CreateAdjustmentPage';
import { LedgerPage } from '../pages/LedgerPage';
import { WarehousesPage } from '../pages/WarehousesPage';
import { SettingsPage } from '../pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/receipts/new" element={<CreateReceiptPage />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/deliveries/new" element={<CreateDeliveryPage />} />
        <Route path="/transfers" element={<TransfersPage />} />
        <Route path="/transfers/new" element={<CreateTransferPage />} />
        <Route path="/adjustments" element={<AdjustmentsPage />} />
        <Route path="/adjustments/new" element={<CreateAdjustmentPage />} />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Default Catch All */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
