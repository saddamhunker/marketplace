alter table public.instant_bookings
  add column if not exists problem_description text,
  add column if not exists urgency text not null default 'Urgent',
  add column if not exists media_label text;
