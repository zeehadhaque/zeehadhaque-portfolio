-- Zee Filmmaking Academy: persistent progress and admin-managed access.
-- Apply once in the Supabase SQL Editor. No service-role key is used by the client.

create table if not exists public.academy_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Filmmaker',
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.academy_answer_key (
  day smallint primary key check (day between 1 and 30),
  answer_index smallint not null check (answer_index between 0 and 5),
  xp smallint not null check (xp between 1 and 100)
);

create table if not exists public.academy_day_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  day smallint not null references public.academy_answer_key(day),
  xp_earned smallint not null default 0 check (xp_earned >= 0),
  reflection text not null default '' check (char_length(reflection) <= 2000),
  completed_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.academy_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  day smallint not null references public.academy_answer_key(day),
  answer_index smallint not null check (answer_index between 0 and 5),
  is_correct boolean not null,
  xp_awarded smallint not null default 0,
  attempted_at timestamptz not null default now()
);

create table if not exists public.academy_entitlements (
  user_id uuid not null references auth.users(id) on delete cascade,
  entitlement_key text not null check (entitlement_key in ('program.30day','track.advanced','arcade.pro','certificate.issue')),
  granted_by uuid not null references auth.users(id),
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  note text not null default '' check (char_length(note) <= 300),
  primary key (user_id, entitlement_key)
);

insert into public.academy_answer_key(day, answer_index, xp) values
  (1,0,20),(2,1,20),(3,1,20),(4,1,20),(5,1,20),(6,1,20),(7,1,35),
  (8,0,25),(9,0,25),(10,1,25),(11,0,25),(12,0,25),(13,0,25),(14,1,35),
  (15,1,25),(16,0,25),(17,0,25),(18,0,25),(19,1,25),(20,0,25),(21,0,35),
  (22,0,25),(23,0,25),(24,1,25),(25,0,25),(26,1,25),(27,0,25),(28,1,35),(29,0,30),(30,0,60)
on conflict (day) do update set answer_index=excluded.answer_index, xp=excluded.xp;

create or replace function public.academy_is_verified_owner()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from auth.users u
    where u.id = auth.uid()
      and lower(coalesce(u.email,'')) = 'zeehadhaque@gmail.com'
      and u.email_confirmed_at is not null
  );
$$;

revoke all on function public.academy_is_verified_owner() from public;
grant execute on function public.academy_is_verified_owner() to authenticated;

create or replace function public.academy_bootstrap_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.academy_profiles(user_id, display_name, email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), 'Filmmaker'),
    coalesce(new.email, '')
  )
  on conflict (user_id) do update
    set email=excluded.email,
        display_name=coalesce(nullif(trim(public.academy_profiles.display_name),''), excluded.display_name);
  return new;
end;
$$;

drop trigger if exists on_academy_auth_user_created on auth.users;
create trigger on_academy_auth_user_created
after insert on auth.users
for each row execute procedure public.academy_bootstrap_profile();

alter table public.academy_profiles enable row level security;
alter table public.academy_answer_key enable row level security;
alter table public.academy_day_progress enable row level security;
alter table public.academy_attempts enable row level security;
alter table public.academy_entitlements enable row level security;

revoke all on public.academy_answer_key from anon, authenticated;
revoke all on public.academy_day_progress from anon, authenticated;
revoke all on public.academy_attempts from anon, authenticated;
revoke all on public.academy_entitlements from anon, authenticated;
revoke all on public.academy_profiles from anon, authenticated;

grant select on public.academy_profiles, public.academy_day_progress, public.academy_attempts, public.academy_entitlements to authenticated;

drop policy if exists "Academy profiles own or owner read" on public.academy_profiles;
create policy "Academy profiles own or owner read" on public.academy_profiles
for select to authenticated
using (user_id = auth.uid() or public.academy_is_verified_owner());

drop policy if exists "Academy progress own or owner read" on public.academy_day_progress;
create policy "Academy progress own or owner read" on public.academy_day_progress
for select to authenticated
using (user_id = auth.uid() or public.academy_is_verified_owner());

drop policy if exists "Academy attempts own or owner read" on public.academy_attempts;
create policy "Academy attempts own or owner read" on public.academy_attempts
for select to authenticated
using (user_id = auth.uid() or public.academy_is_verified_owner());

drop policy if exists "Academy entitlements own or owner read" on public.academy_entitlements;
create policy "Academy entitlements own or owner read" on public.academy_entitlements
for select to authenticated
using (user_id = auth.uid() or public.academy_is_verified_owner());

create or replace function public.academy_complete_day(
  p_day smallint,
  p_answer_index smallint,
  p_reflection text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user uuid := auth.uid();
  v_correct smallint;
  v_xp smallint;
  v_is_correct boolean;
  v_awarded smallint := 0;
  v_done boolean := false;
begin
  if v_user is null then raise exception 'authentication_required'; end if;
  if p_day is null or p_day < 1 or p_day > 30 then raise exception 'invalid_day'; end if;
  if p_answer_index is null or p_answer_index < 0 or p_answer_index > 5 then raise exception 'invalid_answer'; end if;
  if char_length(coalesce(p_reflection,'')) > 2000 then raise exception 'reflection_too_long'; end if;

  if p_day > 7 and not exists (
    select 1 from public.academy_entitlements e
    where e.user_id=v_user and e.entitlement_key='program.30day'
      and (e.expires_at is null or e.expires_at > now())
  ) then
    raise exception 'entitlement_required';
  end if;

  select answer_index, xp into v_correct, v_xp
  from public.academy_answer_key where day=p_day;
  if not found then raise exception 'day_not_found'; end if;

  v_is_correct := (p_answer_index = v_correct);
  if v_is_correct then
    insert into public.academy_day_progress(user_id,day,xp_earned,reflection)
    values (v_user,p_day,v_xp,coalesce(trim(p_reflection), ''))
    on conflict (user_id,day) do nothing
    returning xp_earned into v_awarded;
    v_done := true;
    v_awarded := coalesce(v_awarded,0);
  end if;

  insert into public.academy_attempts(user_id,day,answer_index,is_correct,xp_awarded)
  values (v_user,p_day,p_answer_index,v_is_correct,v_awarded);

  return jsonb_build_object(
    'correct',v_is_correct,
    'completed',v_done,
    'xp_awarded',v_awarded,
    'already_completed',v_is_correct and v_awarded=0
  );
end;
$$;

create or replace function public.academy_grant_entitlement(
  p_user_id uuid,
  p_entitlement_key text,
  p_days integer default null,
  p_note text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_expiry timestamptz;
begin
  if not public.academy_is_verified_owner() then raise exception 'admin_required'; end if;
  if p_entitlement_key not in ('program.30day','track.advanced','arcade.pro','certificate.issue') then raise exception 'invalid_entitlement'; end if;
  if p_days is not null and (p_days < 1 or p_days > 3650) then raise exception 'invalid_duration'; end if;
  if not exists (select 1 from auth.users where id=p_user_id and email_confirmed_at is not null) then raise exception 'verified_user_not_found'; end if;
  v_expiry := case when p_days is null then null else now() + make_interval(days => p_days) end;

  insert into public.academy_entitlements(user_id,entitlement_key,granted_by,expires_at,note)
  values (p_user_id,p_entitlement_key,auth.uid(),v_expiry,left(coalesce(p_note,''),300))
  on conflict (user_id,entitlement_key) do update
    set granted_by=auth.uid(), granted_at=now(), expires_at=excluded.expires_at, note=excluded.note;

  return jsonb_build_object('ok',true,'expires_at',v_expiry);
end;
$$;

create or replace function public.academy_revoke_entitlement(
  p_user_id uuid,
  p_entitlement_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.academy_is_verified_owner() then raise exception 'admin_required'; end if;
  delete from public.academy_entitlements
  where user_id=p_user_id and entitlement_key=p_entitlement_key;
  return jsonb_build_object('ok',true);
end;
$$;

revoke all on function public.academy_complete_day(smallint,smallint,text) from public;
revoke all on function public.academy_grant_entitlement(uuid,text,integer,text) from public;
revoke all on function public.academy_revoke_entitlement(uuid,text) from public;
grant execute on function public.academy_complete_day(smallint,smallint,text) to authenticated;
grant execute on function public.academy_grant_entitlement(uuid,text,integer,text) to authenticated;
grant execute on function public.academy_revoke_entitlement(uuid,text) to authenticated;
