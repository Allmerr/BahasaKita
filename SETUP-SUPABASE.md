# Hubungkan BahasaKita ke Supabase

Profil siswa dan pengaturan akun tersimpan di `public.learner_profiles`. Foto profil tersimpan di bucket privat `profile-photos` pada Supabase Storage. Login/register memakai Supabase Auth. Materi, soal, jawaban, asesmen, dan progres belajar tersimpan di database. Penilaian dilakukan oleh fungsi PostgreSQL dengan sesi pemilik akun.

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

## 3. Aktifkan platform belajar dan admin

Setelah migrasi 001–003, pastikan akun `kevinalmer@apps.ipb.ac.id` sudah terdaftar di Authentication. Jalankan seluruh isi `supabase/DEPLOY-LEARNING.sql` di SQL Editor sebagai satu skrip. Skrip ini membuat tabel dan fungsi belajar, mengisi 12 materi, 4 kelas dasar, serta 108 soal awal, lalu memberikan akses admin kepada akun tersebut. Seluruh perubahan berada dalam satu transaksi; kesalahan membatalkan transaksi. Skrip bisa dijalankan kembali dan mempertahankan versi konten yang diedit admin.

Alternatif: jalankan `004_learning_platform.sql`, `004b_admin_content.sql`, `005_learning_seed.sql`, kemudian `006_first_admin.sql` berurutan. Pada fork untuk proyek lain, ganti email bootstrap pada 006 dan jalankan `npm run seed:learning` untuk menyusun ulang skrip gabungan. File `content/legacy-*.js` hanya sumber seed; tidak dikirim sebagai bank soal pada bundle frontend.

Masuk dengan akun admin lalu buka **Kelola konten** atau `/admin`. Admin bisa membuat dan mengedit materi belajar, teks/video kelas dasar, serta soal asesmen. **Simpan draft** mempertahankan versi terbit. **Terbitkan** mengganti versi yang tersedia untuk sesi baru. Materi memerlukan satu latihan dan lima soal evaluasi; bank asesmen memiliki soal awal, lanjutan, dan penguatan untuk setiap aspek/jenjang. Sesi aktif selalu memakai snapshot versi semula, termasuk kunci penilaiannya. Penguasaan terikat versi: materi yang diperbarui perlu dikuasai kembali.

`user_roles` hanya dapat diubah melalui SQL pengelola database. Nama, metadata Auth, dan kiriman browser tidak dapat menaikkan peran. RLS membatasi riwayat/jawaban ke pemilik akun. Kunci jawaban berada di `private.answer_keys`; siswa hanya menerima teks dan pilihan. API dan fungsi database sama-sama memeriksa peran. Nilai, waktu jawaban, dan penguasaan dihitung server. Tidak perlu service-role key.

Arsip dari `bahasakita-learning-USER_ID` akan diimpor satu kali ke `learning_imports`. Versi lama hanya menyimpan tanda benar/salah, sehingga nilainya tidak dapat dinilai ulang. Arsip dipertahankan, tetapi siswa perlu asesmen online untuk membuka materi. Menghapus cache perangkat tidak menghapus progres online.

## 4. Periksa dan jalankan

```powershell
npm run check:supabase
```

Pemeriksaan membaca layanan Auth dan metadata akses tabel. Tidak membuat akun atau menulis data, dan belum membuktikan proses simpan profil berhasil. Konfigurasi frontend/server harus cocok.

Jalankan API di terminal pertama dengan `npm run dev:api`, lalu frontend di terminal kedua dengan `npm run dev`. Jika dependensi belum ada, jalankan `npm install` di folder utama, lalu jalankan `npm install` dari folder `server`. Restart keduanya setelah mengubah file env. Proxy Vite meneruskan `/api` ke port 3001.

## 5. Verifikasi penyimpanan asli

1. Aktifkan Email provider di Authentication. Atur Site URL dan Redirect URL ke `http://localhost:5173`; pertahankan konfirmasi email.
2. Register dari aplikasi, konfirmasi email jika diminta, lalu login.
3. Pada Pengaturan, ubah nama, jenjang, dan tujuan lalu tekan **Simpan profil**. Cocokkan ketiganya di halaman Profil, sidebar, dan tabel `learner_profiles`. Metadata nama/jenjang/tujuan di Auth juga diperbarui setelah migrasi 003.
4. Pilih foto, periksa pratinjau, lalu tekan **Simpan foto**. Periksa foto di header, sidebar, dan Profil. Refresh lalu logout/login untuk memastikan foto tetap tersimpan. **Hapus foto** mengembalikan avatar inisial tanpa menghapus nama/jenjang/tujuan.
5. Ubah tema lalu tekan **Simpan pengaturan akun**. Cocokkan `preferences` pada baris akun di `learner_profiles`.
6. Selesaikan asesmen; periksa `learning_attempts` dan `attempt_answers`. Jeda setelah beberapa soal, lalu refresh/login di perangkat lain: nomor soal harus berlanjut. Selesaikan materi; periksa `lesson_progress`. Profil SD/SMP/SMA mempunyai progres terpisah.
7. Dengan akun admin, simpan perubahan sebagai draft lalu terbitkan. Akun siswa tidak boleh mendapat akses `/api/v1/me/admin/content` maupun kunci jawaban.
8. Keluar akun untuk memastikan profil/foto tidak tampil sebagai milik tamu. Uji akun B tidak dapat membaca atau mengubah path foto akun A.

Jika profil gagal dimuat, periksa migrasi serta API server. Pemeriksaan online memerlukan proyek yang telah dikonfigurasi; build bukan bukti koneksi dan penulisan online berhasil.

## Pemeriksaan lokal

```powershell
npm run test:supabase-config
npm run build
npm --prefix server run build
npm --prefix server test
npm run test:profile
node scripts/check-learning.mjs
npm run test:learning
```

Tes platform belajar menjalankan migrasi sebenarnya pada PostgreSQL lokal melalui PGlite, termasuk RLS, penilaian, cabang adaptif, kepemilikan sesi, idempotensi, versi konten, dan publikasi admin. Tes browser belajar memakai Express sebenarnya dan database PGlite; hanya Auth menggunakan sesi uji. Tes profil/API memakai client Supabase simulasi untuk memastikan pembatasan akun, penyimpanan tiga kolom, upload/ganti/hapus foto, penolakan berkas, serta penanganan kegagalan. Tes browser membutuhkan Playwright dan Chromium/Chrome; skrip mencari paket di proyek atau runtime Codex, dengan override `PLAYWRIGHT_MODULE_PATH` dan `CHROME_PATH` bila diperlukan. Seluruh tes browser memakai akun uji dan tidak menulis ke proyek cloud. Penerapan migrasi dan persistensi pada layanan Supabase, serta Storage online, tetap perlu diverifikasi pada proyek Supabase yang sudah dikonfigurasi.

Untuk produksi, frontend dan `/api` dilayani pada origin HTTPS yang sama melalui reverse proxy. API memverifikasi JWT pengguna dan memakai RLS dengan sesi pengguna tersebut. Konfigurasikan URL callback dan SMTP produksi pada Supabase.
