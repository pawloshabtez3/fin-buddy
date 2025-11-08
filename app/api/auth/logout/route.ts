import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

export async function POST() {
  try {
    const supabase = await createServerClient();
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: 'Logout failed', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to logout' },
      { status: 500 }
    );
  }
}
