-- Zee Filmmaking Academy: Student Intake & Professional Profile Fields
-- Run in the Supabase SQL Editor. Safe & non-destructive.

alter table public.academy_profiles
  add column if not exists phone text,
  add column if not exists age integer,
  add column if not exists primary_interest text,
  add column if not exists experience_level text,
  add column if not exists enquiry_goal text;

-- Update trigger function to capture intake metadata on user creation
create or replace function public.academy_bootstrap_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.academy_profiles(
    user_id,
    display_name,
    email,
    phone,
    age,
    primary_interest,
    experience_level,
    enquiry_goal
  )
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      'Filmmaker'
    ),
    coalesce(new.email, ''),
    nullif(trim(new.raw_user_meta_data->>'phone'), ''),
    case
      when (new.raw_user_meta_data->>'age') ~ '^[0-9]+$'
      then (new.raw_user_meta_data->>'age')::integer
      else null
    end,
    nullif(trim(new.raw_user_meta_data->>'primary_interest'), ''),
    nullif(trim(new.raw_user_meta_data->>'experience_level'), ''),
    nullif(trim(new.raw_user_meta_data->>'enquiry_goal'), '')
  )
  on conflict (user_id) do update
    set email = excluded.email,
        display_name = coalesce(nullif(trim(excluded.display_name), ''), public.academy_profiles.display_name),
        phone = coalesce(excluded.phone, public.academy_profiles.phone),
        age = coalesce(excluded.age, public.academy_profiles.age),
        primary_interest = coalesce(excluded.primary_interest, public.academy_profiles.primary_interest),
        experience_level = coalesce(excluded.experience_level, public.academy_profiles.experience_level),
        enquiry_goal = coalesce(excluded.enquiry_goal, public.academy_profiles.enquiry_goal);
  return new;
end;
$$;

-- Allow authenticated users to update their own profile fields
grant update (display_name, phone, age, primary_interest, experience_level, enquiry_goal)
  on public.academy_profiles to authenticated;

drop policy if exists "Academy profiles own update" on public.academy_profiles;
create policy "Academy profiles own update" on public.academy_profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
