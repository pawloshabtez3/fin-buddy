import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createServiceClient } from '@/lib/supabaseServer';
import { Profile } from '@/lib/types';
import { validateProfileData, hasValidationErrors, getFirstValidationError } from '@/lib/validation';
import { handleSupabaseError } from '@/lib/errors';

// GET /api/profile - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view profile' },
        { status: 401 }
      );
    }

    // Fetch user profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      
      // If profile doesn't exist, create one
      if (fetchError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || null,
            preferred_currency: 'USD',
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          const appError = handleSupabaseError(createError);
          return NextResponse.json(
            { error: appError.type, message: appError.message },
            { status: appError.statusCode }
          );
        }

        return NextResponse.json(
          { data: newProfile },
          { status: 200 }
        );
      }

      const appError = handleSupabaseError(fetchError);
      return NextResponse.json(
        { error: appError.type, message: appError.message },
        { status: appError.statusCode }
      );
    }

    return NextResponse.json(
      { data: profile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to update profile' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validationErrors = validateProfileData(body);
    if (hasValidationErrors(validationErrors)) {
      const firstError = getFirstValidationError(validationErrors);
      return NextResponse.json(
        { error: 'Validation Error', message: firstError, errors: validationErrors },
        { status: 400 }
      );
    }

    const updates: Partial<Profile> = {};

    if (body.name !== undefined) {
      updates.name = body.name.trim() || null;
    }

    if (body.preferred_currency !== undefined) {
      updates.preferred_currency = body.preferred_currency.toUpperCase().trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      const appError = handleSupabaseError(updateError);
      return NextResponse.json(
        { error: appError.type, message: appError.message },
        { status: appError.statusCode }
      );
    }

    return NextResponse.json(
      { data: profile, message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in PUT /api/profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile - Delete user account and all associated data
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to delete account' },
        { status: 401 }
      );
    }

    // Delete all user expenses (cascade will handle profile deletion)
    const { error: expensesError } = await supabase
      .from('expenses')
      .delete()
      .eq('user_id', user.id);

    if (expensesError) {
      console.error('Error deleting expenses:', expensesError);
      const appError = handleSupabaseError(expensesError);
      return NextResponse.json(
        { error: appError.type, message: appError.message },
        { status: appError.statusCode }
      );
    }

    // Delete user account from Supabase Auth using service role client
    const serviceClient = await createServiceClient();
    const { error: deleteUserError } = await serviceClient.auth.admin.deleteUser(user.id);

    if (deleteUserError) {
      console.error('Error deleting user account:', deleteUserError);
      const appError = handleSupabaseError(deleteUserError);
      return NextResponse.json(
        { error: appError.type, message: appError.message },
        { status: appError.statusCode }
      );
    }

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in DELETE /api/profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
