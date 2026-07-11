# Quick Setup Guide

## Step 1: Prepare Your Backend

Ensure your backend API is running at `http://localhost:5000` with all the endpoints from the API documentation.

### Required Backend Setup
```bash
# Your backend should be running and responding to:
http://localhost:5000/health
```

## Step 2: Install Dependencies

```bash
pnpm install
```

## Step 3: Configure Environment

Create `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Step 4: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application

### Test as Customer
1. Go to `/register` and create an account
2. Or login with existing credentials (ask your backend admin)
3. Browse products at `/products`
4. Add items to cart
5. Checkout and choose payment method

### Test as Admin
1. Login with admin account
2. Go to `/admin` dashboard
3. Manage products and categories

## 🔑 Test Credentials (if available from backend)

```
Admin User:
Email: admin@example.com
Password: Admin@123456

Customer User:
Email: customer@example.com
Password: Customer@123456
```

## ⚠️ Common Issues & Solutions

### Issue: "Cannot connect to API"
**Solution:**
- Verify backend is running: `curl http://localhost:5000/health`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Ensure CORS is enabled on backend

### Issue: "Products not loading"
**Solution:**
- Check backend is running
- Create some products via admin panel first
- Check browser DevTools → Network tab for API errors
- Verify database has data

### Issue: "Login fails but register works"
**Solution:**
- Ensure user email exists in backend database
- Check password is correct
- Try registering a new user first

### Issue: "Port 3000 is already in use"
**Solution:**
```bash
# Kill the process using port 3000
# On macOS/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📱 Features to Test

- [ ] Register new user account
- [ ] Login with credentials
- [ ] Browse products with search
- [ ] Filter by category
- [ ] View product details
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] Checkout with Stripe/bKash
- [ ] View order history
- [ ] View payment history
- [ ] Admin: Create product
- [ ] Admin: Edit product
- [ ] Admin: Delete product
- [ ] Admin: Create category
- [ ] Admin: Delete category

## 🚀 Build for Production

```bash
pnpm build
pnpm start
```

## 📦 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

During deployment, set environment variable:
```
NEXT_PUBLIC_API_URL=<your-backend-url>
```

### Deploy to Other Platforms

1. Build the project: `pnpm build`
2. Upload `.next` and `node_modules` folders
3. Set environment variables on platform
4. Start with: `pnpm start`

## 🔐 Important Security Notes

For production:
- [ ] Enable HTTPS on backend
- [ ] Set secure cookie flags (httpOnly, Secure)
- [ ] Implement CSRF protection if needed
- [ ] Add rate limiting on backend
- [ ] Implement request validation
- [ ] Use environment variables for sensitive data
- [ ] Enable CORS only for your domain

## 📞 Need Help?

1. Check the main [README.md](./README.md)
2. Review backend API documentation
3. Check browser console for errors (F12)
4. Verify all backend endpoints are working

---

**Ready to shop! 🛍️**
