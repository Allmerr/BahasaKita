# Hubungkan BahasaKita ke Supabase

Profil siswa dan pengaturan akun tersimpan di `public.learner_profiles`. Foto profil tersimpan di bucket privat `profile-photos` pada Supabase Storage. Login/register memakai Supabase Auth. Asesmen dan progres belajar masih lokal per akun.

## 1. Isi koneksi proyek

Ambil Project URL dan publishable key dari panel **Connect** proyek Supabase. Isi `.env.local` di folder utama (`.env` yang sudah ada juga didukung):

```dotenv
VITE_SUPABASE_URL=https://PROJECT_ANDA.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Cukup dua nilai itu. Anon public lama juga didukung. Secret key dan service role tidak diperlukan untuk alur ini dan tidak boleh dipakai pada frontend. File `.env.local` dan `server/.env` diabaikan Git; nilai key tidak dicetak oleh helper.

Jalankan `npm run setup:supabase` dari folder utama. Helper membuat `server/.env` dengan URL dan public key yang sama jika file belum ada. File yang sudah ada tidak ditimpa; periksa kecocokannya lewat perintah pemeriksaan koneksi.

## 2. Siapkan tabel

Untuk proyek baru, jalankan migrasi 001, 002, lalu 003 melalui SQL Editor Supabase sesuai urutan:

1. `supabase/migrations/001_accounts.sql` membuat tabel profil dan RLS.
2. `supabase/migrations/002_learning_grades.sql` menambahkan dukungan SMP dan SMA. Jika database masih memakai 001, perubahan jenjang di luar SD akan ditolak dan seluruh perubahan profil pada permintaan itu tidak tersimpan.
3. `supabase/migrations/003_profile_photos.sql` menambahkan foto profil, bucket privat beserta kebijakan akses pemilik, dan sinkronisasi nama/jenjang/tujuan dari tabel profil ke metadata Auth. Migrasi 002 dan 003 dapat dijalankan kembali; jangan mengulang 001 pada database yang sudah dibuat.

`learner_profiles` adalah sumber data profil. Metadata Auth saat registrasi sebelumnya tidak otomatis berubah saat profil diedit; migrasi 003 menyinkronkan data yang sudah ada dan setiap perubahan berikutnya. Metadata lain, email, serta peran akun tetap dipertahankan. Jenjang yang didukung: SD, SMP, dan SMA.

Foto mendukung JPG/PNG/WebP, maksimal 2 MB. API memeriksa tipe dan signature berkas, memakai sesi pengguna untuk Storage/RLS, menyimpan path di `avatar_path`, dan menghasilkan URL foto yang berlaku satu jam. Aplikasi memperbarui URL selama sesi. Unggahan baru memakai nama unik; foto lama dibersihkan setelah penggantinya tersimpan. Gagal simpan tidak menghapus foto lama. Akun lain dan tamu tidak boleh membaca atau mengubah foto. Tidak diperlukan secret/service-role key.

Sebelum migrasi 003 diterapkan, login dan edit teks profil tetap dapat digunakan; upload menampilkan bahwa penyimpanan foto belum dikonfigurasi.

## 3. Periksa dan jalankan

```powershell
npm run check:supabase
```

Pemeriksaan membaca layanan Auth dan metadata akses tabel. Tidak membuat akun atau menulis data, dan belum membuktikan proses simpan profil berhasil. Konfigurasi frontend/server harus cocok.

Jalankan API di terminal pertama dengan `npm run dev:api`, lalu frontend di terminal kedua dengan `npm run dev`. Jika dependensi belum ada, jalankan `npm install` di folder utama, lalu jalankan `npm install` dari folder `server`. Restart keduanya setelah mengubah file env. Proxy Vite meneruskan `/api` ke port 3001.

## 4. Verifikasi penyimpanan asli

1. Aktifkan Email provider di Authentication. Atur Site URL dan Redirect URL ke `http://localhost:5173`; pertahankan konfirmasi email.
2. Register dari aplikasi, konfirmasi email jika diminta, lalu login.
3. Pada Pengaturan, ubah nama, jenjang, dan tujuan lalu tekan **Simpan profil**. Cocokkan ketiganya di halaman Profil, sidebar, dan tabel `learner_profiles`. Metadata nama/jenjang/tujuan di Auth juga diperbarui setelah migrasi 003.
4. Pilih foto, periksa pratinjau, lalu tekan **Simpan foto**. Periksa foto di header, sidebar, dan Profil. Refresh lalu logout/login untuk memastikan foto tetap tersimpan. **Hapus foto** mengembalikan avatar inisial tanpa menghapus nama/jenjang/tujuan.
5. Ubah tema lalu tekan **Simpan pengaturan akun**. Cocokkan `preferences` pada baris akun di `learner_profiles`.
6. Keluar akun untuk memastikan profil/foto tidak tampil sebagai milik tamu. Uji akun B tidak dapat membaca atau mengubah path foto akun A.

Jika profil gagal dimuat, periksa migrasi serta API server. Pemeriksaan online memerlukan proyek yang telah dikonfigurasi; build bukan bukti koneksi dan penulisan online berhasil.

## Pemeriksaan lokal

```powershell
npm run test:supabase-config
npm run build
npm --prefix server run build
npm --prefix server test
npm run test:profile
```

Tes API memakai client Supabase simulasi untuk memastikan pembatasan akun, penyimpanan tiga kolom, upload/ganti/hapus foto, penolakan berkas, serta penanganan kegagalan. Tes browser membutuhkan Playwright dan Chromium/Chrome; skrip mencari paket di proyek atau runtime Codex, dengan override `PLAYWRIGHT_MODULE_PATH` dan `CHROME_PATH` bila diperlukan. Tes browser memakai Auth/API simulasi, bukan akun asli. Migrasi, RLS, dan persistensi Storage online tetap perlu diverifikasi pada proyek Supabase yang sudah dikonfigurasi.

Untuk produksi, frontend dan `/api` dilayani pada origin HTTPS yang sama melalui reverse proxy. API memverifikasi JWT pengguna dan memakai RLS dengan sesi pengguna tersebut. Konfigurasikan URL callback dan SMTP produksi pada Supabase.
