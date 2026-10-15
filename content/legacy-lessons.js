import { dictionaryForGrade } from '../src/gradeDictionary.js'

const q = (prompt, options, correct) => ({ prompt, options, correct })
const catalog = {
 SD: [
  { id: 'sd-tumbuhan', aspect: 'kosakata', title: 'Kenali tumbuhan dan buah', description: 'Kenali mangga, pepaya, dan jeruk lewat gambar dan isyarat.', emoji: '🥭', word: 'Mangga', words: ['Mangga', 'Pepaya', 'Jeruk'], time: 8, intro: 'Kamu akan mengenali tiga buah yang muncul pada video dan Kamus Visual SD.', explanation: 'Mangga tumbuh pada pohon mangga. Pepaya tumbuh pada tanaman pepaya. Jeruk memiliki kulit tebal dan bagian dalam berupa ulas.', tip: 'Perhatikan gambar buah, baca namanya, lalu amati bagian video yang sesuai.', visual: '🥭 🌱 🍊', practice: { prompt: 'Buah apa yang ditunjukkan gambar ini?', visual: '🥭', options: ['Mangga', 'Ayam', 'Ikan'], correct: 0 }, quiz: [
   q('Buah yang tumbuh pada pohon mangga adalah …', ['Jeruk', 'Mangga', 'Pepaya'], 1),
   q('Kata yang sesuai gambar 🍊 adalah …', ['Jeruk', 'Kambing', 'Ikan'], 0),
   q('Manakah yang merupakan nama buah?', ['Ayam', 'Kambing', 'Pepaya'], 2),
   q('Mangga, pepaya, dan jeruk termasuk …', ['Hewan', 'Buah', 'Tempat'], 1),
   q('Buah dengan bagian dalam berupa beberapa ulas adalah …', ['Jeruk', 'Ayam', 'Ikan'], 0),
  ] },
  { id: 'sd-kalimat', aspect: 'kalimat', title: 'Kalimat tentang hewan', description: 'Susun kalimat sederhana dengan kosakata hewan dari video.', emoji: '🐔', word: 'Ayam', words: ['Ayam', 'Kambing', 'Ikan'], time: 10, intro: 'Kamu akan memakai nama hewan untuk menyusun kalimat yang mudah dipahami.', explanation: 'Kalimat “Ayam makan jagung.” menyebutkan hewan, kegiatan, dan makanannya. “Ikan berenang di kolam.” menjelaskan kegiatan ikan dan tempatnya.', tip: 'Mulai dari hewannya, lalu kegiatannya, lalu tambahkan informasi lain.', visual: '🐔 🌽', practice: { prompt: 'Susun menjadi kalimat yang benar.', words: ['jagung', 'Ayam', 'makan'], answer: 'Ayam makan jagung' }, quiz: [
   q('Kalimat yang urut adalah …', ['Jagung ayam makan.', 'Ayam makan jagung.', 'Makan ayam jagung.'], 1),
   q('“Ikan berenang di kolam.” Hewan apa yang berenang?', ['Ikan', 'Ayam', 'Kambing'], 0),
   q('“Kambing makan rumput.” Apa yang dimakan?', ['Air', 'Jagung', 'Rumput'], 2),
   q('“Ayam berada di kandang.” Di mana ayam berada?', ['Kolam', 'Kandang', 'Sekolah'], 1),
   q('Kalimat yang sesuai dengan ikan adalah …', ['Ikan berenang di air.', 'Ikan tumbuh di pohon.', 'Ikan adalah buah.'], 0),
  ] },
  { id: 'sd-bacaan', aspect: 'bacaan', title: 'Cerita hewan di rumah', description: 'Baca cerita pendek memakai kosakata di Kamus Visual SD.', emoji: '🐟', word: 'Ikan', words: ['Ikan', 'Ayam', 'Kambing'], time: 10, intro: 'Kamu akan mencari siapa, tempat, dan kegiatan dalam cerita tentang hewan peliharaan.', explanation: 'Dina melihat hewan di rumah pagi hari. Ayam berada di kandang. Kambing makan rumput. Ikan berenang di kolam. Dina memberi makan ikan.', tip: 'Cari satu informasi dulu: siapa, kapan, di mana, atau apa kegiatannya.', visual: '🐔 🐐 🐟', practice: { prompt: 'Di mana ikan berenang dalam cerita?', options: ['Kandang', 'Kolam', 'Pohon'], correct: 1 }, quiz: [
   q('Siapa yang melihat hewan di rumah?', ['Budi', 'Dina', 'Ibu'], 1),
   q('Kapan Dina melihat hewan?', ['Pagi hari', 'Malam hari', 'Sore hari'], 0),
   q('Di mana ayam berada?', ['Kolam', 'Pohon', 'Kandang'], 2),
   q('Apa makanan kambing dalam cerita?', ['Jagung', 'Rumput', 'Buah'], 1),
   q('Hewan mana yang diberi makan oleh Dina?', ['Ikan', 'Kambing', 'Ayam'], 0),
  ] },
  { id: 'sd-hitung', aspect: 'akademik', title: 'Menghitung buah', description: 'Latih penjumlahan dan pengurangan dengan mangga dan jeruk.', emoji: '🍊', word: 'Jeruk', words: ['Jeruk', 'Mangga', 'Pepaya'], time: 8, intro: 'Kamu akan menghitung jumlah buah yang namanya sudah kamu kenal di Kamus Visual.', explanation: 'Ada 2 jeruk dan 1 jeruk lagi. Jumlahnya 3 jeruk: 2 + 1 = 3. Jika 1 jeruk diberikan kepada teman, tersisa 2 jeruk: 3 − 1 = 2.', tip: 'Hitung satu per satu. Tambah berarti digabungkan; kurang berarti diambil sebagian.', visual: '🍊🍊 + 🍊', practice: { prompt: 'Dua jeruk ditambah satu jeruk berjumlah …', options: ['2 jeruk', '3 jeruk', '4 jeruk'], correct: 1 }, quiz: [
   q('1 mangga + 1 mangga = …', ['1 mangga', '2 mangga', '3 mangga'], 1),
   q('2 jeruk + 1 jeruk = …', ['3 jeruk', '2 jeruk', '4 jeruk'], 0),
   q('4 pepaya − 1 pepaya = …', ['4 pepaya', '2 pepaya', '3 pepaya'], 2),
   q('2 mangga + 2 mangga = …', ['2 mangga', '4 mangga', '3 mangga'], 1),
   q('3 jeruk − 2 jeruk = …', ['1 jeruk', '2 jeruk', '5 jeruk'], 0),
  ] },
 ],
 SMP: [
  { id: 'smp-percakapan', aspect: 'kosakata', title: 'Kosakata percakapan sopan', description: 'Pahami sekolah, sopan, dan permisi dari video SMPLB.', emoji: '🏫', word: 'Sekolah', words: ['Sekolah', 'Sopan', 'Permisi'], time: 8, intro: 'Kamu akan memahami kosakata percakapan yang muncul pada video dan Kamus Visual SMP.', explanation: 'Sekolah adalah tempat belajar. Sopan berarti menghargai orang lain dalam perilaku dan ucapan. Permisi digunakan saat meminta izin atau perhatian dengan sopan.', tip: 'Perhatikan situasinya: di mana kamu berada, kepada siapa kamu berbicara, dan apa yang ingin kamu sampaikan.', visual: '🏫 🤝 🙋', practice: { prompt: 'Saat ingin melewati seseorang, ungkapan yang sesuai adalah …', options: ['Permisi.', 'Cepat pergi!', 'Diam!'], correct: 0 }, quiz: [
   q('Tempat peserta didik belajar bersama guru disebut …', ['Pelabuhan', 'Sekolah', 'Kolam'], 1),
   q('“Sopan” berarti …', ['Menghargai orang lain', 'Memaksa orang lain', 'Mengabaikan orang lain'], 0),
   q('Ungkapan untuk meminta izin lewat adalah …', ['Pindah!', 'Diam!', 'Permisi.'], 2),
   q('Contoh perilaku sopan adalah …', ['Memotong pembicaraan', 'Meminta izin sebelum lewat', 'Mendorong teman'], 1),
   q('Kata “sekolah” termasuk nama …', ['Tempat', 'Buah', 'Hewan'], 0),
  ] },
  { id: 'smp-kalimat', aspect: 'kalimat', title: 'Menyampaikan izin dengan santun', description: 'Pilih kalimat yang tepat untuk percakapan di sekolah.', emoji: '🙋', word: 'Permisi', words: ['Permisi', 'Sopan', 'Sekolah'], time: 10, intro: 'Kamu akan menyusun ungkapan izin dan memilih kalimat yang sesuai dengan situasi.', explanation: 'Kalimat “Permisi, saya ingin lewat.” menyampaikan tujuan dengan sopan. Saat ingin bertanya kepada guru, gunakan “Permisi, boleh saya bertanya?”', tip: 'Gunakan ungkapan sopan, sebutkan dirimu, lalu sampaikan tujuanmu dengan jelas.', visual: '🙋 🏫', practice: { prompt: 'Susun ungkapan untuk meminta izin lewat.', words: ['lewat.', 'Permisi,', 'saya ingin'], answer: 'Permisi, saya ingin lewat.' }, quiz: [
   q('Kalimat untuk meminta izin lewat adalah …', ['Cepat minggir!', 'Permisi, saya ingin lewat.', 'Saya tidak peduli.'], 1),
   q('Kalimat yang santun untuk bertanya kepada guru adalah …', ['Permisi, boleh saya bertanya?', 'Jawab sekarang!', 'Diam dulu!'], 0),
   q('Dalam “Permisi, saya ingin lewat.”, tujuan pembicara adalah …', ['Makan buah', 'Pergi berlayar', 'Meminta izin lewat'], 2),
   q('Kalimat yang tersusun jelas adalah …', ['Saya lewat permisi ingin.', 'Permisi, saya ingin lewat.', 'Ingin permisi lewat saya.'], 1),
   q('Mengapa ungkapan permisi digunakan?', ['Untuk menghargai orang lain', 'Untuk memaksa teman', 'Untuk mengejek guru'], 0),
  ] },
  { id: 'smp-bacaan', aspect: 'bacaan', title: 'Rekreasi ke pelabuhan', description: 'Temukan informasi penting dalam paragraf tentang rekreasi.', emoji: '🚢', word: 'Pelabuhan', words: ['Pelabuhan', 'Rekreasi'], time: 10, intro: 'Kamu akan membaca paragraf baru dengan kosakata dari video pemahaman bacaan SMP.', explanation: 'Pada hari Minggu, Rani berekreasi bersama keluarga ke pelabuhan. Mereka melihat kapal berlabuh. Kapal menaikkan penumpang. Rani mencatat kegiatan di pelabuhan untuk diceritakan di sekolah.', tip: 'Cari siapa, kapan, tempat, dan kegiatan. Gunakan informasi dalam paragraf untuk menjawab.', visual: '🚢 🏖️', practice: { prompt: 'Ke mana Rani berekreasi?', options: ['Kebun', 'Pelabuhan', 'Kolam'], correct: 1 }, quiz: [
   q('Siapa yang berekreasi dalam paragraf?', ['Dina', 'Rani', 'Budi'], 1),
   q('Kapan Rani berekreasi?', ['Hari Minggu', 'Hari Senin', 'Hari Jumat'], 0),
   q('Rani berekreasi bersama …', ['Guru', 'Teman sekolah', 'Keluarga'], 2),
   q('Apa kegiatan kapal dalam paragraf?', ['Menanam buah', 'Menaikkan penumpang', 'Memberi makan ikan'], 1),
   q('Mengapa Rani mencatat kegiatan di pelabuhan?', ['Untuk diceritakan di sekolah', 'Untuk menjual kapal', 'Untuk menghitung buah'], 0),
  ] },
  { id: 'smp-rencana', aspect: 'akademik', title: 'Menghitung rencana rekreasi', description: 'Gunakan waktu dan jumlah orang dalam konteks rekreasi.', emoji: '🏖️', word: 'Rekreasi', words: ['Rekreasi', 'Pelabuhan'], time: 10, intro: 'Kamu akan memakai kosakata rekreasi dan pelabuhan untuk berlatih menghitung waktu serta jumlah orang.', explanation: 'Keluarga berangkat pukul 08.00 dan tiba di pelabuhan pukul 09.00. Perjalanan berlangsung 1 jam atau 60 menit. Ada 3 orang dewasa dan 2 anak; jumlahnya 5 orang.', tip: 'Pisahkan informasi waktu dan jumlah orang. Tulis perhitungannya sebelum memilih jawaban.', visual: '🕗 → 🕘 🚢', practice: { prompt: 'Berangkat pukul 08.00 dan tiba pukul 09.00. Berapa lama perjalanan?', options: ['30 menit', '60 menit', '120 menit'], correct: 1 }, quiz: [
   q('3 orang dewasa dan 2 anak berjumlah …', ['4 orang', '5 orang', '6 orang'], 1),
   q('Perjalanan pukul 08.00 sampai 09.00 berlangsung …', ['1 jam', '2 jam', '3 jam'], 0),
   q('Satu jam sama dengan …', ['30 menit', '90 menit', '60 menit'], 2),
   q('Ada 8 orang. Dua orang pulang lebih dulu. Tersisa …', ['10 orang', '6 orang', '4 orang'], 1),
   q('Perjalanan berlangsung 45 menit, lalu istirahat 15 menit. Total waktu …', ['60 menit', '30 menit', '90 menit'], 0),
  ] },
 ],
 SMA: [
  { id: 'sma-kosakata', aspect: 'kosakata', title: 'Kosakata isyarat dalam konteks', description: 'Bedakan kosakata tempat dan buah pada video SMALB-B.', emoji: '📍', word: 'Purwakarta', words: ['Purwakarta', 'Jambu', 'Inggris'], time: 8, intro: 'Kamu akan mengamati kosakata isyarat dan membedakan maknanya berdasarkan konteks serta kategori.', explanation: 'Purwakarta adalah nama kabupaten di Jawa Barat. Inggris adalah nama negara yang merupakan bagian dari Britania Raya. Jambu adalah nama buah; gambar pada video menunjukkan jambu air.', tip: 'Cocokkan kata, gambar, dan kategori. Nama tempat dan nama buah memiliki konteks yang berbeda.', visual: '📍 🍎 🇬🇧', practice: { prompt: 'Kata yang termasuk nama buah adalah …', options: ['Purwakarta', 'Jambu', 'Inggris'], correct: 1 }, quiz: [
   q('Purwakarta merupakan nama …', ['Buah', 'Kabupaten', 'Peristiwa alam'], 1),
   q('Kata yang termasuk nama buah adalah …', ['Jambu', 'Inggris', 'Purwakarta'], 0),
   q('Nama negara pada materi kosakata isyarat adalah …', ['Jambu', 'Purwakarta', 'Inggris'], 2),
   q('Pasangan kata yang termasuk kategori tempat adalah …', ['Jambu dan hujan', 'Purwakarta dan Inggris', 'Banjir dan jambu'], 1),
   q('Untuk memahami makna kata dalam video, kita mencocokkan …', ['Kata, gambar, dan konteks', 'Suara saja', 'Urutan warna saja'], 0),
  ] },
  { id: 'sma-kalimat', aspect: 'kalimat', title: 'Kalimat sebab dan akibat', description: 'Hubungkan hujan dan banjir dalam kalimat yang logis.', emoji: '🌧️', word: 'Hujan', words: ['Hujan', 'Banjir', 'Eksplanasi'], time: 10, intro: 'Kamu akan membedakan penyebab dan akibat menggunakan kosakata pada materi eksplanasi.', explanation: '“Air sulit mengalir karena saluran tersumbat.” menyatakan penyebab. “Hujan deras membuat air bertambah sehingga jalan tergenang.” menunjukkan hubungan sebab dan akibat.', tip: 'Cari kata “karena” untuk penyebab dan “sehingga” untuk akibat. Baca seluruh kalimat agar hubungan informasinya jelas.', visual: '🌧️ → 🌊', practice: { prompt: 'Kata penghubung untuk melengkapi “Air sulit mengalir … saluran tersumbat.” adalah …', options: ['karena', 'tetapi', 'atau'], correct: 0 }, quiz: [
   q('Kata penghubung yang menyatakan penyebab adalah …', ['Dan', 'Karena', 'Atau'], 1),
   q('Dalam “Air sulit mengalir karena saluran tersumbat.”, penyebabnya adalah …', ['Saluran tersumbat', 'Air sulit mengalir', 'Langit cerah'], 0),
   q('Dalam “Hujan deras turun sehingga jalan tergenang.”, akibatnya adalah …', ['Hujan turun', 'Langit cerah', 'Jalan tergenang'], 2),
   q('Kalimat yang menunjukkan hubungan sebab dan akibat adalah …', ['Jambu berada di meja.', 'Saluran tersumbat sehingga air sulit mengalir.', 'Rani melihat gambar.'], 1),
   q('Kata “sehingga” pada kalimat tersebut membantu menjelaskan …', ['Akibat', 'Nama tempat', 'Pilihan buah'], 0),
  ] },
  { id: 'sma-eksplanasi', aspect: 'bacaan', title: 'Memahami teks eksplanasi', description: 'Temukan proses dan sebab peristiwa dalam bacaan sederhana.', emoji: '📝', word: 'Eksplanasi', words: ['Eksplanasi', 'Hujan', 'Banjir'], time: 12, intro: 'Kamu akan membaca contoh eksplanasi yang dibuat untuk latihan dengan kosakata dari video dan Kamus Visual SMA.', explanation: 'Hujan deras menambah jumlah air di suatu wilayah. Air biasanya mengalir melalui saluran. Jika saluran tersumbat, air sulit mengalir dan dapat meluap. Luapan air menggenangi jalan yang biasanya kering. Peristiwa ini disebut banjir.', tip: 'Temukan peristiwa yang dibahas, lalu urutkan prosesnya. Bedakan penyebab dengan akibat.', visual: '🌧️ 📝 🌊', practice: { prompt: 'Peristiwa yang dijelaskan pada bacaan adalah …', options: ['Panen jambu', 'Banjir', 'Rekreasi'], correct: 1 }, quiz: [
   q('Tujuan contoh teks tersebut adalah …', ['Menceritakan liburan', 'Menjelaskan proses banjir', 'Menjual buah'], 1),
   q('Apa yang menambah jumlah air menurut bacaan?', ['Hujan deras', 'Panen jambu', 'Kapal berlabuh'], 0),
   q('Mengapa air sulit mengalir dalam bacaan?', ['Udara dingin', 'Langit cerah', 'Saluran tersumbat'], 2),
   q('Akibat air meluap pada bacaan adalah …', ['Buah tumbuh', 'Jalan tergenang', 'Kapal berlayar'], 1),
   q('Teks eksplanasi menjelaskan …', ['Bagaimana atau mengapa peristiwa terjadi', 'Daftar nama buah saja', 'Perintah meminta izin saja'], 0),
  ] },
  { id: 'sma-data', aspect: 'akademik', title: 'Membaca data dalam laporan', description: 'Hitung dan bandingkan data contoh dalam konteks hujan.', emoji: '📊', word: 'Hujan', words: ['Hujan', 'Banjir', 'Eksplanasi'], time: 12, intro: 'Kamu akan membandingkan angka pada data contoh dan menulis kesimpulan yang sesuai.', explanation: 'Data latihan: Senin 10 mm, Selasa 20 mm, Rabu 30 mm. Totalnya 60 mm. Rata-rata tiga hari adalah 60 ÷ 3 = 20 mm. Data ini hanya untuk latihan dan tidak dipakai untuk memprediksi banjir.', tip: 'Jumlahkan semua nilai untuk total. Bagi total dengan jumlah hari untuk rata-rata. Kesimpulan harus sesuai data.', visual: '📊 🌧️', practice: { prompt: 'Total data 10 mm, 20 mm, dan 30 mm adalah …', options: ['30 mm', '60 mm', '90 mm'], correct: 1 }, quiz: [
   q('Nilai tertinggi pada data latihan terjadi pada …', ['Senin', 'Rabu', 'Selasa'], 1),
   q('Selisih nilai Rabu dan Senin adalah …', ['20 mm', '10 mm', '40 mm'], 0),
   q('Total data ketiga hari adalah …', ['30 mm', '50 mm', '60 mm'], 2),
   q('Rata-rata data ketiga hari adalah …', ['10 mm', '20 mm', '30 mm'], 1),
   q('Kesimpulan yang sesuai dengan data latihan adalah …', ['Nilai Rabu lebih besar daripada Senin.', 'Senin memiliki nilai terbesar.', 'Semua hari memiliki nilai sama.'], 0),
  ] },
 ],
}

export function lessonsForGrade(grade) {
 if (!Object.hasOwn(catalog, grade)) return []
 const dictionary = dictionaryForGrade(grade)
 return catalog[grade].map(lesson => {
  const wordEntry = dictionary.find(entry => entry.word === lesson.word)
  return { ...lesson, grade, level: grade === 'SD' ? 'Dasar' : grade === 'SMP' ? 'Menengah' : 'Lanjutan', wordEntry, relatedWords: lesson.words.map(word => dictionary.find(entry => entry.word === word)), example: wordEntry.example, video: wordEntry.video }
 })
}
export const allGradeLessons = () => ['SD', 'SMP', 'SMA'].flatMap(lessonsForGrade)
