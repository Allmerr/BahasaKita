import { videosForGrade } from './youtubeMaterials.js'
import { additionalDictionaryForGrade } from './additionalDictionary.js'
import { dictionarySignVideo } from './dictionarySignVideos.js'

// Start points lead into the word's context, rather than claiming an isolated sign clip.
// Words and contexts were checked against sampled frames of these source videos.
const entries = {
 SD: [
  { word: 'Mangga', emoji: '🥭', category: 'Tumbuhan', meaning: 'Buah yang tumbuh pada pohon mangga.', example: 'Pohon mangga menghasilkan buah mangga.', videoId: 'iDDkYTki6pU', start: 80 },
  { word: 'Pepaya', emoji: '🌱', category: 'Tumbuhan', meaning: 'Buah yang tumbuh pada tanaman pepaya.', example: 'Kita menghitung buah pepaya pada gambar.', videoId: 'iDDkYTki6pU', start: 165 },
  { word: 'Jeruk', emoji: '🍊', category: 'Tumbuhan', meaning: 'Buah berkulit tebal dengan bagian dalam berupa beberapa ulas.', example: 'Ada dua buah jeruk pada gambar.', videoId: 'iDDkYTki6pU', start: 225 },
  { word: 'Ayam', emoji: '🐔', category: 'Hewan', meaning: 'Hewan unggas yang memiliki paruh, sayap, dan dua kaki.', example: 'Ayam dapat dipelihara di rumah.', videoId: '3KepM1ycETA', start: 75 },
  { word: 'Kambing', emoji: '🐐', category: 'Hewan', meaning: 'Hewan berkaki empat yang biasa dipelihara sebagai ternak.', example: 'Kambing berada di dalam kandang.', videoId: '3KepM1ycETA', start: 110 },
  { word: 'Ikan', emoji: '🐟', category: 'Hewan', meaning: 'Hewan yang hidup di air dan bernapas dengan insang.', example: 'Ikan berenang di kolam.', videoId: '3KepM1ycETA', start: 165 },
  { word: 'Keluarga', emoji: '👨‍👩‍👧‍👦', category: 'Keluarga', meaning: 'Unit terkecil dalam masyarakat yang terdiri atas ayah, ibu, dan anak.', example: 'Keluarga berkumpul bersama di rumah.', videoId: 'yiNe4PgcNow', start: 60 },
  { word: 'Ibu', emoji: '👩', category: 'Keluarga', meaning: 'Wanita yang melahirkan atau merawat kita dengan penuh kasih.', example: 'Ibu membimbing belajar di rumah.', videoId: 'yiNe4PgcNow', start: 120 },
  { word: 'Cuaca', emoji: '⛅', category: 'Alam', meaning: 'Keadaan udara pada suatu tempat dalam waktu tertentu.', example: 'Simbol cuaca membantu kita mengenali keadaan alam.', videoId: 'NGCqFchaj4g', start: 50 },
  { word: 'Hujan', emoji: '🌧️', category: 'Alam', meaning: 'Titik-titik air yang jatuh dari udara karena proses pendinginan.', example: 'Simbol hujan ditandai awan mendung dan tetesan air.', videoId: 'NGCqFchaj4g', start: 140 },
  { word: 'Tangan', emoji: '✋', category: 'Tubuh', meaning: 'Anggota badan dari pergelangan sampai ke ujung jari untuk memegang.', example: 'Kita menggunakan tangan untuk berisyarat.', videoId: 'KhsHyjBmGbE', start: 70 },
  { word: 'Mata', emoji: '👁️', category: 'Tubuh', meaning: 'Indra untuk melihat rupa, warna, dan gerakan di sekitar kita.', example: 'Mata mengamati visual dan gerak isyarat.', videoId: 'KhsHyjBmGbE', start: 110 },
 ],
 SMP: [
  { word: 'Sekolah', emoji: '🏫', category: 'Tempat', meaning: 'Tempat peserta didik belajar bersama guru.', example: 'Kita bersikap sopan di lingkungan sekolah.', videoId: '5TJG1D3OG1Y', start: 285 },
  { word: 'Sopan', emoji: '🤝', category: 'Sikap', meaning: 'Berperilaku baik dan menghargai orang lain.', example: 'Kita berbicara dengan sopan kepada guru.', videoId: '5TJG1D3OG1Y', start: 405 },
  { word: 'Permisi', emoji: '🙋', category: 'Ungkapan', meaning: 'Ungkapan untuk meminta izin atau perhatian dengan sopan.', example: 'Permisi, saya ingin lewat.', videoId: '5TJG1D3OG1Y', start: 410 },
  { word: 'Rekreasi', emoji: '🏖️', category: 'Kegiatan', meaning: 'Kegiatan untuk menyegarkan pikiran atau bersenang-senang.', example: 'Kita berekreasi bersama keluarga.', videoId: 'XmiXc0YUrXY', start: 285 },
  { word: 'Pelabuhan', emoji: '🚢', category: 'Tempat', meaning: 'Tempat kapal berlabuh untuk menaikkan atau menurunkan penumpang dan barang.', example: 'Kapal berhenti di pelabuhan.', videoId: 'XmiXc0YUrXY', start: 585 },
  { word: 'Kalimat', emoji: '💬', category: 'Bahasa', meaning: 'Kesatuan ujar yang mengungkapkan suatu konsep pikiran dan perasaan.', example: 'Kita menyusun kalimat berpola subjek dan predikat.', videoId: 'hGVrqkHtmzU', start: 85 },
  { word: 'Membaca', emoji: '📖', category: 'Kegiatan', meaning: 'Melihat serta memahami isi dari apa yang tertulis.', example: 'Peserta didik membaca teks dengan cermat.', videoId: 'hGVrqkHtmzU', start: 150 },
  { word: 'Gunung', emoji: '⛰️', category: 'Geografi', meaning: 'Bukit yang sangat besar dan tinggi.', example: 'Masyarakat beraktivitas di daerah lereng gunung.', videoId: 'aMYYehsQij0', start: 70 },
  { word: 'Pantai', emoji: '🏖️', category: 'Geografi', meaning: 'Wilayah daratan yang berbatasan langsung dengan laut.', example: 'Nelayan mencari ikan di sekitar pantai.', videoId: 'aMYYehsQij0', start: 130 },
  { word: 'Tanya', emoji: '❓', category: 'Bahasa', meaning: 'Permintaan penjelasan atau keterangan tentang sesuatu.', example: 'Gunakan kata tanya untuk menggali informasi.', videoId: 'RO9UZpkF-YI', start: 75 },
 ],
 SMA: [
  { word: 'Eksplanasi', emoji: '📝', category: 'Teks', meaning: 'Penjelasan tentang bagaimana atau mengapa suatu peristiwa terjadi.', example: 'Teks eksplanasi menjelaskan proses terjadinya hujan.', videoId: 'cvwI6-6lfGY', start: 75 },
  { word: 'Hujan', emoji: '🌧️', category: 'Peristiwa', meaning: 'Air yang jatuh dari awan ke permukaan bumi dalam bentuk titik-titik air.', example: 'Hujan merupakan salah satu peristiwa alam.', videoId: 'cvwI6-6lfGY', start: 165 },
  { word: 'Banjir', emoji: '🌊', category: 'Peristiwa', meaning: 'Peristiwa meluapnya air sehingga menggenangi wilayah yang biasanya kering.', example: 'Air yang meluap dapat menyebabkan banjir.', videoId: 'cvwI6-6lfGY', start: 165 },
  { word: 'Purwakarta', emoji: '📍', category: 'Tempat', meaning: 'Nama kabupaten di Provinsi Jawa Barat.', example: 'Purwakarta diperagakan dalam video kosakata isyarat.', videoId: 'EBTZFitRSEc', start: 80 },
  { word: 'Jambu', emoji: '🍎', category: 'Buah', meaning: 'Nama kelompok buah; pada video ditunjukkan gambar jambu air.', example: 'Gambar jambu membantu mengenali kata yang diperagakan.', videoId: 'EBTZFitRSEc', start: 110 },
  { word: 'Inggris', emoji: '🇬🇧', category: 'Tempat', meaning: 'Nama negara yang merupakan bagian dari Britania Raya.', example: 'Kata Inggris diperagakan bersama gambar bendera dalam video.', videoId: 'EBTZFitRSEc', start: 170 },
  { word: 'Iklan', emoji: '📢', category: 'Media', meaning: 'Pemberitahuan kepada khalayak mengenai barang atau jasa yang ditawarkan.', example: 'Iklan komersial mempromosikan produk kepada masyarakat.', videoId: 'KQD3tbb7_p0', start: 80 },
  { word: 'Informasi', emoji: '💡', category: 'Media', meaning: 'Pemberitahuan, kabar, atau berita tentang sesuatu hal.', example: 'Iklan layanan masyarakat menyajikan informasi edukatif.', videoId: 'KQD3tbb7_p0', start: 160 },
  { word: 'Desain', emoji: '🎨', category: 'Keterampilan', meaning: 'Kerangka bentuk atau rancangan suatu media visual.', example: 'Desain menu makanan dibuat rapi dan menarik.', videoId: 'Prifrka21FQ', start: 90 },
  { word: 'Menu', emoji: '📋', category: 'Keterampilan', meaning: 'Daftar jenis makanan dan minuman yang tersedia.', example: 'Daftar menu memudahkan pelanggan memilih hidangan.', videoId: 'Prifrka21FQ', start: 180 },
  { word: 'Komunikasi', emoji: '🗣️', category: 'Sosial', meaning: 'Pengiriman dan penerimaan pesan antara dua orang atau lebih.', example: 'Bahasa isyarat menjembatani komunikasi yang inklusif.', videoId: '4W_Ctu2Q0KA', start: 60 },
 ],
}
export function dictionaryForGrade(grade) {
 const videos = videosForGrade(grade)
 return [...(Object.hasOwn(entries, grade) ? entries[grade] : []), ...additionalDictionaryForGrade(grade)].map(entry => {
  const video = videos.find(item => item.id === entry.videoId) || dictionarySignVideo(grade, entry.word)
  return { ...entry, video, mediaStatus: video ? 'video-available' : entry.mediaStatus }
 })
}
export function videoTime(seconds) { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` }
