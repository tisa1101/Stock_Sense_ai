# STOCKSENSE 📦
> **An Intelligent Inventory Management and Decision-Support System**

StockSense replaces manual registers, fragile Excel sheets, and fragmented stock tracking with a modern, centralized, real-time web application. 

This repository represents **Commit 1: Core Inventory Foundation**, establishing a clean, production-ready full-stack architecture with strict stock-ledger audit rules to support future AI forecasting, demand prediction, and anomaly detection.

---

## 1. Project Overview & Business Rules

StockSense enforces strict enterprise stock accounting:
- **No Direct Inventory Mutations**: Stock cannot be modified by arbitrary REST CRUD operations.
- **Stock Ledger Accounting**: Every stock change MUST produce an immutable `StockLedger` audit row recording `QuantityBefore`, `QuantityChange`, `QuantityAfter`, timestamp, and responsible user.
- **Transactional Validations**:
  - **Receipt (+qty)**: Increases warehouse stock on validation.
  - **Delivery (-qty)**: Verifies available stock before validation. Prevents over-shipping.
  - **Internal Transfer**: Decreases source warehouse stock, increases destination warehouse stock, and logs **TWO** ledger entries (`TRANSFER_OUT` & `TRANSFER_IN`). Total company stock remains invariant.
  - **Stock Adjustment**: Reconciles physical counts with system quantity, automatically computing `Difference = Counted - System`.
- **Status Workflow**: Transactions start in `Draft` (no stock mutation) and only alter inventory when validated into `Done` state. Duplicate validation is blocked.

---

## 2. Technology Stack

### Backend
- **Framework**: .NET 8 / ASP.NET Core Web API
- **Architecture**: Clean Architecture (`Domain`, `Application`, `Infrastructure`, `API`)
- **ORM & Database**: Entity Framework Core 8 with SQL Server / LocalDB
- **Security**: JWT Authentication & BCrypt Password Hashing
- **API Tooling**: Swagger / OpenAPI with JWT Bearer support

### Frontend
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Data Fetching**: Axios (with JWT interceptors)
- **Visuals & Icons**: Lucide React & Recharts

---

## 3. Repository Directory Structure

```
stack-sense/
 ├── frontend/
 │   ├── src/
 │   │   ├── components/      # Sidebar, Navbar, StatusBadge, KpiCard, CommonState
 │   │   ├── context/         # AuthContext & useAuth hook
 │   │   ├── layouts/         # MainLayout, AuthLayout
 │   │   ├── pages/           # Dashboard, Products, Inventory, Receipts, Deliveries, Transfers, Adjustments, Ledger, Warehouses, Settings
 │   │   ├── routes/          # AppRoutes & ProtectedRoute
 │   │   ├── services/        # Axios API client
 │   │   ├── types/           # TypeScript interfaces & enums
 │   │   ├── App.tsx
 │   │   └── main.tsx
 │   ├── package.json
 │   └── vite.config.ts
 │
 ├── backend/
 │   ├── StockSense.slnx
 │   ├── StockSense.Domain/         # Entities, Enums
 │   ├── StockSense.Application/    # DTOs, Services, Interfaces, Exception middleware
 │   ├── StockSense.Infrastructure/ # DbContext, Migrations, Seeders, Security
 │   └── StockSense.API/            # Controllers, Program.cs, Swagger
 │
 ├── .env.example
 ├── .gitignore
 └── README.md
```

---

## 4. Default Demo Credentials

On initial startup, the database is automatically seeded with demo accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@stocksense.com` | `Admin@123` | Full Access (Products, Warehouses, Operations, Ledger) |
| **Inventory Manager** | `manager@stocksense.com` | `Manager@123` | Products, Inventory, Operations, Ledger |
| **Warehouse Staff** | `staff@stocksense.com` | `Staff@123` | Inventory View, Receipts, Deliveries, Transfers, Adjustments |

---

## 5. Database Setup & EF Core Migrations

1. Ensure SQL Server or SQL Server LocalDB (`(localdb)\mssqllocaldb`) is available on your machine.
2. The connection string is preconfigured in `backend/StockSense.API/appsettings.json` or environment variables:
   ```env
   ConnectionStrings__DefaultConnection=Server=(localdb)\mssqllocaldb;Database=StockSenseDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True
   ```
3. To manually run migrations (optional, as startup seeder applies schema automatically):
   ```bash
   dotnet ef database update --project backend/StockSense.Infrastructure/StockSense.Infrastructure.csproj --startup-project backend/StockSense.API/StockSense.API.csproj
   ```

---

## 6. How to Run the Backend API

```bash
# Navigate to backend directory
cd backend/StockSense.API

# Run the Web API server
dotnet run
```
- **API Base URL**: `http://localhost:5000/api`
- **Swagger Documentation**: `http://localhost:5000/swagger`

---

## 7. How to Run the Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start local development server
npm run dev
```
- **Frontend URL**: `http://localhost:5173`

---

## 8. Core API Endpoints

### Authentication
- `POST /api/auth/register` - Register new staff account
- `POST /api/auth/login` - Authenticate & obtain JWT Bearer Token

### Products & Categories
- `GET /api/products` - Filter products by category, search term
- `GET /api/products/{id}` - Detailed product metrics & warehouse breakdown
- `POST /api/products` - Create new SKU
- `PUT /api/products/{id}` - Update product metadata
- `DELETE /api/products/{id}` - Remove product (blocked if ledger history exists)

### Inventory & Stock Overview
- `GET /api/inventory` - Stock matrix per product and warehouse
- `GET /api/inventory/product/{productId}` - Product stock levels across warehouses
- `GET /api/inventory/warehouse/{warehouseId}` - Warehouse inventory list

### Operations (Receipts, Deliveries, Transfers, Adjustments)
- `POST /api/receipts` - Draft incoming supplier order
- `POST /api/receipts/{id}/validate` - Validate receipt & increase stock
- `POST /api/deliveries` - Draft customer shipping order
- `POST /api/deliveries/{id}/validate` - Validate delivery & decrease stock
- `POST /api/transfers` - Draft warehouse transfer
- `POST /api/transfers/{id}/validate` - Validate transfer & write 2 ledger rows
- `POST /api/adjustments` - Draft physical stock count reconciliation
- `POST /api/adjustments/{id}/validate` - Validate adjustment & update inventory

### Stock Ledger & Command Center
- `GET /api/ledger` - Complete immutable stock movement audit trail
- `GET /api/dashboard/summary` - Real-time telemetry, low stock alerts, stock movement trends

---

## 9. Roadmap for Commit 2 (Upcoming AI/ML Modules)

The database schema and `StockLedger` audit history generated in Commit 1 serve as the data backbone for:
- 🤖 **Demand Forecasting**: Time-series models predicting future stock consumption based on historical ledger velocity.
- ⚠️ **Stockout Prediction & Anomaly Detection**: Unsupervised detection of unexpected stock shrinkage or demand spikes.
- 💡 **AI Copilot & Natural Language Queries**: Chatbot interface analyzing inventory levels using real-time API tools.
