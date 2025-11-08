# FinBuddy MVP

AI-Powered Personal Finance Assistant built with Next.js, Supabase, and Google Gemini.

## Features

- Track expenses with categories and notes
- Visualize spending patterns with interactive charts
- Get AI-powered financial insights
- Secure authentication and data storage

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **AI**: Google Gemini API
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd finbuddy-mvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables template:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. Set up Supabase database:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run migrations from `supabase/migrations/` in the SQL Editor
   - Or use Supabase CLI: `supabase db push`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
npm start
```

### Deployment

This project is optimized for deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:

- Supabase project setup
- Google Gemini API configuration
- Vercel deployment steps
- Environment variable configuration
- Production testing

**Quick Deploy to Vercel:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/finbuddy-mvp)

After deployment, configure environment variables in Vercel dashboard.

## Project Structure

```
/app                    # Next.js App Router pages
  /api                  # API routes
  /dashboard            # Main dashboard
  /login, /signup       # Authentication pages
  /profile              # User profile
/components             # Reusable React components
/lib                    # Utility functions and API clients
/hooks                  # Custom React hooks
/supabase/migrations    # Database migrations
/scripts                # Utility scripts
```

## Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 10 minutes
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** - Quick deployment reference
- **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** - Environment configuration
- **[PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)** - Pre-deployment verification

## Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run verify-env    # Verify environment variables
npm run build:test    # Lint and build
npm run prod:test     # Build and start production server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT
