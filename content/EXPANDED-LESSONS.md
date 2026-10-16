# Tambahan materi SD, SMP, dan SMA

Rilis ini menambah 24 materi (8 per jenjang) pada 12 materi lama: total 36 materi atau 12 per jenjang. Setiap jenjang mendapat 2 materi baru pada masing-masing aspek. Ada 24 latihan dan 120 soal evaluasi tambahan. Asesmen awal tidak diubah.

| Aspek | SD | SMP | SMA |
|---|---|---|---|
| Kosakata | Benda di tas sekolah; Tempat di sekitar rumah | Kosakata menjaga lingkungan; Mengenali informasi digital | Kosakata penelitian sederhana; Kosakata argumentasi |
| Kalimat | Kalimat kegiatan pagi; Mengikuti petunjuk berurutan | Menghubungkan sebab dan akibat; Menyusun kalimat efektif | Hubungan logis antarkalimat; Membuat parafrasa yang setia |
| Bacaan | Bekal untuk Dina; Mengembalikan buku tepat waktu | Membaca laporan bank sampah; Memahami pengumuman kunjungan | Menilai kesimpulan survei; Membaca evaluasi program sekolah |
| Akademik | Menghitung kelompok benda; Membaca panjang dan waktu | Memahami perbandingan; Persentase dan potongan harga | Rata-rata, median, dan rentang; Membaca hubungan linear |

## Mengaktifkan

Jalankan `supabase/migrations/011_expanded_lessons.sql` di SQL Editor Supabase setelah migrasi 004/004b/005. Muat ulang katalog aplikasi. Tidak membutuhkan migrasi chat atau tabel admin. Migrasi menambahkan konten terbit, tidak mengubah materi lama, jawaban lama, atau progres. Materi baru tetap mengikuti penguncian jalur yang berlaku. Persentase selesai dapat turun karena jumlah materi yang tersedia bertambah, sementara penguasaan lama tetap tersimpan.

Rerun aman: slug yang sudah ada dilewati, termasuk versi yang sudah diedit admin. Edit sumber di `content/expanded-lessons.js`, lalu `npm run seed:expanded` untuk membentuk SQL. Setelah sudah terbit, perubahan isi memerlukan revisi melalui admin atau migrasi baru, bukan menjalankan ulang rilis ini.

## Batas konten

Materi ini merupakan latihan pengayaan yang ditulis untuk aplikasi; belum dipetakan ke seluruh capaian kurikulum atau ditinjau ahli pendidikan Tuli. Penjelasan memakai teks, contoh, simbol/emoji, dan tip penguatan. Video BISINDO baru belum tersedia dan tidak ditautkan secara asal. Materi lama beserta video yang sudah ada tetap dipertahankan. Contoh data dan cerita adalah fiktif.

## Verifikasi

`npm run test:expanded` memeriksa kelengkapan aspek/jenjang, pilihan/kunci jawaban, idempotensi migrasi, perlindungan kunci pada katalog publik, keutuhan konten lama, dan penilaian semua materi baru melalui fungsi PostgreSQL lokal. Pengujian tidak menyatakan bahwa migrasi sudah diterapkan ke Supabase online.
