# Deployment Summary

Quick reference for deploying FinBuddy to production.

## 📋 Prerequisites Checklist

- [ ] Supabase account and project created
- [ ] Google Cloud account with Gemini API enabled
- [ ] Vercel account created
- [ ] Git repository hosted (GitHub/GitLab/Bitbucket)
- [ ] All environment variables obtained

## 🔑 Required Credentials

### Supabase (from [supabase.com/dashboard](https://supabase.com/dashboard))
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Google Gemini (from [Google AI Studio](https://aistudio.google.com/app/apikey))
```
GEMINI_API_KEY=AIzaSy...
```

### Application
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🚀 Deployment Steps

### 1. Prepare Codebase
```bash
# Verify environment variables
npm run verify-env

# Run linter
npm run lint

# Test production build
npm run build:test
```

### 2. Set Up Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Run migrations from `supabase/migrations/`
3. Verify tables and RLS policies
4. Copy credentials from Settings → API

### 3. Set Up Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create API key
3. Enable Generative Language API
4. Copy API key

### 4. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import Git repository
3. Add environment variables
4. Click Deploy

### 5. Post-Deployment
1. Update Supabase redirect URLs
2. Test production deployment
3. Monitor logs for errors

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | Complete deployment guide |
| `ENVIRONMENT_VARIABLES.md` | Environment variable reference |
| `PRE_DEPLOYMENT_CHECKLIST.md` | Pre-deployment verification |
| `QUICK_START.md` | Local development setup |
| `DEPLOYMENT_SUMMARY.md` | This file - quick reference |

## 🛠️ Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run lint                # Run ESLint
npm run verify-env          # Verify environment variables

# Production Testing
npm run build               # Build for production
npm run start               # Start production server
npm run build:test          # Lint + Build
npm run prod:test           # Build + Start

# Deployment
git push origin main        # Triggers Vercel deployment
```

## 🔍 Verification

After deployment, test these flows:

1. **Authentication**
   - Sign up new account
   - Log in
   - Log out

2. **Expense Management**
   - Create expense
   - Edit expense
   - Delete expense
   - View expense list

3. **Dashboard**
   - Monthly summary displays
   - Pie chart renders
   - Line chart renders
   - AI insights generate

4. **Profile**
   - View profile
   - Update name/currency
   - Delete account

## 🐛 Troubleshooting

### Build Fails
```bash
npm run lint              # Check for errors
rm -rf .next node_modules # Clean install
npm install
npm run build
```

### Environment Issues
```bash
npm run verify-env        # Verify all variables set
```

### Supabase Connection
- Check credentials in Vercel dashboard
- Verify Supabase project is active
- Check RLS policies allow access

### Gemini API Errors
- Verify API key is correct
- Check API is enabled
- Verify billing is active

## 📊 Monitoring

### Vercel
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- View deployment logs
- Monitor function execution
- Check analytics

### Supabase
- Dashboard: [supabase.com/dashboard](https://supabase.com/dashboard)
- Monitor database queries
- Check auth logs
- Review API usage

### Google Cloud
- Console: [console.cloud.google.com](https://console.cloud.google.com)
- Monitor API usage
- Check quota limits
- Review billing

## 🔄 Update Workflow

```bash
# 1. Make changes locally
git checkout -b feature/new-feature

# 2. Test locally
npm run dev
npm run build:test

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 4. Create pull request
# Vercel creates preview deployment

# 5. Test preview deployment

# 6. Merge to main
# Vercel deploys to production
```

## 🆘 Support

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Gemini**: [ai.google.dev/docs](https://ai.google.dev/docs)

## 📝 Notes

- Free tier limits:
  - Vercel: 100GB bandwidth/month
  - Supabase: 500MB database, 2GB bandwidth
  - Gemini: Check current quota limits

- Recommended monitoring:
  - Enable Vercel Analytics
  - Set up error tracking (Sentry)
  - Monitor Supabase logs

- Security:
  - Rotate keys every 90 days
  - Never commit secrets
  - Use environment variables
  - Enable RLS policies

---

**Last Updated**: November 2025
**Version**: 1.0.0
