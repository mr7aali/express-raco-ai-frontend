# Developer Guide

Quick reference for developers working on this project.

## 🚀 Quick Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
tsc --noEmit

# Lint code
pnpm lint
```

## 📁 Adding New Pages

### Create a New Feature Page

1. **Create directory** under `app/your-feature/`
2. **Add page.tsx**:
```tsx
export default function YourFeaturePage() {
  return <div>Your Feature</div>
}
```

3. **For protected pages**, wrap with `ProtectedRoute`:
```tsx
import { ProtectedRoute } from '@/components/protected-route'

function YourFeatureContent() {
  return <div>Protected Content</div>
}

export default function YourFeaturePage() {
  return <ProtectedRoute><YourFeatureContent /></ProtectedRoute>
}
```

## 🔄 Using API Client

```tsx
import api from '@/lib/api'

// GET request
const data = await api.get('/api/endpoint')

// POST request
const response = await api.post('/api/endpoint', { key: 'value' })

// PATCH request
const updated = await api.patch('/api/endpoint/:id', { key: 'newValue' })

// DELETE request
await api.delete('/api/endpoint/:id')
```

## 📊 Using Zustand Stores

### Auth Store
```tsx
import { useAuthStore } from '@/lib/store'

function MyComponent() {
  const { user, setUser, logout } = useAuthStore()
  
  return (
    <div>
      {user?.name && <p>Welcome, {user.name}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Cart Store
```tsx
import { useCartStore } from '@/lib/store'

function CartComponent() {
  const { items, addItem, removeItem, clearCart } = useCartStore()
  
  return (
    <div>
      <p>{items.length} items in cart</p>
      <button onClick={() => addItem('product-id', 1)}>Add</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  )
}
```

## 🎣 Using SWR for Data Fetching

```tsx
import useSWR from 'swr'
import api from '@/lib/api'

async function fetcher(url: string) {
  const res = await api.get(url)
  return res.data
}

function MyComponent() {
  const { data, isLoading, error, mutate } = useSWR(
    '/api/products',
    fetcher
  )
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  
  return (
    <div>
      {data?.map(item => <p key={item.id}>{item.name}</p>)}
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  )
}
```

## 📝 Creating Forms with React Hook Form

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  
  const onSubmit = (data: FormData) => {
    console.log(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <textarea {...register('message')} />
      {errors.message && <p>{errors.message.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

## 🎨 Component Structure

### Create Reusable Component

```tsx
// components/my-component.tsx
interface MyComponentProps {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
      <h2 className="font-bold">{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  )
}
```

### Use in Page

```tsx
import { MyComponent } from '@/components/my-component'

export default function Page() {
  return <MyComponent title="Hello" onAction={() => console.log('clicked')} />
}
```

## 🔗 Routing

### Link to Pages
```tsx
import Link from 'next/link'

<Link href="/products">Products</Link>
<Link href={`/products/${id}`}>Product Detail</Link>
```

### Dynamic Routes
- `[id]` - Dynamic segment: `/products/[id]/page.tsx`
- `[...slug]` - Catch-all: `/blog/[...slug]/page.tsx`

### Using useRouter
```tsx
import { useRouter } from 'next/navigation'

function MyComponent() {
  const router = useRouter()
  
  return (
    <button onClick={() => router.push('/products')}>
      Go to Products
    </button>
  )
}
```

## 🎯 Styling Patterns

### Conditional Classes
```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-blue-500',
  isLoading && 'opacity-50'
)}>
  Content
</div>
```

### Dark Mode
```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  This works in both light and dark mode
</div>
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## 🔐 Protected Routes Pattern

### Create Protected Page
```tsx
import { ProtectedRoute } from '@/components/protected-route'

function AdminPageContent() {
  return <div>Admin Only Content</div>
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPageContent />
    </ProtectedRoute>
  )
}
```

### Create Protected API Call
```tsx
'use client'

import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedComponent() {
  const { user } = useAuthStore()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])
  
  if (!user) return null
  
  return <div>Protected content for {user.name}</div>
}
```

## 📦 Adding Dependencies

```bash
# Add a package
pnpm add package-name

# Add as dev dependency
pnpm add -D package-name

# Install all dependencies
pnpm install
```

## 🐛 Debugging

### Browser Console
```tsx
console.log('[debug]', variable)
```

### React DevTools
- Install React DevTools browser extension
- Inspect components and their props
- Monitor state changes

### Network Tab
- Open DevTools → Network
- Monitor API requests
- Check response status and data

## 📊 TypeScript Tips

### Type Your Props
```tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}
```

### Type API Responses
```tsx
interface Product {
  id: string
  name: string
  price: number
}

async function getProduct(id: string): Promise<Product> {
  const res = await api.get(`/api/products/${id}`)
  return res.data
}
```

## 🚀 Performance Tips

### Use Suspense for Loading
```tsx
import { Suspense } from 'react'

function Loading() {
  return <div>Loading...</div>
}

function Content() {
  const { data } = useSWR('/api/data', fetcher)
  return <div>{data}</div>
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  )
}
```

### Memoize Components
```tsx
import { memo } from 'react'

const ExpensiveComponent = memo(function({ data }) {
  return <div>{/* Heavy computation */}</div>
})
```

## 🔗 Environment Variables

### Client-side (accessible in browser)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Server-side (private)
```
SECRET_KEY=your-secret
```

### Usage
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## 📚 Common Patterns

### Loading State with SWR
```tsx
const { data, isLoading, error } = useSWR('/api/data', fetcher)

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
return <Content data={data} />
```

### Form with Submit
```tsx
async function handleSubmit(data: FormData) {
  try {
    const response = await api.post('/api/endpoint', data)
    toast.success('Success!')
    router.push('/next-page')
  } catch (error) {
    toast.error(error.message)
  }
}
```

### Delete Confirmation
```tsx
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure?')) return
  
  try {
    await api.delete(`/api/item/${id}`)
    mutate() // Refresh data
    toast.success('Deleted!')
  } catch (error) {
    toast.error('Failed to delete')
  }
}
```

## 🎯 Best Practices

1. **Always use TypeScript** - Catch errors early
2. **Use semantic HTML** - Better accessibility
3. **Add loading states** - Better UX
4. **Handle errors gracefully** - Users appreciate this
5. **Validate inputs** - With Zod or similar
6. **Use environment variables** - For configuration
7. **Keep components small** - Easier to test and maintain
8. **Use proper naming** - Self-documenting code
9. **Add comments** - For complex logic
10. **Test your changes** - In browser before committing

## 📞 Getting Help

1. Check the [README.md](./README.md)
2. Check [SETUP.md](./SETUP.md)
3. Review component examples
4. Check browser console for errors
5. Use DevTools to debug

---

Happy coding! 🚀
