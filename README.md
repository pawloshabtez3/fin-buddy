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

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables template:
   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in your environment variables in `.env.local`:
   - Supabase URL and keys
   - Google Gemini API key

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
```

### Deployment

This project is optimized for deployment on Vercel.

## Project Structure

```
/app                    # Next.js App Router pages
/components             # Reusable React components
/lib                    # Utility functions and API clients
/hooks                  # Custom React hooks
```

## License

MIT
