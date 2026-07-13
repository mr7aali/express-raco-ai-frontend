# ShopHub E-commerce Frontend

Frontend for the E-commerce Ordering and Payment System. It is built with Next.js, React, TypeScript, Tailwind CSS, Zustand, SWR, React Hook Form, Zod, Stripe Elements, and Axios.

## Features

### Customer

- Register and login
- Browse products
- Search and filter products
- View product details and recommendations
- Add products to cart
- Create orders from the cart
- Checkout with Stripe or bKash
- View order history
- View payment history

### Admin

- Admin dashboard
- Product listing
- Product create, edit, and delete
- Category listing
- Category create and delete
- Stock and status visibility

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- SWR
- Axios
- React Hook Form
- Zod
- Stripe React SDK
- Lucide React

## Project Structure

```txt
app/
  page.tsx
  login/
  register/
  products/
  categories/
  cart/
  checkout/
  payment-confirm/
  account/
  admin/
components/
  navbar.tsx
  product-card.tsx
  protected-route.tsx
  status-badge.tsx
  ui/
lib/
  api.ts
  schemas.ts
  store.ts
  types.ts
  utils.ts
public/
```

## Environment

Copy the example file:

```bash
cp .env.example .env
```

Required variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

For VPS or ngrok deployment, use the public backend root URL without `/api`:

```env
NEXT_PUBLIC_API_URL=https://your-public-url
```

The frontend API client appends paths such as `/api/products`.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open:

```txt
http://localhost:3000
```

Make sure the backend is running and available at `NEXT_PUBLIC_API_URL`.

## Production Build

```bash
pnpm run build
pnpm start
```

## Docker Deployment

The app can be built in Docker and served behind nginx.

Typical compose flow from the deployment root:

```bash
docker compose build frontend
docker compose up -d frontend nginx
```

If you change `NEXT_PUBLIC_API_URL`, rebuild the frontend because public Next.js environment variables are baked into the build:

```bash
docker compose build --no-cache frontend
docker compose up -d frontend nginx
```

## Important URLs

Local frontend:

```txt
http://localhost:3000
```

Local backend:

```txt
http://localhost:5000
```

Backend API docs:

```txt
http://localhost:5000/api/docs
```

## Test Credentials

Seeded admin account from backend:

```txt
Email: admin@example.com
Password: Admin@123456
```

You can also register a new customer account from `/register`.

## Main Routes

```txt
/                         Home
/products                 Product listing
/products/[id]            Product details
/categories               Category browsing
/cart                     Shopping cart
/checkout/[orderId]       Checkout
/payment-confirm          Stripe payment confirmation
/account/orders           Customer order history
/account/payments         Customer payment history
/admin                    Admin dashboard
/admin/products           Product management
/admin/products/new       Create product
/admin/products/[id]      Edit product
/admin/categories         Category management
/login                    Login
/register                 Register
```

## Scripts

```bash
pnpm dev          # Start local development server
pnpm run build    # Create production build
pnpm start        # Start production server
pnpm run lint     # Run ESLint
pnpm exec tsc --noEmit  # Type-check
```

## Verification

Run before submission:

```bash
pnpm run lint
pnpm exec tsc --noEmit
pnpm run build
```

## Deployment Notes

- Use `NEXT_PUBLIC_API_URL=http://14.128.12.14` for direct VPS IP access.
- Use `NEXT_PUBLIC_API_URL=https://your-ngrok-url` for ngrok demo access.
- If using Stripe Elements, set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- The backend should expose `/api`, `/health`, and `/api/docs`.
- The ngrok free warning page is expected for browser visitors. API clients can send `ngrok-skip-browser-warning: true`.

## Assignment Context

This frontend is an optional UI companion for the backend assignment. It demonstrates user registration, login, browsing, ordering, checkout, admin product management, and payment history flows against the backend REST API.
