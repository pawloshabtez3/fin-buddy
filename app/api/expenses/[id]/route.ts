import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';
import { ExpenseInput, EXPENSE_CATEGORIES } from '@/lib/types';

// PUT /api/expenses/[id] - Update expense
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to update expenses' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Expense not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    // Parse request body
    const body: Partial<ExpenseInput> = await request.json();

    // Server-side validation
    if (body.amount !== undefined) {
      if (typeof body.amount !== 'number' || body.amount <= 0) {
        return NextResponse.json(
          { error: 'Validation Error', message: 'Amount must be a positive number' },
          { status: 400 }
        );
      }
    }

    if (body.category !== undefined) {
      if (typeof body.category !== 'string' || !EXPENSE_CATEGORIES.includes(body.category as any)) {
        return NextResponse.json(
          { error: 'Validation Error', message: 'Invalid category' },
          { status: 400 }
        );
      }
    }

    if (body.date !== undefined) {
      if (typeof body.date !== 'string') {
        return NextResponse.json(
          { error: 'Validation Error', message: 'Invalid date format' },
          { status: 400 }
        );
      }
    }

    // Update expense
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.note !== undefined) updateData.note = body.note;
    if (body.date !== undefined) updateData.date = body.date;

    const { data: updatedExpense, error: updateError } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating expense:', updateError);
      return NextResponse.json(
        { error: 'Database Error', message: 'Failed to update expense' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: updatedExpense, message: 'Expense updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in PUT /api/expenses/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to delete expenses' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership before deletion
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Expense not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Delete expense
    const { error: deleteError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting expense:', deleteError);
      return NextResponse.json(
        { error: 'Database Error', message: 'Failed to delete expense' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Expense deleted successfully', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in DELETE /api/expenses/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
