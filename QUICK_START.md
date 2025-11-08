# Quick Start Guide

Get FinBuddy running locally in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd finbuddy-mvp

# Install dependencies
npm install
```

## Step 2: Set Up Supabase (3 minutes)

1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Fill in:
   - Name: `finbuddy-dev`
   - Database Password: (generate and save)
   - Region: (closest to you)
4. Wait for project to provision (~2 minutes)

### Run Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste content from `supabase/migrations/` files
4. Run each migration in order
5. Verify tables exist in **Table Editor**

## Step 3: Get Google Gemini API Key (3 minutes)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select or create a Google Cloud project
4. Copy the API key

**Note**: You may need to enable billing in Google Cloud Console for production use.

## Step 4: Configure Environment (1 minute)

```bash
# Copy example file
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# From Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# From Google AI Studio
GEMINI_API_KEY=AIzaSy...

# Local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Run Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Verify Setup

1. **Sign Up**: Create a new account
2. **Add Expense**: Add a test expense
3. **View Dashboard**: Check charts render
4. **AI Insights**: Click "Get AI Insights" button
5. **Profile**: Update your profile

## Common Issues

### "Supabase connection failed"
- Verify URL and keys in `.env.local`
- Check Supabase project is active (not paused)
- Ensure migrations ran successfully

### "Gemini API error"
- Verify API key is correct
- Check API is enabled in Google Cloud Console
- For free tier, some features may be limited

### "Build errors"
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### "Port 3000 already in use"
```bash
# Use different port
npm run dev -- -p 3001
```

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Review [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for configuration details
- Check [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md) before deploying

## Development Workflow

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Test production build
npm run build:test

# Run production server locally
npm run prod:test
```

## Project Structure

```
/app                    # Next.js pages and API routes
  /api                  # API endpoints
  /dashboard            # Main dashboard
  /login, /signup       # Auth pages
  /profile              # User profile
/components             # React components
/lib                    # Utilities and clients
/hooks                  # Custom React hooks
/supabase/migrations    # Database migrations
```

## Getting Help

- Check documentation in `/docs` folder
- Review code comments
- Check Supabase logs for database issues
- Check browser console for client errors
- Check terminal for server errors

## Tips

- Use React DevTools for debugging components
- Check Network tab for API call issues
- Supabase has built-in logs in dashboard
- Use `console.log` sparingly (remove before commit)

---

**Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md)
