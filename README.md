# BahasaKita — Ruang belajar adaptif

Website React + Vite untuk prototipe PRD BahasaKita, dengan logo dan palet BahasaKita.

## Menjalankan

- `npm install`
- `npm run dev` — server pengembangan
- `npm run build` — hasil produksi di `dist/`
- `npm run preview` — pratinjau build
- `node scripts/check-learning.mjs` — pemeriksaan logika belajar dan render halaman

## Alur yang bisa dicoba

1. Setiap buka atau refresh: animasi logo sekitar 2,4 detik → beranda sebagai pengunjung. Tombol lanjut dapat melewati animasi; preferensi pengurangan gerakan mempercepat layar pembuka. Pengunjung dapat memakai navigasi Beranda, Jalur Belajar, Kamus Visual, dan Kemajuan Saya. Interaksi lain mengarahkan ke Login; asesmen, sesi materi, dan pengaturan juga dilindungi pada level rute. Register membuat profil perangkat; Login memeriksa email dan kata sandi profil lokal, lalu selalu membuka beranda. Setelah menyelesaikan Register, pengguna juga langsung diarahkan ke beranda.
2. Register memakai desain yang sama dengan Login: nama panggilan, email, kata sandi, dan konfirmasi kata sandi. Bagian Jenjang belajar hanya berisi pilihan SD, SMP, dan SMA. Setelah menyimpan, pengguna masuk ke beranda.
3. Asesmen 8 soal mengukur empat aspek. Soal kedua setiap aspek menyesuaikan jawaban pertama. Ada opsi belum tahu dan jeda/lanjut.
4. Jalur diurutkan dari aspek yang perlu penguatan. Materi berikutnya terkunci sampai materi sebelumnya dikuasai.
5. Materi memiliki pengantar, isyarat & visual, latihan, dan evaluasi 5 soal.
6. Skor minimal 80% dan tidak mengulang kesalahan soal dari percobaan sebelumnya membuka langkah berikutnya. Hasil lain mengarahkan penguatan; setelah dua kegagalan tersedia pengantar dasar. Percobaan tidak dibatasi.
7. Kamus visual menyediakan pencarian, kategori, gambar, arti, contoh kalimat, dan dialog video.
8. Kemajuan menampilkan profil empat aspek, perubahan dari asesmen, waktu evaluasi, dan riwayat.
9. Pengaturan menyediakan ukuran teks, gelap/terang, kontras tinggi, pengurangan gerakan, kecepatan video, bahasa, hemat data, dan penghapusan data lokal.

## Status dan batas prototipe

- Profil, pilihan, asesmen, dan progres disimpan di `localStorage` browser ini. Ini **belum akun daring**: login lokal memakai email dan kata sandi dengan hash PBKDF2-SHA256 (salt acak, 100.000 iterasi). Tidak ada autentikasi server, pemulihan akun, database, enkripsi profil, atau sinkronisasi antarperangkat. Profil lama perlu dilengkapi lewat Register. Pilihan Ingat email hanya menyimpan email; tidak menyimpan kata sandi atau status login. Google dan Apple belum terhubung. Tidak ada peran guru/orang tua.
- Latihan adalah konten contoh dasar, bukan kurikulum tervalidasi per jenjang. Pilihan SD/SMP/SMA disimpan; katalog contoh sama untuk seluruh jenjang.
- Video isyarat belum disediakan. Pemutar menampilkan status belum tersedia, tanpa menirukan bahasa isyarat. Pengaturan dapat menambahkan video lokal per kata dan bahasa untuk pratinjau sesi; pemutar mendukung ulang, kecepatan, layar penuh, dan kontras.
- Video isyarat instruksi, soal, umpan balik, dan penguncian membutuhkan produksi konten tersendiri dari komunitas Tuli. Video kata tidak menggantikan penjelasan materi penuh.
- Mode hemat data menghindari pramuat video. Unduh materi dan video luring belum tersedia.
- Asesmen dan aturan rekomendasi menggunakan heuristik deterministik untuk demonstrasi, belum instrumen pengukuran yang tervalidasi. Penguatan dibedakan per aspek; katalog penguatan spesifik per konsep perlu dikembangkan.
- Performa 4G, audit WCAG lengkap, keamanan produksi, dan keputusan hukum terkait pengguna di bawah umur belum diverifikasi.

## Struktur implementasi

- `src/App.jsx`: rute aplikasi.
- `src/auth.js`: hash dan verifikasi kredensial lokal.
- `src/EntryFlow.jsx`: layar pembuka beranimasi, halaman login, dan layout register. Status login hanya disimpan dalam memori sehingga refresh selalu mengulang layar pembuka dan beranda pengunjung. Ini gate prototipe, bukan autentikasi keamanan server.
- `src/access.jsx`: status akses, daftar halaman publik, dan aturan interaksi pengunjung. Navigasi mobile tetap dapat digunakan tanpa login; tombol, tautan fitur, dan input lainnya meminta login.
- `src/LearningApp.jsx`: beranda, profil awal, asesmen, jalur, sesi, kamus, kemajuan, pengaturan.
- `src/learning.jsx`: data contoh, store, rekomendasi, akses materi, dan penilaian.
- `src/components/Icon.jsx`: ikon SVG.
- `src/index.css`: desain responsif dan aksesibilitas.
- `src/responsive.css`: penyesuaian layout ponsel kecil, tablet, desktop, layar pendek/landscape, teks besar, area aman perangkat, dan kontrol sentuh. Sidebar dipakai di desktop. Pada lebar sampai 1024px atau perangkat dengan input sentuh tanpa hover, empat menu utama tampil dalam navbar tetap di bawah, dengan ruang konten dan safe area agar tidak tertutup navbar.
- `public/images/logo-bahasa-kita.png`: logo pengguna.
- `scripts/check-learning.mjs`: pemeriksaan logika dan render server.

File dan aset template agency lama telah dibersihkan. `dist/` merupakan keluaran build terbaru.

## Untuk rilis produksi

Hubungkan autentikasi dan penyimpanan server yang aman, kurikulum dan video bahasa isyarat tervalidasi, remedial per konsep, akses luring, serta audit aksesibilitas bersama pengguna Tuli. Keputusan usia akun dan persetujuan perlu diselesaikan sesuai PRD sebelum mengumpulkan data pengguna anak.

## Akun Supabase dan API

Implementasi akun online terbaru menggantikan login lokal. Lihat [SETUP-SUPABASE.md](./SETUP-SUPABASE.md) untuk migrasi database, environment, dan pengujian. Bagian alur/status prototipe di atas menggambarkan versi sebelumnya; progres belajar tetap lokal, sedangkan profil/pengaturan akun menggunakan API.
