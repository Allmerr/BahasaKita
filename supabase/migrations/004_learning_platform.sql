begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.user_roles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'student' check (role in ('student','admin'))
);
create table if not exists public.lessons (
 id uuid primary key default gen_random_uuid(), slug text not null,
 revision integer not null default 1 check (revision > 0),
 kind text not null check (kind in ('lesson','basic')),
 grade text not null check (grade in ('SD','SMP','SMA','ALL')),
 aspect text not null check (aspect in ('kosakata','kalimat','bacaan','akademik')),
 title text not null check (length(btrim(title)) between 1 and 160),
 data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
 status text not null default 'draft' check (status in ('draft','published','archived')),
 created_at timestamptz not null default now(), unique(slug,revision)
);
create unique index if not exists one_published_lesson on public.lessons(slug) where status='published';
create table if not exists public.questions (
 id uuid primary key default gen_random_uuid(), logical_key text not null,
 revision integer not null default 1 check (revision > 0),
 kind text not null check (kind in ('assessment','practice','quiz')),
 lesson_id uuid references public.lessons(id), grade text not null check (grade in ('SD','SMP','SMA')),
 aspect text not null check (aspect in ('kosakata','kalimat','bacaan','akademik')),
 slot text check (slot in ('first','advanced','remedial')), position integer not null default 0,
 format text not null default 'choice' check (format in ('choice','order')),
 prompt text not null check (length(btrim(prompt)) between 1 and 3000),
 options jsonb not null default '[]'::jsonb check (jsonb_typeof(options)='array'),
 data jsonb not null default '{}'::jsonb check (jsonb_typeof(data)='object'),
 status text not null default 'draft' check (status in ('draft','published','archived')),
 check ((kind='assessment' and lesson_id is null and slot is not null and format='choice') or (kind<>'assessment' and lesson_id is not null and slot is null)),
 check ((format='choice' and jsonb_array_length(options) between 2 and 6) or (format='order' and kind='practice')),
 unique(logical_key,revision)
);
create unique index if not exists one_published_assessment_question on public.questions(logical_key) where status='published' and kind='assessment';
create unique index if not exists one_question_position on public.questions(lesson_id,kind,position) where lesson_id is not null;
create table if not exists private.answer_keys (
 question_id uuid primary key references public.questions(id) on delete cascade,
 answer jsonb not null
);
create table if not exists public.learning_attempts (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check (kind in ('assessment','lesson')),
 grade text not null check (grade in ('SD','SMP','SMA')),
 lesson_id uuid references public.lessons(id), question_set jsonb not null,
 status text not null default 'active' check (status in ('active','completed','cancelled')),
 stage integer not null default 0 check (stage between 0 and 3),
 score numeric, scores jsonb, mastered boolean not null default false,
 started_at timestamptz not null default now(), completed_at timestamptz,
 check ((kind='assessment' and lesson_id is null) or (kind='lesson' and lesson_id is not null))
);
create unique index if not exists one_active_assessment on public.learning_attempts(user_id,grade) where kind='assessment' and status='active';
create unique index if not exists one_active_lesson on public.learning_attempts(user_id,lesson_id) where kind='lesson' and status='active';
create index if not exists attempt_owner_history on public.learning_attempts(user_id,grade,completed_at desc);
create table if not exists public.attempt_answers (
 id uuid primary key default gen_random_uuid(), attempt_id uuid not null references public.learning_attempts(id) on delete cascade,
 question_id uuid not null references public.questions(id), request_id uuid not null,
 answer jsonb, correct boolean not null, phase text not null check (phase in ('practice','graded')),
 seconds integer not null check (seconds between 0 and 86400), created_at timestamptz not null default clock_timestamp(),
 unique(attempt_id,request_id)
);
create unique index if not exists one_graded_answer on public.attempt_answers(attempt_id,question_id) where phase='graded';
create table if not exists public.lesson_progress (
 user_id uuid not null references auth.users(id) on delete cascade, lesson_id uuid not null references public.lessons(id),
 mastered boolean not null default false, best_score numeric not null default 0,
 updated_at timestamptz not null default now(), primary key(user_id,lesson_id)
);
create table if not exists public.learning_imports (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null, imported_at timestamptz not null default now()
);

create or replace function public.bk_is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.user_roles where user_id=(select auth.uid()) and role='admin');
$$;
create or replace function private.require_admin() returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.bk_is_admin() then raise exception 'Halaman ini hanya tersedia untuk admin.' using errcode='42501'; end if;
end;
$$;

alter table public.user_roles enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.learning_attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.learning_imports enable row level security;
revoke all on public.user_roles, public.lessons, public.questions, public.learning_attempts, public.attempt_answers, public.lesson_progress, public.learning_imports from anon, authenticated;
revoke all on private.answer_keys from public, anon, authenticated;
grant select on public.lessons, public.questions to anon, authenticated;
grant select on public.user_roles, public.learning_attempts, public.attempt_answers, public.lesson_progress, public.learning_imports to authenticated;
drop policy if exists own_role on public.user_roles;
create policy own_role on public.user_roles for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists published_lessons on public.lessons;
create policy published_lessons on public.lessons for select using(status='published' or (select public.bk_is_admin()));
drop policy if exists published_questions on public.questions;
create policy published_questions on public.questions for select using(status='published' or (select public.bk_is_admin()));
drop policy if exists own_attempts on public.learning_attempts;
create policy own_attempts on public.learning_attempts for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists own_answers on public.attempt_answers;
create policy own_answers on public.attempt_answers for select to authenticated using(exists(select 1 from public.learning_attempts a where a.id=attempt_id and a.user_id=(select auth.uid())));
drop policy if exists own_progress on public.lesson_progress;
create policy own_progress on public.lesson_progress for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists own_import on public.learning_imports;
create policy own_import on public.learning_imports for select to authenticated using(user_id=(select auth.uid()));

create or replace function private.immutable_content() returns trigger language plpgsql set search_path='' as $$
begin
 if old.status<>'draft' and (to_jsonb(new)-'status') is distinct from (to_jsonb(old)-'status') then
  raise exception 'Konten terbit tidak dapat ditimpa. Buat versi draft baru.';
 end if;
 return new;
end;
$$;
drop trigger if exists immutable_lesson on public.lessons;
create trigger immutable_lesson before update on public.lessons for each row execute function private.immutable_content();
drop trigger if exists immutable_question on public.questions;
create trigger immutable_question before update on public.questions for each row execute function private.immutable_content();
create or replace function private.immutable_key() returns trigger language plpgsql set search_path='' as $$
begin
 if exists(select 1 from public.questions where id=old.question_id and status<>'draft') then raise exception 'Kunci jawaban versi terbit tidak dapat diubah.'; end if;
 if tg_op='DELETE' then return old; end if;
 return new;
end;
$$;
drop trigger if exists immutable_answer_key on private.answer_keys;
create trigger immutable_answer_key before update or delete on private.answer_keys for each row execute function private.immutable_key();

create or replace function private.public_question(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('id',q.id,'version',q.revision,'prompt',q.prompt,'options',q.options,'aspect',q.aspect,'format',q.format,'slot',q.slot) || q.data
 from public.questions q where q.id=p_id;
$$;
create or replace function private.public_lesson(p_id uuid) returns jsonb language sql stable set search_path='' as $$
 select l.data || jsonb_build_object('id',l.slug,'versionId',l.id,'version',l.revision,'kind',l.kind,'grade',l.grade,'aspect',l.aspect,'title',l.title,
 'practice',(select private.public_question(q.id) from public.questions q where q.lesson_id=l.id and kind='practice' limit 1),
 'quiz',coalesce((select jsonb_agg(private.public_question(q.id) order by q.position) from public.questions q where q.lesson_id=l.id and kind='quiz'),'[]'::jsonb))
 from public.lessons l where l.id=p_id;
$$;
create or replace function public.bk_catalog() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('lessons',coalesce(jsonb_agg(private.public_lesson(id) order by grade,aspect,slug) filter(where kind='lesson'),'[]'::jsonb),
 'basicMaterials',coalesce(jsonb_agg(private.public_lesson(id) order by aspect,slug) filter(where kind='basic'),'[]'::jsonb))
 from public.lessons where status='published';
$$;

create or replace function private.current_question(p_attempt uuid) returns uuid language plpgsql stable set search_path='' as $$
declare a public.learning_attempts; n integer; aspect_name text; prior boolean;
begin
 select * into a from public.learning_attempts where id=p_attempt;
 if a.status<>'active' then return null; end if;
 select count(*) into n from public.attempt_answers where attempt_id=p_attempt and phase='graded';
 if a.kind='lesson' then return (a.question_set->'quiz'->>n)::uuid; end if;
 if n>=8 then return null; end if;
 aspect_name := (array['kosakata','kalimat','bacaan','akademik'])[n/2+1];
 if n%2=0 then return (a.question_set->aspect_name->>'first')::uuid; end if;
 select correct into prior from public.attempt_answers where attempt_id=p_attempt and phase='graded' order by created_at desc,id desc limit 1;
 return (a.question_set->aspect_name->>(case when prior then 'advanced' else 'remedial' end))::uuid;
end;
$$;
create or replace function private.attempt_view(p_attempt uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('id',a.id,'kind',a.kind,'grade',a.grade,'lesson',l.slug,'lessonVersion',a.lesson_id,'status',a.status,'stage',a.stage,'score',a.score,'scores',a.scores,'mastered',a.mastered,
 'answered',(select count(*) from public.attempt_answers where attempt_id=a.id and phase='graded'),
 'question',private.public_question(private.current_question(a.id)),
 'practice',private.public_question((a.question_set->>'practice')::uuid),
 'lessonContent',case when l.id is null then null else private.public_lesson(l.id) end,
 'answers',coalesce((select jsonb_agg(jsonb_build_object('questionId',r.question_id,'aspect',q.aspect,'correct',r.correct,'unknown',r.answer is null,'seconds',r.seconds) order by r.created_at,r.id) from public.attempt_answers r join public.questions q on q.id=r.question_id where r.attempt_id=a.id and phase='graded'),'[]'::jsonb))
 from public.learning_attempts a left join public.lessons l on l.id=a.lesson_id where a.id=p_attempt;
$$;

create or replace function public.bk_start_attempt(p_kind text,p_lesson text default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); g text; a public.learning_attempts; l public.lessons; plan jsonb; name text; item jsonb; n integer; baseline numeric;
begin
 if uid is null then raise exception 'Silakan masuk terlebih dahulu.' using errcode='42501'; end if;
 if p_kind not in ('assessment','lesson') then raise exception 'Jenis sesi tidak valid.'; end if;
 select grade into g from public.learner_profiles where user_id=uid;
 if g is null then raise exception 'Lengkapi profil belajarmu.'; end if;
 perform pg_advisory_xact_lock(hashtext(uid::text||':'||p_kind));
 if p_kind='assessment' then
  select * into a from public.learning_attempts where user_id=uid and kind='assessment' and grade=g and status='active';
  if found then return private.attempt_view(a.id); end if;
  plan := '{}'::jsonb;
  foreach name in array array['kosakata','kalimat','bacaan','akademik'] loop
   select jsonb_object_agg(slot,id),count(*) into item,n from public.questions where kind='assessment' and grade=g and aspect=name and status='published';
   if n<>3 or not (item ?& array['first','advanced','remedial']) then raise exception 'Bank asesmen belum lengkap untuk jenjangmu.'; end if;
   plan := plan||jsonb_build_object(name,item);
  end loop;
  insert into public.learning_attempts(user_id,kind,grade,question_set) values(uid,'assessment',g,plan) returning * into a;
 else
  select score into baseline from public.learning_attempts where user_id=uid and kind='assessment' and grade=g and status='completed' order by completed_at desc,id desc limit 1;
  if baseline is null or baseline<80 then raise exception 'Selesaikan asesmen dengan nilai minimal 80 sebelum membuka materi.' using errcode='42501'; end if;
  select a0.* into a from public.learning_attempts a0 join public.lessons l0 on l0.id=a0.lesson_id where a0.user_id=uid and a0.grade=g and l0.slug=p_lesson and a0.status='active' order by a0.started_at desc limit 1;
  if found then return private.attempt_view(a.id); end if;
  select * into l from public.lessons where slug=p_lesson and kind='lesson' and grade=g and status='published';
  if not found then raise exception 'Materi tidak tersedia untuk jenjangmu.'; end if;
  select * into a from public.learning_attempts where user_id=uid and lesson_id=l.id and status='active';
  if found then return private.attempt_view(a.id); end if;
  select jsonb_build_object('quiz',jsonb_agg(id order by position) filter(where kind='quiz'),'practice',(jsonb_agg(id) filter(where kind='practice'))->0),count(*) filter(where kind='quiz') into plan,n
   from public.questions where lesson_id=l.id and status='published';
  if n<>5 or plan->>'practice' is null then raise exception 'Materi belum memiliki latihan dan lima soal evaluasi.'; end if;
  insert into public.learning_attempts(user_id,kind,grade,lesson_id,question_set) values(uid,'lesson',g,l.id,plan) returning * into a;
 end if;
 return private.attempt_view(a.id);
end;
$$;

create or replace function private.grade_answer(p_question uuid,p_answer jsonb) returns boolean language plpgsql stable set search_path='' as $$
declare q public.questions; expected jsonb; value numeric;
begin
 select * into q from public.questions where id=p_question;
 select answer into expected from private.answer_keys where question_id=p_question;
 if expected is null then raise exception 'Kunci jawaban soal belum tersedia.'; end if;
 if p_answer is null or p_answer='null'::jsonb then return false; end if;
 if q.format='choice' then
  if jsonb_typeof(p_answer)<>'number' then raise exception 'Pilih salah satu jawaban yang tersedia.'; end if;
  value := (p_answer#>>'{}')::numeric;
  if value<>trunc(value) or value<0 or value>=jsonb_array_length(q.options) then raise exception 'Pilihan jawaban tidak valid.'; end if;
  return p_answer=expected;
 end if;
 if jsonb_typeof(p_answer)<>'string' or length(p_answer#>>'{}')>1000 then raise exception 'Susunan kata tidak valid.'; end if;
 return regexp_replace(btrim(p_answer#>>'{}'),'\s+',' ','g')=regexp_replace(btrim(expected#>>'{}'),'\s+',' ','g');
end;
$$;

create or replace function public.bk_answer(p_attempt uuid,p_question uuid,p_answer jsonb,p_request uuid,p_practice boolean default false) returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.learning_attempts; old_answer public.attempt_answers; correct_answer boolean; expected uuid; elapsed integer; n integer; total integer; result_score numeric; aspect_scores jsonb; repeated boolean:=false; previous uuid;
begin
 select * into a from public.learning_attempts where id=p_attempt and user_id=(select auth.uid()) for update;
 if not found then raise exception 'Sesi belajar tidak tersedia untuk akunmu.' using errcode='42501'; end if;
 select * into old_answer from public.attempt_answers where attempt_id=a.id and request_id=p_request;
 if found then
  if old_answer.question_id<>p_question or old_answer.answer is distinct from p_answer or (old_answer.phase='practice')<>p_practice then raise exception 'Permintaan jawaban sudah digunakan.'; end if;
  return private.attempt_view(a.id)||jsonb_build_object('feedback',jsonb_build_object('correct',old_answer.correct));
 end if;
 if a.status<>'active' then raise exception 'Sesi ini sudah selesai.'; end if;
 if p_practice then
  if a.kind<>'lesson' then raise exception 'Latihan ini tidak tersedia.'; end if;
  expected := (a.question_set->>'practice')::uuid;
 else expected := private.current_question(a.id); end if;
 if expected is null or expected<>p_question then raise exception 'Soal sudah berubah. Muat ulang sesi untuk melanjutkan.' using errcode='40001'; end if;
 correct_answer := private.grade_answer(p_question,p_answer);
 select least(86400,greatest(0,extract(epoch from clock_timestamp()-coalesce(max(created_at),a.started_at))::integer)) into elapsed from public.attempt_answers where attempt_id=a.id;
 insert into public.attempt_answers(attempt_id,question_id,request_id,answer,correct,phase,seconds)
 values(a.id,p_question,p_request,p_answer,correct_answer,case when p_practice then 'practice' else 'graded' end,elapsed);
 if not p_practice then
  select count(*) into n from public.attempt_answers where attempt_id=a.id and phase='graded';
  total := case when a.kind='assessment' then 8 else 5 end;
  if n=total then
   select round(100.0*count(*) filter(where correct)/total,2) into result_score from public.attempt_answers where attempt_id=a.id and phase='graded';
   select jsonb_object_agg(aspect,s) into aspect_scores from (select q.aspect,round(100.0*count(*) filter(where r.correct)/count(*)) s from public.attempt_answers r join public.questions q on q.id=r.question_id where r.attempt_id=a.id and phase='graded' group by q.aspect) t;
   if a.kind='lesson' then
    select id into previous from public.learning_attempts where user_id=a.user_id and lesson_id=a.lesson_id and status='completed' order by completed_at desc,id desc limit 1;
    select exists(select 1 from public.attempt_answers r join public.attempt_answers prior on prior.question_id=r.question_id and prior.attempt_id=previous and prior.phase='graded' where r.attempt_id=a.id and r.phase='graded' and not r.correct and not prior.correct) into repeated;
   end if;
   update public.learning_attempts set status='completed',completed_at=clock_timestamp(),score=result_score,scores=aspect_scores,mastered=(a.kind='lesson' and result_score>=80 and not repeated) where id=a.id returning * into a;
   if a.kind='lesson' then
    insert into public.lesson_progress(user_id,lesson_id,mastered,best_score) values(a.user_id,a.lesson_id,a.mastered,a.score)
    on conflict(user_id,lesson_id) do update set mastered=public.lesson_progress.mastered or excluded.mastered,best_score=greatest(public.lesson_progress.best_score,excluded.best_score),updated_at=now();
   end if;
  end if;
 end if;
 return private.attempt_view(a.id)||jsonb_build_object('feedback',jsonb_build_object('correct',correct_answer));
end;
$$;

create or replace function public.bk_set_stage(p_attempt uuid,p_stage integer) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if p_stage not between 0 and 3 then raise exception 'Tahap belajar tidak valid.'; end if;
 update public.learning_attempts set stage=p_stage where id=p_attempt and user_id=(select auth.uid()) and kind='lesson' and status='active';
 if not found then raise exception 'Sesi belajar tidak tersedia.' using errcode='42501'; end if;
 return private.attempt_view(p_attempt);
end;
$$;
create or replace function public.bk_get_attempt(p_attempt uuid) returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not exists(select 1 from public.learning_attempts where id=p_attempt and user_id=(select auth.uid())) then raise exception 'Sesi belajar tidak tersedia untuk akunmu.' using errcode='42501'; end if;
 return private.attempt_view(p_attempt);
end;
$$;
create or replace function public.bk_learning_state() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare uid uuid:=auth.uid(); g text; baseline public.learning_attempts; active public.learning_attempts; history jsonb; mastered_slugs jsonb; skills jsonb;
begin
 if uid is null then raise exception 'Silakan masuk terlebih dahulu.' using errcode='42501'; end if;
 select grade into g from public.learner_profiles where user_id=uid;
 select * into baseline from public.learning_attempts where user_id=uid and grade=g and kind='assessment' and status='completed' order by completed_at desc,id desc limit 1;
 select * into active from public.learning_attempts where user_id=uid and grade=g and kind='assessment' and status='active' order by started_at desc limit 1;
 skills := baseline.scores;
 if skills is not null then
  skills := skills||coalesce((select jsonb_object_agg(aspect,score) from (select distinct on (l.aspect) l.aspect,a.score from public.learning_attempts a join public.lessons l on l.id=a.lesson_id where a.user_id=uid and a.grade=g and a.status='completed' and a.completed_at>baseline.completed_at order by l.aspect,a.completed_at desc,a.id desc) t),'{}'::jsonb);
 end if;
 select coalesce(jsonb_agg(l.slug),'[]'::jsonb) into mastered_slugs from public.lesson_progress p join public.lessons l on l.id=p.lesson_id where p.user_id=uid and p.mastered and l.grade=g and l.status='published';
 select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'type',a.kind,'lesson',l.slug,'lessonVersion',a.lesson_id,'title',l.title,'aspect',l.aspect,'grade',a.grade,'score',a.score,'scores',a.scores,'mastered',a.mastered,'date',a.completed_at,
 'answers',private.attempt_view(a.id)->'answers') order by a.completed_at,a.id),'[]'::jsonb) into history from public.learning_attempts a left join public.lessons l on l.id=a.lesson_id where a.user_id=uid and a.status='completed';
 return jsonb_build_object('assessment',skills,'assessmentDraft',case when active.id is null then null else private.attempt_view(active.id)->'answers' end,'activeAssessment',case when active.id is null then null else private.attempt_view(active.id) end,'mastered',mastered_slugs,'attempts',history,
 'legacy',(select payload from public.learning_imports where user_id=uid));
end;
$$;
create or replace function public.bk_import_legacy(p_payload jsonb) returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Silakan masuk terlebih dahulu.' using errcode='42501'; end if;
 if jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>100000 then raise exception 'Arsip progres perangkat terlalu besar atau tidak valid.'; end if;
 insert into public.learning_imports(user_id,payload) values(auth.uid(),p_payload) on conflict(user_id) do nothing;
 return true;
end;
$$;

-- Administrative editing is installed in 004b; only these narrowly-scoped RPCs are executable.
revoke all on all functions in schema private from public,anon,authenticated;
revoke all on function public.bk_is_admin(),public.bk_catalog(),public.bk_start_attempt(text,text),public.bk_answer(uuid,uuid,jsonb,uuid,boolean),public.bk_set_stage(uuid,integer),public.bk_get_attempt(uuid),public.bk_learning_state(),public.bk_import_legacy(jsonb) from public,anon,authenticated;
grant execute on function public.bk_is_admin(),public.bk_catalog() to anon,authenticated;
grant execute on function public.bk_start_attempt(text,text),public.bk_answer(uuid,uuid,jsonb,uuid,boolean),public.bk_set_stage(uuid,integer),public.bk_get_attempt(uuid),public.bk_learning_state(),public.bk_import_legacy(jsonb) to authenticated;
commit;
