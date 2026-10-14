import { useAccount } from './Account.jsx'
import { createContext, useContext, useEffect, useState } from 'react'
import { allGradeLessons, lessonsForGrade } from './gradeLessons.js'
import { dictionaryForGrade } from './gradeDictionary.js'

export const aspects = [
  { id: 'kosakata', name: 'Kosakata', icon: 'book', color: 'purple', description: 'Kenali kata dan artinya.' },
  { id: 'kalimat', name: 'Kalimat', icon: 'text', color: 'blue', description: 'Susun kata, pahami makna.' },
  { id: 'bacaan', name: 'Bacaan', icon: 'file', color: 'pink', description: 'Temukan informasi dalam cerita.' },
  { id: 'akademik', name: 'Soal akademik', icon: 'shapes', color: 'yellow', description: 'Pahami konsep matematika.' },
]
export const lessons = allGradeLessons()
export const dictionary = ['SD', 'SMP', 'SMA'].flatMap(dictionaryForGrade)
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
export const initialState = { profile: null, assessment: null, assessmentDraft: null, mastered: [], attempts: [], settings: { textSize: 'normal', theme: 'light', speed: '1', comfortable: false, contrast: false, language: 'default', dataSaver: false } }
const Store = createContext(null)
export function Provider({ children }) {
 const account = useAccount()
 const userId = account?.session?.user.id
 const [state, setState] = useState(() => { try { return { ...structuredClone(initialState), settings: { ...initialState.settings, ...JSON.parse(localStorage.getItem('bahasakita-preferences') || '{}') } } } catch { return structuredClone(initialState) } })
 const [clips, setClips] = useState({})
 const [accountError, setAccountError] = useState('')
 const [accountReady, setAccountReady] = useState(false)
 useEffect(() => {
  let active = true
  setAccountReady(false); setAccountError(''); setClips({})
  setState(previous => ({ ...structuredClone(initialState), settings: previous.settings }))
  if (!userId) return () => { active = false }
  account.accountApi().then(data => {
   if (!active) return
   let saved = {}
   try { saved = JSON.parse(localStorage.getItem('bahasakita-learning-' + userId) || '{}') } catch {}
   setState({ ...structuredClone(initialState), assessment: saved.assessment || null, assessmentDraft: saved.assessmentDraft || null, mastered: saved.mastered || [], attempts: saved.attempts || [], profile: data.profile, settings: { ...initialState.settings, ...data.preferences } })
   setAccountReady(true)
  }).catch(error => { if (active) setAccountError(error.message) })
  return () => { active = false }
 }, [userId])
 useEffect(() => {
  try {
   localStorage.setItem('bahasakita-preferences', JSON.stringify(state.settings))
   if (userId && accountReady) localStorage.setItem('bahasakita-learning-' + userId, JSON.stringify({ assessment: state.assessment, assessmentDraft: state.assessmentDraft, mastered: state.mastered, attempts: state.attempts }))
  } catch {}
 }, [state, userId, accountReady])
 const saveProfile = async profile => {
  const data = await account.accountApi('/profile', profile)
  setState(previous => ({ ...previous, profile: { ...previous.profile, name: data.name, grade: data.grade, goal: data.goal } }))
 }
 const savePreferences = async () => { await account.accountApi('/preferences', state.settings) }
 useEffect(() => { document.documentElement.dataset.theme = state.settings.theme; document.documentElement.dataset.size = state.settings.textSize; document.documentElement.dataset.comfort = String(state.settings.comfortable); document.documentElement.dataset.contrast = String(state.settings.contrast); document.title = 'BahasaKita — Belajar dengan caramu' }, [state.settings])
 const update = patch => setState(previous => ({ ...previous, ...patch }))
 const setting = (key, value) => setState(previous => ({ ...previous, settings: { ...previous.settings, [key]: value } }))
 const catalog = lessonsForGrade(state.profile?.grade)
 const activeIds = new Set(catalog.map(lesson => lesson.id))
 const masteredLessons = state.mastered.filter(id => activeIds.has(id))
 const lessonAttempts = state.attempts.filter(attempt => attempt.type === 'lesson' && activeIds.has(attempt.lesson))
 const path = buildPath(state)
 const next = path.find(l => !state.mastered.includes(l.id))
 return <Store.Provider value={{ state, setState, update, setting, path, next, clips, setClips, saveProfile, savePreferences, accountError, accountReady, lessons: catalog, dictionary: dictionaryForGrade(state.profile?.grade), masteredLessons, lessonAttempts }}>{children}</Store.Provider>
}
export const useStore = () => useContext(Store)
export function buildPath(state) {
 const lessons = lessonsForGrade(state.profile?.grade)
 const last = state.attempts.filter(a => a.type === 'lesson' && lessons.some(l => l.id === a.lesson)).at(-1)
 const reinforcement = last && !last.mastered && !state.mastered.includes(last.lesson) ? last.lesson : null
 return [...lessons.filter(l => state.mastered.includes(l.id)), ...lessons.filter(l => !state.mastered.includes(l.id)).sort((a, b) => {
   if (a.id === reinforcement) return -1
   if (b.id === reinforcement) return 1
   return (state.assessment?.[a.aspect] ?? 0) - (state.assessment?.[b.aspect] ?? 0)
 })]
}
export const ASSESSMENT_PASS_SCORE = 80
export function assessmentScore(state) {
 if (!state.assessment) return null
 const latest = state.attempts.filter(a => a.type === 'assessment').at(-1)
 if (latest?.answers?.length === 8) return latest.answers.filter(a => a.correct).length / 8 * 100
 const scores = latest?.scores || state.assessment
 const values = aspects.map(a => scores[a.id])
 return values.every(v => Number.isFinite(v) && v >= 0 && v <= 100) ? values.reduce((sum, v) => sum + v, 0) / values.length : null
}
export function learningDestination(state) {
 const score = assessmentScore(state)
 return score === null ? '/assessment' : score >= ASSESSMENT_PASS_SCORE ? '/' : '/basic-class'
}
export function canOpen(id, state, path) { return learningDestination(state) === '/' && lessonsForGrade(state.profile?.grade).some(l => l.id === id) && path.some(l => l.id === id) }
export function level(score) { return score >= 80 ? 'Baik' : score >= 50 ? 'Cukup' : 'Perlu penguatan' }
export function evaluateLesson(answers, previous) {
 const score = answers.filter(a => a.correct).length / answers.length * 100
 const repeatedError = answers.some((a, i) => !a.correct && previous?.answers?.[i]?.correct === false)
 return { score, mastered: score >= 80 && !repeatedError, repeatedError }
}
