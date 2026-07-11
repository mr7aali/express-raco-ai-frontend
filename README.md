# ShopHub - E-Commerce Frontend

A complete, production-ready e-commerce frontend built with Next.js, TypeScript, and Tailwind CSS, fully integrated with your backend API.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure login/registration with JWT tokens
- **Product Browsing**: Browse, search, and filter products by category
- **Product Details**: View detailed product information with recommendations
- **Shopping Cart**: Add/remove items, manage quantities, persist cart state
- **Checkout**: Create orders and choose between Stripe and bKash payment providers
- **Order Management**: View order history and track order status
- **Payment History**: See all payment transactions with status tracking

### Admin Features
- **Admin Dashboard**: Overview of products, categories, orders, and payments
- **Product Management**: Create, edit, and delete products with full details
- **Category Management**: Organize products into categories with parent-child relationships
- **Stock Management**: Track and manage product inventory

## 📋 Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Backend API running at `http://localhost:5000` (or configured URL)
- Basic understanding of Next.js and React

## 🛠️ Installation

1. **Clone or download the project**

2. **Install dependencies**:
```bash
pnpm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` if your backend API is not at `http://localhost:5000`:
```
NEXT_PUBLIC_API_URL=http://your-api-url:5000
```

4. **Start the development server**:
```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
app/
├── page.tsx                    # Homepage
├── login/                      # User login
├── register/                   # User registration
├── products/                   # Product listing & details
│   ├── page.tsx               # Product list with filters
│   └── [id]/page.tsx          # Product details
├── categories/                # Category browsing
├── cart/                       # Shopping cart
├── checkout/[orderId]/        # Payment checkout
├── account/
│   ├── orders/                # Order history
│   └── payments/              # Payment history
└── admin/                      # Admin dashboard
    ├── page.tsx               # Dashboard overview
    ├── products/              # Admin product management
    │   ├── page.tsx           # Product list
    │   ├── new/               # Create product
    │   └── [id]/              # Edit product
    └── categories/            # Admin category management

components/
├── navbar.tsx                 # Navigation bar
├── product-card.tsx           # Product card component
├── status-badge.tsx           # Status indicator
├── protected-route.tsx        # Auth route protection

lib/
├── api.ts                     # API client with auth
├── store.ts                   # Zustand state management
└── schemas.ts                 # Zod validation schemas
```

## 🔐 Authentication

The app uses JWT tokens for authentication:
- Tokens are stored in cookies (secure, httpOnly flag can be enabled on backend)
- Automatically included in all API requests
- Auto-logout on token expiry

**Test Credentials** (from backend):
```
Admin:
- Email: admin@example.com
- Password: Admin@123456

Customer:
- Email: customer@example.com
- Password: Customer@123456
```

## 🛒 Key Pages & Features

### Public Pages
- **/** - Homepage with features and CTAs
- **/products** - Browse all products with search/filter
- **/categories** - Browse product categories
- **/login** - User login
- **/register** - User registration

### Protected Pages (Customers)
- **/cart** - Shopping cart management
- **/checkout/[orderId]** - Payment checkout (Stripe/bKash)
- **/account/orders** - View orders and manage them
- **/account/payments** - Payment history

### Admin Pages
- **/admin** - Dashboard with statistics
- **/admin/products** - Manage products
- **/admin/products/new** - Create new product
- **/admin/products/[id]** - Edit product
- **/admin/categories** - Manage categories

## 🔌 API Integration

The frontend is fully integrated with your backend API. Key endpoints used:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Product details
- `GET /api/products/:id/recommendations` - Recommended products

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - User's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Order details
- `PATCH /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/checkout` - Initiate payment
- `GET /api/users/me/payments` - Payment history

## 💳 Payment Providers

### Stripe
- Credit/Debit card payments
- Integration ready with clientSecret flow
- Redirect to payment confirmation

### bKash
- Mobile money payments
- Redirects to bKash payment page
- Callback handling ready

## 🎨 Customization

### Branding
Edit the logo and name in `components/navbar.tsx` and `app/page.tsx`

### Colors & Styling
All colors are managed via Tailwind CSS. The theme uses:
- Primary: Blue (`blue-600`)
- Success: Green (`green-600`)
- Warning: Yellow (`yellow-600`)
- Error: Red (`red-600`)

### State Management
Uses Zustand for:
- Authentication state
- Shopping cart state

Both are persisted to localStorage automatically.

## 📦 Dependencies

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **SWR** - Data fetching & caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **Lucide React** - Icons

## 🚀 Deployment

### On Vercel (Recommended)
1. Push code to GitHub
2. Import in Vercel dashboard
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### On Other Platforms
Build and deploy:
```bash
pnpm build
pnpm start
```

## 🐛 Troubleshooting

### "Cannot connect to API" error
- Verify backend is running at `NEXT_PUBLIC_API_URL`
- Check CORS settings on backend
- Verify token is being sent in requests

### Products not loading
- Ensure backend is running
- Check API response in browser DevTools Network tab
- Verify `NEXT_PUBLIC_API_URL` is correct

### Cart not persisting
- Check browser localStorage is enabled
- Clear localStorage: `localStorage.clear()`
- Verify Zustand stores are configured

### Auth issues
- Clear cookies: `document.cookie` in console
- Check token expiry on backend
- Verify login endpoint response

## 📝 Performance Tips

1. **Image Optimization**: Replace placeholder images with optimized images
2. **Lazy Loading**: Add image lazy loading for products
3. **Pagination**: Already implemented for products
4. **Caching**: SWR handles caching automatically
5. **Code Splitting**: Next.js handles this automatically

## 🔒 Security

- ✅ HTTPS ready (set in production)
- ✅ CORS configured on backend
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Input validation with Zod
- ✅ XSS protection (React escaping)

## 📞 Support

For issues or questions:
1. Check this README
2. Review the API documentation
3. Check browser console for errors
4. Verify backend is running correctly

## 📄 License

This project is ready for production use. Customize it according to your needs.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
