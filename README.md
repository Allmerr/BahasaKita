# BahasaKita — Ruang belajar adaptif

Website React + Vite untuk prototipe PRD BahasaKita, dengan logo dan palet BahasaKita.

## Koneksi database Supabase

Tahap akun online menyimpan profil dan pengaturan ke Supabase melalui API server. Isi `.env.local`, jalankan `npm run setup:supabase`, siapkan tabel lewat `supabase/migrations/001_accounts.sql`, lalu periksa dengan `npm run check:supabase`. Panduan lengkap: [SETUP-SUPABASE.md](SETUP-SUPABASE.md). Secret key/service role tidak dipakai di frontend. Asesmen dan progres masih lokal per akun.

## Menjalankan

- `npm install`
- `npm run dev` — server pengembangan
- `npm run build` — hasil produksi di `dist/`
- `npm run preview` — pratinjau build
- `node scripts/check-learning.mjs` — pemeriksaan logika belajar dan render halaman

## Alur yang bisa dicoba

1. Setiap buka atau refresh: animasi logo sekitar 2,4 detik → beranda sebagai pengunjung. Tombol lanjut dapat melewati animasi; preferensi pengurangan gerakan mempercepat layar pembuka. Pengunjung dapat memakai navigasi Beranda, Jalur Belajar, Kamus Visual, dan Kemajuan Saya. Interaksi lain mengarahkan ke Login; asesmen, sesi materi, dan pengaturan juga dilindungi pada level rute. Register dan login memakai Supabase Auth setelah koneksi dikonfigurasi; profil dan pengaturan akun dimuat melalui API server. Akses asesmen dan fitur belajar mengikuti status akun serta progres lokal. Register selalu memulai asesmen baru dan mereset progres profil sebelumnya. Sebelum asesmen selesai, pengguna yang sudah masuk tetap bisa membuka Beranda, Belajar, Kamus Visual, Kemajuan, Profil, dan Pengaturan melalui navigasi. Tombol fitur, input, dan pengiriman form mengarahkan ke asesmen; kontrol di halaman asesmen tetap bisa dipakai. URL sesi materi juga meminta asesmen. Setelah asesmen selesai, aturan nilai minimal 80 dan kelas dasar tetap berlaku.
2. Register memakai desain yang sama dengan Login: nama panggilan, email, kata sandi, dan konfirmasi kata sandi. Bagian Jenjang belajar hanya berisi pilihan SD, SMP, dan SMA. Setelah menyimpan, pengguna langsung masuk ke asesmen awal.
3. Asesmen 8 soal mengukur empat aspek. Soal kedua setiap aspek menyesuaikan jawaban pertama. Ada opsi belum tahu dan jeda/lanjut. Nilai total dihitung dari jawaban benar dibagi 8 × 100. Nilai minimal 80 membuka seluruh fitur dan materi; nilai di bawah 80 tetap menampilkan beranda dan empat menu utama dengan tambahan menu Kelas Dasar pada sidebar serta navbar ponsel. Menu Kelas Dasar disembunyikan setelah nilai minimal 80. Kelas dasar, asesmen ulang, profil, dan pengaturan bisa diakses sebelum lulus. Rute belajar, kamus, kemajuan, dan materi dilindungi dari URL langsung untuk pengguna yang belum lulus. Nilai kelulusan memakai hasil asesmen terakhir, bukan perubahan skor latihan. Dengan 8 soal, nilai lulus pertama yang mungkin adalah 87,5.
4. Jalur menampilkan empat materi per jenjang yang memakai kosakata dan video sama dengan Kamus Visual: SD (tumbuhan, kalimat hewan, bacaan hewan, menghitung buah), SMP (percakapan sopan, ungkapan izin, rekreasi ke pelabuhan, perhitungan rencana rekreasi), SMA (kosakata isyarat, kalimat sebab-akibat, teks eksplanasi, membaca data). Jalur diurutkan dari aspek yang perlu penguatan. Seluruh materi terbuka setelah asesmen lulus; urutan rekomendasi tetap dimulai dari aspek yang perlu penguatan.
5. Materi memiliki pengantar, isyarat & visual, latihan, dan evaluasi 5 soal.
6. Skor minimal 80% dan tidak mengulang kesalahan soal dari percobaan sebelumnya menandai materi dikuasai. Hasil lain mengarahkan penguatan; setelah dua kegagalan tersedia pengantar dasar. Percobaan tidak dibatasi.
7. Kamus visual menyediakan pencarian, kategori, gambar, arti, contoh kalimat, dan dialog video. Kartu arti kata mengikuti kosakata video pada jenjang profil: 6 kata SD, 5 kata SMP, dan 6 kata SMA. Kategori mengikuti isi materi, tersedia filter video sumber, dan setiap detail kata dapat memutar video sumber dari titik mulai konteks kata. Membuka detail kata menghentikan pemutar video utama agar suara tidak tumpang tindih. Katalog kosakata ada di `src/gradeDictionary.js`; titik mulai adalah penanda konteks hasil pemeriksaan sampel tayangan, bukan cuplikan satu gerakan isyarat yang dipotong atau validasi linguistik isyarat. Bagian video YouTube menampilkan dua materi khusus peserta didik Tuli/tunarungu sesuai jenjang SD/SMP/SMA dari profil, yang dipilih dari sumber SDLB/SMPLB/SMALB dengan dukungan visual atau isyarat dan memutar video langsung di halaman. Mengubah jenjang di Pengaturan mengganti daftar serta menutup pemutar sebelumnya. Video baru dimuat setelah pengguna memilihnya; tersedia kontrol YouTube, layar penuh, permintaan subtitle Indonesia jika tersedia, atribusi pembuat, dan tautan sumber cadangan. Daftar video ada di `src/youtubeMaterials.js`; ketersediaan, subtitle, dan izin penyematan bergantung pada YouTube serta pembuat video. Kartu video menampilkan jenjang/kelas pada sumber dan dukungan aksesnya. Pilihan SD berasal dari kelas 4 SDLB; SMP dari kelas 7 dan 9 SMPLB; SMA dari SMALB-B. Tayangan mencakup penjelasan isyarat, gambar, teks, serta rekaman pembelajaran kelas. Sampel tayangan diperiksa secara visual; sistem isyarat tidak diberi label BISINDO/SIBI jika sumber tidak menyebutkannya. Ini bukan audit kurikulum atau validasi aksesibilitas penuh oleh komunitas Tuli.
8. Kemajuan menampilkan profil empat aspek, perubahan dari asesmen, waktu evaluasi, dan riwayat.
9. Pengaturan menyediakan ukuran teks, gelap/terang, kontras tinggi, pengurangan gerakan, kecepatan video, bahasa, hemat data, dan penghapusan data lokal.

10. Kelas belajar dasar menyediakan empat video penjelasan visual lokal dengan teks (tanpa suara), masing-masing 24 detik, dan teks penjelasan lengkap. Tombol ulangi asesmen membuka kembali asesmen; menonton video tidak otomatis membuka fitur. Aset ada di `public/videos/`; `node scripts/create-basic-videos.mjs` membuat ulang video menggunakan Playwright dan Chrome lokal. `node scripts/check-entry-flow.mjs` menguji alur browser register, video, rute terkunci, login, dan asesmen ulang. Kedua skrip memakai lokasi runtime Windows pada perangkat pengembangan ini.

## Status dan batas prototipe

- Akun memakai Supabase Auth; profil dan pengaturan disimpan di database setelah konfigurasi dan migrasi selesai. Asesmen serta progres masih lokal per user ID. Preferensi tamu disimpan di perangkat. Google dan Apple belum terhubung; belum ada reset password atau penghapusan akun online.
- Latihan adalah konten contoh yang disusun per jenjang, bukan kurikulum tervalidasi. Materi dan soal latihan memakai kosakata video; video menjadi sumber pendukung kosakata dan isyarat, bukan klaim bahwa semua soal diajarkan dalam video. ID materi berbeda per jenjang sehingga penguasaan tidak berpindah saat jenjang diganti. Riwayat lama tetap disimpan; materi generik versi lama tidak dihitung sebagai penguasaan materi baru.
- Video isyarat belum disediakan. Pemutar menampilkan status belum tersedia, tanpa menirukan bahasa isyarat. Pengaturan dapat menambahkan video lokal per kata dan bahasa untuk pratinjau sesi; pemutar mendukung ulang, kecepatan, layar penuh, dan kontras.
- Video isyarat instruksi, soal, umpan balik, dan penguncian membutuhkan produksi konten tersendiri dari komunitas Tuli. Video kata tidak menggantikan penjelasan materi penuh.
- Mode hemat data menghindari pramuat video. Unduh materi dan video luring belum tersedia.
- Asesmen dan aturan rekomendasi menggunakan heuristik deterministik untuk demonstrasi, belum instrumen pengukuran yang tervalidasi. Penguatan dibedakan per aspek; katalog penguatan spesifik per konsep perlu dikembangkan.
- Performa 4G, audit WCAG lengkap, keamanan produksi, dan keputusan hukum terkait pengguna di bawah umur belum diverifikasi.

## Struktur implementasi

- `src/App.jsx`: rute aplikasi.
- `src/auth.js`: normalisasi email dan helper prototipe lama. Login aktif memakai Supabase Auth.
- `src/supabaseConfig.js`: validasi URL/public key dan penolakan privileged key sebelum Vite mengirimnya ke browser.
- `server/src/index.ts`: API profil/pengaturan dengan JWT pengguna dan RLS.
- `src/EntryFlow.jsx`: layar pembuka beranimasi, halaman login, dan layout register. Status login hanya disimpan dalam memori sehingga refresh selalu mengulang layar pembuka dan beranda pengunjung. Ini gate prototipe, bukan autentikasi keamanan server.
- `src/access.jsx`: status akses, daftar halaman publik, dan aturan interaksi pengunjung. Navigasi mobile tetap dapat digunakan tanpa login; tombol, tautan fitur, dan input lainnya meminta login.
- `src/LearningApp.jsx`: beranda, profil awal, asesmen, jalur, sesi, kamus, kemajuan, pengaturan.
- `src/GradeDictionary.jsx` dan `src/gradeDictionary.js`: arti kata per jenjang, filter video/kategori, dan detail kata dengan tautan bagian video.
- `src/YouTubeLessons.jsx` dan `src/youtubeMaterials.js`: pemutar YouTube di Kamus Visual dan katalog materi per jenjang.
- `src/BasicClass.jsx` dan `src/basicMaterials.js`: kelas dasar, pemutar video, teks materi, dan asesmen ulang.
- `src/gradeLessons.js`: katalog, pengantar, latihan, dan evaluasi empat materi per jenjang yang terhubung ke Kamus Visual.
- `src/LessonVideo.jsx`: pemutar video kosakata yang memakai sumber dan waktu yang sama dengan kamus.
- `src/learning.jsx`: data contoh, store, rekomendasi, akses materi, dan penilaian.
- `src/components/Icon.jsx`: ikon SVG.
- `src/index.css`: desain responsif dan aksesibilitas.
- `src/dictionary.css`: tampilan Kamus Visual dengan judul ringkas, kosakata sebelum video, pencarian/filter terpadu, kartu kata dan video, serta tata letak ponsel dan dukungan preferensi gerakan.
- `src/theme.css`: tombol matahari/bulan di kiri profil pada header, tema terang/gelap tersimpan, dan logo transparan berwarna terang pada mode gelap.
- `src/responsive.css`: penyesuaian layout ponsel kecil, tablet, desktop, layar pendek/landscape, teks besar, area aman perangkat, dan kontrol sentuh. Sidebar dipakai di desktop. Pada lebar sampai 1024px atau perangkat dengan input sentuh tanpa hover, empat menu utama tampil dalam navbar tetap di bawah, dengan ruang konten dan safe area agar tidak tertutup navbar.
- `public/images/logo-bahasa-kita.png`: logo pengguna.
- `scripts/check-learning.mjs`: pemeriksaan logika dan render server.

File dan aset template agency lama telah dibersihkan. `dist/` merupakan keluaran build terbaru.

## Untuk rilis produksi

Hubungkan autentikasi dan penyimpanan server yang aman, kurikulum dan video bahasa isyarat tervalidasi, remedial per konsep, akses luring, serta audit aksesibilitas bersama pengguna Tuli. Keputusan usia akun dan persetujuan perlu diselesaikan sesuai PRD sebelum mengumpulkan data pengguna anak.

## Akun Supabase dan API

Implementasi akun online terbaru menggantikan login lokal. Lihat [SETUP-SUPABASE.md](./SETUP-SUPABASE.md) untuk migrasi database, environment, dan pengujian. Penjelasan autentikasi lokal di atas menggambarkan versi sebelumnya; progres belajar tetap lokal per user ID, sedangkan profil/pengaturan akun menggunakan API. Registrasi akun saat ini hanya mendukung SD. Jika konfirmasi email aktif, pengguna perlu mengonfirmasi email lalu login sebelum asesmen. Sesi Supabase dipulihkan saat refresh; setelah layar pembuka, pengguna diarahkan sesuai hasil asesmen.

Kamus Visual (pratinjau SD untuk tamu) dan pengaturan aksesibilitas tetap dapat digunakan tanpa login. Kemajuan, profil, asesmen, dan materi memerlukan akun. Fitur asesmen, kelas dasar, serta materi/video per jenjang dari repo utama tetap tersedia. `node scripts/check-learning.mjs` memeriksa logika dan rute dengan fixture akun yang sudah dimuat. Skrip `check-entry-flow.mjs` masih mengasumsikan autentikasi lokal versi sebelumnya dan lokasi runtime perangkat asal; pengujian akun online mengikuti panduan Supabase.
