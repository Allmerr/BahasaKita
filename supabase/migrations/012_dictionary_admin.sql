begin;
create table if not exists public.dictionary_entries (
 grade text not null check (grade in ('SD','SMP','SMA')),
 word_key text not null check (length(word_key) between 1 and 100),
 word text not null check (length(trim(word)) between 1 and 100),
 emoji text not null default '📖',
 category text not null check (length(trim(category)) between 1 and 80),
 meaning text not null check (length(trim(meaning)) between 1 and 1000),
 example text not null check (length(trim(example)) between 1 and 1000),
 video_kind text not null default 'none' check (video_kind in ('none','youtube','hosted')),
 video_id text,
 video_url text,
 video_title text,
 video_start integer not null default 0 check (video_start between 0 and 86400),
 source_url text check (source_url is null or source_url ~ '^https://'),
 hidden boolean not null default false,
 updated_at timestamptz not null default now(),
 primary key (grade,word_key),
 constraint dictionary_video_check check (
  (video_kind='none' and video_id is null and video_url is null)
  or (video_kind='youtube' and video_id ~ '^[A-Za-z0-9_-]{11}$' and video_url is null)
  or (video_kind='hosted' and video_id is null and video_url ~ '^https://balaibahasajatim[.]kemendikdasmen[.]go[.]id/storage/videos/[A-Za-z0-9_-]+[.]mp4$')
 )
);
alter table public.dictionary_entries enable row level security;
drop policy if exists dictionary_read on public.dictionary_entries;
create policy dictionary_read on public.dictionary_entries for select to anon,authenticated using (true);
drop policy if exists dictionary_admin_insert on public.dictionary_entries;
create policy dictionary_admin_insert on public.dictionary_entries for insert to authenticated with check (public.bk_is_admin());
drop policy if exists dictionary_admin_update on public.dictionary_entries;
create policy dictionary_admin_update on public.dictionary_entries for update to authenticated using (public.bk_is_admin()) with check (public.bk_is_admin());
drop policy if exists dictionary_admin_delete on public.dictionary_entries;
create policy dictionary_admin_delete on public.dictionary_entries for delete to authenticated using (public.bk_is_admin());
revoke all on public.dictionary_entries from public,anon,authenticated;
grant select on public.dictionary_entries to anon,authenticated;
grant insert,update,delete on public.dictionary_entries to authenticated;
commit;
