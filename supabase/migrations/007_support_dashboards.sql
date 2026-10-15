begin;

alter table public.user_roles drop constraint if exists user_roles_role_check;
alter table public.user_roles add constraint user_roles_role_check check(role in ('student','admin','teacher','parent'));

create table if not exists public.support_links (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references auth.users(id) on delete cascade,
 supporter_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('teacher','parent')),
 created_at timestamptz not null default now(), revoked_at timestamptz,
 check(student_id<>supporter_id), unique(student_id,supporter_id)
);
create table if not exists public.support_invites (
 id uuid primary key default gen_random_uuid(), student_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('teacher','parent')), code_hash text not null unique,
 created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '24 hours',
 used_by uuid references auth.users(id) on delete set null, used_at timestamptz, revoked_at timestamptz
);
create table if not exists public.support_assignments (
 id uuid primary key default gen_random_uuid(), teacher_id uuid not null references auth.users(id) on delete cascade,
 student_id uuid not null references auth.users(id) on delete cascade,
 lesson_id uuid not null references public.lessons(id),
 title text not null check(length(btrim(title)) between 1 and 160),
 instructions text not null default '' check(length(instructions)<=2000), due_at timestamptz,
 created_at timestamptz not null default now(), withdrawn_at timestamptz,
 request_id uuid not null, unique(teacher_id,request_id)
);
create table if not exists public.support_notes (
 id uuid primary key default gen_random_uuid(), teacher_id uuid not null references auth.users(id) on delete cascade,
 student_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(length(btrim(body)) between 1 and 2000),
 created_at timestamptz not null default now(), request_id uuid not null, unique(teacher_id,request_id)
);
create index if not exists support_roster on public.support_links(supporter_id,created_at) where revoked_at is null;
create index if not exists support_student_tasks on public.support_assignments(student_id,created_at desc);
create index if not exists support_student_notes on public.support_notes(student_id,created_at desc);
create index if not exists support_student_invites on public.support_invites(student_id,created_at desc);

alter table public.support_links enable row level security;
alter table public.support_invites enable row level security;
alter table public.support_assignments enable row level security;
alter table public.support_notes enable row level security;
revoke all on public.support_links,public.support_invites,public.support_assignments,public.support_notes from public,anon,authenticated;
-- Reads and writes go through the scoped RPCs below. In particular, invite hashes are never public.

create or replace function public.bk_support_role() returns text language sql stable security definer set search_path='' as $$
 select coalesce((select role from public.user_roles where user_id=auth.uid()),'student');
$$;
create or replace function private.support_linked(p_student uuid,p_supporter uuid,p_kind text default null) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.support_links l
 where l.student_id=p_student and l.supporter_id=p_supporter and l.revoked_at is null
 and (p_kind is null or l.kind=p_kind)
 and coalesce((select role from public.user_roles where user_id=l.student_id),'student')='student'
 and (select role from public.user_roles where user_id=l.supporter_id)=l.kind);
$$;
create or replace function private.require_support_student(p_student uuid,p_teacher boolean default false) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not private.support_linked(p_student,auth.uid(),case when p_teacher then 'teacher' else null end) then
  raise exception 'Siswa ini belum terhubung dengan akunmu.' using errcode='42501';
 end if;
 -- Serialize writes with unlinking, so a revoked relationship cannot receive a new task/note.
 perform 1 from public.support_links where student_id=p_student and supporter_id=auth.uid() and revoked_at is null for share;
 if not found then raise exception 'Hubungan pendampingan sudah berakhir.' using errcode='42501'; end if;
end;
$$;

create or replace function private.create_support_role() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.user_roles(user_id,role) values(new.id,
  case when new.raw_user_meta_data->>'role' in ('teacher','parent') then new.raw_user_meta_data->>'role' else 'student' end)
 on conflict(user_id) do nothing;
 return new;
end;
$$;
drop trigger if exists create_support_role_after_signup on auth.users;
create trigger create_support_role_after_signup after insert on auth.users for each row execute function private.create_support_role();

create or replace function public.bk_admin_set_support_role(p_email text,p_role text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare target uuid; existing_role text;
begin
 perform private.require_admin();
 if p_role is null or p_role not in ('student','teacher','parent') then raise exception 'Pilih peran siswa, guru, atau orang tua.'; end if;
 select id into target from auth.users where lower(email)=lower(btrim(p_email));
 if target is null then raise exception 'Akun belum ditemukan. Minta pengguna mendaftar terlebih dahulu.'; end if;
 -- Lock the profile to serialize role changes with invitation/link creation.
 perform 1 from public.learner_profiles where user_id=target for update;
 select coalesce((select role from public.user_roles where user_id=target),'student') into existing_role;
 if existing_role='admin' then raise exception 'Peran admin tidak dapat diubah melalui halaman ini.' using errcode='42501'; end if;
 if existing_role<>p_role and exists(select 1 from public.support_links where (student_id=target or supporter_id=target) and revoked_at is null) then
  raise exception 'Putuskan hubungan pendampingan aktif sebelum mengganti peran akun.';
 end if;
 insert into public.user_roles(user_id,role) values(target,p_role) on conflict(user_id) do update set role=excluded.role;
 update public.support_invites set revoked_at=now() where student_id=target and revoked_at is null and used_at is null and existing_role<>p_role;
 return jsonb_build_object('name',(select name from public.learner_profiles where user_id=target),'role',p_role);
end;
$$;

create or replace function public.bk_create_support_invite(p_kind text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare code text:=upper(replace(gen_random_uuid()::text,'-','')); result public.support_invites;
begin
 perform 1 from public.learner_profiles where user_id=auth.uid() for update;
 if auth.uid() is null or public.bk_support_role()<>'student' then raise exception 'Undangan hanya dapat dibuat oleh siswa.' using errcode='42501'; end if;
 if p_kind is null or p_kind not in ('teacher','parent') then raise exception 'Pilih pendamping guru atau orang tua.'; end if;
 update public.support_invites set revoked_at=now() where student_id=auth.uid() and kind=p_kind and used_at is null and revoked_at is null;
 insert into public.support_invites(student_id,kind,code_hash) values(auth.uid(),p_kind,encode(sha256(convert_to(code,'UTF8')),'hex')) returning * into result;
 return jsonb_build_object('id',result.id,'kind',result.kind,'code',code,'expiresAt',result.expires_at);
end;
$$;
create or replace function public.bk_redeem_support_invite(p_code text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare invitation public.support_invites; link_id uuid; r text; code text:=upper(regexp_replace(p_code,'[[:space:]-]','','g'));
begin
 r:=public.bk_support_role();
 if auth.uid() is null or r not in ('teacher','parent') then raise exception 'Masuk menggunakan akun guru atau orang tua.' using errcode='42501'; end if;
 if code is null or code!~'^[A-F0-9]{32}$' then raise exception 'Kode undangan tidak valid atau sudah kedaluwarsa.'; end if;
 select * into invitation from public.support_invites where code_hash=encode(sha256(convert_to(code,'UTF8')),'hex');
 if invitation.id is null then raise exception 'Kode undangan tidak valid atau sudah kedaluwarsa.'; end if;
 perform 1 from public.learner_profiles where user_id in (auth.uid(),invitation.student_id) order by user_id for update;
 select * into invitation from public.support_invites where id=invitation.id for update;
 r:=public.bk_support_role();
 if r not in ('teacher','parent') then raise exception 'Peran pendamping sudah berubah. Muat ulang halaman.' using errcode='42501'; end if;
 if invitation.id is null or invitation.used_at is not null or invitation.revoked_at is not null or invitation.expires_at<=now() then raise exception 'Kode undangan tidak valid atau sudah kedaluwarsa.'; end if;
 if invitation.kind<>r then raise exception 'Kode ini ditujukan untuk peran pendamping yang berbeda.'; end if;
 if coalesce((select role from public.user_roles where user_id=invitation.student_id),'student')<>'student' then raise exception 'Undangan ini sudah tidak tersedia.'; end if;
 insert into public.support_links(student_id,supporter_id,kind) values(invitation.student_id,auth.uid(),r)
 on conflict(student_id,supporter_id) do update set kind=excluded.kind,revoked_at=null,created_at=now() returning id into link_id;
 update public.support_invites set used_at=now(),used_by=auth.uid() where id=invitation.id;
 return jsonb_build_object('id',link_id,'name',(select name from public.learner_profiles where user_id=invitation.student_id));
end;
$$;
create or replace function public.bk_revoke_support_invite(p_id uuid) returns boolean
language plpgsql security definer set search_path='' as $$
begin
 update public.support_invites set revoked_at=now() where id=p_id and student_id=auth.uid() and used_at is null;
 if not found then raise exception 'Undangan ini tidak tersedia.' using errcode='42501'; end if;
 return true;
end;
$$;
create or replace function public.bk_unlink_support(p_id uuid) returns boolean
language plpgsql security definer set search_path='' as $$
begin
 update public.support_links set revoked_at=now() where id=p_id and (student_id=auth.uid() or supporter_id=auth.uid()) and revoked_at is null;
 if not found then raise exception 'Hubungan pendampingan ini tidak tersedia.' using errcode='42501'; end if;
 return true;
end;
$$;

create or replace function private.support_summary(p_student uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare g text; baseline public.learning_attempts; skills jsonb; mastered_count integer; lesson_count integer;
begin
 select grade into g from public.learner_profiles where user_id=p_student;
 select * into baseline from public.learning_attempts where user_id=p_student and grade=g and kind='assessment' and status='completed' order by completed_at desc,id desc limit 1;
 skills:=baseline.scores;
 if skills is not null then
  skills:=skills||coalesce((select jsonb_object_agg(aspect,score) from (
   select distinct on(l.aspect) l.aspect,a.score from public.learning_attempts a join public.lessons l on l.id=a.lesson_id
   where a.user_id=p_student and a.grade=g and a.status='completed' and a.completed_at>baseline.completed_at
   order by l.aspect,a.completed_at desc,a.id desc) s),'{}'::jsonb);
 end if;
 select count(*) into lesson_count from public.lessons where status='published' and kind='lesson' and grade=g;
 select count(*) into mastered_count from public.lesson_progress p join public.lessons l on l.id=p.lesson_id
  where p.user_id=p_student and p.mastered and l.grade=g and l.status='published';
 return jsonb_build_object('id',p_student,'name',(select name from public.learner_profiles where user_id=p_student),'grade',g,
  'goal',(select goal from public.learner_profiles where user_id=p_student),'scores',skills,'assessmentScore',baseline.score,
  'mastered',mastered_count,'totalLessons',lesson_count,
  'lastActivity',(select max(completed_at) from public.learning_attempts where user_id=p_student and grade=g and status='completed'));
end;
$$;
create or replace function private.support_tasks(p_student uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'teacherId',a.teacher_id,'teacherName',p.name,'title',a.title,'instructions',a.instructions,
  'lesson',l.slug,'lessonTitle',l.title,'grade',l.grade,'createdAt',a.created_at,'dueAt',a.due_at,
  'available',exists(select 1 from public.lessons c where c.slug=l.slug and c.grade=l.grade and c.status='published'),
  'completedAt',(select min(t.completed_at) from public.learning_attempts t join public.lessons m on m.id=t.lesson_id
   where t.user_id=p_student and t.status='completed' and t.mastered and t.completed_at>=a.created_at and m.slug=l.slug and m.grade=l.grade))
  order by a.created_at desc,a.id),'[]'::jsonb)
 from public.support_assignments a join public.lessons l on l.id=a.lesson_id join public.learner_profiles p on p.user_id=a.teacher_id
 where a.student_id=p_student and a.withdrawn_at is null and private.support_linked(p_student,a.teacher_id,'teacher');
$$;
create or replace function private.support_feedback(p_student uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',n.id,'teacherId',n.teacher_id,'teacherName',p.name,'body',n.body,'createdAt',n.created_at) order by n.created_at desc,n.id),'[]'::jsonb)
 from (select * from public.support_notes where student_id=p_student and private.support_linked(p_student,teacher_id,'teacher') order by created_at desc,id limit 100) n
 join public.learner_profiles p on p.user_id=n.teacher_id;
$$;
create or replace function public.bk_support_dashboard() returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if auth.uid() is null or public.bk_support_role() not in ('teacher','parent') then raise exception 'Dashboard ini untuk guru atau orang tua.' using errcode='42501'; end if;
 return jsonb_build_object('role',public.bk_support_role(),'students',coalesce((select jsonb_agg(private.support_summary(student_id)||jsonb_build_object('linkId',id) order by created_at desc,id)
  from public.support_links where supporter_id=auth.uid() and private.support_linked(student_id,auth.uid())),'[]'::jsonb));
end;
$$;
create or replace function public.bk_support_student(p_student uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform private.require_support_student(p_student);
 return private.support_summary(p_student)||jsonb_build_object('assignments',private.support_tasks(p_student),'notes',private.support_feedback(p_student),
 'history',coalesce((select jsonb_agg(to_jsonb(h) order by h.date desc,h.id) from (
  select a.id,a.kind as type,l.title,a.score,a.mastered,a.completed_at as date,
   coalesce((select sum(seconds) from public.attempt_answers where attempt_id=a.id and phase='graded'),0) as seconds
  from public.learning_attempts a left join public.lessons l on l.id=a.lesson_id
  where a.user_id=p_student and a.grade=(select grade from public.learner_profiles where user_id=p_student) and a.status='completed'
  order by a.completed_at desc,a.id limit 20) h),'[]'::jsonb),
 'difficulties',coalesce((select jsonb_agg(to_jsonb(d)) from (
  select q.aspect,count(*) filter(where not r.correct) as incorrect,count(*) as total
  from public.attempt_answers r join public.learning_attempts a on a.id=r.attempt_id join public.questions q on q.id=r.question_id
  where a.user_id=p_student and a.grade=(select grade from public.learner_profiles where user_id=p_student) and a.status='completed' and r.phase='graded'
  group by q.aspect) d),'[]'::jsonb));
end;
$$;
create or replace function public.bk_student_support() returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if auth.uid() is null or public.bk_support_role()<>'student' then raise exception 'Halaman ini untuk siswa.' using errcode='42501'; end if;
 return jsonb_build_object('links',coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'name',p.name,'role',l.kind) order by l.created_at desc,l.id)
  from public.support_links l join public.learner_profiles p on p.user_id=l.supporter_id where l.student_id=auth.uid() and private.support_linked(auth.uid(),l.supporter_id)),'[]'::jsonb),
 'invites',coalesce((select jsonb_agg(jsonb_build_object('id',id,'kind',kind,'expiresAt',expires_at) order by created_at desc)
  from public.support_invites where student_id=auth.uid() and revoked_at is null and used_at is null and expires_at>now()),'[]'::jsonb),
 'assignments',private.support_tasks(auth.uid()),'notes',private.support_feedback(auth.uid()));
end;
$$;

create or replace function public.bk_assign_support_lesson(p_student uuid,p_lesson uuid,p_title text,p_instructions text,p_due timestamptz,p_request uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare lesson public.lessons; result uuid; prior public.support_assignments;
begin
 perform private.require_support_student(p_student,true);
 if p_request is null then raise exception 'Permintaan tugas belum valid.'; end if;
 select * into prior from public.support_assignments where teacher_id=auth.uid() and request_id=p_request;
 if prior.id is not null then
  if prior.student_id<>p_student or prior.lesson_id<>p_lesson or prior.title is distinct from btrim(p_title) or prior.instructions is distinct from coalesce(btrim(p_instructions),'') or prior.due_at is distinct from p_due then raise exception 'Permintaan tugas berbeda. Muat ulang halaman.'; end if;
  return prior.id;
 end if;
 select * into lesson from public.lessons where id=p_lesson and kind='lesson' and status='published';
 if lesson.id is null or lesson.grade<>(select grade from public.learner_profiles where user_id=p_student) then raise exception 'Pilih materi terbit yang sesuai jenjang siswa.'; end if;
 if p_title is null or length(btrim(p_title)) not between 1 and 160 or length(coalesce(p_instructions,''))>2000 then raise exception 'Isi judul dan arahan tugas yang sesuai.'; end if;
 if p_due is not null and p_due<=now() then raise exception 'Tenggat tugas harus berada di masa depan.'; end if;
 if (select count(*) from public.support_assignments where student_id=p_student and withdrawn_at is null)>199 then raise exception 'Batas tugas siswa tercapai. Tarik tugas lama terlebih dahulu.'; end if;
 insert into public.support_assignments(teacher_id,student_id,lesson_id,title,instructions,due_at,request_id)
 values(auth.uid(),p_student,p_lesson,btrim(p_title),coalesce(btrim(p_instructions),''),p_due,p_request) returning id into result;
 return result;
end;
$$;
create or replace function public.bk_withdraw_support_assignment(p_id uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare student uuid;
begin
 select student_id into student from public.support_assignments where id=p_id and teacher_id=auth.uid();
 perform private.require_support_student(student,true);
 update public.support_assignments set withdrawn_at=now() where id=p_id and teacher_id=auth.uid();
 return true;
end;
$$;
create or replace function public.bk_add_support_note(p_student uuid,p_body text,p_request uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid; prior public.support_notes;
begin
 perform private.require_support_student(p_student,true);
 if p_body is null or length(btrim(p_body)) not between 1 and 2000 or p_request is null then raise exception 'Isi catatan antara 1–2000 karakter.'; end if;
 select * into prior from public.support_notes where teacher_id=auth.uid() and request_id=p_request;
 if prior.id is not null then
  if prior.student_id<>p_student or prior.body<>btrim(p_body) then raise exception 'Permintaan catatan berbeda. Muat ulang halaman.'; end if;
  return prior.id;
 end if;
 insert into public.support_notes(teacher_id,student_id,body,request_id) values(auth.uid(),p_student,btrim(p_body),p_request) returning id into result;
 return result;
end;
$$;
create or replace function public.bk_delete_support_note(p_id uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare student uuid;
begin
 select student_id into student from public.support_notes where id=p_id and teacher_id=auth.uid();
 perform private.require_support_student(student,true);
 delete from public.support_notes where id=p_id and teacher_id=auth.uid();
 return true;
end;
$$;

revoke all on all functions in schema private from public,anon,authenticated;
revoke all on function public.bk_support_role(),public.bk_admin_set_support_role(text,text),public.bk_create_support_invite(text),public.bk_redeem_support_invite(text),public.bk_revoke_support_invite(uuid),public.bk_unlink_support(uuid),public.bk_support_dashboard(),public.bk_support_student(uuid),public.bk_student_support(),public.bk_assign_support_lesson(uuid,uuid,text,text,timestamptz,uuid),public.bk_withdraw_support_assignment(uuid),public.bk_add_support_note(uuid,text,uuid),public.bk_delete_support_note(uuid) from public,anon,authenticated;
grant execute on function public.bk_support_role(),public.bk_admin_set_support_role(text,text),public.bk_create_support_invite(text),public.bk_redeem_support_invite(text),public.bk_revoke_support_invite(uuid),public.bk_unlink_support(uuid),public.bk_support_dashboard(),public.bk_support_student(uuid),public.bk_student_support(),public.bk_assign_support_lesson(uuid,uuid,text,text,timestamptz,uuid),public.bk_withdraw_support_assignment(uuid),public.bk_add_support_note(uuid,text,uuid),public.bk_delete_support_note(uuid) to authenticated;
notify pgrst,'reload schema';
commit;
