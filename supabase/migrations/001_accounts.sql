begin;
create table public.learner_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 name text not null check (length(trim(name)) between 1 and 30),
 grade text not null default 'SD' check (grade = 'SD'),
 goal text not null default 'Mengenal kata' check (goal in ('Mengenal kata', 'Memahami cerita', 'Belajar matematika')),
 preferences jsonb not null default '{"textSize":"normal","theme":"light","speed":"1","comfortable":false,"contrast":false,"language":"default","dataSaver":false}'::jsonb,
 created_at timestamptz not null default now()
);
alter table public.learner_profiles enable row level security;
revoke all on public.learner_profiles from anon, authenticated;
grant select on public.learner_profiles to authenticated;
grant update (name, grade, goal, preferences) on public.learner_profiles to authenticated;
create policy own_profile_read on public.learner_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy own_profile_update on public.learner_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create function public.create_learner_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.learner_profiles(user_id, name, grade, goal)
 values (new.id, coalesce(nullif(left(trim(new.raw_user_meta_data->>'name'),30),''),'Teman belajar'), 'SD',
 case when new.raw_user_meta_data->>'goal' in ('Mengenal kata','Memahami cerita','Belajar matematika') then new.raw_user_meta_data->>'goal' else 'Mengenal kata' end);
 return new;
end;
$$;
revoke all on function public.create_learner_profile() from public;
create trigger create_learner_after_signup after insert on auth.users for each row execute function public.create_learner_profile();
insert into public.learner_profiles(user_id,name) select id,'Teman belajar' from auth.users on conflict do nothing;
commit;
