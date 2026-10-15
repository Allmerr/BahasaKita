export const questionBank = {
 SD: {
  kosakata: [
   { prompt: 'Pilih kata yang sesuai dengan gambar ini.', visual: '🥭', options: ['Mangga', 'Sepatu', 'Buku'], correct: 0 },
   { prompt: 'Apa arti “menyiram”?', visual: '🪴💧', options: ['Memetik bunga', 'Memberi air pada tanaman', 'Membaca buku'], correct: 1 },
   { prompt: 'Pilih nama benda ini.', visual: '✏️', options: ['Tas', 'Pensil', 'Kursi'], correct: 1 },
  ],
  kalimat: [
   { prompt: '“Ayam makan jagung.” Siapa yang makan?', visual: '🐔 🌽', options: ['Jagung', 'Ayam', 'Kandang'], correct: 1 },
   { prompt: '“Sebelum makan, Budi mencuci tangan.” Apa yang dilakukan lebih dulu?', visual: '🧼 → 🍽️', options: ['Makan', 'Tidur', 'Mencuci tangan'], correct: 2 },
   { prompt: 'Pilih susunan kalimat yang benar.', visual: '🐟 🌊', options: ['Ikan berenang di kolam.', 'Kolam ikan berenang.', 'Berenang di ikan kolam.'], correct: 0 },
  ],
  bacaan: [
   { prompt: 'Dina pergi ke kebun. Ia melihat pohon mangga berbuah lebat. Di mana Dina berada?', visual: '👧 🌳 🥭', options: ['Pasar', 'Kebun', 'Sekolah'], correct: 1 },
   { prompt: 'Bunga layu karena tanahnya kering. Dina memberi air agar bunga kembali segar. Mengapa Dina memberi air?', visual: '🌷 💧', options: ['Agar bunga segar', 'Agar tanah kering', 'Untuk dibuang'], correct: 0 },
   { prompt: 'Budi memelihara dua ekor kelinci di rumah. Hewan apa yang dipelihara Budi?', visual: '👦 🐰', options: ['Kucing', 'Burung', 'Kelinci'], correct: 2 },
  ],
  akademik: [
   { prompt: 'Dua jeruk ditambah satu jeruk. Berapa jumlahnya?', visual: '🍊🍊 + 🍊', options: ['2', '3', '4'], correct: 1 },
   { prompt: 'Ada 6 buah mangga. Tiga mangga dibagikan kepada teman. Berapa sisa mangga?', visual: '🥭🥭🥭🥭🥭🥭 − 3', options: ['2', '4', '3'], correct: 2 },
   { prompt: 'Satu buah apel ditambah satu buah apel. Berapa jumlahnya?', visual: '🍎 + 🍎', options: ['2', '3', '1'], correct: 0 },
  ],
 },
 SMP: {
  kosakata: [
   { prompt: 'Kata yang berarti “berperilaku baik dan menghargai orang lain” adalah …', visual: '🤝 🏫', options: ['Sopan', 'Sombong', 'Marah'], correct: 0 },
   { prompt: 'Kata “pelabuhan” bermakna tempat untuk …', visual: '🚢 ⚓', options: ['Membeli buku sekolah', 'Kapal bersandar dan menaikkan penumpang', 'Menanam bibit padi'], correct: 1 },
   { prompt: 'Saat membutuhkan bantuan orang lain dengan santun, kita mengucapkan …', visual: '🙋 💬', options: ['Tolong', 'Pergi', 'Awas'], correct: 0 },
  ],
  kalimat: [
   { prompt: '“Rani meminjam buku kamus di perpustakaan.” Benda apa yang dipinjam Rani?', visual: '👧 📚 🏛️', options: ['Perpustakaan', 'Buku kamus', 'Rani'], correct: 1 },
   { prompt: 'Manakah kalimat berpola Subjek – Predikat – Objek – Keterangan (S-P-O-K)?', visual: '📝 🏫', options: ['Siswa menulis cerita di kelas.', 'Di kelas siswa cerita.', 'Menulis cerita siswa di kelas.'], correct: 0 },
   { prompt: 'Pilih kalimat tanya yang tepat untuk menanyakan tempat.', visual: '❓ 📍', options: ['Di mana sekolah barumu?', 'Siapa namamu?', 'Berapa harga bukumu?'], correct: 0 },
  ],
  bacaan: [
   { prompt: 'Pada hari Minggu, Rani berekreasi bersama keluarga ke pantai. Mereka berangkat pagi hari agar udara masih sejuk. Kapan Rani berekreasi?', visual: '🏖️ ☀️', options: ['Hari Senin siang', 'Hari Minggu pagi', 'Hari Jumat malam'], correct: 1 },
   { prompt: 'Nelayan di pesisir mencari ikan pada malam hari dan kembali ke pelabuhan saat fajar. Mengapa nelayan kembali saat fajar?', visual: '🚢 🌅 🐟', options: ['Karena sudah selesai mencari ikan dan menjual hasilnya', 'Karena ingin berenang di pantai', 'Karena tersesat di tengah laut'], correct: 0 },
   { prompt: 'Andi mencatat jadwal piket kebersihan di papan kelas. Apa tujuan Andi mencatat jadwal tersebut?', visual: '📋 🧹', options: ['Agar kelas tetap bersih dan rapi', 'Untuk membeli makanan', 'Agar bisa tidur di kelas'], correct: 0 },
  ],
  akademik: [
   { prompt: 'Perjalanan dari sekolah ke pelabuhan berangkat pukul 08.00 dan tiba pukul 09.30. Berapa lama perjalanan?', visual: '🕗 → 🕤', options: ['1 jam', '1 jam 30 menit', '2 jam'], correct: 1 },
   { prompt: 'Sebuah kotak berisi 12 pensil warna. Jika ada 3 kotak yang sama, berapa total pensil warna?', visual: '📦 12 × 3', options: ['24 pensil', '36 pensil', '48 pensil'], correct: 1 },
   { prompt: 'Ibu membeli 15 buah apel, lalu dibagikan sama rata kepada 3 anak. Berapa apel yang diterima tiap anak?', visual: '🍎 15 ÷ 3', options: ['5 apel', '4 apel', '6 apel'], correct: 0 },
  ],
 },
 SMA: {
  kosakata: [
   { prompt: 'Teks yang menjelaskan proses terjadinya suatu fenomena alam atau sosial disebut …', visual: '📝 🌧️', options: ['Teks narasi fiksi', 'Teks eksplanasi', 'Teks puisi'], correct: 1 },
   { prompt: 'Dalam dunia publikasi dan bisnis, media “iklan komersial” bertujuan untuk …', visual: '📢 💼', options: ['Menghibur diri sendiri', 'Mempromosikan produk atau jasa kepada khalayak', 'Menyimpan berkas pribadi'], correct: 1 },
   { prompt: 'Kerangka bentuk atau rancangan visual suatu karya media cetak disebut …', visual: '🎨 📐', options: ['Desain', 'Suara', 'Piknik'], correct: 0 },
  ],
  kalimat: [
   { prompt: '“Curah hujan tinggi menyebabkan air sungai meluap sehingga wilayah pemukiman tergenang banjir.” Kalimat tersebut menunjukkan hubungan …', visual: '🌧️ 🌊 🏠', options: ['Sebab dan akibat', 'Perbandingan harga', 'Ungkapan salam'], correct: 0 },
   { prompt: 'Manakah kalimat yang menyatakan fakta secara objektif?', visual: '📊 📑', options: ['Pameran karya siswa berlangsung pada tanggal 10 hingga 12 November.', 'Menurut saya lukisan itu paling hebat di dunia.', 'Mungkin esok hari semua orang akan datang.'], correct: 0 },
   { prompt: 'Pilihlah kalimat ajakan yang efektif dalam poster promosi kegiatan sekolah.', visual: '📢 🎨', options: ['Ayo kunjungi bazar karya siswa kreatif di aula sekolah!', 'Kemarin mereka tidak datang ke aula.', 'Buku itu tertinggal di atas meja.'], correct: 0 },
  ],
  bacaan: [
   { prompt: 'Daur air dimulai dari penguapan air permukaan karena panas matahari. Uap air naik ke atmosfer, membentuk awan, lalu turun kembali sebagai hujan. Apa faktor utama penguapan air?', visual: '☀️ 🌊 ☁️ 🌧️', options: ['Tiupan angin malam', 'Panas sinar matahari', 'Tekanan air tanah'], correct: 1 },
   { prompt: 'Desain kemasan produk harus memuat informasi komposisi, tanggal kedaluwarsa, dan identitas produsen agar konsumen terlindungi. Mengapa informasi kedaluwarsa sangat penting?', visual: '🏷️ 📅', options: ['Mengetahui batas waktu keamanan konsumsi produk', 'Menghias tampilan warna wadah kemasan', 'Menambah bobot timbangan barang'], correct: 0 },
   { prompt: 'Pelatihan bahasa isyarat di lingkungan kerja membantu menciptakan komunikasi yang inklusif dan setara bagi rekan kerja Tuli. Apa dampak positif pelatihan tersebut?', visual: '🤝 🏢', options: ['Menumbuhkan lingkungan kerja yang inklusif dan saling memahami', 'Menghapus jam istirahat kerja', 'Membatasi pergaulan antarkaryawan'], correct: 0 },
  ],
  akademik: [
   { prompt: 'Harga sebuah buku adalah Rp20.000. Toko memberikan potongan harga 10%. Berapa jumlah potongan harganya?', visual: '🏷️ Rp20.000 × 10%', options: ['Rp1.000', 'Rp2.000', 'Rp5.000'], correct: 1 },
   { prompt: 'Seorang desainer grafis membutuhkan waktu 45 menit untuk membuat 1 halaman menu. Berapa lama waktu yang dibutuhkan untuk menyelesaikan 4 halaman?', visual: '⏱️ 45 menit × 4', options: ['2 jam', '3 jam (180 menit)', '4 jam 30 menit'], correct: 1 },
   { prompt: 'Modal awal pembuatan suvenir adalah Rp50.000. Setelah dijual, diperoleh pendapatan Rp75.000. Berapa keuntungan yang didapat?', visual: '💰 Rp75.000 − Rp50.000', options: ['Rp25.000', 'Rp15.000', 'Rp30.000'], correct: 0 },
  ],
 },
}
export const questionsForGrade = grade => Object.hasOwn(questionBank, grade) ? questionBank[grade] : questionBank.SD
