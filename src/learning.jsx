import { createContext, useContext, useEffect, useState } from 'react'

export const aspects = [
  { id: 'kosakata', name: 'Kosakata', icon: 'book', color: 'purple', description: 'Kenali kata dan artinya.' },
  { id: 'kalimat', name: 'Kalimat', icon: 'text', color: 'blue', description: 'Susun kata, pahami makna.' },
  { id: 'bacaan', name: 'Bacaan', icon: 'file', color: 'pink', description: 'Temukan informasi dalam cerita.' },
  { id: 'akademik', name: 'Soal akademik', icon: 'shapes', color: 'yellow', description: 'Pahami konsep matematika.' },
]
export const lessons = [
  { id: 'kata', aspect: 'kosakata', title: 'Kata di sekitarku', description: 'Kenali benda yang kamu temui setiap hari.', emoji: '🌱', time: 8, level: 'Dasar', word: 'Buku', example: 'Saya membaca buku.', intro: 'Kamu akan mengenali benda, lalu memilih kata yang sesuai dengan gambarnya.', tip: 'Lihat bentuk bendanya. Buku punya halaman yang dapat dibuka.', visual: '📚', explanation: 'Buku berisi halaman. Kita dapat membaca cerita atau informasi di dalamnya.', practice: { prompt: 'Gambar ini menunjukkan apa?', visual: '📚', options: ['Buku', 'Meja', 'Sepatu'], correct: 0 }, quiz: [
    { prompt: 'Benda untuk membaca cerita adalah …', options: ['Sepatu', 'Buku', 'Gelas'], correct: 1 },
    { prompt: '📏 Kata yang sesuai gambar adalah …', options: ['Penggaris', 'Buku', 'Tas'], correct: 0 },
    { prompt: '✏️ Kita menulis dengan …', options: ['Gelas', 'Sepatu', 'Pensil'], correct: 2 },
    { prompt: '🎒 Benda untuk membawa buku adalah …', options: ['Tas', 'Piring', 'Jam'], correct: 0 },
    { prompt: '🪑 Kata yang sesuai gambar adalah …', options: ['Meja', 'Kursi', 'Buku'], correct: 1 },
  ] },
  { id: 'kalimat', aspect: 'kalimat', title: 'Menyusun kalimat', description: 'Gabungkan kata menjadi cerita kecil.', emoji: '🧩', time: 10, level: 'Dasar', word: 'Membaca', example: 'Dina membaca buku.', intro: 'Kamu akan menyusun kalimat dan mencari siapa yang melakukan kegiatan.', tip: 'Mulai dari siapa, lalu kegiatannya, lalu bendanya: Dina → membaca → buku.', visual: '👧 📖', explanation: 'Dina adalah orangnya. Membaca adalah kegiatannya. Buku adalah benda yang dibaca.', practice: { prompt: 'Susun kata menjadi kalimat.', words: ['buku', 'Dina', 'membaca'], answer: 'Dina membaca buku' }, quiz: [
    { prompt: 'Kalimat yang urut adalah …', options: ['Buku Dina membaca.', 'Dina membaca buku.', 'Membaca buku Dina.'], correct: 1 },
    { prompt: '“Budi makan nasi.” Siapa yang makan?', options: ['Budi', 'Nasi', 'Dina'], correct: 0 },
    { prompt: '“Ibu menyiram tanaman.” Apa kegiatannya?', options: ['Tanaman', 'Ibu', 'Menyiram'], correct: 2 },
    { prompt: '“Dina membawa tas.” Apa yang dibawa?', options: ['Buku', 'Tas', 'Sepatu'], correct: 1 },
    { prompt: 'Kalimat untuk 🧒 ✍️ adalah …', options: ['Anak menulis.', 'Anak tidur.', 'Anak makan.'], correct: 0 },
  ] },
  { id: 'cerita', aspect: 'bacaan', title: 'Cerita di taman', description: 'Baca cerita pendek dan temukan maknanya.', emoji: '🌳', time: 10, level: 'Dasar', word: 'Taman', example: 'Dina bermain di taman.', intro: 'Kamu akan membaca cerita pendek, lalu menemukan siapa, tempat, dan kegiatan dalam cerita.', tip: 'Cari satu informasi dulu. Siapa? Dina. Di mana? Di taman. Apa kegiatannya? Menyiram bunga.', visual: '🌳 🌷 🧒', explanation: 'Dina pergi ke taman pagi hari. Ia membawa air. Dina menyiram bunga. Bunganya berwarna pink.', practice: { prompt: 'Di mana Dina berada?', options: ['Sekolah', 'Taman', 'Rumah'], correct: 1 }, quiz: [
    { prompt: 'Siapa yang pergi ke taman?', options: ['Budi', 'Ibu', 'Dina'], correct: 2 },
    { prompt: 'Kapan Dina pergi?', options: ['Pagi', 'Malam', 'Sore'], correct: 0 },
    { prompt: 'Apa yang dibawa Dina?', options: ['Buku', 'Air', 'Sepatu'], correct: 1 },
    { prompt: 'Apa yang Dina lakukan?', options: ['Membaca', 'Tidur', 'Menyiram bunga'], correct: 2 },
    { prompt: 'Apa warna bunganya?', options: ['Pink', 'Biru', 'Kuning'], correct: 0 },
  ] },
  { id: 'hitung', aspect: 'akademik', title: 'Ayo menghitung', description: 'Pahami penjumlahan dengan gambar.', emoji: '🍎', time: 8, level: 'Dasar', word: 'Tambah', example: 'Dua apel ditambah satu apel menjadi tiga apel.', intro: 'Kamu akan menghitung benda dan menggabungkan dua kelompok.', tip: 'Hitung setiap benda satu per satu. Kelompok pertama 2, lalu tambah 1. Jumlahnya 3.', visual: '🍎🍎 + 🍎', explanation: 'Tambah berarti menggabungkan. Dua apel dan satu apel menjadi tiga apel. 2 + 1 = 3.', practice: { prompt: '🍎🍎 + 🍎 = berapa apel?', options: ['2', '3', '4'], correct: 1 }, quiz: [
    { prompt: '🍎 + 🍎 = …', options: ['1', '2', '3'], correct: 1 },
    { prompt: '2 + 1 = …', options: ['3', '2', '4'], correct: 0 },
    { prompt: '🍎🍎 + 🍎🍎 = …', options: ['2', '3', '4'], correct: 2 },
    { prompt: '1 + 3 = …', options: ['4', '3', '5'], correct: 0 },
    { prompt: '3 + 2 = …', options: ['4', '5', '6'], correct: 1 },
  ] },
]
export const dictionary = [
  { word: 'Buku', emoji: '📚', meaning: 'Benda berisi halaman untuk dibaca.', example: 'Saya membaca buku.', category: 'Benda' },
  { word: 'Membaca', emoji: '📖', meaning: 'Melihat tulisan dan memahami artinya.', example: 'Dina membaca cerita.', category: 'Kegiatan' },
  { word: 'Taman', emoji: '🌳', meaning: 'Tempat dengan tanaman dan bunga.', example: 'Dina bermain di taman.', category: 'Tempat' },
  { word: 'Tambah', emoji: '➕', meaning: 'Menggabungkan dua jumlah.', example: 'Dua ditambah satu menjadi tiga.', category: 'Matematika' },
  { word: 'Air', emoji: '💧', meaning: 'Cairan untuk minum dan menyiram.', example: 'Dina membawa air.', category: 'Benda' },
  { word: 'Pensil', emoji: '✏️', meaning: 'Benda untuk menulis dan menggambar.', example: 'Saya menulis dengan pensil.', category: 'Benda' },
  { word: 'Bunga', emoji: '🌷', meaning: 'Bagian tanaman yang berwarna indah.', example: 'Bunga ini berwarna pink.', category: 'Benda' },
  { word: 'Menyiram', emoji: '🪴', meaning: 'Memberi air pada tanaman.', example: 'Dina menyiram bunga.', category: 'Kegiatan' },
]
export const questionBank = {
 kosakata: [
  { prompt: 'Pilih kata yang sesuai gambar.', visual: '📚', options: ['Buku', 'Sepatu', 'Gelas'], correct: 0 },
  { prompt: 'Apa arti “menyiram”?', visual: '🪴💧', options: ['Memetik bunga', 'Memberi air pada tanaman', 'Membaca buku'], correct: 1 },
  { prompt: 'Pilih nama benda ini.', visual: '✏️', options: ['Tas', 'Pensil', 'Kursi'], correct: 1 },
 ],
 kalimat: [
  { prompt: '“Dina membaca buku.” Siapa yang membaca?', visual: '👧 📖', options: ['Buku', 'Dina', 'Budi'], correct: 1 },
  { prompt: '“Sebelum makan, Budi mencuci tangan.” Apa yang dilakukan lebih dulu?', visual: '🧼 → 🍽️', options: ['Makan', 'Tidur', 'Mencuci tangan'], correct: 2 },
  { prompt: 'Pilih kalimat yang urut.', visual: '👧 📖', options: ['Dina membaca buku.', 'Buku Dina membaca.', 'Membaca Dina buku.'], correct: 0 },
 ],
 bacaan: [
  { prompt: 'Dina pergi ke taman. Ia menyiram bunga. Di mana Dina berada?', visual: '🌳 🌷', options: ['Rumah', 'Taman', 'Sekolah'], correct: 1 },
  { prompt: 'Bunga layu karena tanahnya kering. Dina memberi air agar bunga segar. Mengapa Dina memberi air?', visual: '🌷 💧', options: ['Agar bunga segar', 'Agar tanah kering', 'Untuk membaca'], correct: 0 },
  { prompt: 'Dina membawa buku ke sekolah. Apa yang dibawa Dina?', visual: '🎒 📚', options: ['Air', 'Sepatu', 'Buku'], correct: 2 },
 ],
 akademik: [
  { prompt: 'Dua apel ditambah satu apel. Berapa jumlahnya?', visual: '🍎🍎 + 🍎', options: ['2', '3', '4'], correct: 1 },
  { prompt: 'Ada 5 apel. Dua diberikan kepada Dina. Berapa apel yang tersisa?', visual: '🍎🍎🍎🍎🍎 − 2', options: ['7', '2', '3'], correct: 2 },
  { prompt: 'Satu apel ditambah satu apel. Berapa jumlahnya?', visual: '🍎 + 🍎', options: ['2', '3', '1'], correct: 0 },
 ],
}
export const initialState = { profile: null, assessment: null, assessmentDraft: null, mastered: [], attempts: [], settings: { textSize: 'normal', theme: 'light', speed: '1', comfortable: false, contrast: false, language: 'default', dataSaver: false } }
const Store = createContext(null)
export function Provider({ children }) {
 const [state, setState] = useState(() => { try { const stored = JSON.parse(localStorage.getItem('bahasakita-v1')); return stored ? { ...initialState, ...stored, settings: { ...initialState.settings, ...stored.settings } } : initialState } catch { return initialState } })
 const [clips, setClips] = useState({})
 useEffect(() => { try { localStorage.setItem('bahasakita-v1', JSON.stringify(state)) } catch {} }, [state])
 useEffect(() => { document.documentElement.dataset.theme = state.settings.theme; document.documentElement.dataset.size = state.settings.textSize; document.documentElement.dataset.comfort = String(state.settings.comfortable); document.documentElement.dataset.contrast = String(state.settings.contrast); document.title = 'BahasaKita — Belajar dengan caramu' }, [state.settings])
 const update = patch => setState(previous => ({ ...previous, ...patch }))
 const setting = (key, value) => setState(previous => ({ ...previous, settings: { ...previous.settings, [key]: value } }))
 const path = buildPath(state)
 const next = path.find(l => !state.mastered.includes(l.id))
 return <Store.Provider value={{ state, setState, update, setting, path, next, clips, setClips }}>{children}</Store.Provider>
}
export const useStore = () => useContext(Store)
export function buildPath(state) {
 const last = state.attempts.filter(a => a.type === 'lesson').at(-1)
 const reinforcement = last && !last.mastered && !state.mastered.includes(last.lesson) ? last.lesson : null
 return [...lessons.filter(l => state.mastered.includes(l.id)), ...lessons.filter(l => !state.mastered.includes(l.id)).sort((a, b) => {
   if (a.id === reinforcement) return -1
   if (b.id === reinforcement) return 1
   return (state.assessment?.[a.aspect] ?? 0) - (state.assessment?.[b.aspect] ?? 0)
 })]
}
export function canOpen(id, state, path) { const index = path.findIndex(l => l.id === id); return !!state.assessment && index >= 0 && path.slice(0, index).every(l => state.mastered.includes(l.id)) }
export function level(score) { return score >= 80 ? 'Baik' : score >= 50 ? 'Cukup' : 'Perlu penguatan' }
export function evaluateLesson(answers, previous) {
 const score = answers.filter(a => a.correct).length / answers.length * 100
 const repeatedError = answers.some((a, i) => !a.correct && previous?.answers?.[i]?.correct === false)
 return { score, mastered: score >= 80 && !repeatedError, repeatedError }
}
