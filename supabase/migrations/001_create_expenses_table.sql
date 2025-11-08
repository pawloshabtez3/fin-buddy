-- Create expenses table
create table if not exists expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  amount numeric not null check (amount > 0),
  category text not null,
  note text,
  date date not null default current_date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for efficient queries
create index if not exists idx_expenses_user_id on expenses(user_id);
create index if not exists idx_expenses_date on expenses(date desc);
create index if not exists idx_expenses_user_date on expenses(user_id, date desc);

-- Enable Row Level Security
alter table expenses enable row level security;

-- RLS Policies for expenses table (optimized for performance)
create policy "Users can view own expenses"
  on expenses for select
  using (user_id = (select auth.uid()));

create policy "Users can insert own expenses"
  on expenses for insert
  with check (user_id = (select auth.uid()));

create policy "Users can update own expenses"
  on expenses for update
  using (user_id = (select auth.uid()));

create policy "Users can delete own expenses"
  on expenses for delete
  using (user_id = (select auth.uid()));

-- Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = '';

-- Create trigger to automatically update updated_at
create trigger update_expenses_updated_at
  before update on expenses
  for each row
  execute function update_updated_at_column();
