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

Masuk dengan akun admin: aplikasi langsung membuka **Kelola konten** di `/admin`, tanpa wajib asesmen. Tombol **Lihat sebagai siswa** membuka pratinjau terpisah. Pratinjau memakai konten terbit dan penilaian server, tetapi seluruh nilai/progres/profil uji disimpan sementara, tanpa menulis ke tabel siswa atau Storage. Akhiri dengan **Kembali ke admin**. Tidak diperlukan migrasi tambahan untuk mode ini. Admin bisa membuat dan mengedit materi belajar, teks/video kelas dasar, serta soal asesmen. **Simpan draft** mempertahankan versi terbit. **Terbitkan** mengganti versi yang tersedia untuk sesi baru. Materi memerlukan satu latihan dan lima soal evaluasi; bank asesmen memiliki soal awal, lanjutan, dan penguatan untuk setiap aspek/jenjang. Sesi aktif selalu memakai snapshot versi semula, termasuk kunci penilaiannya. Penguasaan terikat versi: materi yang diperbarui perlu dikuasai kembali.

`user_roles` tidak dapat ditulis langsung oleh pengguna. Role admin hanya diberikan lewat SQL pengelola database. Setelah migrasi 007, akun baru dapat memilih siswa/guru/orang tua; admin dapat mengubah ketiga peran tersebut melalui Akun pendamping. Metadata dan kiriman browser tidak dapat memberi role admin. RLS membatasi riwayat/jawaban ke pemilik akun. Kunci jawaban berada di `private.answer_keys`; siswa hanya menerima teks dan pilihan. API dan fungsi database sama-sama memeriksa peran. Nilai, waktu jawaban, dan penguasaan dihitung server. Tidak perlu service-role key.

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

## Dashboard guru dan orang tua

Setelah migrasi 001–006, jalankan seluruh [007_support_dashboards.sql](supabase/migrations/007_support_dashboards.sql) di SQL Editor Supabase. Migrasi dapat dijalankan ulang dan tidak mengubah nilai atau konten yang sudah ada. Reload aplikasi sesudah berhasil. Sebelum migrasi terpasang, login dan fitur lama tetap tersedia; menu pendampingan belum muncul.

Akun baru memilih **Daftar sebagai** siswa, guru, atau orang tua. Untuk akun yang sudah terdaftar, admin membuka **Akun pendamping**, mengisi email dan peran, lalu menyimpan. Pengguna perlu reload. Peran admin tidak dapat dibuat/diubah lewat formulir ini. Hubungan pendampingan aktif harus diputuskan sebelum peran diganti.

1. Siswa membuka **Pendamping**, memilih guru/orang tua, lalu membuat kode.
2. Bagikan kode kepada pendamping yang dikenal. Kode berlaku 24 jam dan hanya untuk satu akun dengan peran yang sesuai. Membuat kode baru membatalkan kode lama untuk jenis pendamping tersebut. Kode tidak disimpan dalam bentuk teks asli di database dan hanya ditampilkan saat dibuat.
3. Guru/orang tua login langsung ke dashboard, lalu memasukkan kode. Hanya siswa terhubung yang terlihat.
4. Guru memilih materi terbit sesuai jenjang, memberi tugas/penguatan dengan tenggat opsional, dan menulis catatan. Catatan/tugas dibaca siswa dan pendamping terhubung. Guru hanya dapat menarik tugas/menghapus catatannya sendiri. Orang tua mendapat ringkasan dan saran aktivitas di rumah, tanpa kontrol pemberian tugas/catatan atau perubahan nilai.
5. Siswa melihat **Tugas dari guru** dan **Catatan guru** di Pendamping. Status tugas otomatis selesai setelah evaluasi materi dikuasai sejak tugas diberikan. Prasyarat asesmen dan kelas dasar tetap berlaku. Tombol Perbarui tugas/progres mengambil hasil terbaru.
6. Siswa maupun pendamping dapat memutuskan hubungan. Akses progres serta tampilan tugas/catatan guru tersebut langsung dihentikan. Untuk menghubungkan kembali, siswa perlu membuat undangan baru. Riwayat belajar asli tetap tersimpan.

Dashboard memuat empat aspek, materi dikuasai, nilai asesmen dan aktivitas terbaru. Guru juga melihat ringkasan jawaban salah per aspek; ini belum diagnosis penyebab kesalahan. Saran kegiatan orang tua memakai panduan sederhana berdasarkan aspek yang perlu dilatih. Versi awal menggunakan daftar siswa; pengelolaan kelas, chat, dan notifikasi otomatis belum termasuk.

Verifikasi dengan akun siswa/guru/orang tua terpisah. Pastikan akun pendamping lain tidak dapat mengakses siswa tanpa undangan, orang tua tidak dapat membuat tugas/catatan melalui API, dan setelah hubungan diputus endpoint progres mengembalikan 403. Tes otomatis melakukan skenario ini pada database lokal, tanpa memakai akun cloud.

## Hapus akun permanen
Isi SUPABASE_SERVICE_ROLE_KEY hanya di server/.env, lalu restart API. Jangan gunakan awalan VITE_ untuk secret ini. DELETE /api/v1/me/account memverifikasi pengguna dan konfirmasi HAPUS AKUN; ID akun berasal dari token. Foto dibersihkan lewat Storage API, lalu Auth admin menghapus akun; foreign key cascade menghapus profil dan data belajar. Bila penghapusan Auth gagal setelah foto dibersihkan, ulangi permintaan. Uji online menggunakan akun percobaan, bukan akun utama.

## Tabel pengguna admin dan akun demo
Jalankan migrasi 009_admin_users.sql setelah migrasi sebelumnya. Halaman /admin/accounts menyediakan tabel, cari nama/email, pagination 20 akun, detail, edit profil/peran non-admin, dan hapus permanen. Perubahan peran ditolak jika hubungan pendamping aktif. Email ditampilkan read-only; admin tidak dapat dipromosikan/dihapus dari tabel. Hapus memakai SUPABASE_SERVICE_ROLE_KEY khusus backend.

Dari folder server: npm run seed:demo menampilkan rencana 24 akun demo. npm run seed:demo -- --apply membuat akun online dengan password acak dan email terkonfirmasi. Domain .example khusus data simulasi; akun tersebut tidak dapat menerima email pemulihan. Akun yang sudah ada dilewati tanpa reset password. Kredensial baru ditulis ke demo-credentials-*.local.json yang diabaikan Git. Data meliputi variasi SD/SMP/SMA, nama, tujuan, dan preferensi; progres/nilai palsu tidak dimasukkan ke hasil asesmen. Gunakan proyek pengujian untuk demo.

## Chat pendamping dan tabel murid
Jalankan migrasi 010_support_chat.sql setelah migrasi 007, lalu restart API. Murid membuka Pendamping > Buka chat; guru/orang tua membuka dashboard pendamping, mencari murid di tabel lalu memilih Progres & chat. Hanya pasangan murid-pendamping yang terhubung dapat membaca/mengirim pesan. Hubungan yang diputus menutup akses chat; jika pasangan terhubung lagi, riwayat lama tersedia kembali. Percakapan antarpendamping tetap terpisah.

Pesan teks maksimum 2000 karakter, diperbarui setiap 5 detik, riwayat 50 pesan per halaman dengan Muat pesan sebelumnya. Tidak ada lampiran, panggilan, notifikasi push, maupun status sudah dibaca pada versi ini. Pesan tersimpan di database dan tidak memakai enkripsi end-to-end. Penghapusan akun/link secara permanen menghapus pesan melalui cascade. Pengiriman ulang dengan request ID sama tidak menggandakan pesan.

Uji online dengan dua akun yang sudah dihubungkan: kirim bolak-balik, pindah murid, coba dari akun tak terkait, lalu putuskan hubungan. Tes SQL lokal tersedia di server/src/chat.test.ts.
# Pengelolaan Kamus Visual

Jalankan `supabase/migrations/012_dictionary_admin.sql` di SQL Editor Supabase setelah migrasi sebelumnya. Admin lalu dapat membuka **Kelola kamus** di sidebar untuk menambah, mengedit, menyembunyikan, atau menghapus kosakata. Kamus siswa membaca perubahan dari Supabase saat halaman dimuat. Kata bawaan tetap tersedia bila tabel belum dibuat, dengan pesan kesalahan sinkronisasi. Video YouTube dapat memakai ID atau URL; video MP4 langsung dibatasi pada sumber Balai Bahasa Jawa Timur.

