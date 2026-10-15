# BahasaKita UI/UX di Figma

File: https://www.figma.com/design/lq8j5WRNWnNPIL7Vg2mma0

Tim: Salman Alfarisy's team.

## Hasil

Plugin lokal berhasil dijalankan di Figma Desktop pada 15 Oktober 2026. Panel aplikasi terbaru mengonfirmasi **271 layar desktop, 65 layar mobile, dan 111 dialog**, termasuk variasi keadaan dan cabang alur.

Desain mencakup login/register, tema terang/gelap, asesmen dan hasil, kelas dasar, materi empat tahap, evaluasi, kamus berdasarkan SD/SMP/SMA, detail kata/video, kemajuan, profil, pengaturan, serta contoh kondisi konfirmasi email, batas pengiriman email, data gagal dimuat, pencarian kosong, dan halaman tidak ditemukan.

Kosakata dan judul video untuk tiga jenjang diambil dari `src/gradeDictionary.js` dan `src/youtubeMaterials.js`, disalin ke `project-content.json`. Seluruh tampilan tetap menggunakan teks, vektor, auto-layout, serta instance komponen yang dapat diedit. Logo dan thumbnail adalah gambar. Font Noto Sans menggantikan Segoe UI yang tidak tersedia pada layanan Figma.

Pemeriksaan visual desktop menemukan label SD pada kartu SMP/SMA dan ikon navigasi yang sama; keduanya sudah diperbaiki melalui plugin. Tema gelap memakai warna primer teks #a5b4fc dari CSS proyek. Pemeriksaan ini merupakan pemeriksaan sampel layar, bukan audit setiap interaksi di semua layar.

## Plugin

`figma-plugin/manifest.json` dan `figma-plugin/code.js` merupakan plugin yang dijalankan. Plugin memeriksa nama layar sebelum menambahkan agar pengulangan tidak menggandakan layar. Sebagian kontrol adalah representasi desain, bukan fungsi backend; video dan penyimpanan akun tetap dijalankan di aplikasi BahasaKita asli.

`figma-state.json` mencatat hasil dan ID fondasi untuk kelanjutan. `expanded-states.figma.js` dan `polish.figma.js` adalah sumber tambahan keadaan layar dan perapian yang sudah digabungkan ke plugin.

## Pelengkapan detail

Pembaruan berikutnya dijalankan melalui plugin desktop: **61 layar desktop, 14 layar mobile, dan 34 dialog**. Layar tambahan mencakup 15 pilihan video sesuai data sumber, empat materi dasar dengan transkrip lengkap, pengaturan aksesibilitas dengan komponen sakelar interaktif, serta profil kemampuan dan riwayat belajar. Setiap kata dari kamus tiga jenjang memiliki dialog tersendiri. Ilustrasi kosakata dirender dari emoji yang dipakai di aplikasi.

Pengaturan menggunakan kontrol visual sesuai aplikasi dan memiliki konfirmasi penghapusan progres lokal. Prototipe tidak menghapus data akun atau menjalankan Supabase. Pemutar video adalah representasi desain; aplikasi asli tetap menjadi tempat memutar YouTube. Komponen sakelar mendemonstrasikan keadaan aktif/nonaktif.

## Pelengkapan kurikulum dan alur

Revisi terbaru menambahkan seluruh 12 materi dari `src/gradeLessons.js`, 60 soal evaluasi, serta 36 keadaan soal asesmen dari `src/learning.jsx`. Label tahap mengikuti aplikasi: Pengantar, Isyarat & visual, Latihan, Evaluasi. Kartu Belajar SD/SMP/SMA membuka materi masing-masing. Kamus memiliki 33 detail kata, contoh kalimat, waktu video, dan 15 pilihan sumber video. Layar filter kategori/video, pilihan jenjang register, kontrol kata sandi terpisah, pasangan tema halaman utama, dan konfirmasi simpan pengaturan melengkapi prototipe.

`lesson-content.json` merupakan salinan data kurikulum saat pembaruan. `completeness.figma.js`, `simple-controls.figma.js`, dan `final-controls.figma.js` berisi tambahan desain. Jalankan `node design/build-completeness.mjs` dari akar proyek jika mengubah sumber tambahan; hasilnya digabungkan ke `figma-plugin/code.js`. Paket ZIP hanya membutuhkan manifest, kode plugin yang sudah menyertakan data/aset, dan petunjuk.

Paket Figma Starter menolak banyak aksi dalam satu interaksi. Prototipe menggunakan satu aksi navigasi/overlay dan keadaan komponen. Nilai kumulatif, pencarian teks bebas, gabungan filter, dan backend tidak disimulasikan penuh. Hasil evaluasi merupakan contoh cabang lulus/penguatan; aplikasi asli menghitung nilai dan menyimpan progres. Ini merupakan desain yang mengikuti isi proyek, bukan salinan dengan ketepatan setiap piksel; Noto Sans menggantikan font sistem aplikasi. Pemeriksaan mencakup sampel tampilan dan alur, bukan audit manual setiap layar.
