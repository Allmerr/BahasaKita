# Pengujian BahasaKita

Gunakan Node.js 22.12+ atau Node.js 24+, lalu jalankan `npm ci` dan `npm --prefix server ci`. Tes memakai kredensial palsu, mock, dan PostgreSQL lokal PGlite; tidak membutuhkan `.env`, akun Supabase, atau service-role key. Unit test menolak permintaan jaringan yang tidak dimock.

## Perintah

| Perintah | Cakupan |
| --- | --- |
| `npm test` | Unit/komponen React, validasi backend, API HTTP, dan PostgreSQL/RLS |
| `npm run test:unit` | Unit/komponen React dan unit validasi backend |
| `npm run test:watch` | Unit frontend dalam mode watch |
| `npm run test:coverage` | Unit frontend dengan laporan V8 di `coverage/index.html` dan `coverage/coverage-summary.json` |
| `npm run test:e2e` | Kompilasi API dan tiga alur browser: profil/foto, belajar/admin, serta visual semua materi |
| `npm run test:all` | Unit, integrasi, laporan coverage frontend, build produksi, dan seluruh alur browser |
| `node scripts/check-learning.mjs` | Pemeriksaan tambahan integritas seed dan render rute setiap jenjang |

Untuk tes browser, jalankan `npx playwright install chromium` satu kali. Skrip memakai Chrome/Edge lokal jika ditemukan; selain itu memakai Chromium Playwright. `CHROME_PATH` dapat menentukan executable lain. Browser berjalan headless. Runner menjalankan grup berurutan dan berhenti dengan exit code bukan nol ketika ada kegagalan.

## Matriks fitur

| Fitur | Unit/komponen dan API | Integrasi/browser |
| --- | --- | --- |
| Registrasi, konfirmasi email, login/logout | `account`, `forms`, `auth-config`: metadata profil, normalisasi email, pemulihan sesi, kata sandi, pesan error, provider sosial yang belum aktif | Alur login/logout profil memakai Auth simulasi |
| Nama, jenjang, tujuan | `forms`, `learning-store`, `validation`, `app`: simpan tiga kolom, nilai canonical, kegagalan, batas input dan kepemilikan | Reload/login kembali dan pemisahan akun |
| Foto profil | `forms`, `avatar`, `app`: pratinjau, tipe/ukuran/signature, upload/ganti/hapus, kegagalan, URL privat dan fallback inisial | Persistensi, upload error, hapus, tampilan mobile |
| Aksesibilitas dan preferensi | `pages`, `learning-store`, `validation`, `app`: tema, ukuran teks, kontras, mode nyaman, kecepatan, hemat data, penyimpanan | Preferensi digunakan pada video/tampilan browser |
| Asesmen adaptif | `learning-logic`, `online-learning`, `learning-validation`, `learning-routes`: akses, pilihan/tidak tahu, request ID, retry dan hasil server | SQL cabang lanjutan/penguatan; delapan soal SD/SMP/SMA; skor 75 gagal, 87,5 lulus; jeda/resume |
| Materi dan latihan | `online-learning`, `learning-store`: tahap, visual, susun kata, jawaban, penguasaan dari server | SQL nilai 80 dan kesalahan berulang; resume; pengiriman ulang; 12 materi × empat tahap visual |
| Kelas dasar | `pages`, `admin`, `learning-validation`: video, teks slide, kegagalan video, asesmen ulang dan editor | Nilai asesmen gagal membuka kelas dasar; draft/publikasi kelas dasar |
| Kamus dan video | `dictionary-media`: jenjang, pencarian, kategori/sumber, modal, URL/waktu video, putar/tutup, preview lokal, hemat data/kecepatan | Unit memeriksa konfigurasi player; ketersediaan video eksternal memerlukan pemeriksaan terpisah |
| Beranda, jalur, profil, kemajuan | `pages`, `learning-logic`: rekomendasi, batas jenjang, mastery, jejak belajar, arsip lama dan rute privat | Penguasaan/riwayat sesudah sesi belajar |
| Admin | `admin`, `learning-validation`, `learning-routes`: editor, pilihan/kunci, draft, simpan sebelum terbit, penolakan siswa | PostgreSQL memeriksa peran, draft tersembunyi, publikasi, versi tetap, sesi aktif dan penguasaan antarversi |
| Keamanan data dan kegagalan API | `api`, `auth-config`, `app`, `learning-routes`: JWT, key browser, tipe input, JSON rusak, ukuran berlebih, nilai/peran palsu dan error terkontrol | RLS/permission pemilik; kunci privat; larangan promosi admin; arsip lokal tidak membuka materi; migrasi/seed bisa dijalankan ulang |

Nama berkas unit frontend berada di `tests/unit/`. Tes backend berada di `server/src/*.test.ts`. `learning.test.ts` menjalankan banyak skenario berurutan pada database yang sama; jumlah test case runner bukan jumlah assertion atau variasi inputnya.

## Lingkungan dan batas verifikasi

- Unit React memakai Vitest, React Testing Library, dan jsdom. Layout, decoding gambar/video, serta pemutaran YouTube tidak dibuktikan oleh jsdom. API browser seperti dialog/scroll/object URL diganti stub; visual dan overflow juga diperiksa lewat Chromium.
- Tes HTTP memakai Express asli dengan client Supabase simulasi. Tes SQL menjalankan migrasi sebenarnya pada PGlite dengan role dan `auth.uid()` uji. Test fixture browser belajar menggabungkan Express dan PGlite; Auth tetap simulasi. Tes foto tidak mengunggah ke Storage cloud.
- Coverage V8 di sini khusus JavaScript frontend, bukan persentase kelulusan fitur, coverage SQL, atau jaminan bebas bug. `src/main.jsx` dan ikon SVG statis dikecualikan; baris lain yang belum tersentuh tetap terlihat dalam laporan.
- Pengiriman email nyata, RLS/Storage pada layanan Supabase asli, masa berlaku JWT nyata, kondisi jaringan nyata, isi/availability video eksternal, dan audit aksesibilitas pengguna tetap mengikuti pemeriksaan manual pada `SETUP-SUPABASE.md`.

GitHub Actions menjalankan `npm run test:all` pada push dan pull request, lalu menyimpan laporan coverage sebagai artifact. Workflow tidak memakai secret proyek.

## Menambah kasus regresi

Tambahkan pengujian yang gagal untuk perilaku bermasalah, jalankan file/grup terkait, perbaiki implementasi, lalu jalankan `npm test`. Untuk perubahan rute API, skema, autentikasi, atau alur belajar/admin, jalankan `npm run test:all`. Hindari snapshot DOM besar atau assertion yang hanya menyalin detail implementasi; periksa perilaku pengguna, hasil tersimpan, dan batas akses.
