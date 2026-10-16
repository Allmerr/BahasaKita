begin;
create or replace function public.bk_admin_users(p_search text default '', p_page integer default 1) returns jsonb
language plpgsql security definer set search_path='' as $$
declare result jsonb; total bigint;
begin
 perform private.require_admin();
 if p_page < 1 or length(p_search)>100 then raise exception 'Filter tidak valid.'; end if;
 select count(*) into total from auth.users u join public.learner_profiles p on p.user_id=u.id where p.name ilike '%'||p_search||'%' or u.email ilike '%'||p_search||'%';
 select coalesce(jsonb_agg(to_jsonb(x)),'[]') into result from (
 select u.id,u.email,p.name,p.grade,p.goal,coalesce(r.role,'student') role,u.created_at,u.last_sign_in_at,
 coalesce((u.raw_user_meta_data->>'demo_seed')='bahasakita-v1',false) demo
 from auth.users u join public.learner_profiles p on p.user_id=u.id left join public.user_roles r on r.user_id=u.id
 where p.name ilike '%'||p_search||'%' or u.email ilike '%'||p_search||'%'
 order by u.created_at desc,u.id limit 20 offset (p_page-1)*20
 ) x;
 return jsonb_build_object('users',result,'total',total);
end; $$;
create or replace function public.bk_admin_edit_user(p_id uuid,p_name text,p_grade text,p_goal text,p_role text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare target_email text;
begin
 perform private.require_admin();
 select u.email into target_email from auth.users u join public.learner_profiles p on p.user_id=u.id where u.id=p_id for update of p;
 if target_email is null then raise exception 'Akun tidak ditemukan.'; end if;
 perform public.bk_admin_set_support_role(target_email,p_role);
 update public.learner_profiles set name=p_name,grade=p_grade,goal=p_goal where user_id=p_id;
 return jsonb_build_object('updated',true);
end; $$;
revoke all on function public.bk_admin_users(text,integer),public.bk_admin_edit_user(uuid,text,text,text,text) from public,anon;
grant execute on function public.bk_admin_users(text,integer),public.bk_admin_edit_user(uuid,text,text,text,text) to authenticated;
commit;
