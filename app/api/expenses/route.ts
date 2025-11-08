import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';
import { ExpenseInput, EXPENSE_CATEGORIES } from '@/lib/types';

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to create expenses' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: ExpenseInput = await request.json();

    // Server-side validation
    if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Amount is required and must be a positive number' },
        { status: 400 }
      );
    }

    if (!body.category || typeof body.category !== 'string') {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Category is required' },
        { status: 400 }
      );
    }

    if (!EXPENSE_CATEGORIES.includes(body.category as any)) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Invalid category' },
        { status: 400 }
      );
    }

    if (!body.date || typeof body.date !== 'string') {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Date is required' },
        { status: 400 }
      );
    }

    // Create expense with user_id association
    const { data: expense, error: insertError } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        amount: body.amount,
        category: body.category,
        note: body.note || null,
        date: body.date,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating expense:', insertError);
      return NextResponse.json(
        { error: 'Database Error', message: 'Failed to create expense' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: expense, message: 'Expense created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/expenses:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET /api/expenses - Fetch all expenses for authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view expenses' },
        { status: 401 }
      );
    }

    // Get query parameters for date range filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    // Apply date range filters if provided
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: expenses, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching expenses:', fetchError);
      return NextResponse.json(
        { error: 'Database Error', message: 'Failed to fetch expenses' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: expenses || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/expenses:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
