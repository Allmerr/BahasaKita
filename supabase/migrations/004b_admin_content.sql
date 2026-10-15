begin;
create or replace function private.validate_question(p jsonb,p_order boolean default false) returns void language plpgsql set search_path='' as $$
declare value jsonb; n integer; answer numeric;
begin
 if coalesce(jsonb_typeof(p),'')<>'object' or coalesce(length(btrim(p->>'prompt')),0) not between 1 and 3000 then raise exception 'Isi pertanyaan belum valid.'; end if;
 if p_order and jsonb_typeof(p->'words')='array' then
  if jsonb_array_length(p->'words') not between 2 and 12 or coalesce(jsonb_typeof(p->'answer'),'')<>'string' or coalesce(length(p->>'answer'),0) not between 1 and 1000 then raise exception 'Latihan susun kata belum lengkap.'; end if;
  for value in select jsonb_array_elements(p->'words') loop if coalesce(jsonb_typeof(value),'')<>'string' or length(value#>>'{}') not between 1 and 100 then raise exception 'Kata latihan tidak valid.'; end if; end loop;
 else
  if coalesce(jsonb_typeof(p->'options'),'')<>'array' or coalesce(jsonb_typeof(p->'answer'),'')<>'number' then raise exception 'Isi pilihan dan kunci jawaban.'; end if;
  n:=jsonb_array_length(p->'options'); answer:=(p->>'answer')::numeric;
  if n not between 2 and 6 or answer<>trunc(answer) or answer<0 or answer>=n then raise exception 'Kunci jawaban tidak sesuai pilihan.'; end if;
  for value in select jsonb_array_elements(p->'options') loop if coalesce(jsonb_typeof(value),'')<>'string' or coalesce(length(btrim(value#>>'{}')),0) not between 1 and 1000 then raise exception 'Pilihan jawaban tidak valid.'; end if; end loop;
 end if;
end;
$$;

create or replace function public.bk_admin_content() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare materials jsonb; bank jsonb;
begin
 perform private.require_admin();
 select coalesce(jsonb_agg(to_jsonb(l)||jsonb_build_object('questions',coalesce((select jsonb_agg(to_jsonb(q)||jsonb_build_object('answer',k.answer) order by q.kind,q.position) from public.questions q join private.answer_keys k on k.question_id=q.id where q.lesson_id=l.id),'[]'::jsonb)) order by l.slug,l.revision desc),'[]'::jsonb) into materials from public.lessons l;
 select coalesce(jsonb_agg(to_jsonb(q)||jsonb_build_object('answer',k.answer) order by q.grade,q.aspect,q.slot,q.revision desc),'[]'::jsonb) into bank from public.questions q join private.answer_keys k on k.question_id=q.id where q.kind='assessment';
 return jsonb_build_object('lessons',materials,'questions',bank);
end;
$$;
create or replace function public.bk_admin_save_question(p_source uuid,p_payload jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare source public.questions; target public.questions; key text; revision_number integer;
begin
 perform private.require_admin(); perform private.validate_question(p_payload);
 if p_payload->>'grade' not in ('SD','SMP','SMA') or p_payload->>'aspect' not in ('kosakata','kalimat','bacaan','akademik') or p_payload->>'slot' not in ('first','advanced','remedial') then raise exception 'Pilih jenjang, aspek, dan jenis soal.'; end if;
 key:='assessment-'||lower(p_payload->>'grade')||'-'||(p_payload->>'aspect')||'-'||(p_payload->>'slot');
 perform pg_advisory_xact_lock(hashtext(key));
 if p_source is not null then
  select * into source from public.questions where id=p_source and kind='assessment';
  if not found or source.logical_key<>key then raise exception 'Kategori soal versi ini tidak dapat dipindahkan.'; end if;
 end if;
 select * into target from public.questions where logical_key=key and status='draft' order by revision desc limit 1;
 if not found then
  select coalesce(max(revision),0)+1 into revision_number from public.questions where logical_key=key;
  insert into public.questions(logical_key,revision,kind,grade,aspect,slot,prompt,options,data)
  values(key,revision_number,'assessment',p_payload->>'grade',p_payload->>'aspect',p_payload->>'slot',btrim(p_payload->>'prompt'),p_payload->'options',jsonb_build_object('visual',coalesce(p_payload->>'visual',''))) returning * into target;
 else
  update public.questions set prompt=btrim(p_payload->>'prompt'),options=p_payload->'options',data=jsonb_build_object('visual',coalesce(p_payload->>'visual','')) where id=target.id returning * into target;
 end if;
 insert into private.answer_keys(question_id,answer) values(target.id,p_payload->'answer') on conflict(question_id) do update set answer=excluded.answer;
 return target.id;
end;
$$;

create or replace function public.bk_admin_save_lesson(p_source uuid,p_payload jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare source public.lessons; target public.lessons; slug_name text; revision_number integer; q jsonb; qid uuid; index integer:=0; body jsonb; value jsonb;
begin
 perform private.require_admin();
 if coalesce(jsonb_typeof(p_payload),'')<>'object' or octet_length(p_payload::text)>80000 or coalesce(length(btrim(p_payload->>'title')),0) not between 1 and 160 or p_payload->>'kind' not in ('lesson','basic') or p_payload->>'aspect' not in ('kosakata','kalimat','bacaan','akademik') then raise exception 'Isi judul, jenis, dan aspek materi dengan benar.'; end if;
 if p_payload->>'kind'='lesson' and p_payload->>'grade' not in ('SD','SMP','SMA') then raise exception 'Pilih jenjang materi.'; end if;
 body:=p_payload->'data';
 if coalesce(jsonb_typeof(body),'')<>'object' or body ?| array['quiz','practice','correct','answer'] then raise exception 'Isi materi belum valid.'; end if;
 if p_payload->>'kind'='lesson' then
  if coalesce(length(body->>'intro'),0) not between 1 and 6000 or coalesce(length(body->>'explanation'),0) not between 1 and 12000 then raise exception 'Isi pengantar dan penjelasan materi.'; end if;
  perform private.validate_question(p_payload->'practice',true);
  if coalesce(jsonb_typeof(p_payload->'quiz'),'')<>'array' or jsonb_array_length(p_payload->'quiz')<>5 then raise exception 'Materi perlu lima soal evaluasi.'; end if;
  for q in select jsonb_array_elements(p_payload->'quiz') loop perform private.validate_question(q); end loop;
  if coalesce(body->'wordEntry'->>'videoId','') !~ '^[a-zA-Z0-9_-]{11}$' then raise exception 'Isi video YouTube pendukung yang valid.'; end if;
 else
  if coalesce(jsonb_typeof(body->'slides'),'')<>'array' or jsonb_array_length(body->'slides') not between 1 and 20 or coalesce(body->>'videoSrc','') !~ '^(https://|/videos/)' then raise exception 'Isi video dan bagian penjelasan kelas dasar.'; end if;
  for q in select jsonb_array_elements(body->'slides') loop
   if coalesce(jsonb_typeof(q),'')<>'array' or jsonb_array_length(q) not between 2 and 10 then raise exception 'Setiap bagian kelas dasar perlu judul dan penjelasan.'; end if;
   for value in select jsonb_array_elements(q) loop if coalesce(jsonb_typeof(value),'')<>'string' or length(value#>>'{}') not between 1 and 3000 then raise exception 'Teks kelas dasar tidak valid.'; end if; end loop;
  end loop;
 end if;
 if p_source is not null then select * into source from public.lessons where id=p_source; if not found then raise exception 'Materi sumber tidak ditemukan.'; end if; slug_name:=source.slug;
 else slug_name:=p_payload->>'slug'; end if;
 if slug_name is null or slug_name !~ '^[a-z0-9][a-z0-9-]{2,99}$' then raise exception 'Alamat materi perlu 3–100 huruf kecil, angka, atau tanda hubung.'; end if;
 perform pg_advisory_xact_lock(hashtext(slug_name));
 select * into target from public.lessons where slug=slug_name and status='draft' order by revision desc limit 1;
 if not found then
  select coalesce(max(revision),0)+1 into revision_number from public.lessons where slug=slug_name;
  if p_source is null and revision_number>1 then raise exception 'Alamat materi sudah digunakan. Edit materi yang sudah ada.'; end if;
  insert into public.lessons(slug,revision,kind,grade,aspect,title,data) values(slug_name,revision_number,p_payload->>'kind',case when p_payload->>'kind'='basic' then 'ALL' else p_payload->>'grade' end,p_payload->>'aspect',btrim(p_payload->>'title'),body) returning * into target;
 else
  update public.lessons set kind=p_payload->>'kind',grade=case when p_payload->>'kind'='basic' then 'ALL' else p_payload->>'grade' end,aspect=p_payload->>'aspect',title=btrim(p_payload->>'title'),data=body where id=target.id returning * into target;
  delete from public.questions where lesson_id=target.id;
 end if;
 if target.kind='lesson' then
  q:=p_payload->'practice';
  insert into public.questions(logical_key,revision,kind,lesson_id,grade,aspect,format,prompt,options,data)
   values(slug_name||'-practice',target.revision,'practice',target.id,target.grade,target.aspect,case when q ? 'words' then 'order' else 'choice' end,q->>'prompt',coalesce(q->'options','[]'::jsonb),q-array['prompt','options','answer']) returning id into qid;
  insert into private.answer_keys values(qid,q->'answer');
  for q in select jsonb_array_elements(p_payload->'quiz') loop
   insert into public.questions(logical_key,revision,kind,lesson_id,grade,aspect,position,prompt,options,data)
    values(slug_name||'-quiz-'||index,target.revision,'quiz',target.id,target.grade,target.aspect,index,q->>'prompt',q->'options',q-array['prompt','options','answer']) returning id into qid;
   insert into private.answer_keys values(qid,q->'answer'); index:=index+1;
  end loop;
 end if;
 return target.id;
end;
$$;

create or replace function public.bk_admin_publish(p_kind text,p_id uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare l public.lessons; q public.questions; n integer;
begin
 perform private.require_admin();
 if p_kind='question' then
  select * into q from public.questions where id=p_id and kind='assessment' and status='draft' for update;
  if not found then raise exception 'Pilih draft soal yang akan diterbitkan.'; end if;
  perform pg_advisory_xact_lock(hashtext(q.logical_key));
  if not exists(select 1 from private.answer_keys where question_id=q.id) then raise exception 'Kunci jawaban belum lengkap.'; end if;
  update public.questions set status='archived' where logical_key=q.logical_key and status='published';
  update public.questions set status='published' where id=q.id;
 elsif p_kind='lesson' then
  select * into l from public.lessons where id=p_id and status='draft' for update;
  if not found then raise exception 'Pilih draft materi yang akan diterbitkan.'; end if;
  perform pg_advisory_xact_lock(hashtext(l.slug));
  if l.kind='lesson' then
   select count(*) into n from public.questions question_row join private.answer_keys k on k.question_id=question_row.id where question_row.lesson_id=l.id;
   if n<>6 then raise exception 'Latihan atau evaluasi belum lengkap.'; end if;
  end if;
  update public.lessons set status='archived' where slug=l.slug and status='published';
  update public.questions set status='archived' where lesson_id in(select id from public.lessons where slug=l.slug and status='archived');
  update public.lessons set status='published' where id=l.id;
  update public.questions set status='published' where lesson_id=l.id;
 else raise exception 'Jenis konten tidak valid.'; end if;
 return true;
end;
$$;
revoke all on all functions in schema private from public,anon,authenticated;
revoke all on function public.bk_admin_content(),public.bk_admin_save_question(uuid,jsonb),public.bk_admin_save_lesson(uuid,jsonb),public.bk_admin_publish(text,uuid) from public,anon,authenticated;
grant execute on function public.bk_admin_content(),public.bk_admin_save_question(uuid,jsonb),public.bk_admin_save_lesson(uuid,jsonb),public.bk_admin_publish(text,uuid) to authenticated;
commit;
