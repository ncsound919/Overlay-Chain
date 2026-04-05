# ChainFlow (Overlay Chain) - Interactive Implementation Specification

> **Purpose**: Transform ChainFlow from a static landing page with fake data into a fully interactive supply chain management application with real database queries, authentication, blockchain integration, and AI-powered intelligence.

> **Current State**: One 2537-line marketing page (`src/app/page.tsx`), 4 API routes returning random/simulated data, a comprehensive but unused Prisma schema (20+ models on SQLite), simulated AI and blockchain services, and a full shadcn/ui component library (48 components).

> **Target State**: A multi-page authenticated SaaS application where users can manage inventory, track shipments, evaluate suppliers, place orders, view AI-generated forecasts, and verify supply chain events on-chain.

---

## Table of Contents

1. [New Pages to Build](#1-new-pages-to-build)
2. [Database Wiring](#2-database-wiring)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Real Blockchain Integration Points](#4-real-blockchain-integration-points)
5. [AI Integration](#5-ai-integration)
6. [Navigation & Layout](#6-navigation--layout)
7. [Data Seeding](#7-data-seeding)
8. [Priority Order](#8-priority-order)

---

## 1. New Pages to Build

The landing page at `/` stays as-is (the public marketing page). All application pages live under authenticated routes.

### 1.1 Authentication Pages

#### `/auth/login` - Login Page
- **File**: `src/app/auth/login/page.tsx`
- **Components**:
  - `LoginForm` (`src/components/auth/login-form.tsx`) - Email + password form using `react-hook-form` + `zod` validation
  - OAuth provider buttons (Google, GitHub) via `next-auth` providers
  - "Forgot password?" link (→ `/auth/forgot-password`, stretch goal)
  - "Don't have an account?" link → `/auth/register`
- **UI**: Centered card layout, uses `Card`, `Input`, `Button`, `Label`, `Form` from shadcn/ui
- **Behavior**: Calls `signIn()` from `next-auth/react`. On success, redirects to `/dashboard`. On failure, shows inline error via `toast`.
- **No sidebar/app layout** - standalone page with minimal branding.

#### `/auth/register` - Registration Page
- **File**: `src/app/auth/register/page.tsx`
- **Components**:
  - `RegisterForm` (`src/components/auth/register-form.tsx`) - Name, email, password, confirm password, organization name
  - Zod schema: email format, password min 8 chars, passwords match, org name required
- **API Endpoint**: `POST /api/auth/register`
  - Creates `User` record (with hashed password via `bcrypt`)
  - Creates `Organization` record (slug auto-generated from name)
  - Links user to org with role `admin`
  - Returns session token
- **Behavior**: On success, auto-signs in and redirects to `/dashboard`.

### 1.2 Dashboard

#### `/dashboard` - Main Dashboard
- **File**: `src/app/(app)/dashboard/page.tsx`
- **Components to build**:
  - `KPICards` (`src/components/dashboard/kpi-cards.tsx`)
    - Total Revenue (sum of delivered shipment values)
    - Active Shipments (count where status in `shipped`, `in_transit`, `customs`)
    - Inventory Alerts (count where `quantityOnHand <= reorderPoint`)
    - Supplier Score (avg `performanceScore` across active suppliers)
  - `ShipmentMap` (`src/components/dashboard/shipment-map.tsx`)
    - Visual map or table showing in-transit shipments with origin/destination
    - Click to navigate to `/shipments/[id]`
  - `RecentActivity` (`src/components/dashboard/recent-activity.tsx`)
    - Last 20 `AuditLog` entries for the org
    - Shows action, entity type, user name, timestamp
  - `AlertsFeed` (`src/components/dashboard/alerts-feed.tsx`)
    - Active `RiskEvent` records (status = `active` or `monitoring`)
    - Severity badge coloring: critical=red, high=orange, medium=yellow, low=blue
  - `InventoryHeatmap` (`src/components/dashboard/inventory-heatmap.tsx`)
    - Warehouse capacity utilization chart using `recharts` (BarChart or Treemap)
    - Data from `Warehouse.capacityUsed`
  - `DemandForecastChart` (`src/components/dashboard/demand-forecast-chart.tsx`)
    - Line chart comparing predicted vs actual quantities
    - Data from `DemandForecast` table
  - `QuickActions` (`src/components/dashboard/quick-actions.tsx`)
    - Buttons: "New Shipment", "Create PO", "Add Product", "Run Forecast"
    - Each opens a dialog or navigates to the relevant page
- **API Endpoints**:
  - `GET /api/dashboard/kpis` - Aggregated KPIs from real DB
  - `GET /api/dashboard/activity` - Recent audit log entries
  - `GET /api/dashboard/alerts` - Active risk events
- **Data fetching**: Use `@tanstack/react-query` with `useQuery` hooks. Refetch interval: 30s for KPIs, 60s for activity.

### 1.3 Inventory Management

#### `/inventory` - Inventory List
- **File**: `src/app/(app)/inventory/page.tsx`
- **Components**:
  - `InventoryTable` (`src/components/inventory/inventory-table.tsx`)
    - Uses `@tanstack/react-table` with columns: Product SKU, Product Name, Warehouse, Qty On Hand, Qty Reserved, Qty Incoming, Available (computed: onHand - reserved), Reorder Point, Status (badge: OK/Low/Critical), Last Stocktake, Actions
    - Status logic: `Critical` if onHand <= reorderPoint * 0.5, `Low` if onHand <= reorderPoint, `OK` otherwise
    - Column sorting on all numeric columns
    - Column filtering: warehouse dropdown, status dropdown, product category dropdown
    - Global search across product name and SKU
    - Pagination: 25 rows per page
  - `InventoryFilters` (`src/components/inventory/inventory-filters.tsx`)
    - Warehouse selector (from `Warehouse` table)
    - Category filter (distinct `Product.category` values)
    - Status filter (OK / Low / Critical)
    - Date range filter for lastStocktake
  - `AddInventoryDialog` (`src/components/inventory/add-inventory-dialog.tsx`)
    - Form: select warehouse, select product (or create new), quantity, reorder point, bin location, lot number, expiration date
    - Uses `Dialog` + `Form` + `Select` + `Input` components
  - `AdjustQuantityDialog` (`src/components/inventory/adjust-quantity-dialog.tsx`)
    - Adjust on-hand quantity with reason (receipt, shipment, adjustment, damage, return)
    - Creates `AuditLog` entry on every adjustment
  - `BulkImportDialog` (`src/components/inventory/bulk-import-dialog.tsx`)
    - CSV upload for bulk inventory updates
    - Preview table before committing
- **API Endpoints**:
  - `GET /api/inventory` - List with filters, sorting, pagination. Query params: `warehouseId`, `category`, `status`, `search`, `sortBy`, `sortDir`, `page`, `pageSize`
  - `POST /api/inventory` - Create new inventory record
  - `PATCH /api/inventory/[id]` - Update quantity/details
  - `POST /api/inventory/bulk` - Bulk CSV import
  - `GET /api/inventory/alerts` - Items below reorder point
- **Prisma queries**: Join `Inventory` → `Product` (for name, SKU, category) and `Inventory` → `Warehouse` (for warehouse name).

### 1.4 Shipment Tracking

#### `/shipments` - Shipment List
- **File**: `src/app/(app)/shipments/page.tsx`
- **Components**:
  - `ShipmentTable` (`src/components/shipments/shipment-table.tsx`)
    - Columns: Shipment #, Type (badge), Status (badge with color), Mode (icon + text), Origin → Destination, Carrier, ETD, ETA, Value, Blockchain Verified (checkmark if `blockchainTxId` exists), Actions
    - Status colors: pending=gray, processing=blue, shipped=indigo, in_transit=yellow, customs=orange, delivered=green, cancelled=red
    - Filterable by status, mode, type, date range
    - Sortable by date, value, status
  - `CreateShipmentDialog` (`src/components/shipments/create-shipment-dialog.tsx`)
    - Multi-step form:
      1. Basic info: type, mode, carrier, incoterms
      2. Origin & destination (select warehouse or enter custom location)
      3. Add items (select products, quantities, values)
      4. Dates: estimated departure/arrival
      5. Review & submit
    - Auto-generates `shipmentNumber` (format: `SHP-{YYYYMMDD}-{seq}`)
    - Option to record on blockchain at creation
- **API Endpoints**:
  - `GET /api/shipments` - List with filters/pagination
  - `POST /api/shipments` - Create shipment + items
  - `GET /api/shipments/[id]` - Full detail with items + tracking events
  - `PATCH /api/shipments/[id]` - Update status/details
  - `POST /api/shipments/[id]/track` - Add tracking event
  - `POST /api/shipments/[id]/blockchain` - Record shipment on-chain

#### `/shipments/[id]` - Shipment Detail
- **File**: `src/app/(app)/shipments/[id]/page.tsx`
- **Components**:
  - `ShipmentHeader` - Shipment number, status badge, mode icon, blockchain verification status
  - `ShipmentTimeline` (`src/components/shipments/shipment-timeline.tsx`)
    - Vertical timeline of `TrackingEvent` records
    - Each event shows: timestamp, status, location, description, source badge
    - "Add Event" button opens dialog to manually add tracking event
  - `ShipmentItems` - Table of `ShipmentItem` records (product, qty, value)
  - `ShipmentDetails` - Card showing origin, destination, carrier, dates, values, incoterms
  - `BlockchainProof` (`src/components/shipments/blockchain-proof.tsx`)
    - Shows blockchain transaction details if `blockchainTxId` is set
    - Tx hash (linked to block explorer), block number, gas used, timestamp
    - Button to "Verify On-Chain" if not yet recorded
  - `ShipmentActions` - Update status dropdown, edit details, print BOL, cancel shipment

### 1.5 Supplier Management

#### `/suppliers` - Supplier List
- **File**: `src/app/(app)/suppliers/page.tsx`
- **Components**:
  - `SupplierGrid` (`src/components/suppliers/supplier-grid.tsx`)
    - Card grid (default) or table view (toggle)
    - Each card shows: name, type badge, tier badge, country flag, performance score (circular progress), risk score (color-coded), active/inactive indicator
    - Click card → `/suppliers/[id]`
  - `SupplierFilters` - Filter by tier (1/2/3), type, country, performance range, risk range, active status
  - `AddSupplierDialog` (`src/components/suppliers/add-supplier-dialog.tsx`)
    - Form: name, code, type, tier, country, region, address, contact email, contact phone, website, lead time, payment terms, certifications (multi-select tags)
- **API Endpoints**:
  - `GET /api/suppliers` - List with filters
  - `POST /api/suppliers` - Create supplier
  - `GET /api/suppliers/[id]` - Detail with products, performance history, risk events
  - `PATCH /api/suppliers/[id]` - Update supplier
  - `DELETE /api/suppliers/[id]` - Soft delete (set `isActive = false`)

#### `/suppliers/[id]` - Supplier Detail
- **File**: `src/app/(app)/suppliers/[id]/page.tsx`
- **Components**:
  - `SupplierProfile` - Header card with all supplier info, edit button
  - `PerformanceChart` (`src/components/suppliers/performance-chart.tsx`)
    - Line chart of `SupplierPerformance` over time
    - Metrics: on-time delivery, quality score, fill rate, defect rate
    - Time range selector: 3m, 6m, 1y, all
  - `SupplierProducts` - Table of `SupplierProduct` records with cost, lead time, quality rating
  - `RiskAssessment` (`src/components/suppliers/risk-assessment.tsx`)
    - Current risk score with breakdown
    - Active `RiskEvent` records for this supplier
    - "Run AI Risk Assessment" button → calls AI service
  - `OrderHistory` - Recent `PurchaseOrder` records for this supplier
  - `PerformanceLog` - Tabular history from `SupplierPerformance` table

### 1.6 Purchase Orders

#### `/orders` - Order List
- **File**: `src/app/(app)/orders/page.tsx`
- **Components**:
  - `OrderTable` (`src/components/orders/order-table.tsx`)
    - Columns: PO #, Supplier Name, Status (badge), Order Date, Expected Delivery, Total Value, Payment Status (badge), Items Count, Blockchain Verified, Actions
    - Filterable by status, supplier, date range, payment status
    - Sortable by date, value
  - `CreateOrderDialog` (`src/components/orders/create-order-dialog.tsx`)
    - Multi-step:
      1. Select supplier (with search)
      2. Add line items: select product (from `SupplierProduct` for chosen supplier), quantity, unit price (auto-populated from `SupplierProduct.cost`), total auto-calculated
      3. Set payment terms, expected delivery, notes
      4. Review & submit
    - Auto-generates `poNumber` (format: `PO-{YYYYMMDD}-{seq}`)
    - Option to submit on blockchain
- **API Endpoints**:
  - `GET /api/orders` - List with filters/pagination
  - `POST /api/orders` - Create PO + items
  - `GET /api/orders/[id]` - Detail with items
  - `PATCH /api/orders/[id]` - Update status/details
  - `PATCH /api/orders/[id]/receive` - Mark items as received (updates `receivedQty`)
  - `POST /api/orders/[id]/blockchain` - Record on-chain

#### `/orders/[id]` - Order Detail
- **File**: `src/app/(app)/orders/[id]/page.tsx`
- **Components**:
  - `OrderHeader` - PO number, supplier link, status badge, payment status
  - `OrderItems` - Table of line items with received quantities, progress bars
  - `ReceiveItems` dialog - Mark partial/full receipt of items, auto-updates inventory
  - `OrderTimeline` - Status change history from `AuditLog`
  - `BlockchainProof` - Same component as shipments, reused

### 1.7 Analytics & Reporting

#### `/analytics` - Analytics Dashboard
- **File**: `src/app/(app)/analytics/page.tsx`
- **Components**:
  - `AnalyticsTabs` - Tabbed layout with sections:
    - **Overview**: Revenue trends, shipment volume, order fulfillment rates
    - **Inventory**: Stock levels over time, turnover rates, dead stock identification
    - **Suppliers**: Performance comparison, risk matrix (scatter plot: performance vs risk)
    - **Logistics**: Shipping mode breakdown, carrier performance, on-time delivery rates
    - **Financial**: Spend by supplier, cost trends, payment aging
  - `DateRangePicker` (`src/components/analytics/date-range-picker.tsx`)
    - Uses `Calendar` + `Popover` from shadcn/ui
    - Presets: Last 7 days, 30 days, 90 days, YTD, Custom
  - `ChartCard` (`src/components/analytics/chart-card.tsx`)
    - Reusable wrapper: title, description, chart area, download button (CSV/PNG)
  - `MetricCard` (`src/components/analytics/metric-card.tsx`)
    - KPI with trend arrow (up/down), percentage change, sparkline
  - Charts (all using `recharts`):
    - `RevenueChart` - AreaChart of shipment values over time
    - `ShipmentVolumeChart` - BarChart of shipment counts by mode
    - `SupplierScatterPlot` - ScatterChart (x=performance, y=risk, size=order volume)
    - `InventoryTurnoverChart` - ComposedChart with bar (turnover) + line (stock level)
    - `SpendByCategoryChart` - PieChart of order values by product category
    - `CarrierComparisonChart` - RadarChart comparing carriers on cost, speed, reliability
- **API Endpoints**:
  - `GET /api/analytics/overview` - Aggregated metrics with date range
  - `GET /api/analytics/inventory` - Inventory metrics
  - `GET /api/analytics/suppliers` - Supplier comparison data
  - `GET /api/analytics/logistics` - Shipment/carrier metrics
  - `GET /api/analytics/financial` - Spend and payment data
  - `GET /api/analytics/export` - CSV export for any dataset

### 1.8 Settings

#### `/settings` - Settings Page
- **File**: `src/app/(app)/settings/page.tsx`
- **Components**:
  - `SettingsTabs` with sections:
    - **Profile** (`src/components/settings/profile-form.tsx`)
      - Edit user name, email, password change
      - Avatar upload (stretch)
    - **Organization** (`src/components/settings/org-form.tsx`)
      - Edit org name, industry, website
      - Manage org settings JSON (notification preferences, default currency, timezone)
      - Only visible to `admin` role
    - **Team** (`src/components/settings/team-management.tsx`)
      - List users in org with roles
      - Invite new user (sends email or generates invite link)
      - Change user roles (admin, manager, analyst, viewer)
      - Remove user from org
      - Only visible to `admin` role
    - **Integrations** (`src/components/settings/integrations-form.tsx`)
      - List configured integrations from `Integration` table
      - Add new integration (ERP, WMS, TMS, Marketplace, Carrier)
      - Toggle active/inactive
      - Show last sync time, error count
    - **Webhooks** (`src/components/settings/webhooks-form.tsx`)
      - CRUD for `Webhook` records
      - Select events to subscribe to
      - Test webhook button
    - **Blockchain** (`src/components/settings/blockchain-form.tsx`)
      - Configure blockchain network (RPC URL, chain ID)
      - Smart contract addresses
      - Wallet configuration
      - View deployed contracts from `SmartContract` table
    - **AI Models** (`src/components/settings/ai-models-form.tsx`)
      - View/configure AI models from `AIModel` table
      - Set active model for each task type (forecasting, anomaly detection, etc.)
- **API Endpoints**:
  - `GET/PATCH /api/settings/profile` - User profile
  - `GET/PATCH /api/settings/organization` - Org settings (admin only)
  - `GET/POST/DELETE /api/settings/team` - Team management (admin only)
  - `GET/POST/PATCH/DELETE /api/settings/integrations` - Integration CRUD
  - `GET/POST/PATCH/DELETE /api/settings/webhooks` - Webhook CRUD
  - `GET/PATCH /api/settings/blockchain` - Blockchain config
  - `GET/PATCH /api/settings/ai-models` - AI model config

---

## 2. Database Wiring

### 2.1 Current State

- **Schema**: `prisma/schema.prisma` defines 20+ models (User, Session, Organization, Supplier, SupplierProduct, SupplierPerformance, Warehouse, Product, Inventory, Shipment, ShipmentItem, TrackingEvent, PurchaseOrder, PurchaseOrderItem, DemandForecast, RiskEvent, BlockchainTransaction, SmartContract, AuditLog, Compliance, Integration, Webhook, SystemConfig, AIModel).
- **DB provider**: SQLite (file-based, good for dev; switch to PostgreSQL for production).
- **Prisma client**: `src/lib/db.ts` has the singleton pattern ready. Import as `import { prisma } from '@/lib/db'`.
- **Problem**: Zero API routes query the database. All return hardcoded or randomly generated data.

### 2.2 Required Changes

#### Environment Setup

Create `.env` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Run initial setup:
```bash
npx prisma generate
npx prisma db push
```

#### API Route Rewrites

Every existing API route must be rewritten to query the database. Below are the specific changes:

**`src/app/api/dashboard/route.ts`** (currently returns random KPIs):
- Replace `generateRandomKPIs()` with:
  ```typescript
  import { prisma } from '@/lib/db';
  import { getServerSession } from 'next-auth';

  // Get org from session
  const session = await getServerSession(authOptions);
  const orgId = session.user.organizationId;

  // Real KPIs
  const activeShipments = await prisma.shipment.count({
    where: { organizationId: orgId, status: { in: ['shipped', 'in_transit', 'customs'] } }
  });

  const inventoryAlerts = await prisma.inventory.count({
    where: {
      warehouse: { organizationId: orgId },
      quantityOnHand: { lte: prisma.raw('reorderPoint') } // or use raw query
    }
  });

  const supplierAvg = await prisma.supplier.aggregate({
    where: { organizationId: orgId, isActive: true },
    _avg: { performanceScore: true }
  });
  ```

**All other API routes**: Follow the same pattern - replace simulated data with Prisma queries scoped to the user's `organizationId`.

#### New API Route Structure

```
src/app/api/
  auth/
    register/route.ts          # POST - user registration
    [...nextauth]/route.ts     # NextAuth handler
  dashboard/
    route.ts                   # GET - rewrite existing
    kpis/route.ts             # GET - aggregated KPIs
    activity/route.ts         # GET - recent audit logs
    alerts/route.ts           # GET - active risk events
  inventory/
    route.ts                  # GET (list) / POST (create)
    [id]/route.ts             # GET / PATCH / DELETE
    bulk/route.ts             # POST - CSV import
    alerts/route.ts           # GET - low stock alerts
  shipments/
    route.ts                  # GET / POST
    [id]/
      route.ts               # GET / PATCH
      track/route.ts         # POST - add tracking event
      blockchain/route.ts    # POST - record on-chain
  suppliers/
    route.ts                 # GET / POST
    [id]/
      route.ts              # GET / PATCH / DELETE
      performance/route.ts  # GET - performance history
      risk/route.ts         # POST - run AI risk assessment
  orders/
    route.ts                # GET / POST
    [id]/
      route.ts             # GET / PATCH
      receive/route.ts     # PATCH - receive items
      blockchain/route.ts  # POST - record on-chain
  analytics/
    overview/route.ts      # GET
    inventory/route.ts     # GET
    suppliers/route.ts     # GET
    logistics/route.ts     # GET
    financial/route.ts     # GET
    export/route.ts        # GET - CSV export
  settings/
    profile/route.ts       # GET / PATCH
    organization/route.ts  # GET / PATCH
    team/route.ts          # GET / POST / DELETE
    integrations/route.ts  # CRUD
    webhooks/route.ts      # CRUD
    blockchain/route.ts    # GET / PATCH
    ai-models/route.ts     # GET / PATCH
  chainflow/
    route.ts               # Keep & extend - unified AI + blockchain
```

#### Audit Logging

Every write operation (POST, PATCH, DELETE) must create an `AuditLog` entry:
```typescript
await prisma.auditLog.create({
  data: {
    userId: session.user.id,
    action: 'UPDATE',       // CREATE, UPDATE, DELETE, STATUS_CHANGE
    entityType: 'shipment', // matches model name
    entityId: shipment.id,
    oldValue: previousState,
    newValue: newState,
  }
});
```

Create a helper function at `src/lib/audit.ts`:
```typescript
export async function createAuditLog(params: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
}) {
  return prisma.auditLog.create({ data: params });
}
```

### 2.3 Query Patterns

All list endpoints should support:
- **Pagination**: `?page=1&pageSize=25` → `skip` / `take`
- **Sorting**: `?sortBy=createdAt&sortDir=desc` → `orderBy`
- **Filtering**: Query params mapped to `where` clauses
- **Search**: `?search=term` → `contains` on relevant text fields
- **Organization scoping**: Every query must include `organizationId` from session

Standard response format:
```typescript
{
  data: T[],
  pagination: {
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
  }
}
```

---

## 3. Authentication & Authorization

### 3.1 NextAuth Configuration

**File**: `src/lib/auth.ts`

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          organizationName: user.organization?.name,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
  },
};
```

**NextAuth route handler**: `src/app/api/auth/[...nextauth]/route.ts`

**Type augmentation**: `src/types/next-auth.d.ts`
```typescript
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role: string;
    organizationId: string | null;
    organizationName?: string;
  }
  interface Session {
    user: User & {
      id: string;
      role: string;
      organizationId: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    organizationId: string;
  }
}
```

### 3.2 Session Provider

**File**: `src/components/providers/session-provider.tsx`
```typescript
'use client';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

Wrap in root layout or in `(app)` layout.

### 3.3 Middleware for Route Protection

**File**: `src/middleware.ts`
```typescript
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/auth/login' },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/inventory/:path*',
    '/shipments/:path*',
    '/suppliers/:path*',
    '/orders/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
};
```

### 3.4 Role-Based Access Control (RBAC)

Roles (stored in `User.role`):
| Role | Dashboard | Inventory | Shipments | Suppliers | Orders | Analytics | Settings (own) | Settings (org/team) |
|------|-----------|-----------|-----------|-----------|--------|-----------|----------------|---------------------|
| `admin` | Full | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full | Full | Full |
| `manager` | Full | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full | Full | Read-only |
| `analyst` | Read | Read | Read | Read | Read | Full | Full | None |
| `viewer` | Read | Read | Read | Read | Read | Read | Read (own profile) | None |

**Authorization helper** at `src/lib/authorize.ts`:
```typescript
export function canWrite(role: string, resource: string): boolean {
  if (role === 'admin' || role === 'manager') return true;
  return false;
}

export function canAccessSettings(role: string, section: string): boolean {
  if (section === 'profile') return true; // everyone
  if (role === 'admin') return true;
  if (role === 'manager' && section !== 'team') return true;
  return false;
}

export function requireRole(session: any, ...roles: string[]) {
  if (!roles.includes(session.user.role)) {
    throw new Error('Forbidden');
  }
}
```

Use in API routes:
```typescript
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
if (!canWrite(session.user.role, 'inventory')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### 3.5 Additional Dependency

Install `bcryptjs` for password hashing:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

---

## 4. Real Blockchain Integration Points

### 4.1 Current State

`src/lib/blockchain-service.ts` (577 lines) has a fully structured `BlockchainService` class with:
- ABIs for SupplyChain, Escrow, and Traceability contracts
- Config for Polygon network (chainId 137)
- Methods: `createShipment`, `updateShipmentStatus`, `createEscrowPayment`, `releaseEscrowPayment`, `recordTraceabilityEvent`, `getProductHistory`, `verifyDocument`, `getTransactionStatus`, `getBlockchainStats`, `subscribeToEvents`
- **Problem**: All methods generate random tx hashes and return simulated results. `generateTxHash()` just returns `0x${random hex}`.

### 4.2 Integration Strategy

**Phase 1 (MVP)**: Keep simulation mode but persist results to `BlockchainTransaction` table. This gives the UI real data to display without requiring wallet setup.

**Phase 2 (Production)**: Replace simulated calls with real on-chain transactions using `ethers.js` or `viem`.

### 4.3 Phase 1 Changes to `blockchain-service.ts`

Add database persistence to every method:
```typescript
import { prisma } from '@/lib/db';

// After generating simulated result:
await prisma.blockchainTransaction.create({
  data: {
    txHash: result.txHash,
    network: this.config.network,
    contractAddress: this.contracts.supplyChain.address,
    method: 'createShipment',
    fromAddress: '0xSIMULATED',
    toAddress: this.contracts.supplyChain.address,
    status: 'confirmed',
    entityType: 'shipment',
    entityId: shipmentId,
    payload: { origin, destination, carrier },
    gasUsed: result.gasUsed,
    blockNumber: result.blockNumber,
  }
});

// Also update the entity's blockchainTxId:
await prisma.shipment.update({
  where: { id: shipmentId },
  data: { blockchainTxId: result.txHash }
});
```

### 4.4 Phase 2 Changes (Real On-Chain)

Install ethers.js:
```bash
npm install ethers
```

Add to `.env`:
```env
BLOCKCHAIN_RPC_URL="https://polygon-rpc.com"
BLOCKCHAIN_PRIVATE_KEY="your-wallet-private-key"
BLOCKCHAIN_CHAIN_ID=137
```

Replace simulated calls with real contract interactions:
```typescript
import { ethers } from 'ethers';

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private supplyChainContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY!, this.provider);
    this.supplyChainContract = new ethers.Contract(
      contractAddress,
      SUPPLY_CHAIN_CONTRACT_ABI,
      this.signer
    );
  }

  async createShipment(data: ShipmentRecord) {
    const tx = await this.supplyChainContract.createShipment(
      data.shipmentId, data.origin, data.destination, data.carrier
    );
    const receipt = await tx.wait();

    await prisma.blockchainTransaction.create({
      data: {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        network: 'polygon',
        contractAddress: this.supplyChainContract.target as string,
        method: 'createShipment',
        fromAddress: this.signer.address,
        toAddress: this.supplyChainContract.target as string,
        gasUsed: Number(receipt.gasUsed),
        gasPrice: Number(receipt.gasPrice),
        status: 'confirmed',
        entityType: 'shipment',
        entityId: data.shipmentId,
        payload: data,
      }
    });

    return receipt;
  }
}
```

### 4.5 Blockchain-Related UI Integration Points

| Feature | Page | Behavior |
|---------|------|----------|
| Record shipment on-chain | `/shipments/[id]` | Button triggers `POST /api/shipments/[id]/blockchain` |
| Record PO on-chain | `/orders/[id]` | Button triggers `POST /api/orders/[id]/blockchain` |
| View tx proof | Shipment/Order detail | `BlockchainProof` component shows tx hash, block, gas |
| Blockchain feed | `/dashboard` | Live feed of recent `BlockchainTransaction` records |
| Blockchain settings | `/settings` | Configure network, contracts, wallet |
| Escrow payments | `/orders/[id]` | Create/release escrow for PO payments |
| Traceability log | `/shipments/[id]` | Full product journey recorded on-chain |

### 4.6 Smart Contract Deployment (Stretch Goal)

The ABIs in `blockchain-service.ts` define three contracts:
1. **SupplyChainContract** - `createShipment`, `updateStatus`, `getShipment`
2. **EscrowContract** - `createEscrow`, `releasePayment`, `refund`
3. **TraceabilityContract** - `recordEvent`, `getHistory`, `verifyDocument`

These would need to be written in Solidity, compiled, deployed to Polygon testnet (Mumbai), and their addresses stored in `SmartContract` table or `.env`.

---

## 5. AI Integration

### 5.1 Current State

`src/lib/ai-service.ts` (398 lines) has an `AIService` class using `z-ai-web-dev-sdk` (ZAI). Methods:
- `generateDemandForecast(input)` - Takes historical data, returns predicted quantities with confidence
- `detectAnomalies(input)` - Takes metric data points, returns anomaly flags
- `assessSupplierRisk(input)` - Takes supplier data + external factors, returns risk breakdown
- `processQuery(input)` - Natural language chat about supply chain
- `generateInsights(data)` - Generate insights from any dataset
- `optimizeInventory(input)` - Inventory optimization recommendations

**Problem**: The methods are structured correctly but are only called from the simulated `/api/chainflow` route. They're not wired to real data from the database.

### 5.2 Wiring AI to Real Data

Each AI method should pull real data from the database before calling the LLM:

#### Demand Forecasting
- **Trigger**: Button on `/analytics` or `/inventory` pages, or scheduled via cron
- **Flow**:
  1. Fetch historical `PurchaseOrderItem` quantities grouped by product and month
  2. Fetch related `DemandForecast` records (for accuracy feedback loop)
  3. Pass to `aiService.generateDemandForecast()`
  4. Save result to `DemandForecast` table
  5. Return to UI for display
- **API**: `POST /api/ai/forecast` with body `{ productId, months: 6 }`
- **Data source**: 
  ```typescript
  const historicalData = await prisma.purchaseOrderItem.findMany({
    where: { purchaseOrder: { organizationId: orgId }, sku: product.sku },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true, quantity: true }
  });
  ```

#### Anomaly Detection
- **Trigger**: Background job or manual trigger on dashboard
- **Flow**:
  1. Fetch recent metric data (e.g., shipment delays, inventory levels, spend patterns)
  2. Pass to `aiService.detectAnomalies()`
  3. If anomalies detected, create `RiskEvent` records
  4. Surface on dashboard alerts feed
- **API**: `POST /api/ai/anomalies` with body `{ metric: 'shipment_delays', days: 30 }`

#### Supplier Risk Assessment
- **Trigger**: Button on `/suppliers/[id]` detail page
- **Flow**:
  1. Fetch supplier record with performance history
  2. Fetch recent `RiskEvent` records for supplier's country/region
  3. Pass to `aiService.assessSupplierRisk()`
  4. Update `Supplier.riskScore`
  5. Create `RiskEvent` if new risks identified
  6. Return assessment to UI
- **API**: `POST /api/ai/risk-assessment` with body `{ supplierId }`

#### Chat / Natural Language Query
- **Trigger**: Chat widget accessible from any app page
- **Component**: `AIChatWidget` (`src/components/ai/chat-widget.tsx`)
  - Floating button in bottom-right corner
  - Opens slide-over panel with chat interface
  - User types natural language queries: "Which suppliers have the highest risk?", "Show me inventory levels for electronics", "What shipments are delayed?"
  - AI processes query with org context, returns formatted response
- **Flow**:
  1. User sends message
  2. Backend enriches with org context (recent activity, key metrics)
  3. Calls `aiService.processQuery()`
  4. Returns response with data references
- **API**: `POST /api/ai/chat` with body `{ query, conversationHistory: [] }`

#### Inventory Optimization
- **Trigger**: Button on `/inventory` page
- **Flow**:
  1. Fetch all inventory records with products and demand forecasts
  2. Pass to `aiService.optimizeInventory()`
  3. Returns recommendations: reorder point adjustments, safety stock levels, dead stock alerts
  4. Display as actionable cards user can accept/dismiss
- **API**: `POST /api/ai/optimize-inventory`

### 5.3 New API Routes for AI

```
src/app/api/ai/
  forecast/route.ts        # POST - demand forecast for product
  anomalies/route.ts       # POST - anomaly detection
  risk-assessment/route.ts # POST - supplier risk
  chat/route.ts            # POST - natural language query
  optimize-inventory/route.ts  # POST - inventory optimization
  insights/route.ts        # POST - generate insights from data
```

### 5.4 AI Chat Widget Component

**File**: `src/components/ai/chat-widget.tsx`
```
- Fixed position button (bottom-right)
- Expandable panel using Sheet component from shadcn/ui
- Message list with user/AI message bubbles
- Input field with send button
- Loading indicator during AI processing
- Message history stored in zustand store (persists during session)
- Optional: save conversation history to DB
```

**File**: `src/stores/chat-store.ts` (zustand)
```typescript
interface ChatStore {
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>;
  isOpen: boolean;
  isLoading: boolean;
  addMessage: (msg) => void;
  toggleOpen: () => void;
  setLoading: (v: boolean) => void;
  clearMessages: () => void;
}
```

---

## 6. Navigation & Layout

### 6.1 App Layout (Authenticated Pages)

**File**: `src/app/(app)/layout.tsx`

All authenticated pages use a shared layout with sidebar navigation:

```typescript
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SessionProvider } from '@/components/providers/session-provider';
import { QueryProvider } from '@/components/providers/query-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <AppHeader />
            <div className="flex-1 overflow-auto p-6">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
```

### 6.2 Sidebar Component

**File**: `src/components/layout/app-sidebar.tsx`

Uses the existing `sidebar.tsx` shadcn component. Navigation items:

```
ChainFlow Logo + Name (collapsible header)
────────────────────
Dashboard        (LayoutDashboard icon)   → /dashboard
────────────────────
SUPPLY CHAIN
  Inventory      (Package icon)           → /inventory
  Shipments      (Truck icon)             → /shipments
  Suppliers      (Users icon)             → /suppliers
  Orders         (ShoppingCart icon)       → /orders
────────────────────
INTELLIGENCE
  Analytics      (BarChart3 icon)         → /analytics
  AI Insights    (Brain icon)             → opens AI chat
────────────────────
SYSTEM
  Settings       (Settings icon)          → /settings
────────────────────
User avatar + name + role (footer)
  Sign Out button
```

- Active state: highlight current route
- Collapsible on mobile (hamburger menu in header)
- Collapsed mode: show only icons (toggle via button)
- Badge counts on nav items:
  - Inventory: count of low/critical items
  - Shipments: count of in-transit
  - Orders: count of pending

### 6.3 Header Component

**File**: `src/components/layout/app-header.tsx`

```
[Sidebar Toggle] [Breadcrumb: Dashboard > ...] ──────── [Search] [Notifications Bell] [User Avatar Dropdown]
```

- **Breadcrumb**: Auto-generated from route path using `usePathname()`
- **Search**: Command palette (uses `cmdk` - already installed) for global search across all entities
- **Notifications**: Dropdown with recent risk events and alerts (from `RiskEvent` where status = active)
- **User dropdown**: Profile link, org name, role badge, sign out button

### 6.4 Query Provider

**File**: `src/components/providers/query-provider.tsx`
```typescript
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,       // 30 seconds
        refetchOnWindowFocus: true,
      },
    },
  }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

### 6.5 Page Route Structure

```
src/app/
  page.tsx                          # Landing page (public, unchanged)
  layout.tsx                        # Root layout (fonts, metadata)
  auth/
    login/page.tsx                  # Login (no sidebar)
    register/page.tsx               # Register (no sidebar)
  (app)/
    layout.tsx                      # App layout (sidebar + header + providers)
    dashboard/page.tsx
    inventory/page.tsx
    shipments/
      page.tsx                      # List
      [id]/page.tsx                 # Detail
    suppliers/
      page.tsx                      # List
      [id]/page.tsx                 # Detail
    orders/
      page.tsx                      # List
      [id]/page.tsx                 # Detail
    analytics/page.tsx
    settings/page.tsx
```

### 6.6 Shared Components to Build

```
src/components/
  layout/
    app-sidebar.tsx                 # Main sidebar navigation
    app-header.tsx                  # Top header bar
    breadcrumb-nav.tsx              # Auto-generated breadcrumbs
    command-search.tsx              # Global search (cmdk)
    notification-dropdown.tsx       # Alert notifications
    user-menu.tsx                   # User avatar + dropdown
  providers/
    session-provider.tsx            # NextAuth session
    query-provider.tsx              # React Query
  shared/
    data-table.tsx                  # Reusable table wrapper (tanstack)
    page-header.tsx                 # Page title + description + actions
    empty-state.tsx                 # Empty state illustration
    loading-skeleton.tsx            # Page loading skeleton
    status-badge.tsx                # Reusable status badge (configurable colors)
    confirm-dialog.tsx              # Reusable confirmation dialog
    error-boundary.tsx              # Error boundary with retry
  ai/
    chat-widget.tsx                 # Floating AI chat
    chat-message.tsx                # Chat message bubble
```

---

## 7. Data Seeding

### 7.1 Seed Script

**File**: `prisma/seed.ts`

The seed script populates the database with realistic demo data so the app has content immediately after setup.

```bash
# Add to package.json:
"prisma": {
  "seed": "tsx prisma/seed.ts"
}

# Run:
npx prisma db seed
```

Install `tsx` for running TypeScript seeds:
```bash
npm install -D tsx
```

### 7.2 Seed Data Plan

#### Organizations (1)
```typescript
{
  name: 'Uplift Global Supply Co.',
  slug: 'uplift-global',
  type: 'enterprise',
  industry: 'manufacturing',
  website: 'https://upliftglobal.example.com',
}
```

#### Users (4)
| Name | Email | Role | Password |
|------|-------|------|----------|
| Admin User | admin@chainflow.demo | admin | chainflow123 |
| Sarah Manager | sarah@chainflow.demo | manager | chainflow123 |
| David Analyst | david@chainflow.demo | analyst | chainflow123 |
| View User | viewer@chainflow.demo | viewer | chainflow123 |

#### Warehouses (4)
| Name | Code | Type | Country | Region | Capacity |
|------|------|------|---------|--------|----------|
| Los Angeles DC | LAX-DC | distribution | USA | West Coast | 50000 sqm |
| Rotterdam Hub | RTD-HUB | distribution | Netherlands | Europe | 75000 sqm |
| Shenzhen Factory | SZN-MFG | manufacturing | China | Asia Pacific | 30000 sqm |
| Sao Paulo Fulfillment | SAO-FC | fulfillment | Brazil | South America | 20000 sqm |

#### Products (15)
Mix of product categories:
- Electronics (5): Circuit Board A1, Microprocessor X5, LED Display Panel, Battery Module B3, Sensor Array S7
- Raw Materials (5): Steel Coil Grade A, Aluminum Sheet 6061, Copper Wire AWG-12, Polycarbonate Resin, Carbon Fiber Roll
- Finished Goods (5): Smart Controller Unit, Power Supply 500W, Networking Switch Pro, IoT Gateway Device, Solar Panel Module

#### Suppliers (8)
Mix of tiers and regions:
- Tier 1: 3 suppliers (Japan, Germany, USA)
- Tier 2: 3 suppliers (China, Taiwan, South Korea)
- Tier 3: 2 suppliers (Vietnam, India)

Each with realistic performance scores (60-98), risk scores (15-75), lead times (7-60 days).

#### Inventory Records (40+)
Each product stocked in 2-3 warehouses with varying quantities. Some deliberately below reorder point to trigger alerts.

#### Shipments (20)
Mix of statuses across all modes:
- 3 pending, 3 processing, 4 shipped, 5 in_transit, 1 customs, 3 delivered, 1 cancelled
- Mix of sea (8), air (6), land (4), rail (2)
- Each with 1-3 tracking events
- 5 with blockchain tx IDs (simulated)

#### Purchase Orders (12)
- 2 draft, 2 submitted, 3 confirmed, 2 partial, 2 received, 1 cancelled
- Each with 2-5 line items
- Linked to suppliers

#### Supplier Performance Records (80+)
Monthly performance records for each supplier spanning 12 months. Realistic trends (some improving, some declining).

#### Demand Forecasts (30)
Forecasts for 10 products over 3 future months with varying confidence levels.

#### Risk Events (8)
- 2 active (1 critical: port congestion, 1 high: supplier financial warning)
- 3 monitoring (medium severity)
- 3 resolved (historical)

#### Blockchain Transactions (10)
Simulated transactions linked to shipments and POs.

#### Audit Logs (50+)
Historical activity covering user logins, inventory adjustments, shipment status changes, PO creation.

### 7.3 Seed Script Structure

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create organization
  const org = await prisma.organization.create({ ... });

  // 2. Create users (hash passwords with bcrypt)
  const passwordHash = await bcrypt.hash('chainflow123', 12);
  const admin = await prisma.user.create({ ... });

  // 3. Create warehouses
  // 4. Create products
  // 5. Create suppliers + supplier products
  // 6. Create inventory (some below reorder point)
  // 7. Create shipments + items + tracking events
  // 8. Create purchase orders + items
  // 9. Create supplier performance history
  // 10. Create demand forecasts
  // 11. Create risk events
  // 12. Create blockchain transactions
  // 13. Create audit logs

  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 8. Priority Order

### Phase 1: Foundation (Must complete first)
1. **Environment & Database Setup**
   - Create `.env` file
   - Run `prisma generate` and `prisma db push`
   - Install `bcryptjs`
   - Write and run seed script (`prisma/seed.ts`)
   
2. **Authentication**
   - `src/lib/auth.ts` (NextAuth config with Credentials provider)
   - `src/app/api/auth/[...nextauth]/route.ts`
   - `src/app/api/auth/register/route.ts`
   - `src/types/next-auth.d.ts` (type augmentation)
   - `src/middleware.ts` (route protection)
   - `src/app/auth/login/page.tsx`
   - `src/app/auth/register/page.tsx`
   - `src/components/auth/login-form.tsx`
   - `src/components/auth/register-form.tsx`

3. **App Layout & Navigation**
   - `src/app/(app)/layout.tsx` (sidebar + header + providers)
   - `src/components/providers/session-provider.tsx`
   - `src/components/providers/query-provider.tsx`
   - `src/components/layout/app-sidebar.tsx`
   - `src/components/layout/app-header.tsx`
   - `src/components/layout/user-menu.tsx`

### Phase 2: Core Pages (Build in this order)
4. **Dashboard** (`/dashboard`)
   - Rewrite `GET /api/dashboard` to use real DB queries
   - Build KPI cards, activity feed, alerts feed
   - Add quick action buttons

5. **Inventory** (`/inventory`)
   - `GET/POST /api/inventory` endpoints
   - Inventory table with filters, sorting, pagination
   - Add/adjust inventory dialogs
   - Low stock alerts

6. **Shipments** (`/shipments`, `/shipments/[id]`)
   - `GET/POST /api/shipments` endpoints
   - Shipment table with status filters
   - Create shipment multi-step dialog
   - Detail page with timeline, items, blockchain proof

7. **Suppliers** (`/suppliers`, `/suppliers/[id]`)
   - `GET/POST /api/suppliers` endpoints
   - Supplier grid/table with filters
   - Detail page with performance chart, risk assessment, order history

8. **Orders** (`/orders`, `/orders/[id]`)
   - `GET/POST /api/orders` endpoints
   - Order table with filters
   - Create order multi-step dialog
   - Detail page with items, receive workflow

### Phase 3: Intelligence & Polish
9. **Analytics** (`/analytics`)
   - Analytics API endpoints
   - Chart components (revenue, inventory, suppliers, logistics, financial)
   - Date range filtering
   - CSV export

10. **AI Integration**
    - Wire AI service methods to real DB data
    - AI API endpoints (forecast, anomalies, risk, chat, optimize)
    - AI chat widget (floating button + panel)
    - Zustand chat store

11. **Blockchain Integration**
    - Persist simulated blockchain results to DB
    - Blockchain proof UI components
    - Record on-chain buttons on shipment and order pages
    - Blockchain settings page

12. **Settings** (`/settings`)
    - Profile management
    - Organization settings (admin only)
    - Team management (admin only)
    - Integration and webhook configuration

### Phase 4: Stretch Goals (After MVP)
13. **Command palette** (global search with `cmdk`)
14. **Notification system** (bell icon with real-time alerts)
15. **Dark mode** (using `next-themes` - already installed)
16. **Bulk operations** (CSV import, batch status updates)
17. **Real blockchain** (deploy Solidity contracts to Polygon testnet)
18. **Email notifications** (invite users, shipment alerts)
19. **Forgot password** flow
20. **Mobile responsive** refinements

---

## Appendix A: Existing UI Components Available

The following shadcn/ui components are already installed and ready to use (in `src/components/ui/`):

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`

## Appendix B: Installed Dependencies Reference

Key dependencies already in `package.json` that should be used:
- **Auth**: `next-auth` v4
- **Database**: `@prisma/client`, `prisma`
- **Data tables**: `@tanstack/react-table`
- **Data fetching**: `@tanstack/react-query`
- **Forms**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **State**: `zustand`
- **Charts**: `recharts`
- **Animation**: `framer-motion`
- **Dates**: `date-fns`
- **AI**: `z-ai-web-dev-sdk`
- **DnD**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Icons**: `lucide-react`
- **Markdown**: `react-markdown`
- **Theming**: `next-themes`

**Need to install**:
- `bcryptjs` + `@types/bcryptjs` (password hashing)
- `tsx` (dev dependency, for running seed script)
- `ethers` (Phase 2 blockchain, optional initially)

## Appendix C: File Creation Checklist

### New Directories to Create
```
src/app/(app)/
src/app/(app)/dashboard/
src/app/(app)/inventory/
src/app/(app)/shipments/
src/app/(app)/shipments/[id]/
src/app/(app)/suppliers/
src/app/(app)/suppliers/[id]/
src/app/(app)/orders/
src/app/(app)/orders/[id]/
src/app/(app)/analytics/
src/app/(app)/settings/
src/app/auth/
src/app/auth/login/
src/app/auth/register/
src/app/api/auth/register/
src/app/api/auth/[...nextauth]/
src/app/api/inventory/
src/app/api/inventory/[id]/
src/app/api/inventory/bulk/
src/app/api/inventory/alerts/
src/app/api/shipments/
src/app/api/shipments/[id]/
src/app/api/shipments/[id]/track/
src/app/api/shipments/[id]/blockchain/
src/app/api/suppliers/
src/app/api/suppliers/[id]/
src/app/api/suppliers/[id]/performance/
src/app/api/suppliers/[id]/risk/
src/app/api/orders/
src/app/api/orders/[id]/
src/app/api/orders/[id]/receive/
src/app/api/orders/[id]/blockchain/
src/app/api/analytics/overview/
src/app/api/analytics/inventory/
src/app/api/analytics/suppliers/
src/app/api/analytics/logistics/
src/app/api/analytics/financial/
src/app/api/analytics/export/
src/app/api/settings/profile/
src/app/api/settings/organization/
src/app/api/settings/team/
src/app/api/settings/integrations/
src/app/api/settings/webhooks/
src/app/api/settings/blockchain/
src/app/api/settings/ai-models/
src/app/api/ai/forecast/
src/app/api/ai/anomalies/
src/app/api/ai/risk-assessment/
src/app/api/ai/chat/
src/app/api/ai/optimize-inventory/
src/app/api/ai/insights/
src/components/auth/
src/components/dashboard/
src/components/inventory/
src/components/shipments/
src/components/suppliers/
src/components/orders/
src/components/analytics/
src/components/settings/
src/components/layout/
src/components/providers/
src/components/shared/
src/components/ai/
src/stores/
src/types/
src/lib/
```

### Total New Files (Approximate)
- **Pages**: 13 files
- **API Routes**: 35+ files
- **Components**: 50+ files
- **Lib/Utils**: 5 files
- **Types**: 2 files
- **Stores**: 2 files
- **Config/Seed**: 3 files
- **Total**: ~110 new files
