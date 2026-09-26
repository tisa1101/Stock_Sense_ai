export enum UserRole {
  Admin = 1,
  InventoryManager = 2,
  WarehouseStaff = 3,
}

export enum TransactionType {
  RECEIPT = 1,
  DELIVERY = 2,
  TRANSFER_IN = 3,
  TRANSFER_OUT = 4,
  ADJUSTMENT = 5,
}

export enum OperationStatus {
  Draft = 1,
  Waiting = 2,
  Ready = 3,
  Done = 4,
  Canceled = 5,
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  location: string;
  isActive: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  categoryName: string;
  unitOfMeasure: string;
  initialStock: number;
  reorderLevel: number;
  totalStock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  updatedAt: string;
}

export interface ReceiptItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
}

export interface Receipt {
  id: number;
  receiptNumber: string;
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName: string;
  status: OperationStatus;
  receiptDate: string;
  createdAt: string;
  items: ReceiptItem[];
}

export interface DeliveryItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  availableStockAtWarehouse: number;
}

export interface DeliveryOrder {
  id: number;
  deliveryNumber: string;
  warehouseId: number;
  warehouseName: string;
  status: OperationStatus;
  deliveryDate: string;
  createdAt: string;
  items: DeliveryItem[];
}

export interface TransferItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  sourceWarehouseAvailableStock: number;
}

export interface InternalTransfer {
  id: number;
  transferNumber: string;
  sourceWarehouseId: number;
  sourceWarehouseName: string;
  destinationWarehouseId: number;
  destinationWarehouseName: string;
  status: OperationStatus;
  transferDate: string;
  createdAt: string;
  items: TransferItem[];
}

export interface StockAdjustmentItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  systemQuantity: number;
  countedQuantity: number;
  difference: number;
}

export interface StockAdjustment {
  id: number;
  adjustmentNumber: string;
  warehouseId: number;
  warehouseName: string;
  reason: string;
  status: OperationStatus;
  adjustmentDate: string;
  createdAt: string;
  items: StockAdjustmentItem[];
}

export interface StockLedger {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  transactionType: TransactionType;
  referenceId: string;
  quantityBefore: number;
  quantityChange: number;
  quantityAfter: number;
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface StockMovementPoint {
  date: string;
  receipts: number;
  deliveries: number;
  transfers: number;
  adjustments: number;
}

export interface LowStockProduct {
  productId: number;
  productName: string;
  sku: string;
  categoryName: string;
  totalStock: number;
  reorderLevel: number;
  status: string;
}

export interface DashboardSummary {
  totalProducts: number;
  totalStockQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  pendingTransfers: number;
  lowStockProducts: LowStockProduct[];
  recentStockMovements: StockLedger[];
  stockMovementHistory: StockMovementPoint[];
}

// ──── AI Intelligence ────
export interface ForecastPoint {
  date: string;
  value: number;
  forecastValue?: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface ReorderSuggestion {
  suggestedReorderDate: string;
  suggestedReorderQuantity: number;
  reason: string;
}

export interface DemandForecast {
  productId: number;
  productName: string;
  sku: string;
  history: ForecastPoint[];
  forecast: ForecastPoint[];
  reorderSuggestion?: ReorderSuggestion;
}

export interface AiAnomaly {
  productId: number;
  productName: string;
  sku: string;
  severity: 'High' | 'Medium' | 'Low';
  type: string;
  description: string;
  ledgerId: number;
  quantityChange: number;
  zScore: number;
  detectedAt: string;
}

export interface AiAnomalyResult {
  anomalies: AiAnomaly[];
  totalCount: number;
  scannedAt: string;
}

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CopilotResponse {
  reply: string;
  timestamp: string;
}

// ===== COMMIT 3 TYPES =====
export type Theme = 'light' | 'dark' | 'system';

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: number; // NotificationType enum
  priority: number; // NotificationPriority enum
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: number;
  createdAt: string;
}

export interface NotificationList {
  items: NotificationItem[];
  totalCount: number;
  unreadCount: number;
}

export interface SupplierDetail {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  isActive: boolean;
  notes?: string;
  updatedAt: string;
  totalReceipts: number;
  totalQuantitySupplied: number;
  recentReceipts: Receipt[];
}

export interface UpdateSupplierPayload {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  isActive: boolean;
  notes?: string;
}

export interface TopSupplier {
  supplierId: number;
  supplierName: string;
  totalReceipts: number;
  totalQuantitySupplied: number;
  rating: number;
  lastReceiptDate: string;
}

export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalReceiptsThisMonth: number;
  topSuppliers: TopSupplier[];
}

export interface CategoryBreakdown {
  categoryName: string;
  productCount: number;
  totalStock: number;
  percentage: number;
}

export interface WarehouseComparison {
  warehouseName: string;
  warehouseCode: string;
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  utilizationPercentage: number;
}

export interface MovementTrend {
  date: string;
  receipts: number;
  deliveries: number;
  transfersIn: number;
  transfersOut: number;
  adjustments: number;
  netChange: number;
}

export interface TopProductMovement {
  productId: number;
  productName: string;
  sku: string;
  totalMovements: number;
  totalQuantityMoved: number;
  averageMovementSize: number;
}

export interface StockOverTime {
  date: string;
  totalStock: number;
}

export interface OperationSummary {
  operationType: string;
  draft: number;
  waiting: number;
  ready: number;
  done: number;
  canceled: number;
  total: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: number;
  createdAt: string;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: number;
  isActive: boolean;
  createdAt: string;
}
