# Pre-Deployment Checklist

Use this checklist before deploying FinBuddy to production.

## 1. Code Quality

- [ ] All TypeScript errors resolved
  ```bash
  npm run build
  ```
- [ ] ESLint passes without errors
  ```bash
  npm run lint
  ```
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented
- [ ] Code reviewed and approved

## 2. Environment Configuration

- [ ] `.env.local.example` is up to date
- [ ] All required environment variables documented
- [ ] No secrets committed to repository
- [ ] `.env.local` in `.gitignore`
- [ ] Environment variables validated locally

## 3. Supabase Setup

- [ ] Supabase project created
- [ ] Database migrations executed successfully
- [ ] Tables created: `expenses`, `profiles`
- [ ] RLS policies enabled on all tables
- [ ] RLS policies tested (users can only access own data)
- [ ] Database indexes created
- [ ] Supabase credentials obtained:
  - [ ] Project URL
  - [ ] Anon key
  - [ ] Service role key
- [ ] Authentication redirect URLs configured
- [ ] Email templates customized (optional)

## 4. Google Gemini API

- [ ] Google Cloud project created
- [ ] Billing enabled
- [ ] Generative Language API enabled
- [ ] API key created
- [ ] API key restrictions configured
- [ ] API tested with sample request
- [ ] Quota limits reviewed

## 5. Local Testing

- [ ] Production build succeeds
  ```bash
  npm run build
  ```
- [ ] Production server starts
  ```bash
  npm start
  ```
- [ ] All pages load without errors
- [ ] User signup works
- [ ] User login works
- [ ] Expense CRUD operations work
- [ ] Dashboard visualizations render
- [ ] AI insights generate successfully
- [ ] Profile updates work
- [ ] Account deletion works
- [ ] Logout works
- [ ] Protected routes redirect correctly

## 6. Vercel Configuration

- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Project framework detected as Next.js
- [ ] Build settings configured
- [ ] All environment variables added to Vercel
- [ ] Environment variables enabled for correct environments
- [ ] Sensitive variables marked appropriately
- [ ] Custom domain configured (if applicable)

## 7. Security Review

- [ ] RLS policies prevent unauthorized access
- [ ] API routes verify authentication
- [ ] Service role key kept secret
- [ ] Gemini API key kept secret
- [ ] No sensitive data in client-side code
- [ ] CORS configured correctly
- [ ] Rate limiting considered for AI endpoints
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified

## 8. Performance

- [ ] Images optimized
- [ ] Unused dependencies removed
- [ ] Code splitting implemented
- [ ] Bundle size acceptable
  ```bash
  npm run build
  # Check .next/static/chunks sizes
  ```
- [ ] Lighthouse score reviewed
- [ ] Database queries optimized
- [ ] Indexes created for common queries

## 9. Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT.md complete
- [ ] ENVIRONMENT_VARIABLES.md accurate
- [ ] API documentation current
- [ ] Code comments added where needed
- [ ] Architecture documented

## 10. Monitoring & Logging

- [ ] Error tracking configured (optional: Sentry)
- [ ] Analytics configured (optional: Vercel Analytics)
- [ ] Logging strategy defined
- [ ] Supabase logs accessible
- [ ] Vercel deployment logs accessible

## 11. Backup & Recovery

- [ ] Database backup strategy defined
- [ ] Migration files in version control
- [ ] Rollback procedure documented
- [ ] Recovery plan tested

## 12. Post-Deployment

- [ ] Production URL accessible
- [ ] SSL certificate active (HTTPS)
- [ ] All features tested in production
- [ ] User signup flow tested
- [ ] Payment/billing configured (if applicable)
- [ ] Support email configured
- [ ] Status page created (optional)
- [ ] Team notified of deployment

## Testing Checklist

### Authentication Flow
- [ ] Sign up with new email
- [ ] Verify email (if enabled)
- [ ] Log in with credentials
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Protected routes redirect to login

### Expense Management
- [ ] Create expense with all fields
- [ ] Create expense with minimal fields
- [ ] Edit existing expense
- [ ] Delete expense
- [ ] View expense list
- [ ] Expenses sorted by date
- [ ] Empty state displays correctly

### Dashboard Visualizations
- [ ] Monthly summary calculates correctly
- [ ] Pie chart renders with data
- [ ] Pie chart shows empty state
- [ ] Line chart renders with data
- [ ] Line chart shows empty state
- [ ] Charts update after adding expense

### AI Insights
- [ ] Insights button triggers request
- [ ] Loading state displays
- [ ] Insights render successfully
- [ ] Error handling works
- [ ] Retry mechanism works

### Profile Management
- [ ] View profile information
- [ ] Update name
- [ ] Update currency preference
- [ ] Currency displays throughout app
- [ ] Delete account confirmation
- [ ] Account deletion removes all data

## Common Issues

### Build Fails
- Check TypeScript errors: `npm run build`
- Check ESLint errors: `npm run lint`
- Verify all imports are correct
- Check for missing dependencies

### Environment Variables Not Working
- Restart dev server after changes
- Check variable names (case-sensitive)
- Verify `NEXT_PUBLIC_` prefix for client variables
- Check for typos in `.env.local`

### Supabase Connection Issues
- Verify credentials are correct
- Check project is not paused
- Verify RLS policies allow access
- Check network connectivity

### Gemini API Errors
- Verify API key is valid
- Check API is enabled
- Verify billing is active
- Check quota limits

## Final Verification

Before clicking "Deploy":

1. [ ] All checklist items completed
2. [ ] Local production build tested
3. [ ] All environment variables ready
4. [ ] Team notified of deployment
5. [ ] Rollback plan ready
6. [ ] Monitoring tools active

## Post-Deployment Verification

After deployment:

1. [ ] Visit production URL
2. [ ] Complete full user flow
3. [ ] Check Vercel deployment logs
4. [ ] Monitor for errors
5. [ ] Verify analytics tracking
6. [ ] Test from different devices/browsers
7. [ ] Verify email notifications (if applicable)

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Production URL**: _____________

**Notes**: _____________
