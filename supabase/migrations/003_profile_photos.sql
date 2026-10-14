begin;

alter table public.learner_profiles add column if not exists avatar_path text;
alter table public.learner_profiles drop constraint if exists learner_profiles_avatar_path_check;
alter table public.learner_profiles add constraint learner_profiles_avatar_path_check
 check (avatar_path is null or avatar_path ~ ('^' || user_id::text || '/[a-zA-Z0-9-]+\.(jpg|png|webp)$'));
grant update (avatar_path) on public.learner_profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-photos', 'profile-photos', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
 allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists profile_photos_read_own on storage.objects;
create policy profile_photos_read_own on storage.objects for select to authenticated
 using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists profile_photos_insert_own on storage.objects;
create policy profile_photos_insert_own on storage.objects for insert to authenticated
 with check (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists profile_photos_delete_own on storage.objects;
create policy profile_photos_delete_own on storage.objects for delete to authenticated
 using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- learner_profiles is authoritative. Keep registration metadata consistent with edits.
create or replace function public.sync_learner_profile_metadata() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 update auth.users set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
  || jsonb_build_object('name', new.name, 'grade', new.grade, 'goal', new.goal, 'avatar_path', new.avatar_path)
 where id = new.user_id;
 return new;
end;
$$;
revoke all on function public.sync_learner_profile_metadata() from public;
drop trigger if exists sync_learner_profile_metadata on public.learner_profiles;
create trigger sync_learner_profile_metadata after update of name, grade, goal, avatar_path
 on public.learner_profiles for each row execute function public.sync_learner_profile_metadata();

update auth.users u set raw_user_meta_data = coalesce(u.raw_user_meta_data, '{}'::jsonb)
 || jsonb_build_object('name', p.name, 'grade', p.grade, 'goal', p.goal, 'avatar_path', p.avatar_path)
from public.learner_profiles p where p.user_id = u.id;

commit;
