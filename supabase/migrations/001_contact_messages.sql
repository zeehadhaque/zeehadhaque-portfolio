create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (
    char_length(email) between 5 and 200
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  subject text not null default '' check (char_length(subject) <= 160),
  message text not null check (char_length(message) between 10 and 4000),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.contact_messages enable row level security;

grant insert on table public.contact_messages to anon, authenticated;
grant select on table public.contact_messages to authenticated;
revoke select, update, delete on table public.contact_messages from anon;
revoke update, delete on table public.contact_messages from authenticated;

drop policy if exists "public may insert contact messages" on public.contact_messages;
create policy "public may insert contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

create or replace function public.is_verified_zee_owner()
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users
    where auth.users.id = auth.uid()
      and lower(auth.users.email) = 'zeehadhaque@gmail.com'
      and auth.users.email_confirmed_at is not null
  );
$$;

revoke execute on function public.is_verified_zee_owner() from public;
grant execute on function public.is_verified_zee_owner() to authenticated;

drop policy if exists "verified Zeehad owner may read contact messages" on public.contact_messages;
create policy "verified Zeehad owner may read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (public.is_verified_zee_owner());
