# ShopHub Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (3000)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Page Layer (15 Pages)                   │   │
│  │  • Homepage, Login, Register                         │   │
│  │  • Products, Categories, Details                     │   │
│  │  • Cart, Checkout, Account                           │   │
│  │  • Admin Dashboard, Product/Category Mgmt            │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Component Layer (4 Custom Components)       │   │
│  │  • Navbar (with auth awareness)                      │   │
│  │  • ProductCard (reusable display)                    │   │
│  │  • StatusBadge (color-coded status)                  │   │
│  │  • ProtectedRoute (auth wrapper)                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       State Management Layer (Zustand)               │   │
│  │  ┌──────────────────┐  ┌──────────────────┐         │   │
│  │  │  Auth Store      │  │  Cart Store      │         │   │
│  │  ├──────────────────┤  ├──────────────────┤         │   │
│  │  │ • user: User     │  │ • items: Item[]  │         │   │
│  │  │ • token: string  │  │ • addItem()      │         │   │
│  │  │ • logout()       │  │ • removeItem()   │         │   │
│  │  │ (localStorage)   │  │ (localStorage)   │         │   │
│  │  └──────────────────┘  └──────────────────┘         │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         API/Utility Layer                            │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │   │
│  │  │ API Client   │ │ Validation   │ │ Types      │ │   │
│  │  │ (Axios)      │ │ (Zod)        │ │ (TS)       │ │   │
│  │  │ • JWT inject │ │ • Schemas    │ │ • Types.ts │ │   │
│  │  │ • Interceptor│ │ • Resolvers  │ │ • Utils    │ │   │
│  │  └──────────────┘ └──────────────┘ └─────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HTTP Layer (Axios)                                  │   │
│  │  All requests include JWT token automatically        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Network)
┌─────────────────────────────────────────────────────────────┐
│            Backend API (Express/Your Stack)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  API Routes                                        │     │
│  │  • /api/auth/* - Authentication                   │     │
│  │  • /api/products/* - Product CRUD                 │     │
│  │  • /api/categories/* - Category CRUD              │     │
│  │  • /api/orders/* - Order management               │     │
│  │  • /api/payments/* - Payment processing           │     │
│  │  • /api/users/* - User endpoints                  │     │
│  └────────────────────────────────────────────────────┘     │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Database                                          │     │
│  │  • Users, Products, Categories                    │     │
│  │  • Orders, OrderItems, Payments                   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Authentication Flow
```
User Input (Login Form)
    ↓
Form Validation (Zod Schema)
    ↓
API Call (axios POST /api/auth/login)
    ↓
Server Response {token, user}
    ↓
Zustand Store Update
    ↓
localStorage Persistence
    ↓
Redirect to Dashboard
```

### 2. Product Browsing Flow
```
User Visits /products
    ↓
SWR Fetch /api/products
    ↓
Show Loading Spinner
    ↓
Render Product List
    ↓
User Filters (Category/Search)
    ↓
Update SWR URL Params
    ↓
Auto-refresh with new data
    ↓
Display Updated Products
```

### 3. Shopping & Checkout Flow
```
User Adds Product to Cart
    ↓
useCartStore.addItem(productId)
    ↓
Save to localStorage
    ↓
Update Cart Display
    ↓
User Proceeds to Checkout
    ↓
Create Order via API
    ↓
Redirect to /checkout/:orderId
    ↓
Choose Payment Method
    ↓
Stripe/bKash Payment
    ↓
Payment Confirmation
    ↓
View Order in /account/orders
```

### 4. Admin Product Management Flow
```
Admin Logs In
    ↓
ProtectedRoute Checks Role=ADMIN
    ↓
Access /admin Dashboard
    ↓
Click Create Product
    ↓
Navigate to /admin/products/new
    ↓
Fill Form with React Hook Form
    ↓
Validate with Zod Schema
    ↓
POST to /api/products
    ↓
Server Creates Product
    ↓
Redirect to /admin/products
    ↓
New Product Shows in List
```

## Component Hierarchy

```
<RootLayout>
  <Navbar />
  <main>
    {/* Dynamic Page Content */}
    
    ┌─ Public Routes
    │  ├─ HomePage
    │  ├─ LoginPage
    │  ├─ RegisterPage
    │  └─ ProductPage
    │     └─ ProductCard
    │
    ├─ Protected Customer Routes
    │  ├─ CartPage
    │  │  └─ ProductCard
    │  └─ CheckoutPage
    │
    └─ Protected Admin Routes
       ├─ DashboardPage
       ├─ ProductsListPage
       │  ├─ ProductCard
       │  └─ StatusBadge
       └─ CreateProductPage
  </main>
</RootLayout>
```

## State Management Architecture

```
┌─────────────────────────────────────────┐
│      Global State (Zustand + localStorage)│
├─────────────────────────────────────────┤
│                                         │
│  useAuthStore                           │
│  ├─ user: User | null                   │
│  ├─ token: string | null                │
│  ├─ setUser(user)                       │
│  ├─ setToken(token)                     │
│  └─ logout()                            │
│                                         │
│  useCartStore                           │
│  ├─ items: CartItem[]                   │
│  ├─ addItem(id, qty)                    │
│  ├─ removeItem(id)                      │
│  ├─ updateQuantity(id, qty)             │
│  └─ clearCart()                         │
│                                         │
└─────────────────────────────────────────┘
            ↑
            │ (Auto-sync)
            ↓
┌─────────────────────────────────────────┐
│      localStorage (Persistence)         │
│                                         │
│  Keys:                                  │
│  • auth-store                           │
│  • cart-store                           │
│                                         │
└─────────────────────────────────────────┘
```

## API Client Architecture

```
┌──────────────────────────────────────┐
│     Axios Instance (lib/api.ts)      │
├──────────────────────────────────────┤
│                                      │
│  Request Interceptor                 │
│  ├─ Add JWT from Zustand Store       │
│  ├─ Add Content-Type header          │
│  └─ Pass request to server           │
│                                      │
│  Response Interceptor                │
│  ├─ Handle 401 Unauthorized          │
│  ├─ Auto-logout on token expire      │
│  └─ Return response data             │
│                                      │
│  Error Handler                       │
│  ├─ Catch network errors             │
│  ├─ Format error messages            │
│  └─ Re-throw for page to handle      │
│                                      │
└──────────────────────────────────────┘
        ↑              ↓
   (Use in Pages)  (Calls Backend)
        ↑              ↓
    api.get()       Backend API
    api.post()      /api/...
    api.patch()
    api.delete()
```

## Form Validation Architecture

```
┌─────────────────────────────────────────┐
│    React Hook Form + Zod Integration    │
├─────────────────────────────────────────┤
│                                         │
│  1. Define Zod Schema (lib/schemas.ts)  │
│     ├─ Field types and constraints      │
│     ├─ Custom validations               │
│     └─ Error messages                   │
│                                         │
│  2. Create Form Handler                 │
│     ├─ useForm(resolver: zodResolver)   │
│     ├─ register() - bind fields         │
│     └─ formState.errors - show errors   │
│                                         │
│  3. Validate on Submit                  │
│     ├─ Zod validates input              │
│     ├─ Returns errors if invalid        │
│     ├─ Shows in UI                      │
│     └─ Calls API if valid               │
│                                         │
└─────────────────────────────────────────┘
```

## Authentication Flow with JWT

```
┌────────────────────────────────────────┐
│         Authentication Flow            │
├────────────────────────────────────────┤
│                                        │
│  1. User Submits Credentials           │
│     Email + Password                   │
│     ↓                                  │
│  2. API Request                        │
│     POST /api/auth/login               │
│     ↓                                  │
│  3. Server Validates                   │
│     Check database                     │
│     ↓                                  │
│  4. Return Token                       │
│     Response: {token, user}            │
│     ↓                                  │
│  5. Store in Zustand                   │
│     useAuthStore.setToken(token)       │
│     useAuthStore.setUser(user)         │
│     ↓                                  │
│  6. Persist to Storage                 │
│     localStorage saves state           │
│     ↓                                  │
│  7. Future Requests                    │
│     Interceptor adds: Authorization    │
│     Header: Bearer {token}             │
│     ↓                                  │
│  8. Server Validates Token             │
│     Returns protected data             │
│                                        │
└────────────────────────────────────────┘
```

## File Organization Strategy

```
Root
├── app/                    # Pages & Routes
│   ├── public/            # No auth needed
│   │   ├── /              # Homepage
│   │   ├── /login
│   │   ├── /register
│   │   └── /products
│   │
│   ├── protected/         # Auth required
│   │   ├── /cart
│   │   ├── /checkout
│   │   └── /account
│   │
│   └── admin/             # Admin only
│       ├── /dashboard
│       ├── /products
│       └── /categories
│
├── components/            # Reusable UI
│   ├── shared/           # Used across pages
│   │   ├── navbar.tsx
│   │   └── footer.tsx    # (if added)
│   │
│   ├── features/         # Feature-specific
│   │   ├── product-card.tsx
│   │   └── status-badge.tsx
│   │
│   └── ui/               # Atomic components
│       └── button.tsx
│
├── lib/                  # Utilities & Config
│   ├── api.ts           # HTTP client
│   ├── store.ts         # State stores
│   ├── schemas.ts       # Validation
│   ├── types.ts         # Type defs
│   └── utils.ts         # Helpers
│
└── public/              # Static assets
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│                                         │
│  Layer 1: Route Protection              │
│  ├─ ProtectedRoute wrapper              │
│  ├─ Check auth state                    │
│  └─ Redirect if unauthorized            │
│                                         │
│  Layer 2: Role-Based Access             │
│  ├─ Check user.role                     │
│  ├─ Allow ADMIN or CUSTOMER             │
│  └─ Deny others                         │
│                                         │
│  Layer 3: Input Validation              │
│  ├─ Zod schema validation               │
│  ├─ Client-side checking                │
│  └─ Server should also validate         │
│                                         │
│  Layer 4: Token Security                │
│  ├─ JWT in cookies (httpOnly)           │
│  ├─ Auto-added to requests              │
│  └─ Expires and refreshes               │
│                                         │
│  Layer 5: API Security                  │
│  ├─ Server validates token              │
│  ├─ Checks user permissions             │
│  └─ Returns 401/403 on failure          │
│                                         │
└─────────────────────────────────────────┘
```

## Performance Optimizations

```
┌──────────────────────────────────────────┐
│       Performance Strategy               │
├──────────────────────────────────────────┤
│                                          │
│  Caching                                 │
│  ├─ SWR for API responses                │
│  ├─ localStorage for state               │
│  └─ Next.js build-time optimization      │
│                                          │
│  Code Splitting                          │
│  ├─ Automatic by Next.js                 │
│  ├─ Each page is separate bundle         │
│  └─ Lazy load components                 │
│                                          │
│  Bundle Size                             │
│  ├─ Tailwind CSS optimized               │
│  ├─ Tree-shaking of unused code          │
│  └─ Minimal dependencies                 │
│                                          │
│  Network Optimization                    │
│  ├─ Request deduplication (SWR)          │
│  ├─ Batch multiple requests              │
│  └─ Compression enabled                  │
│                                          │
└──────────────────────────────────────────┘
```

## Error Handling Strategy

```
┌──────────────────────────────────────────┐
│        Error Handling Layers             │
├──────────────────────────────────────────┤
│                                          │
│  1. Form Validation Errors               │
│     ├─ Zod catches invalid input         │
│     ├─ Display under form fields         │
│     └─ Prevent API call                  │
│                                          │
│  2. API Request Errors                   │
│     ├─ Network error handling            │
│     ├─ Server error responses            │
│     └─ Show error toast/message          │
│                                          │
│  3. Auth Errors                          │
│     ├─ 401 Unauthorized                  │
│     ├─ Auto-logout                       │
│     └─ Redirect to login                 │
│                                          │
│  4. Runtime Errors                       │
│     ├─ Error boundaries (if added)       │
│     ├─ Fallback UI                       │
│     └─ Console logging                   │
│                                          │
│  5. User-Facing Errors                   │
│     ├─ Friendly error messages           │
│     ├─ Actionable suggestions            │
│     └─ Retry options                     │
│                                          │
└──────────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ Scalability - Easy to add new features
- ✅ Maintainability - Clear separation of concerns
- ✅ Security - Multiple protection layers
- ✅ Performance - Optimized at each level
- ✅ Testability - Components are isolated
- ✅ Type Safety - TypeScript throughout

