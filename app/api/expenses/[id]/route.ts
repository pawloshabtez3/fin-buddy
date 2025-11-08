import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';
import { ExpenseInput } from '@/lib/types';
import { validateExpenseInput, hasValidationErrors, getFirstValidationError } from '@/lib/validation';
import { handleSupabaseError } from '@/lib/errors';
import { withAuth } from '@/lib/auth-middleware';

// PUT /api/expenses/[id] - Update expense
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (user) => {
    const supabase = await createServerClient();
    const { id } = await params;

    // Verify ownership
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingExpense) {
      const appError = handleSupabaseError(fetchError || new Error('Not found'));
      return NextResponse.json(
        { error: appError.type, message: 'Expense not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    // Parse request body
    const body: Partial<ExpenseInput> = await request.json();

    // Server-side validation for provided fields
    const validationErrors = validateExpenseInput({
      amount: body.amount ?? existingExpense.amount,
      category: body.category ?? existingExpense.category,
      date: body.date ?? existingExpense.date,
      note: body.note ?? existingExpense.note,
    });
    
    if (hasValidationErrors(validationErrors)) {
      const firstError = getFirstValidationError(validationErrors);
      return NextResponse.json(
        { error: 'Validation Error', message: firstError, errors: validationErrors },
        { status: 400 }
      );
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
      const appError = handleSupabaseError(updateError);
      return NextResponse.json(
        { error: appError.type, message: appError.message },
        { status: appError.statusCode }
      );
    }

    return NextResponse.json(
      { data: updatedExpense, message: 'Expense updated successfully' },
      { status: 200 }
    );
  });
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (user) => {
    const supabase = await createServerClient();
    const { id } = await params;

    // Verify ownership before deletion
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingExpense) {
      const appError = handleSupabaseError(fetchError || new Error('Not found'));
      return NextResponse.json(
        { error: appError.type, message: 'Expense not found or you do not have permission to delete it' },
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
      const appError = handleSupabaseError(deleteError);
      return NextResponse.json(
        { error: appError.type, message: appError.message },
        { status: appError.statusCode }
      );
    }

    return NextResponse.json(
      { message: 'Expense deleted successfully', success: true },
      { status: 200 }
    );
  });
}
