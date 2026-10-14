# Setup akun online BahasaKita

1. Buat proyek Supabase. Jalankan `supabase/migrations/001_accounts.sql` sekali melalui SQL Editor pada proyek baru (atau migrasi CLI). Migrasi membuat profil otomatis dan RLS pemilik akun.
2. Aktifkan Email provider di Authentication. Pertahankan konfirmasi email. Atur Site URL dan Redirect URLs ke `http://localhost:5173` saat pengembangan, lalu domain HTTPS produksi. Konfigurasikan SMTP untuk pengiriman produksi.
3. Salin `.env.example` menjadi `.env.local` di root; isi URL proyek dan publishable key dari Supabase. Jangan gunakan secret/service-role key di frontend.
4. Salin `server/.env.example` menjadi `server/.env`; isi URL dan publishable key proyek yang sama.
5. Di folder `server`, jalankan `npm install` lalu `npm run dev`. Di root, jalankan `npm install` lalu `npm run dev`.
6. Daftar akun SD, buka tautan konfirmasi email, lalu login. Profil dan pengaturan akun disimpan melalui Express. Pengaturan tamu tersimpan di perangkat; pengguna login perlu menekan Simpan pengaturan akun.

## Verifikasi online

- Buat akun A dan B. Ubah nama/tujuan/pengaturan A; reload dan login pada browser lain untuk memeriksa sinkronisasi.
- Keluar A; profil dan progres A tidak muncul sebagai tamu atau akun B.
- Tanpa token, GET/PATCH `/api/v1/me` harus mengembalikan 401; token palsu juga 401.
- Dengan token A, akses baris B melalui Supabase REST harus tidak mengembalikan data; UPDATE B tidak mengubah baris. INSERT/DELETE profil oleh client ditolak.
- Register saat konfirmasi email aktif menampilkan petunjuk konfirmasi, bukan menganggap akun sudah login.
- Kamus dan pengaturan aksesibilitas dapat dioperasikan tanpa login.

## Batas tahap ini

Asesmen/progres belajar masih prototipe lokal per user ID, belum dinilai server. Data login/progres lama tidak otomatis diimpor. Hapus progres lokal tidak menghapus akun online. Belum ada reset password atau penghapusan akun online. Role guru tidak dibuat.

Produksi: layani frontend dan `/api` pada origin HTTPS yang sama menggunakan reverse proxy (proxy Vite hanya untuk development). API saat ini bind localhost untuk reverse proxy. Sesuaikan callback Supabase dan deployment. JWT diverifikasi dengan `getUser`; koneksi database menggunakan JWT siswa agar RLS tetap berlaku. Jangan menaruh token di log.

Tes lokal: `npm run build` di root; `npm run build` dan `npm test` di server. Tes isolasi RLS dan email membutuhkan proyek Supabase yang dikonfigurasi; build bukan bukti tes online berhasil.
