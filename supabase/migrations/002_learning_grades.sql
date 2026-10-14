begin;

alter table public.learner_profiles drop constraint if exists learner_profiles_grade_check;
alter table public.learner_profiles add constraint learner_profiles_grade_check
 check (grade in ('SD', 'SMP', 'SMA'));

create or replace function public.create_learner_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.learner_profiles(user_id, name, grade, goal)
 values (
  new.id,
  coalesce(nullif(left(trim(new.raw_user_meta_data->>'name'),30),''),'Teman belajar'),
  case when new.raw_user_meta_data->>'grade' in ('SD','SMP','SMA')
   then new.raw_user_meta_data->>'grade' else 'SD' end,
  case when new.raw_user_meta_data->>'goal' in ('Mengenal kata','Memahami cerita','Belajar matematika')
   then new.raw_user_meta_data->>'goal' else 'Mengenal kata' end
 );
 return new;
end;
$$;

revoke all on function public.create_learner_profile() from public;
commit;
