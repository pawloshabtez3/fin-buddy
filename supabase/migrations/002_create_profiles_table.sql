-- Create profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  preferred_currency text default 'USD' not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for efficient queries
create index if not exists idx_profiles_id on profiles(id);

-- Enable Row Level Security
alter table profiles enable row level security;

-- RLS Policies for profiles table (optimized for performance)
create policy "Users can view own profile"
  on profiles for select
  using (id = (select auth.uid()));

create policy "Users can insert own profile"
  on profiles for insert
  with check (id = (select auth.uid()));

create policy "Users can update own profile"
  on profiles for update
  using (id = (select auth.uid()));

create policy "Users can delete own profile"
  on profiles for delete
  using (id = (select auth.uid()));

-- Create trigger to automatically update updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

-- Create function to automatically create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, preferred_currency)
  values (new.id, new.raw_user_meta_data->>'name', 'USD');
  return new;
end;
$$ language plpgsql security definer
set search_path = '';

-- Create trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();
