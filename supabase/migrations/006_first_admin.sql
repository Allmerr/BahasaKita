begin;
do $$
declare target uuid;
begin
 select id into target from auth.users where lower(email)=lower('kevinalmer@apps.ipb.ac.id');
 if target is null then raise exception 'Akun admin yang dipilih belum terdaftar. Daftarkan akun tersebut terlebih dahulu.'; end if;
 insert into public.user_roles(user_id,role) values(target,'admin') on conflict(user_id) do update set role='admin';
end;
$$;
commit;
