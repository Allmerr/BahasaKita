# Video kelas dasar per jenjang

Untuk proyek Supabase yang sudah memakai platform belajar (migrasi 004, 004b, dan 005):

1. Buka SQL Editor di dashboard proyek Supabase yang digunakan aplikasi.
2. Salin **seluruh** isi `migrations/008_basic_youtube.sql`, lalu klik **Run**.
3. Muat ulang aplikasi. Pada profil siswa SD/SMP/SMA, buka Kelas Dasar setelah hasil asesmen di bawah 80.

Tidak perlu menjalankan ulang DEPLOY-LEARNING.sql pada database yang sudah terpasang. Untuk pemasangan baru, paket DEPLOY-LEARNING.sql sudah mencakup konten ini.

## Isi pembaruan

| Jenjang | Video YouTube | Topik pendamping |
| --- | --- | --- |
| SD | [Direktorat PKPLK](https://www.youtube.com/watch?v=iDDkYTki6pU) | Tumbuhan, buah, kalimat dan bacaan kebun, penjumlahan/pengurangan |
| SMP | [Melalita Anggraeni](https://www.youtube.com/watch?v=XmiXc0YUrXY) | Paragraf rekreasi, kata tanya, waktu perjalanan, tiket dan pembagian |
| SMA | [SMALB KM](https://www.youtube.com/watch?v=cvwI6-6lfGY) | Teks eksplanasi, sebab-akibat, proses hujan dan data curah hujan |

Tiga sumber diperiksa melalui oEmbed dan cuplikan pemutaran YouTube pada 15 Oktober 2026. Video ditayangkan melalui pemutar YouTube di dalam aplikasi; tidak diunduh atau diunggah ulang. Untuk SMP pemutaran dimulai pada bagian pengantar rekreasi sekitar 04.45; pengguna dapat kembali ke awal melalui kontrol pemutar.

Terdapat 12 materi (4 aspek × 3 jenjang) dan 36 soal asesmen awal (soal awal, lanjutan, penguatan pada setiap aspek). Delapan soal dipilih adaptif pada setiap percobaan sesuai aturan asesmen yang sudah ada. Ringkasan, contoh kalimat, bacaan, dan data hitungan merupakan latihan pendamping buatan BahasaKita yang mengikuti topik video, bukan transkrip atau klaim data asli video. Soal tidak menilai kemampuan mendengar.

Migrasi menerbitkan revisi soal baru dan mengarsipkan versi terdahulu. Riwayat, jawaban, dan nilai siswa tidak dihapus. Asesmen yang sedang berlangsung tetap menyelesaikan kumpulan soal lamanya; percobaan baru memakai soal baru. Kunci jawaban tetap berada pada tabel privat server. Menjalankan file SQL ini kembali tidak menggandakan konten atau menimpa perubahan admin yang dibuat setelah rilis ini.

## Pemeliharaan

Admin dapat mengubah jenjang kelas dasar, alamat YouTube, judul sumber, pembuat video, detik mulai, serta ringkasan melalui Kelola Materi. Empat kartu umum lama digantikan oleh kartu khusus per jenjang. Kartu khusus yang sudah tersedia diprioritaskan daripada kartu umum.

Sumber editorial: `content/basic-youtube.js`. Setelah mengedit sumber untuk sebuah **rilis baru**, gunakan identitas rilis/migrasi baru agar riwayat tetap aman. `node scripts/generate-basic-youtube.mjs` mereproduksi file 008; `npm run seed:learning` juga memperbarui paket pemasangan baru. File sumber editorial memuat kunci, sehingga tidak boleh diimpor ke bundle frontend.
