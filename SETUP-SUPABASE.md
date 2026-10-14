# Hubungkan BahasaKita ke Supabase

Tahap awal menyimpan **profil siswa dan pengaturan akun** ke tabel `public.learner_profiles`. Login/register memakai Supabase Auth. Asesmen dan progres belajar masih lokal per akun.

## 1. Isi koneksi proyek

Ambil Project URL dan publishable key dari panel **Connect** proyek Supabase. Isi `.env.local` di folder utama:

```dotenv
VITE_SUPABASE_URL=https://PROJECT_ANDA.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Cukup dua nilai itu. Anon public lama juga didukung. Secret key dan service role tidak diperlukan untuk alur ini dan tidak boleh dipakai pada frontend. File `.env.local` dan `server/.env` diabaikan Git; nilai key tidak dicetak oleh helper.

Jalankan `npm run setup:supabase` dari folder utama. Helper membuat `server/.env` dengan URL dan public key yang sama jika file belum ada. File yang sudah ada tidak ditimpa; periksa kecocokannya lewat perintah pemeriksaan koneksi.

## 2. Siapkan tabel

Untuk proyek baru, jalankan `supabase/migrations/001_accounts.sql`, lalu `supabase/migrations/002_learning_grades.sql` melalui SQL Editor Supabase sesuai urutan. Jika 001 sudah pernah dijalankan, cukup jalankan 002 untuk menambahkan dukungan SMP dan SMA.

Migrasi membuat tabel profil, RLS untuk pemilik akun, serta trigger profil setelah register. Akun yang sudah ada juga memperoleh baris profil. Kolom menyimpan nama, jenjang, tujuan, dan pengaturan. Jenjang yang didukung: SD, SMP, dan SMA. Pilihan jenjang saat register disimpan oleh trigger dan dapat diubah melalui Pengaturan.

## 3. Periksa dan jalankan

```powershell
npm run check:supabase
```

Pemeriksaan membaca layanan Auth dan metadata akses tabel. Tidak membuat akun atau menulis data, dan belum membuktikan proses simpan profil berhasil. Konfigurasi frontend/server harus cocok.

Jalankan API di terminal pertama dengan `npm run dev:api`, lalu frontend di terminal kedua dengan `npm run dev`. Jika dependensi belum ada, jalankan `npm install` di folder utama, lalu jalankan `npm install` dari folder `server`. Restart keduanya setelah mengubah file env. Proxy Vite meneruskan `/api` ke port 3001.

## 4. Verifikasi penyimpanan asli

1. Aktifkan Email provider di Authentication. Atur Site URL dan Redirect URL ke `http://localhost:5173`; pertahankan konfirmasi email.
2. Register dari aplikasi, konfirmasi email jika diminta, lalu login.
3. Pada Pengaturan, ubah nama dan tekan **Simpan profil**. Ubah tema lalu tekan **Simpan pengaturan akun**.
4. Buka Table Editor di Supabase dan cocokkan kolom `name` serta `preferences` pada baris akun di `learner_profiles`.
5. Refresh aplikasi untuk memastikan data dimuat dari database. Keluar akun untuk memastikan profil tidak tampil sebagai milik tamu.

Jika profil gagal dimuat, periksa migrasi serta API server. Pemeriksaan online memerlukan proyek yang telah dikonfigurasi; build bukan bukti koneksi dan penulisan online berhasil.

## Pemeriksaan lokal

```powershell
npm run test:supabase-config
npm run build
npm --prefix server run build
npm --prefix server test
```

Untuk produksi, frontend dan `/api` dilayani pada origin HTTPS yang sama melalui reverse proxy. API memverifikasi JWT pengguna dan memakai RLS dengan sesi pengguna tersebut. Konfigurasikan URL callback dan SMTP produksi pada Supabase.
