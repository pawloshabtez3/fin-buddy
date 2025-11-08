import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from './supabaseServer';
import { User } from '@supabase/supabase-js';

/**
 * Verify user authentication in API routes
 * Returns the authenticated user or throws an error response
 */
export async function verifyAuth(
  request: NextRequest
): Promise<{ user: User; error: null } | { user: null; error: NextResponse }> {
  try {
    const supabase = await createServerClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        user: null,
        error: NextResponse.json(
          {
            error: 'Unauthorized',
            message: 'You must be logged in to access this resource',
          },
          { status: 401 }
        ),
      };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error verifying authentication:', error);
    return {
      user: null,
      error: NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Failed to verify authentication',
        },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware wrapper for API routes that require authentication
 * Usage:
 * 
 * export async function GET(request: NextRequest) {
 *   return withAuth(request, async (user) => {
 *     // Your authenticated route logic here
 *     // user is guaranteed to be authenticated
 *   });
 * }
 */
export async function withAuth(
  request: NextRequest,
  handler: (user: User) => Promise<NextResponse>
): Promise<NextResponse> {
  const { user, error } = await verifyAuth(request);

  if (error) {
    return error;
  }

  try {
    return await handler(user!);
  } catch (error) {
    console.error('Error in authenticated route handler:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
