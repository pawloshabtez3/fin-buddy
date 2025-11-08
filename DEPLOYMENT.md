# FinBuddy Deployment Guide

This guide covers deploying FinBuddy to Vercel and configuring all required services.

## Prerequisites

- Node.js 18+ installed locally
- npm or yarn package manager
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier available)
- Supabase account (free tier available)
- Google Cloud account for Gemini API

## 1. Supabase Setup

### Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: finbuddy-production (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your users
4. Wait for project to be provisioned (2-3 minutes)

### Obtain Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Run the migration files from `supabase/migrations/` in order:
   - First: Create tables and RLS policies
   - Second: Create indexes and any additional configurations

Alternatively, use Supabase CLI:
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Verify Database Setup

1. Go to **Table Editor** in Supabase dashboard
2. Verify these tables exist:
   - `expenses`
   - `profiles`
3. Go to **Authentication** → **Policies**
4. Verify RLS policies are enabled for both tables

## 2. Google Gemini API Setup

### Create Google Cloud Project

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable billing (required for Gemini API)

### Enable Gemini API

1. Go to **APIs & Services** → **Library**
2. Search for "Generative Language API"
3. Click **Enable**

### Obtain API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key: `GEMINI_API_KEY`
4. (Recommended) Click **Restrict Key**:
   - Set application restrictions (HTTP referrers or IP addresses)
   - Restrict to "Generative Language API"

### Test API Key

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

## 3. Environment Variables

### Local Development

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Fill in the values:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Never commit `.env.local` to version control (already in `.gitignore`)

### Production Environment Variables

For Vercel deployment, you'll configure these in the Vercel dashboard (see Vercel Deployment section).

## 4. Vercel Deployment

### Connect Repository

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your Git repository
4. Vercel will auto-detect Next.js framework

### Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (leave as default)
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)

### Add Environment Variables

In the Vercel project settings, add these environment variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production, Preview, Development |
| `GEMINI_API_KEY` | Your Google Gemini API key | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL | Production only |

**Important**: 
- For `NEXT_PUBLIC_APP_URL` in production, use your Vercel domain (e.g., `https://finbuddy.vercel.app`)
- Mark `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` as sensitive
- Enable all three environments (Production, Preview, Development) for each variable

### Deploy

1. Click **Deploy**
2. Wait for build to complete (2-5 minutes)
3. Vercel will provide a deployment URL

### Configure Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## 5. Post-Deployment Configuration

### Update Supabase Redirect URLs

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/dashboard`
     - `http://localhost:3000/auth/callback` (for local dev)

### Test Production Deployment

1. Visit your Vercel deployment URL
2. Test complete user flow:
   - Sign up with new account
   - Add expenses
   - View dashboard visualizations
   - Generate AI insights
   - Update profile
   - Log out and log back in

### Monitor Deployment

1. **Vercel Analytics**: Enable in project settings for performance monitoring
2. **Supabase Logs**: Monitor database queries and auth events
3. **Error Tracking**: Consider adding Sentry or similar service

## 6. Local Production Build Testing

Before deploying, test the production build locally:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` and test all features.

### Common Build Issues

**Issue**: Build fails with TypeScript errors
- **Solution**: Run `npm run lint` and fix all errors

**Issue**: Environment variables not found
- **Solution**: Ensure `.env.local` exists with all required variables

**Issue**: Supabase connection fails
- **Solution**: Verify credentials and check Supabase project status

**Issue**: Gemini API errors
- **Solution**: Verify API key and check quota limits

## 7. Continuous Deployment

Vercel automatically deploys:
- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

### Deployment Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit
3. Push to GitHub: `git push origin feature/new-feature`
4. Create pull request
5. Vercel creates preview deployment
6. Test preview deployment
7. Merge to main
8. Vercel deploys to production

## 8. Rollback Procedure

If deployment has issues:

1. In Vercel dashboard, go to **Deployments**
2. Find last working deployment
3. Click **⋯** → **Promote to Production**
4. Previous deployment becomes active immediately

## 9. Security Checklist

- [ ] All environment variables configured in Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` marked as sensitive
- [ ] `GEMINI_API_KEY` marked as sensitive
- [ ] Supabase RLS policies enabled and tested
- [ ] Gemini API key restricted to specific APIs
- [ ] Custom domain uses HTTPS
- [ ] Supabase redirect URLs configured correctly
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets committed to repository

## 10. Monitoring and Maintenance

### Regular Checks

- Monitor Vercel deployment logs for errors
- Check Supabase database usage and performance
- Monitor Gemini API quota and costs
- Review user feedback and error reports

### Scaling Considerations

- **Supabase**: Free tier includes 500MB database, upgrade as needed
- **Vercel**: Free tier includes 100GB bandwidth, upgrade for more
- **Gemini API**: Monitor token usage and costs

### Backup Strategy

- Supabase provides automatic daily backups
- Export database periodically for additional safety
- Keep migration files in version control

## Support Resources

- **Next.js**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Vercel**: [https://vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
- **Gemini API**: [https://ai.google.dev/docs](https://ai.google.dev/docs)

## Troubleshooting

### Deployment Fails

1. Check Vercel build logs for specific errors
2. Verify all environment variables are set
3. Test production build locally
4. Check for TypeScript/ESLint errors

### Authentication Issues

1. Verify Supabase redirect URLs
2. Check Supabase project status
3. Verify environment variables match Supabase dashboard
4. Clear browser cookies and try again

### Database Connection Issues

1. Verify Supabase credentials
2. Check RLS policies are correctly configured
3. Verify migrations ran successfully
4. Check Supabase project status

### AI Insights Not Working

1. Verify Gemini API key is correct
2. Check API quota hasn't been exceeded
3. Verify API is enabled in Google Cloud Console
4. Check Vercel function logs for errors
