# Authentication Middleware Documentation

This document explains the authentication and route protection implementation in FinBuddy.

## Overview

The authentication system uses a multi-layered approach to protect routes and verify user sessions:

1. **Edge Middleware** - Protects routes at the edge before they reach the application
2. **API Route Middleware** - Verifies authentication in API endpoints
3. **Client-Side Protection** - AuthProvider handles client-side route guards
4. **Server Component Protection** - Server pages verify auth before rendering

## Components

### 1. Edge Middleware (`middleware.ts`)

The Next.js middleware runs at the edge and protects routes before they reach the application server.

**Features:**
- Redirects unauthenticated users from protected routes to login
- Redirects authenticated users from auth pages to dashboard
- Preserves the intended destination with `redirectTo` query parameter
- Handles Supabase session cookies properly

**Protected Routes:**
- `/dashboard` - Main dashboard page
- `/profile` - User profile page

**Auth Routes:**
- `/login` - Login page
- `/signup` - Signup page

**Usage:**
The middleware runs automatically on all routes except static files and API routes.

### 2. API Route Middleware (`lib/auth-middleware.ts`)

Provides utilities for verifying authentication in API routes.

#### `verifyAuth(request: NextRequest)`

Verifies user authentication and returns the user object or an error response.

**Returns:**
```typescript
{ user: User; error: null } | { user: null; error: NextResponse }
```

**Example:**
```typescript
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  const { user, error } = await verifyAuth(request);
  
  if (error) {
    return error; // Returns 401 Unauthorized
  }
  
  // user is authenticated, proceed with logic
}
```

#### `withAuth(request, handler)`

A wrapper function that handles authentication and error handling automatically.

**Example:**
```typescript
import { withAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (user) => {
    // user is guaranteed to be authenticated
    // Your route logic here
    
    return NextResponse.json({ data: 'success' });
  });
}
```

**Benefits:**
- Reduces boilerplate code
- Consistent error handling
- Type-safe user object
- Automatic error responses

### 3. Client-Side Protection (`components/AuthProvider.tsx`)

The AuthProvider component manages client-side authentication state and route protection.

**Features:**
- Maintains user session state
- Listens for auth state changes
- Redirects based on authentication status
- Provides `useAuth()` hook for components

**Usage:**
```typescript
import { useAuth } from '@/components/AuthProvider';

function MyComponent() {
  const { user, session, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Welcome {user.email}</div>;
}
```

### 4. Server Component Protection

Server components verify authentication before rendering.

**Example (`app/dashboard/page.tsx`):**
```typescript
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabaseServer';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }
  
  // Render dashboard for authenticated user
}
```

## Authentication Flow

### Login Flow
1. User submits credentials on `/login`
2. Supabase Auth validates credentials
3. Session cookies are set
4. Middleware detects authenticated session
5. User is redirected to `/dashboard`

### Protected Route Access
1. User navigates to `/dashboard`
2. Middleware checks for valid session
3. If no session: redirect to `/login?redirectTo=/dashboard`
4. If valid session: allow access
5. Server component verifies auth again
6. Page renders with user data

### API Request Flow
1. Client makes API request with session cookies
2. API route calls `withAuth()` or `verifyAuth()`
3. Supabase verifies session from cookies
4. If invalid: return 401 Unauthorized
5. If valid: execute route logic with user object

### Logout Flow
1. User clicks logout
2. `supabase.auth.signOut()` is called
3. Session cookies are cleared
4. User is redirected to `/login`
5. Middleware prevents access to protected routes

## Security Considerations

### Row Level Security (RLS)
All database queries are protected by Supabase RLS policies that ensure users can only access their own data.

### Session Verification
- Sessions are verified on every API request
- Middleware verifies sessions at the edge
- Server components verify sessions before rendering
- Client-side auth state is synced with server

### Cookie Security
- Supabase handles secure cookie management
- HttpOnly cookies prevent XSS attacks
- SameSite attribute prevents CSRF attacks
- Cookies are encrypted and signed

### Authorization
- User ID from authenticated session is used for all queries
- Ownership is verified before update/delete operations
- No client-side user ID manipulation is possible

## Migration Guide

### Updating Existing API Routes

**Before:**
```typescript
export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'You must be logged in' },
      { status: 401 }
    );
  }
  
  // Route logic...
}
```

**After:**
```typescript
import { withAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (user) => {
    // Route logic with authenticated user...
  });
}
```

## Testing Authentication

### Testing Protected Routes
1. Navigate to `/dashboard` without logging in
2. Should redirect to `/login?redirectTo=/dashboard`
3. After login, should redirect back to `/dashboard`

### Testing API Authentication
1. Make API request without session cookies
2. Should receive 401 Unauthorized response
3. Make API request with valid session
4. Should receive successful response

### Testing Session Expiry
1. Log in and wait for session to expire
2. Navigate to protected route
3. Should redirect to login
4. API requests should return 401

## Troubleshooting

### "Unauthorized" errors on valid sessions
- Check that cookies are being sent with requests
- Verify Supabase environment variables are correct
- Check browser console for cookie errors

### Infinite redirect loops
- Verify middleware matcher configuration
- Check that auth routes are properly defined
- Ensure AuthProvider is not conflicting with middleware

### Session not persisting
- Check cookie settings in browser
- Verify domain configuration for cookies
- Check that Supabase client is properly initialized

## Requirements Satisfied

This implementation satisfies the following requirements:

- **1.4**: Authenticated users can access the Dashboard
- **1.5**: User data is isolated by user identifier
- **10.4**: Unauthenticated users are redirected to login when accessing protected routes

## Future Enhancements

- Rate limiting for API routes
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)
- Session management dashboard
- Audit logging for authentication events
