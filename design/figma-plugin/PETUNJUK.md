# Lengkapi desain BahasaKita di Figma

File tujuan: https://www.figma.com/design/lq8j5WRNWnNPIL7Vg2mma0

Plugin berhasil dijalankan di Figma Desktop pada 15 Oktober 2026. Figma mengonfirmasi **271 layar desktop, 65 layar mobile, dan 111 dialog**. Jumlah ini mencakup keadaan layar dan cabang alur, bukan 271 fitur berbeda.

## Cara menjalankan

1. Buka aplikasi **Figma Desktop** dan file BahasaKita di atas dengan akses edit.
2. Buka menu **Plugins → Development → Import plugin from manifest…**.
3. Pilih `manifest.json` dalam folder ini.
4. Jalankan **Plugins → Development → BahasaKita — Lengkapi UI UX**.
5. Panel plugin menampilkan jumlah layar setelah selesai. Tutup panel tersebut, lalu periksa halaman **01 · Desktop & alur** dan **02 · Mobile**. Pilih layar lalu klik Present untuk mencoba tautan prototipe.

## Yang ditambahkan

Versi ini mencakup seluruh 12 materi SD/SMP/SMA dari `src/gradeLessons.js`: pengantar, isyarat & visual, latihan, lima pertanyaan evaluasi per materi, serta contoh hasil dikuasai/perlu penguatan. Terdapat 60 soal evaluasi dan 36 keadaan pertanyaan asesmen yang bersumber dari kode aplikasi.

Kamus memuat seluruh 33 entri dari tiga jenjang, dialog arti/contoh/waktu video, pilihan kategori, dan lima sumber video per jenjang. Tampilan filter menggunakan layar tersendiri agar kompatibel dengan paket Figma Starter. Memilih filter meninjau satu filter; penggabungan filter dan pencarian teks bebas tetap dijalankan di aplikasi asli.

Register memiliki pilihan SD/SMP/SMA. Kontrol kata sandi dan konfirmasi dapat ditampilkan/disembunyikan secara terpisah menggunakan teks contoh. Halaman utama memiliki pasangan terang/gelap; logo memakai aset transparan. Versi mobile memuat daftar materi dan kamus setiap jenjang, semua detail kata, serta ringkasan setiap materi.

- Desktop: asesmen awal dengan contoh hasil lulus/perlu penguatan, kelas dasar, jalur belajar, materi/video, kamus visual, detail kata/video, kemajuan, profil, pengaturan, dan beranda gelap.
- Mobile: login, register, beranda, asesmen, belajar, kamus, pengaturan.
- Komponen dan warna memakai fondasi yang sudah ada. Desain berisi teks, vektor, auto-layout, dan instance yang dapat diedit; logo dan thumbnail merupakan aset gambar.
- Tautan navigasi, tahapan, umpan balik jawaban, pilihan jenjang, filter, sakelar, serta perpindahan tema halaman utama terhubung pada prototipe. Video dan penyimpanan merupakan representasi desain; plugin tidak mengakses Supabase atau membuat akun.

Paket akun Figma saat ini membatasi satu aksi per interaksi. Karena itu nilai kumulatif tidak dihitung di prototipe: hasil evaluasi lulus/penguatan disediakan sebagai contoh cabang yang bisa dipilih. Asesmen mencontohkan cabang pertanyaan berdasarkan pilihan jawaban; contoh hasilnya tidak mewakili perhitungan nilai sesi. Perhitungan nilai otomatis, input formulir, pemutaran YouTube, dan penyimpanan data tetap berjalan di aplikasi BahasaKita asli. Semua layar memakai lapisan yang dapat diedit, bukan tangkapan layar halaman utuh.

Plugin khusus untuk file di atas. Ia berhenti bila kerangka yang diharapkan hilang atau sebagian telah diisi, untuk menghindari penimpaan dan duplikasi. Tiga layar desktop yang sudah ada digunakan kembali. Jika terjadi error di tengah proses, sebagian layar mungkin telah dibuat; jangan menghapus desain untuk mencoba ulang. Salin pesan errornya agar kelanjutan dapat diperbaiki berdasarkan keadaan file.

Plugin tidak memerlukan koneksi jaringan, password, key, atau layanan berbayar. Kuota MCP tetap berlaku untuk penyuntingan melalui chat; menjalankan plugin lokal dilakukan melalui editor Figma.
