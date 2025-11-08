import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';
import { getSpendingInsights } from '@/lib/gemini';
import { Expense } from '@/lib/types';

// POST /api/insights - Generate AI insights from expense data
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to generate insights' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const expenses: Expense[] = body.expenses;

    // Validate expense data
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Expense data is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // Verify all expenses belong to the authenticated user
    const invalidExpenses = expenses.filter(exp => exp.user_id !== user.id);
    if (invalidExpenses.length > 0) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You can only generate insights for your own expenses' },
        { status: 403 }
      );
    }

    // Call Gemini API with timeout handling
    try {
      const insights = await getSpendingInsights(expenses);
      
      return NextResponse.json(
        { 
          data: {
            insights,
            generated_at: new Date().toISOString()
          },
          message: 'Insights generated successfully'
        },
        { status: 200 }
      );
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      
      // Handle specific error types
      if (geminiError instanceof Error) {
        if (geminiError.message.includes('timeout')) {
          return NextResponse.json(
            { error: 'Timeout Error', message: 'The AI service took too long to respond. Please try again.' },
            { status: 504 }
          );
        }
        
        if (geminiError.message.includes('API key')) {
          return NextResponse.json(
            { error: 'Configuration Error', message: 'AI service is not properly configured' },
            { status: 503 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'AI Service Error', message: 'Failed to generate insights. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in POST /api/insights:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
