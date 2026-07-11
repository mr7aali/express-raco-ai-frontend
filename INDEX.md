# ShopHub Project Index

Complete file and directory reference for the e-commerce frontend.

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `SETUP.md` | Quick setup guide |
| `PROJECT_SUMMARY.md` | Detailed project overview |
| `DEVELOPER_GUIDE.md` | Developer reference & patterns |
| `INDEX.md` | This file - project index |

## 🏠 Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS theme |
| `next.config.mjs` | Next.js configuration |
| `postcss.config.mjs` | PostCSS configuration |
| `.env.example` | Environment variables template |
| `.eslintrc.json` | ESLint configuration |

## 📂 Directory Structure

### `/app` - Pages and Routes

```
app/
├── layout.tsx                    # Root layout component
├── globals.css                   # Global styles
├── page.tsx                      # Homepage (/)
│
├── login/
│   └── page.tsx                 # Login page (/login)
│
├── register/
│   └── page.tsx                 # Registration (/register)
│
├── products/
│   ├── page.tsx                 # Product listing (/products)
│   └── [id]/
│       └── page.tsx             # Product details (/products/:id)
│
├── categories/
│   └── page.tsx                 # Category browsing (/categories)
│
├── cart/
│   └── page.tsx                 # Shopping cart (/cart)
│
├── checkout/
│   └── [orderId]/
│       └── page.tsx             # Payment checkout (/checkout/:id)
│
├── account/
│   ├── orders/
│   │   └── page.tsx             # Order history (/account/orders)
│   └── payments/
│       └── page.tsx             # Payment history (/account/payments)
│
└── admin/
    ├── page.tsx                 # Dashboard (/admin)
    │
    ├── products/
    │   ├── page.tsx             # Product list (/admin/products)
    │   ├── new/
    │   │   └── page.tsx         # Create product (/admin/products/new)
    │   └── [id]/
    │       └── page.tsx         # Edit product (/admin/products/:id)
    │
    └── categories/
        └── page.tsx             # Manage categories (/admin/categories)
```

### `/components` - Reusable Components

```
components/
├── navbar.tsx                   # Navigation bar
├── product-card.tsx             # Product display card
├── status-badge.tsx             # Status indicator component
├── protected-route.tsx          # Auth protection wrapper
└── ui/
    └── button.tsx              # shadcn Button component
```

### `/lib` - Utility Functions & Configuration

```
lib/
├── api.ts                       # Axios instance with auth
├── store.ts                     # Zustand stores (auth, cart)
├── schemas.ts                   # Zod validation schemas
├── types.ts                     # TypeScript type definitions
└── utils.ts                     # Helper functions (cn)
```

## 📄 File Reference

### Pages - Detailed

#### Public Pages
| File | Route | Purpose |
|------|-------|---------|
| `app/page.tsx` | `/` | Homepage |
| `app/login/page.tsx` | `/login` | User login |
| `app/register/page.tsx` | `/register` | User registration |
| `app/products/page.tsx` | `/products` | Product listing with filters |
| `app/products/[id]/page.tsx` | `/products/:id` | Product details |
| `app/categories/page.tsx` | `/categories` | Category browsing |

#### Protected Pages (Customers)
| File | Route | Purpose |
|------|-------|---------|
| `app/cart/page.tsx` | `/cart` | Shopping cart |
| `app/checkout/[orderId]/page.tsx` | `/checkout/:id` | Payment checkout |
| `app/account/orders/page.tsx` | `/account/orders` | Order history |
| `app/account/payments/page.tsx` | `/account/payments` | Payment history |

#### Admin Pages
| File | Route | Purpose | Auth |
|------|-------|---------|------|
| `app/admin/page.tsx` | `/admin` | Dashboard | Admin only |
| `app/admin/products/page.tsx` | `/admin/products` | Product list | Admin only |
| `app/admin/products/new/page.tsx` | `/admin/products/new` | Create product | Admin only |
| `app/admin/products/[id]/page.tsx` | `/admin/products/:id` | Edit product | Admin only |
| `app/admin/categories/page.tsx` | `/admin/categories` | Category management | Admin only |

### Components - Detailed

#### Navbar (`components/navbar.tsx`)
- **Props**: None
- **Features**:
  - Responsive navigation menu
  - Auth-aware menu items
  - Logo and site title
  - Links for main sections

#### Product Card (`components/product-card.tsx`)
- **Props**: `product: Product`
- **Features**:
  - Product image
  - Price display
  - Status badge
  - Add to cart button
  - Quick view link

#### Status Badge (`components/status-badge.tsx`)
- **Props**: `status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'ACTIVE' | 'INACTIVE'`
- **Features**:
  - Color-coded status display
  - Icon indicators
  - Text labels

#### Protected Route (`components/protected-route.tsx`)
- **Props**: `children: ReactNode, requiredRole?: 'ADMIN' | 'CUSTOMER'`
- **Features**:
  - Auth protection
  - Role-based access
  - Redirect to login
  - Error handling

### Utilities - Detailed

#### API Client (`lib/api.ts`)
```typescript
// Features
- JWT token auto-injection
- Request/response interceptors
- Error handling
- Methods: get, post, patch, put, delete
```

#### Zustand Stores (`lib/store.ts`)
```typescript
// useAuthStore
- user: User | null
- token: string | null
- setUser(user): void
- setToken(token): void
- logout(): void

// useCartStore
- items: CartItem[]
- addItem(productId, quantity): void
- removeItem(productId): void
- updateQuantity(productId, quantity): void
- clearCart(): void
```

#### Validation Schemas (`lib/schemas.ts`)
- `loginSchema` - Login validation
- `registerSchema` - Registration validation
- `createProductSchema` - Product CRUD validation
- `createCategorySchema` - Category CRUD validation

#### Types (`lib/types.ts`)
- `User` - User data type
- `Product` - Product data type
- `Order` - Order data type
- `Payment` - Payment data type
- `Category` - Category data type
- `CartItem` - Cart item type

## 🔄 Data Flow Examples

### Authentication Flow
```
1. User fills registration form
2. Form validates with Zod schema
3. Register page submits to /api/auth/register
4. API client sends request via axios
5. Response includes token and user data
6. Token stored in cookie
7. useAuthStore updates with user/token
8. User redirected to homepage
9. Auth persists on page reload (Zustand + localStorage)
```

### Product Browsing Flow
```
1. User visits /products
2. Page uses SWR to fetch /api/products
3. Loading state shown while fetching
4. Products rendered with ProductCard component
5. User can filter by category or search
6. ProductCard has "Add to Cart" button
7. Cart updated via useCartStore
```

### Shopping & Checkout Flow
```
1. User adds products to cart
2. Cart stored in useCartStore (localStorage)
3. User visits /cart page
4. Cart items display with ProductCard
5. User adjusts quantities or removes items
6. User proceeds to checkout
7. Checkout creates order via /api/orders
8. User redirected to /checkout/:orderId
9. Payment page offers Stripe or bKash
10. Payment processed via /api/payments/checkout
11. Confirmation shown
12. Order visible in /account/orders
```

### Admin Flow
```
1. Admin logs in with admin credentials
2. Redirected to /admin dashboard
3. Dashboard shows statistics
4. Admin can navigate to /admin/products
5. Product list shows all products
6. Admin clicks "Create" -> /admin/products/new
7. Form validates and submits
8. New product appears in list
9. Admin can edit or delete products
```

## 🎯 Common Tasks

### Add New Page
1. Create directory: `app/my-page/`
2. Create `page.tsx` with default export
3. Add link in navbar or other pages

### Add New Component
1. Create file: `components/my-component.tsx`
2. Export default component
3. Import and use in pages

### Add API Call
1. Use `api.get/post/patch/delete`
2. Handle errors with try/catch
3. Show loading/error states

### Add Form
1. Create validation schema in `lib/schemas.ts`
2. Use `useForm` with resolver
3. Use `register` for inputs
4. Display `errors` for validation messages

### Update Styling
1. Use Tailwind classes
2. Use `cn()` for conditional classes
3. Dark mode: `dark:` prefix
4. Responsive: `md:` `lg:` etc.

## 📊 Key Technologies Used

| Technology | Purpose | Files |
|-----------|---------|-------|
| Next.js 16 | Framework | `next.config.mjs` |
| React 19 | UI library | `app/` `components/` |
| TypeScript | Type safety | `tsconfig.json` `*.ts` `*.tsx` |
| Tailwind CSS | Styling | `tailwind.config.ts` `app/globals.css` |
| Zustand | State | `lib/store.ts` |
| SWR | Data fetching | `app/products/page.tsx` |
| React Hook Form | Forms | `app/admin/products/new/page.tsx` |
| Zod | Validation | `lib/schemas.ts` |
| Axios | HTTP | `lib/api.ts` |

## 🔐 Security Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| Protected Routes | `components/protected-route.tsx` | Role-based access |
| JWT Auth | `lib/api.ts` | Token injection |
| Input Validation | `lib/schemas.ts` | Zod schemas |
| Error Handling | All pages | Try/catch blocks |
| Type Safety | `lib/types.ts` | TypeScript |

## 📈 Performance Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| SWR Caching | Product pages | Cache API responses |
| Code Splitting | All pages | Automatic by Next.js |
| Lazy Loading | Product cards | Images load on scroll |
| State Persistence | `lib/store.ts` | localStorage |
| Image Optimization | `components/` | Next.js Image |

## 🚀 Deployment Files

| File | Purpose |
|------|---------|
| `.next/` | Build output (generated) |
| `package.json` | Dependencies and scripts |
| `.env.production` | Production config |
| `vercel.json` | Vercel deployment config |

## 📝 Environment Variables

### Required
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Optional
- `NEXT_PUBLIC_GA_ID` - Google Analytics (if added)

## 🎓 Learning Paths

### For Beginners
1. Read `README.md`
2. Review `SETUP.md`
3. Explore page structure
4. Run dev server
5. Browse `/products` page

### For Developers
1. Read `DEVELOPER_GUIDE.md`
2. Review `lib/` directory
3. Understand stores and schemas
4. Check component examples
5. Build a new feature

### For DevOps
1. Review `package.json` scripts
2. Check `next.config.mjs`
3. Review deployment options in `README.md`
4. Setup CI/CD pipeline

## 🐛 Debugging Resources

### Files to Check for Issues
| Issue | File to Check |
|-------|--------------|
| API not working | `lib/api.ts` `.env.local` |
| Auth failing | `lib/store.ts` `lib/schemas.ts` |
| Styling broken | `app/globals.css` `tailwind.config.ts` |
| Types error | `lib/types.ts` TypeScript files |
| Forms not validating | `lib/schemas.ts` form page |
| Components not rendering | Component file and import |

## ✅ Pre-Launch Checklist

- [ ] API URL configured in `.env.local`
- [ ] Backend running at configured URL
- [ ] Login/register working
- [ ] Products displaying
- [ ] Cart functionality working
- [ ] Checkout process complete
- [ ] Admin dashboard accessible
- [ ] Product creation working
- [ ] Styling looks correct
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All links working

---

**Last Updated**: 2024
**Project Status**: Production Ready
