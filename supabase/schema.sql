-- MistriHub Market Supabase schema
-- Run this in the Supabase SQL editor after creating a project.

create extension if not exists "pgcrypto";

create type public.app_role as enum ('user', 'worker', 'admin');
create type public.verification_status as enum ('pending', 'verified', 'rejected');
create type public.listing_type as enum ('product', 'job', 'business');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.notification_type as enum ('profile_view', 'job_nearby', 'buyer_interest', 'trust_score', 'referral', 'admin');
create type public.booking_status as enum ('requested', 'accepted', 'on_the_way', 'arrived', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  full_name text not null,
  phone text,
  whatsapp text,
  avatar_url text,
  city text,
  area text,
  referral_code text unique,
  referred_by uuid references public.profiles(id),
  login_streak integer not null default 0,
  referral_points integer not null default 0,
  profile_boost_points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trust_scores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  score integer not null default 40 check (score between 0 and 100),
  phone_verified boolean not null default false,
  id_verified boolean not null default false,
  jobs_completed integer not null default 0,
  reviews_count integer not null default 0,
  avg_response_minutes integer,
  scam_reports_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.worker_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  skill text not null,
  experience_years integer not null default 0,
  price_min integer,
  price_max integer,
  location text not null,
  latitude double precision,
  longitude double precision,
  distance_label text,
  bio text,
  level text not null default 'Bronze',
  availability text not null default 'Available Now',
  verification_status public.verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  category text not null,
  location text not null,
  distance_label text,
  opens_at text,
  closes_at text,
  phone text,
  whatsapp text,
  photos text[] not null default '{}',
  offer text,
  verified boolean not null default false,
  trust_score integer not null default 40 check (trust_score between 0 and 100),
  rating numeric(2,1) not null default 0,
  reviews_count integer not null default 0,
  open_now boolean not null default true,
  trending boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type public.listing_type not null,
  title text not null,
  category text not null,
  description text,
  price integer,
  price_label text,
  location text not null,
  images text[] not null default '{}',
  status text not null default 'active',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  worker_profile_id uuid references public.worker_profiles(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  constraint review_target_required check (
    worker_profile_id is not null or business_profile_id is not null or listing_id is not null
  )
);

create table public.service_videos (
  id uuid primary key default gen_random_uuid(),
  worker_profile_id uuid not null references public.worker_profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  video_url text not null,
  thumbnail_url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_profile_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  reason text not null,
  status public.report_status not null default 'open',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  read_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null references public.profiles(id) on delete cascade,
  points_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  unique (referrer_id, referred_id)
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.worker_live_locations (
  worker_profile_id uuid primary key references public.worker_profiles(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  is_online boolean not null default false,
  last_seen_at timestamptz not null default now(),
  update_interval_seconds integer not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.instant_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_profile_id uuid references public.worker_profiles(id) on delete set null,
  service_type text not null,
  latitude double precision not null,
  longitude double precision not null,
  radius_km integer not null default 5,
  status public.booking_status not null default 'requested',
  eta_minutes integer,
  accepted_at timestamptz,
  locked_at timestamptz,
  completed_at timestamptz,
  fallback_phone text,
  fallback_whatsapp text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.instant_bookings(id) on delete cascade,
  worker_profile_id uuid not null references public.worker_profiles(id) on delete cascade,
  status text not null default 'pending',
  notified_at timestamptz not null default now(),
  responded_at timestamptz,
  unique (booking_id, worker_profile_id)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trust_scores_updated_at before update on public.trust_scores for each row execute function public.set_updated_at();
create trigger worker_profiles_updated_at before update on public.worker_profiles for each row execute function public.set_updated_at();
create trigger business_profiles_updated_at before update on public.business_profiles for each row execute function public.set_updated_at();
create trigger listings_updated_at before update on public.listings for each row execute function public.set_updated_at();
create trigger service_videos_updated_at before update on public.service_videos for each row execute function public.set_updated_at();
create trigger reports_updated_at before update on public.reports for each row execute function public.set_updated_at();
create trigger worker_live_locations_updated_at before update on public.worker_live_locations for each row execute function public.set_updated_at();
create trigger instant_bookings_updated_at before update on public.instant_bookings for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, referral_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'MistriHub User'),
    coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'user'),
    upper(substr(replace(new.id::text, '-', ''), 1, 8))
  )
  on conflict (id) do nothing;

  insert into public.trust_scores (profile_id)
  values (new.id)
  on conflict (profile_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.trust_scores enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.listings enable row level security;
alter table public.reviews enable row level security;
alter table public.service_videos enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.referrals enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.worker_live_locations enable row level security;
alter table public.instant_bookings enable row level security;
alter table public.booking_requests enable row level security;

create policy "Profiles are readable by authenticated users" on public.profiles for select to authenticated using (true);
create policy "Users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Trust scores are public to authenticated users" on public.trust_scores for select to authenticated using (true);
create policy "Admins manage trust scores" on public.trust_scores for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Worker profiles readable" on public.worker_profiles for select to authenticated using (true);
create policy "Workers manage own worker profile" on public.worker_profiles for all to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "Admins manage worker profiles" on public.worker_profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Business profiles readable" on public.business_profiles for select to authenticated using (true);
create policy "Business owners manage own profiles" on public.business_profiles for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Admins manage business profiles" on public.business_profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Listings readable" on public.listings for select to authenticated using (true);
create policy "Owners manage listings" on public.listings for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Admins manage listings" on public.listings for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Reviews readable" on public.reviews for select to authenticated using (true);
create policy "Users create reviews" on public.reviews for insert to authenticated with check (reviewer_id = auth.uid());
create policy "Reviewers update own reviews" on public.reviews for update to authenticated using (reviewer_id = auth.uid()) with check (reviewer_id = auth.uid());
create policy "Admins manage reviews" on public.reviews for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Service videos readable" on public.service_videos for select to authenticated using (status = 'active' or public.is_admin());
create policy "Workers create own service videos" on public.service_videos for insert to authenticated with check (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid())
);
create policy "Workers update own service videos" on public.service_videos for update to authenticated using (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid())
) with check (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid())
);
create policy "Admins manage service videos" on public.service_videos for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Users create reports" on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "Users read own reports" on public.reports for select to authenticated using (reporter_id = auth.uid() or public.is_admin());
create policy "Admins manage reports" on public.reports for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Users read own notifications" on public.notifications for select to authenticated using (profile_id = auth.uid());
create policy "Users update own notifications" on public.notifications for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "Admins create notifications" on public.notifications for insert to authenticated with check (public.is_admin());

create policy "Users read own referrals" on public.referrals for select to authenticated using (referrer_id = auth.uid() or referred_id = auth.uid() or public.is_admin());
create policy "Admins manage referrals" on public.referrals for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins read audit logs" on public.admin_audit_logs for select to authenticated using (public.is_admin());
create policy "Admins create audit logs" on public.admin_audit_logs for insert to authenticated with check (public.is_admin());

create policy "Online worker locations readable" on public.worker_live_locations for select to authenticated using (is_online = true or public.is_admin());
create policy "Workers manage own live location" on public.worker_live_locations for all to authenticated using (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid())
) with check (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid())
);
create policy "Admins manage live locations" on public.worker_live_locations for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Customers read own bookings" on public.instant_bookings for select to authenticated using (customer_id = auth.uid() or public.is_admin());
create policy "Customers create bookings" on public.instant_bookings for insert to authenticated with check (customer_id = auth.uid());
create policy "Workers read assigned bookings" on public.instant_bookings for select to authenticated using (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid())
);
create policy "Admins manage bookings" on public.instant_bookings for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Workers read their booking requests" on public.booking_requests for select to authenticated using (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid()) or public.is_admin()
);
create policy "Workers update their booking requests" on public.booking_requests for update to authenticated using (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid())
) with check (
  exists (select 1 from public.worker_profiles wp where wp.id = worker_profile_id and wp.profile_id = auth.uid())
);
create policy "Admins manage booking requests" on public.booking_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());
