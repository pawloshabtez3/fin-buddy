# Implementation Plan

- [x] 1. Initialize Next.js project and configure dependencies





  - Create Next.js 14+ project with TypeScript and Tailwind CSS
  - Install required dependencies: @supabase/supabase-js, @google/generative-ai, recharts
  - Configure Tailwind CSS with custom theme colors
  - Set up environment variables structure (.env.local.example)
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Set up Supabase integration and database schema





  - Create Supabase client configuration in lib/supabaseClient.ts
  - Create server-side Supabase client in lib/supabaseServer.ts
  - Write SQL migration for expenses table with RLS policies
  - Write SQL migration for profiles table with RLS policies
  - Create database indexes for performance optimization
  - _Requirements: 1.5, 2.2, 2.3_

- [x] 3. Implement TypeScript types and constants





  - Define Expense, ExpenseInput, Profile interfaces in lib/types.ts
  - Define MonthlySummary, CategoryAggregate, DailySpending interfaces
  - Create EXPENSE_CATEGORIES constant array
  - Define API response types and error types
  - _Requirements: 2.1, 2.4, 9.2_

- [x] 4. Create authentication pages and flows




  - [x] 4.1 Build signup page with email/password form


    - Create app/signup/page.tsx with form component
    - Implement client-side validation for email and password
    - Integrate Supabase Auth signup method
    - Add error handling and success redirect to dashboard
    - _Requirements: 1.1, 1.2_
  - [x] 4.2 Build login page with authentication


    - Create app/login/page.tsx with form component
    - Integrate Supabase Auth login method
    - Add error handling and success redirect to dashboard
    - _Requirements: 1.3, 1.4_
  - [x] 4.3 Implement logout functionality


    - Create logout API route or client-side function
    - Clear session via Supabase Auth
    - Redirect to login page after logout
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 4.4 Create authentication context provider


    - Build AuthProvider component with user state management
    - Implement session persistence and refresh logic
    - Add protected route logic for dashboard access
    - _Requirements: 1.4, 10.4_

- [x] 5. Build expense CRUD API routes






  - [x] 5.1 Create POST /api/expenses endpoint

    - Implement expense creation with user_id association
    - Add server-side validation for required fields
    - Return created expense object
    - _Requirements: 2.2, 2.3_

  - [x] 5.2 Create GET /api/expenses endpoint

    - Fetch all expenses for authenticated user
    - Implement date range filtering via query params
    - Return sorted expense array
    - _Requirements: 3.1, 3.2_

  - [x] 5.3 Create PUT /api/expenses/[id] endpoint

    - Implement expense update with ownership validation
    - Update expense record in database
    - Return updated expense object
    - _Requirements: 4.2, 4.3_

  - [x] 5.4 Create DELETE /api/expenses/[id] endpoint

    - Implement expense deletion with ownership validation
    - Remove expense from database
    - Return success status
    - _Requirements: 4.4, 4.5_

- [x] 6. Implement expense management UI components





  - [x] 6.1 Create ExpenseForm component


    - Build form with amount, category, date, note fields
    - Implement client-side validation
    - Add submit handler calling API routes
    - Support both create and edit modes
    - _Requirements: 2.1, 2.4, 2.5, 4.2_
  - [x] 6.2 Create ExpenseList component


    - Display expenses in descending date order
    - Add edit and delete action buttons per expense
    - Implement optimistic UI updates
    - Show empty state when no expenses exist
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1_
  - [x] 6.3 Integrate ExpenseForm and ExpenseList


    - Wire form submission to create/update expenses
    - Refresh expense list after mutations
    - Handle loading and error states
    - _Requirements: 2.2, 4.3, 4.5_

- [ ] 7. Build dashboard visualization components
  - [ ] 7.1 Create MonthlySummary component
    - Calculate total spending for current month
    - Display formatted currency value
    - Update when month changes
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [ ] 7.2 Create ExpenseChart pie chart component
    - Aggregate expenses by category for current month
    - Render pie chart using Recharts
    - Display category labels and percentages
    - Show empty state when no data
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [ ] 7.3 Create SpendingTrend line chart component
    - Aggregate daily totals for last 30 days
    - Render line chart using Recharts with date x-axis
    - Add tooltip showing date and amount
    - Show empty state when no data
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 8. Integrate Google Gemini AI insights
  - [ ] 8.1 Create Gemini API client in lib/gemini.ts
    - Initialize GoogleGenerativeAI with API key
    - Create getSpendingInsights function
    - Format prompt with expense data and instructions
    - Handle API response and errors
    - _Requirements: 8.2, 8.3_
  - [ ] 8.2 Create POST /api/insights endpoint
    - Accept expense data in request body
    - Call Gemini API via lib/gemini.ts
    - Return AI-generated insights text
    - Implement error handling and timeout
    - _Requirements: 8.2, 8.3, 8.4, 8.5_
  - [ ] 8.3 Create AIInsights component
    - Add button to trigger insights generation
    - Display loading state during API call
    - Render formatted AI response text
    - Show error message with retry option on failure
    - _Requirements: 8.1, 8.4, 8.5_

- [ ] 9. Build user profile management
  - [ ] 9.1 Create profile API routes
    - Implement GET /api/profile to fetch user profile
    - Implement PUT /api/profile to update name and currency
    - Implement DELETE /api/profile for account deletion
    - _Requirements: 9.1, 9.2, 11.2, 11.3, 11.4_
  - [ ] 9.2 Create profile page UI
    - Build form to display and edit name and preferred currency
    - Add account deletion button with confirmation dialog
    - Integrate with profile API routes
    - Display currency throughout app based on preference
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 11.1, 11.2, 11.5_

- [ ] 10. Create dashboard page and layout
  - [ ] 10.1 Build main dashboard page
    - Create app/dashboard/page.tsx as server component
    - Fetch initial expense data server-side
    - Render MonthlySummary, ExpenseChart, SpendingTrend, AIInsights
    - Pass data to client components as props
    - _Requirements: 5.2, 6.2, 7.2, 8.4_
  - [ ] 10.2 Create app layout with navigation
    - Build root layout.tsx with auth check
    - Create Navigation component with links to dashboard and profile
    - Add logout button to navigation
    - Implement redirect logic for unauthenticated users
    - _Requirements: 1.4, 10.1, 10.3, 10.4_

- [ ] 11. Implement error handling and validation
  - Create standardized error response types
  - Add form validation error displays
  - Implement toast notifications for network errors
  - Add retry mechanisms for failed API calls
  - Handle Supabase and Gemini API errors gracefully
  - _Requirements: 2.4, 4.3, 8.5_

- [ ] 12. Add data aggregation utility functions
  - Create function to calculate monthly summary from expenses
  - Create function to aggregate expenses by category
  - Create function to generate daily spending totals
  - Create currency formatting utility
  - _Requirements: 5.1, 6.1, 7.1, 9.4_

- [ ] 13. Implement authentication middleware and route protection
  - Create middleware to check auth status on protected routes
  - Redirect unauthenticated users to login
  - Verify user session in API routes
  - _Requirements: 1.4, 1.5, 10.4_

- [ ] 14. Configure deployment and environment setup
  - Create deployment configuration for Vercel
  - Document required environment variables
  - Set up Supabase project and obtain credentials
  - Obtain Google Gemini API key
  - Test production build locally
  - _Requirements: All_

- [ ] 15. Write integration tests for API routes
  - Test expense CRUD operations with mocked Supabase
  - Test insights endpoint with mocked Gemini API
  - Test profile operations
  - Test authentication flows
  - _Requirements: All_

- [ ] 16. Write component tests
  - Test ExpenseForm validation and submission
  - Test ExpenseList rendering and actions
  - Test chart components with various data scenarios
  - Test empty states and error states
  - _Requirements: All_
