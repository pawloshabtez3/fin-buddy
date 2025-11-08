# Environment Variables Reference

This document describes all environment variables required for FinBuddy.

## Required Variables

### Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Format**: `https://[project-id].supabase.co`
- **Where to find**: Supabase Dashboard → Settings → API → Project URL
- **Required for**: All environments (development, preview, production)
- **Public**: Yes (prefixed with `NEXT_PUBLIC_`)
- **Example**: `https://abcdefghijklmnop.supabase.co`

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: Supabase anonymous/public API key
- **Format**: Long JWT token string
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → anon/public
- **Required for**: All environments
- **Public**: Yes (prefixed with `NEXT_PUBLIC_`)
- **Security**: Safe to expose (protected by RLS policies)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: Supabase service role key with admin privileges
- **Format**: Long JWT token string
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → service_role
- **Required for**: All environments
- **Public**: No (server-side only)
- **Security**: ⚠️ KEEP SECRET - Bypasses RLS policies
- **Usage**: Server-side operations, admin tasks
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Google Gemini API

#### `GEMINI_API_KEY`
- **Description**: Google Gemini API key for AI insights
- **Format**: Alphanumeric string
- **Where to find**: Google Cloud Console → APIs & Services → Credentials
- **Required for**: All environments
- **Public**: No (server-side only)
- **Security**: ⚠️ KEEP SECRET - Incurs API costs
- **Usage**: AI insights generation
- **Example**: `AIzaSyD1234567890abcdefghijklmnopqrst`

### Application Configuration

#### `NEXT_PUBLIC_APP_URL`
- **Description**: Base URL of your application
- **Format**: Full URL with protocol
- **Required for**: All environments
- **Public**: Yes (prefixed with `NEXT_PUBLIC_`)
- **Values by environment**:
  - Development: `http://localhost:3000`
  - Preview: `https://[branch]-[project].vercel.app`
  - Production: `https://your-domain.com` or `https://[project].vercel.app`
- **Usage**: OAuth redirects, absolute URLs, email links
- **Example**: `https://finbuddy.vercel.app`

## Environment-Specific Configuration

### Local Development (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Production

Configure in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service role key | Production, Preview, Development |
| `GEMINI_API_KEY` | Production API key | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production only |

### Vercel Preview (Pull Requests)

Preview deployments automatically inherit environment variables from Production/Preview settings. Update `NEXT_PUBLIC_APP_URL` if needed for preview-specific testing.

## Security Best Practices

### Secret Variables

These variables should NEVER be committed to version control:
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`

### Public Variables

These variables are safe to expose in client-side code:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

### `.gitignore` Configuration

Ensure these files are in `.gitignore`:
```
.env
.env.local
.env.*.local
```

### Rotation Policy

Rotate sensitive keys if:
- Keys are accidentally exposed
- Team member with access leaves
- Suspicious activity detected
- Every 90 days (recommended)

## Validation

### Check Environment Variables

Create a script to validate environment variables on startup:

```typescript
// lib/env-check.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
  'NEXT_PUBLIC_APP_URL',
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
```

### Test Configuration

```bash
# Test local environment
npm run build

# Check for missing variables
node -e "require('./lib/env-check').validateEnv()"
```

## Troubleshooting

### Variable Not Found

**Symptom**: `process.env.VARIABLE_NAME is undefined`

**Solutions**:
1. Verify variable exists in `.env.local`
2. Restart development server after adding variables
3. Check variable name spelling (case-sensitive)
4. Ensure `NEXT_PUBLIC_` prefix for client-side variables

### Build Fails with Environment Error

**Symptom**: Build fails with "Missing environment variable"

**Solutions**:
1. Check all required variables are set in Vercel
2. Verify variable names match exactly
3. Check for trailing spaces in values
4. Ensure variables are enabled for correct environment

### Supabase Connection Fails

**Symptom**: "Invalid API key" or connection errors

**Solutions**:
1. Verify URL and keys match Supabase dashboard
2. Check for extra quotes or spaces in values
3. Ensure project is not paused in Supabase
4. Verify RLS policies are configured

### Gemini API Errors

**Symptom**: "API key not valid" or 403 errors

**Solutions**:
1. Verify API key is correct
2. Check API is enabled in Google Cloud Console
3. Verify billing is enabled
4. Check API quota hasn't been exceeded

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase API Keys](https://supabase.com/docs/guides/api#api-url-and-keys)
- [Google Cloud API Keys](https://cloud.google.com/docs/authentication/api-keys)
