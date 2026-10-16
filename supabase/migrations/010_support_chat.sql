begin;
create table if not exists public.support_messages (
 id bigint generated always as identity primary key,
 link_id uuid not null references public.support_links(id) on delete cascade,
 sender_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(length(btrim(body)) between 1 and 2000),
 request_id uuid not null,
 created_at timestamptz not null default clock_timestamp(),
 unique(sender_id,request_id)
);
create index if not exists support_messages_history on public.support_messages(link_id,id desc);
alter table public.support_messages enable row level security;
revoke all on public.support_messages from public,anon,authenticated;
revoke all on sequence public.support_messages_id_seq from public,anon,authenticated;

create or replace function private.require_chat_link(p_link uuid) returns void
language plpgsql security definer set search_path='' as $$
declare l public.support_links;
begin
 select * into l from public.support_links where id=p_link for share;
 if l.id is null or auth.uid() is null or auth.uid() not in (l.student_id,l.supporter_id)
 or not private.support_linked(l.student_id,l.supporter_id) then
  raise exception 'Percakapan tidak tersedia atau hubungan pendampingan telah berakhir.' using errcode='42501';
 end if;
end; $$;

create or replace function public.bk_chat_messages(p_link uuid,p_before bigint default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare messages jsonb; oldest bigint;
begin
 perform private.require_chat_link(p_link);
 select coalesce(jsonb_agg(to_jsonb(x) order by x.order_id),'[]'),min(x.order_id) into messages,oldest from (
  select id::text id,id order_id,sender_id,body,created_at from public.support_messages
  where link_id=p_link and (p_before is null or id<p_before) order by public.support_messages.id desc limit 50
 ) x;
 return jsonb_build_object('messages',messages,'hasOlder',exists(select 1 from public.support_messages where link_id=p_link and id<oldest));
end; $$;

create or replace function public.bk_chat_send(p_link uuid,p_body text,p_request uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare message public.support_messages;
begin
 perform private.require_chat_link(p_link);
 if p_body is null or length(btrim(p_body)) not between 1 and 2000 or p_request is null then raise exception 'Pesan harus berisi 1–2000 karakter.'; end if;
 insert into public.support_messages(link_id,sender_id,body,request_id) values(p_link,auth.uid(),btrim(p_body),p_request)
 on conflict(sender_id,request_id) do nothing returning * into message;
 if message.id is null then
  select * into message from public.support_messages where sender_id=auth.uid() and request_id=p_request;
  if message.link_id<>p_link or message.body<>btrim(p_body) then raise exception 'ID pengiriman sudah digunakan untuk pesan lain.' using errcode='23505'; end if;
 end if;
 return jsonb_build_object('id',message.id::text,'sender_id',message.sender_id,'body',message.body,'created_at',message.created_at);
end; $$;
revoke all on function private.require_chat_link(uuid) from public,anon,authenticated;
revoke all on function public.bk_chat_messages(uuid,bigint),public.bk_chat_send(uuid,text,uuid) from public,anon;
grant execute on function public.bk_chat_messages(uuid,bigint),public.bk_chat_send(uuid,text,uuid) to authenticated;
commit;
