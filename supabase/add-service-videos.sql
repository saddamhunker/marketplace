create table if not exists public.service_videos (
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

alter table public.service_videos enable row level security;

drop policy if exists "Service videos readable" on public.service_videos;
drop policy if exists "Workers create own service videos" on public.service_videos;
drop policy if exists "Workers update own service videos" on public.service_videos;
drop policy if exists "Admins manage service videos" on public.service_videos;

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('service-videos', 'service-videos', true, 52428800, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Service videos public read" on storage.objects;
drop policy if exists "Workers upload service videos" on storage.objects;

create policy "Service videos public read" on storage.objects for select to public using (bucket_id = 'service-videos');
create policy "Workers upload service videos" on storage.objects for insert to authenticated with check (
  bucket_id = 'service-videos' and owner = auth.uid()
);
