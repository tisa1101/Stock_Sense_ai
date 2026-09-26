# STOCKSENSE 📦
> **An Intelligent Inventory Management and Decision-Support System**

StockSense replaces manual registers, fragile Excel sheets, and fragmented stock tracking with a modern, centralized, real-time web application. 

- **Commit 1**: Core Inventory Foundation — production-ready full-stack architecture with strict stock-ledger audit rules.
- **Commit 2**: AI Intelligence Layer — demand forecasting, anomaly detection, and Google Gemini-powered AI Copilot.

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
stock-sense/
 ├── frontend/
 │   ├── src/
 │   │   ├── components/      # Sidebar, Navbar, StatusBadge, KpiCard, FloatingCopilot
 │   │   ├── context/         # AuthContext & useAuth hook
 │   │   ├── layouts/         # MainLayout, AuthLayout
 │   │   ├── pages/           # Dashboard, Products, Inventory, + ForecastPage, AnomaliesPage, CopilotPage
 │   │   ├── routes/          # AppRoutes & ProtectedRoute
 │   │   ├── services/        # Axios API client
 │   │   ├── types/           # TypeScript interfaces & enums (+ AI types)
 │   │   ├── App.tsx
 │   │   └── main.tsx
 │   ├── package.json
 │   └── vite.config.ts
 │
 ├── backend/
 │   ├── StockSense.slnx
 │   ├── StockSense.Domain/         # Entities, Enums
 │   ├── StockSense.Application/    # DTOs, Services (+AiService), Interfaces (+IAiService)
 │   ├── StockSense.Infrastructure/ # DbContext, Migrations, Seeders, Security
 │   └── StockSense.API/            # Controllers (+AiController), Program.cs, Swagger
 │
 ├── ai-service/                    # Python FastAPI AI Microservice (Commit 2)
 │   ├── main.py                    # FastAPI entry point
 │   ├── routers/                   # forecast, anomalies, copilot endpoints
 │   ├── services/                  # db, forecaster, detector, copilot_service
 │   ├── requirements.txt
 │   └── start.ps1
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

## 5. Quickstart with Docker Compose 🐳

You can spin up the entire StockSense multi-tier stack (**React Frontend + Nginx**, **.NET 8 Backend API**, **FastAPI AI Microservice**, and **MS SQL Server 2022**) with a single command:

```bash
# 1. Copy environment template and add your Gemini API key (optional for copilot)
cp .env.example .env

# 2. Build and start all services in detached mode
docker compose up -d --build
```

### 🌐 Service Endpoints

| Service | Container Name | URL / Port | Description |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | `stocksense-frontend` | `http://localhost:5173` or `http://localhost:80` | React 18 SPA + Nginx reverse proxy |
| **Backend API** | `stocksense-backend` | `http://localhost:5000/api` | .NET 8 Web API Gateway & Business Engine |
| **Swagger UI** | `stocksense-backend` | `http://localhost:5000/swagger` | Interactive OpenAPI documentation |
| **AI Microservice** | `stocksense-ai-service` | `http://localhost:8000` | Python FastAPI (Forecasting, Anomalies, Copilot) |
| **Database** | `stocksense-sqlserver` | `localhost:1433` | Microsoft SQL Server 2022 |

To stop and remove containers:
```bash
docker compose down
```

---

## 6. Database Setup & EF Core Migrations (Local Mode)

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

## 9. AI Intelligence Layer (Commit 2)

Commit 2 adds three AI/ML capabilities on top of the Commit 1 foundation — without modifying any existing core logic.

### Architecture

```
┌──────────────────────────────────┐
│         React Frontend           │
│  + ForecastPage + AnomaliesPage  │
│  + CopilotPage + FloatingCopilot │
└──────────┬───────────────────────┘
           │ HTTP (axios)
┌──────────▼───────────────────────┐
│    .NET 8 API (Gateway/Proxy)    │
│  + AiController → IAiService     │
└──────────┬───────────────────────┘
           │ HTTP (HttpClient)
┌──────────▼───────────────────────┐
│   Python FastAPI (ai-service/)   │
│  • /forecast  (SES Forecasting)  │
│  • /anomalies (Z-score Detector) │
│  • /copilot   (Gemini Chat)      │
└──────────────────────────────────┘
```

### Features

| Feature | Description | Algorithm |
| :--- | :--- | :--- |
| **📈 Demand Forecasting** | Predicts daily demand per product for N days ahead | Simple Exponential Smoothing (statsmodels) |
| **🚨 Anomaly Detection** | Auto-flags unusual stock movements, spikes, drops | Z-score statistical method (σ > 2.5) |
| **🤖 AI Copilot** | Natural language assistant for inventory Q&A | Google Gemini (`gemini-2.0-flash`) |

### New Directory Structure

```
ai-service/
├── main.py                 # FastAPI entry point
├── requirements.txt        # Python dependencies
├── start.ps1               # PowerShell one-click startup
├── .env.example            # Environment variables template
├── routers/
│   ├── forecast.py         # POST /forecast/{product_id}
│   ├── anomalies.py        # GET  /anomalies?days=30
│   └── copilot.py          # POST /copilot/chat
└── services/
    ├── db.py               # SQL Server database helpers (pyodbc)
    ├── forecaster.py       # SES demand forecasting engine
    ├── detector.py         # Z-score anomaly detection engine
    └── copilot_service.py  # Gemini SDK integration
```

### How to Run the AI Service

```bash
# Navigate to ai-service directory
cd ai-service

# Option 1: Use the startup script (recommended)
.\start.ps1

# Option 2: Manual setup
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- **AI Service URL**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/health`
- **Swagger Docs**: `http://localhost:8000/docs`

> **Note**: Set `GEMINI_API_KEY` in `ai-service/.env` to enable the AI Copilot. The Forecasting and Anomaly Detection features work without an API key.

### AI API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/forecast/{productId}?horizonDays=30` | Get demand forecast for a product |
| `GET` | `/api/ai/anomalies?days=30` | Detect anomalous stock movements |
| `POST` | `/api/ai/copilot/chat` | Chat with the AI Copilot |

---

## 10. Running the Full Stack

Start all three services in separate terminals:

```bash
# Terminal 1 — Backend API
cd backend/StockSense.API
dotnet run

# Terminal 2 — AI Service
cd ai-service
.\start.ps1

# Terminal 3 — Frontend
cd frontend
npm install   # first time only
npm run dev
```

| Service | URL |
| :--- | :--- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000/api` |
| AI Service | `http://localhost:8000` |
| Swagger (API) | `http://localhost:5000/swagger` |
| Swagger (AI) | `http://localhost:8000/docs` |
