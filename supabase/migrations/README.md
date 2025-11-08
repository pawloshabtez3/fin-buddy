# Supabase Migrations

This directory contains SQL migrations for the FinBuddy application.

## Migration Files

1. **001_create_expenses_table.sql** - Creates the expenses table with RLS policies and indexes
2. **002_create_profiles_table.sql** - Creates the profiles table with RLS policies and auto-creation trigger

## Running Migrations

### Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of each migration file in order (001, then 002)
4. Execute each migration

## Migration Order

**Important:** Run migrations in numerical order:
1. First run `001_create_expenses_table.sql`
2. Then run `002_create_profiles_table.sql`

The profiles migration depends on the `update_updated_at_column()` function created in the expenses migration.

## What These Migrations Do

### Expenses Table
- Stores user expense records
- Enforces positive amounts via check constraint
- Includes RLS policies to ensure users can only access their own expenses
- Creates indexes for efficient querying by user_id and date
- Auto-updates the updated_at timestamp on changes

### Profiles Table
- Stores user profile information (name, preferred currency)
- Automatically creates a profile when a new user signs up
- Includes RLS policies for data isolation
- Defaults to USD currency
- Auto-updates the updated_at timestamp on changes

## Environment Variables Required

Make sure these are set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
