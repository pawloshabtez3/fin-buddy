import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabaseServer';
import { DashboardClient } from './DashboardClient';
import { Expense, Profile } from '@/lib/types';

export default async function DashboardPage() {
  // Create server-side Supabase client
  const supabase = await createServerClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch initial expense data server-side
  const { data: expenses, error: expensesError } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (expensesError) {
    console.error('Error fetching expenses:', expensesError);
  }

  // Fetch user profile for currency preference
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  const currency = profile?.preferred_currency || 'USD';
  const initialExpenses: Expense[] = expenses || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardClient initialExpenses={initialExpenses} currency={currency} />
    </main>
  );
}
