// Add only missing named views; leave existing user edits intact.
await Promise.all(styleJobs);
await figma.setCurrentPageAsync(desktopPage);
links.length = 0;
const additions = {};
const desktopNew = [];
function newDesktop(key, name) {
 const existing = desktopPage.children.find(n => n.name === 'UX / ' + name);
 if (existing) { additions[key] = existing.id; return null; }
 const root = frame(desktopPage, 'UX / ' + name, 1440, 'VERTICAL', 'bg', 0, 0);
 root.x = 6800 + (desktopNew.length % 3) * 1640;
 root.y = 200 + Math.floor(desktopNew.length / 3) * 1500;
 desktopNew.push(root); additions[key] = root.id;
 return root;
}
function note(parent, title, body, tone = 'purple') {
 const n = card(parent, title, 1132, tone);
 txt(n, title, 'Section', 'text', 1084);
 txt(n, body, 'Body', 'muted', 1084);
 return n;
}
function route(node, key) { links.push({ n: node, target: key }); }
function sourceVideo(parent, title, grade, width = 1084) {
 const v = card(parent, 'Video / ' + title, width, 'text', 24);
 icon(v, 'hand', 64);
 txt(v, title, 'Section', 'panel', width - 48);
 txt(v, grade + ' · Video YouTube dengan isyarat dan media visual', 'Body', 'panel', width - 48);
 const controls = frame(v, 'Kontrol video', width - 48, 'HORIZONTAL', null, 0, 16);
 icon(controls, 'play'); txt(controls, '00:00   ━━━━━━━━━━   CC   1×   ⛶', 'Body', 'panel', width - 100);
 return v;
}
let r = newDesktop('intro', 'Asesmen · Pengantar');
if (r) {
 const m = shell(r, 'Asesmen awal');
 heading(m, 'Bukan ujian. Ini titik awalmu.', 'Jawab sesuai yang kamu pahami. Tidak perlu terburu-buru.');
 const c = card(m, 'Pengantar asesmen', 1132);
 icon(c, 'shapes', 56); txt(c, '8 soal, 4 aspek kemampuan', 'Heading');
 txt(c, 'Kosakata, kalimat, bacaan, dan matematika dasar sesuai jenjang belajarmu.', 'Body', 'muted', 1084);
 txt(c, 'Sekitar 5 menit · Bisa dijeda dan dilanjutkan', 'Caption', 'muted', 1084);
 button(c, 'Mulai asesmen', 'Asesmen awal');
}
for (const passed of [true, false]) {
 const key = passed ? 'passed' : 'foundation';
 r = newDesktop(key, passed ? 'Asesmen · Lulus' : 'Asesmen · Perlu penguatan');
 if (!r) continue;
 const m = shell(r, 'Asesmen awal', !passed);
 heading(m, passed ? 'Semua fitur belajar terbuka' : 'Mulai dari kelas belajar dasar', 'Nilai asesmenmu ' + (passed ? '90' : '60') + '/100. Batas kelulusan adalah 80.');
 const row = frame(m, 'Profil kemampuan', 1132, 'HORIZONTAL', null, 0, 20);
 for (const [aspect, value] of [['Kosakata', passed ? '100%' : '50%'], ['Kalimat', passed ? '100%' : '50%'], ['Bacaan', passed ? '75%' : '75%'], ['Soal akademik', passed ? '75%' : '50%']]) {
  const c = card(row, aspect, 268); txt(c, aspect, 'Section', 'text', 220); txt(c, value, 'Heading'); txt(c, passed ? 'Siap bertumbuh' : 'Perlu penguatan', 'Caption', 'muted', 220);
 }
 const c = note(m, passed ? 'Kamu siap melanjutkan belajar' : 'Kita kuatkan dasar bersama', passed ? 'Jalur belajar, materi, kamus, dan kemajuan sudah bisa diakses.' : 'Pelajari video materi asesmen di kelas dasar, lalu ulangi asesmen hingga nilai minimal 80.', passed ? 'purple' : 'yellow');
 button(c, passed ? 'Lanjut belajar' : 'Masuk kelas belajar dasar', passed ? 'Belajar' : 'Kelas belajar dasar');
}
for (const grade of ['SD', 'SMP', 'SMA']) {
 r = newDesktop('learn' + grade, 'Belajar · ' + grade);
 if (r) {
  const m = shell(r, 'Belajar'); heading(m, 'Jalur yang dibuat untukmu.', 'Kosakata, materi, dan video mengikuti jenjang ' + grade + '.'); tag(m, 'Jenjang ' + grade);
  for (let i = 0; i < projectContent[grade].videos.length; i += 2) {
   const row = frame(m, 'Materi ' + grade, 1132, 'HORIZONTAL', null, 0, 24);
   for (const v of projectContent[grade].videos.slice(i, i + 2)) {
    const c = use(row, 'LessonCard', { title: v.title, body: v.sourceLevel + ' · Kenali kata, lihat isyarat, lalu coba latihan.' }, 554); route(c, 'Materi belajar');
   }
  }
  const b = button(m, 'Lihat kosakata ' + grade, null, true); route(b, 'dict' + grade);
 }
 r = newDesktop('dict' + grade, 'Kamus visual · ' + grade);
 if (r) {
  const m = shell(r, 'Kamus visual'); heading(m, 'Kamus visual', 'Arti kata dan konteks gerakan dari video pembelajaran jenjang ' + grade + '.'); tag(m, 'Jenjang ' + grade);
  field(m, 'Cari kosakata', 'Cari kata yang ingin kamu kenali', false, false, 650);
  const filter = frame(m, 'Filter kategori', 1132, 'HORIZONTAL', null, 0, 12);
  for (const category of ['Semua', ...new Set(projectContent[grade].words.map(w => w.category))].slice(0, 5)) button(filter, category, null, category !== 'Semua');
  for (let i = 0; i < projectContent[grade].words.length; i += 4) {
   const row = frame(m, 'Kosakata sumber proyek', 1132, 'HORIZONTAL', null, 0, 20);
   for (const w of projectContent[grade].words.slice(i, i + 4)) { const c = use(row, 'WordCard', { title: w.word, meaning: w.meaning, category: w.category }, 268); route(c, 'word' + grade); }
  }
 }
 r = newDesktop('word' + grade, 'Arti kata & video · ' + grade);
 if (r) {
  const m = shell(r, 'Kamus visual'); const w = projectContent[grade].words[0];
  heading(m, w.word, 'Kamus visual · ' + grade + ' · ' + w.category);
  const c = card(m, 'Arti & contoh', 1132); txt(c, w.meaning, 'Section', 'text', 1084); txt(c, w.example, 'Body', 'muted', 1084);
  txt(c, 'Lihat kata dalam video', 'Section'); txt(c, w.videoTitle, 'Body', 'muted', 1084);
  const t = Math.floor(w.start / 60) + ':' + String(w.start % 60).padStart(2, '0');
  txt(c, 'Mulai sekitar ' + t + ' untuk melihat konteks kata dan gerakan dalam materi.', 'Caption', 'muted', 1084);
  sourceVideo(c, w.videoTitle, grade); const b = button(c, 'Kembali ke kamus', null, true); route(b, 'dict' + grade);
 }
}
r = newDesktop('gated', 'Beranda · Sebelum asesmen');
if (r) {
 const m = shell(r, 'Beranda'); heading(m, 'Halo, teman belajar!', 'Kamu tetap bisa menjelajahi halaman setelah membuat akun.');
 const n = note(m, 'Kenali kemampuanmu terlebih dahulu', 'Selesaikan asesmen awal sebelum memakai fitur belajar.'); button(n, 'Mulai asesmen awal', 'Asesmen awal');
 const row = frame(m, 'Jelajahi fitur', 1132, 'HORIZONTAL', null, 0, 24);
 for (const title of ['Belajar', 'Kamus visual']) { const c = card(row, title, 554); icon(c, 'lock', 36); txt(c, title, 'Heading'); txt(c, 'Halaman bisa dilihat. Mulai aktivitas setelah menyelesaikan asesmen.', 'Body', 'muted', 506); button(c, 'Kerjakan asesmen', 'Asesmen awal'); }
}
for (const stage of ['Kenali', 'Amati', 'Coba', 'Evaluasi']) {
 r = newDesktop('stage' + stage, 'Materi · ' + stage);
 if (!r) continue;
 const m = shell(r, 'Belajar'); heading(m, 'Tumbuhan di sekitar kita', 'SD · Kosakata · Tahap ' + stage);
 const steps = frame(m, 'Empat tahap belajar', 1132, 'HORIZONTAL', null, 0, 16);
 for (const [i, name] of ['Kenali', 'Amati', 'Coba', 'Evaluasi'].entries()) { const b = button(steps, (i + 1) + ' · ' + name, null, name !== stage); route(b, 'stage' + name); }
 const c = card(m, 'Isi materi / ' + stage, 1132);
 if (stage === 'Kenali') { txt(c, 'Kenali tumbuhan di sekitar kita', 'Heading', 'text', 1084); txt(c, 'Amati kata, arti, dan contoh pada video sebelum berlatih.', 'Body', 'muted', 1084); sourceVideo(c, projectContent.SD.videos[0].title, 'SD'); }
 if (stage === 'Amati') { txt(c, 'Amati contoh ini', 'Heading'); txt(c, projectContent.SD.words[0].example, 'Section', 'text', 1084); txt(c, projectContent.SD.words[0].meaning, 'Body', 'muted', 1084); button(c, 'Lihat arti dalam kamus', 'Kamus visual', true); }
 if (stage === 'Coba') { txt(c, 'Latihan interaktif', 'Heading'); txt(c, 'Pilih kata yang sesuai dengan contoh pada materi.', 'Body', 'muted', 1084); for (const w of projectContent.SD.words.slice(0, 3)) button(c, w.word, null, true, 500); note(m, 'Tepat! Kamu sudah memahami contoh ini.', 'Lanjutkan ke evaluasi untuk memeriksa pemahamanmu.'); }
 if (stage === 'Evaluasi') { tag(c, 'SOAL 1 DARI 5'); txt(c, 'Apa yang tumbuh pada pohon mangga?', 'Heading', 'text', 1084); for (const w of ['Buah mangga', 'Ikan', 'Ayam']) button(c, w, null, true, 500); txt(c, 'Target penguasaan: 4 dari 5 soal', 'Caption', 'muted'); }
 const i = ['Kenali', 'Amati', 'Coba', 'Evaluasi'].indexOf(stage); const b = button(m, stage === 'Evaluasi' ? 'Lihat hasil' : 'Lanjutkan'); route(b, i === 3 ? 'mastered' : 'stage' + ['Kenali', 'Amati', 'Coba', 'Evaluasi'][i + 1]);
}
for (const ok of [true, false]) {
 r = newDesktop(ok ? 'mastered' : 'retry', ok ? 'Evaluasi · Materi dikuasai' : 'Evaluasi · Penguatan');
 if (!r) continue;
 const m = shell(r, 'Belajar'); heading(m, ok ? 'Satu langkah baru sudah kamu kuasai.' : 'Kamu sedang bertumbuh.', 'Tumbuhan di sekitar kita · Hasil evaluasi');
 const c = card(m, 'Hasil evaluasi', 1132, ok ? 'purple' : 'yellow'); icon(c, ok ? 'trophy' : 'leaf', 56); txt(c, ok ? '4 dari 5 jawaban tepat' : '2 dari 5 jawaban tepat', 'Heading'); txt(c, ok ? 'Materi ini sudah dikuasai. Kamu bisa melanjutkan atau mengulang.' : 'Coba contoh dan penjelasan kembali sebelum mengulang evaluasi.', 'Body', 'muted', 1084);
 button(c, ok ? 'Lanjut belajar' : 'Lihat materi lagi', ok ? 'Belajar' : 'Materi belajar'); if (!ok) route(button(c, 'Ulangi evaluasi', null, true), 'stageEvaluasi');
}
for (const [key, name, title, description, action, destination] of [
 ['empty', 'Kamus · Kata tidak ditemukan', 'Kata belum ditemukan', 'Coba kata lain atau tampilkan semua kategori dan video.', 'Lihat semua kata', 'Kamus visual'],
 ['confirm', 'Register · Konfirmasi email', 'Akun dibuat', 'Periksa email untuk konfirmasi, lalu login.', 'Kembali ke login', 'Login'],
 ['rate', 'Register · Batas email', 'Email verifikasi belum dapat dikirim', 'Batas pengiriman email verifikasi tercapai. Tunggu beberapa saat sebelum mencoba kembali.', 'Kembali ke register', 'Register'],
 ['profileError', 'Akun · Profil gagal dimuat', 'Profil belum dapat dimuat', 'Periksa koneksi lalu coba kembali. Perubahan belum tersimpan.', 'Coba lagi', 'Pengaturan'],
 ['missing', 'Halaman tidak ditemukan', 'Halaman ini belum ditemukan.', 'Kembali ke ruang belajar dan lanjutkan perjalananmu.', 'Kembali ke beranda', 'Beranda']
]) {
 r = newDesktop(key, name); if (!r) continue;
 const m = shell(r, key === 'empty' ? 'Kamus visual' : 'Beranda'); const c = card(m, title, 1132); icon(c, key === 'confirm' ? 'mail' : 'info', 48); txt(c, title, 'Heading', 'text', 1084); txt(c, description, 'Body', 'muted', 1084); button(c, action, destination);
}
// Dark versions preserve the existing editable hierarchy.
for (const [key, source] of [['loginDark', 'Login'], ['registerDark', 'Register'], ['dictionaryDark', 'Kamus visual']]) {
 const name = 'UX / ' + source + ' · Gelap';
 const exists = desktopPage.children.find(n => n.name === name);
 if (exists) { additions[key] = exists.id; continue; }
 const original = await figma.getNodeByIdAsync(screenIds[source]);
 const clone = original.clone(); desktopPage.appendChild(clone); clone.name = name;
 desktopNew.push(clone); additions[key] = clone.id; created.push(clone.id);
 for (const n of [clone, ...clone.findAll(() => true)]) {
  if (Array.isArray(n.fills)) n.fills = n.fills.map(f => { if (f.type !== 'SOLID') return f; const match = Object.entries(state.semantic.Light).find(([k, v]) => f.boundVariables?.color?.id === v); return match ? paint(match[0], 'Dark') : f; });
  if (Array.isArray(n.strokes)) n.strokes = n.strokes.map(f => f.type === 'SOLID' ? paint('border', 'Dark') : f);
 }
}
await Promise.all(styleJobs);
for (const { n, target } of links) {
 const destinationId = additions[target] || screenIds[target]; if (!destinationId) continue;
 let top = n; while (top.parent && top.parent.type !== 'PAGE') top = top.parent;
 if (top.id !== destinationId) await n.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId, navigation: 'NAVIGATE', transition: null, preserveScrollPosition: false }] }]);
}
const allUX = desktopPage.children.filter(n => n.type === 'FRAME' && n.name.startsWith('UX / '));
let uxY = 200;
for (let i = 0; i < allUX.length; i += 3) { const group = allUX.slice(i, i + 3); group.forEach((n, k) => { n.x = 6800 + k * 1640; n.y = uxY; }); uxY += Math.max(...group.map(n => n.height)) + 180; }

await figma.setCurrentPageAsync(mobilePage);
const mobileAdded = [];
for (const [key, title] of [['basic', 'Kelas belajar dasar'], ['progress', 'Kemajuan saya'], ['profile', 'Profil saya'], ['word', 'Arti kata & video'], ['lesson', 'Materi belajar'], ['passed', 'Hasil asesmen · Lulus'], ['foundation', 'Hasil asesmen · Penguatan']]) {
 const name = 'Mobile UX / ' + title;
 if (mobilePage.children.some(n => n.name === name)) continue;
 const root = frame(mobilePage, name, 390, 'VERTICAL', 'bg', 20, 24);
 mobileAdded.push(root); root.x = 200 + (mobileAdded.length - 1) * 470; root.y = 2600;
 logo(root, 160); heading(root, title, 'BahasaKita · Jenjang SD', 350);
 const content = card(root, 'Isi / ' + title, 350, 'panel', 20);
 if (key === 'basic') {
  tag(content, 'Nilai asesmen: 60/100'); txt(content, 'Kita kuatkan dasar bersama.', 'Section', 'text', 310);
  txt(content, 'Pelajari video materi dasar, lalu ulangi asesmen hingga nilai minimal 80.', 'Body', 'muted', 310);
  for (const t of ['Kosakata dasar', 'Kalimat', 'Bacaan', 'Matematika dasar']) button(content, t, null, true, 310);
  txt(content, 'Video penjelasan visual dengan teks, tanpa suara.', 'Body', 'muted', 310); button(content, 'Ulangi asesmen awal', null, false, 310);
 } else if (key === 'progress') {
  txt(content, 'Setiap langkahmu berarti.', 'Section', 'text', 310);
  for (const [value, label] of [['90/100', 'Nilai asesmen'], ['2 materi', 'Sudah dikuasai'], ['4 sesi', 'Sesi belajar tercatat']]) use(content, 'Stat', { value, label }, 310);
 } else if (key === 'profile') {
  icon(content, 'profile', 48); txt(content, 'Dina', 'Heading'); tag(content, 'SD'); txt(content, 'Tujuan: Mengenal kata', 'Body', 'muted', 310); button(content, 'Edit profil', null, true, 310);
 } else if (key === 'word') {
  const w = projectContent.SD.words[0]; tag(content, w.category); txt(content, w.word, 'Heading'); txt(content, w.meaning, 'Body', 'muted', 310); txt(content, w.example, 'Body', 'text', 310); txt(content, w.videoTitle, 'Label', 'text', 310); button(content, 'Putar bagian video', null, false, 310);
 } else if (key === 'lesson') {
  txt(content, 'Tumbuhan di sekitar kita', 'Section', 'text', 310);
  for (const label of ['1 · Kenali', '2 · Amati', '3 · Coba', '4 · Evaluasi']) tag(content, label);
  video(content, projectContent.SD.videos[0].title, 310); txt(content, 'Kenali kata, lihat contoh, lalu coba latihan.', 'Body', 'muted', 310); button(content, 'Lanjut ke latihan', null, false, 310);
 } else {
  const pass = key === 'passed'; icon(content, pass ? 'trophy' : 'leaf', 48); txt(content, pass ? '90/100' : '60/100', 'Heading');
  txt(content, pass ? 'Semua fitur belajar terbuka.' : 'Mulai dari kelas belajar dasar.', 'Section', 'text', 310);
  txt(content, 'Batas kelulusan: 80', 'Body', 'muted', 310); button(content, pass ? 'Lanjut belajar' : 'Masuk kelas dasar', null, false, 310);
 }
 const back = button(root, 'Kembali ke beranda', null, true, 350);
 const mobileHome = mobilePage.children.find(n => n.name === 'Mobile / Beranda');
 if (mobileHome) await back.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: mobileHome.id, navigation: 'NAVIGATE', transition: null, preserveScrollPosition: false }] }]);
}
await Promise.all(styleJobs);
await figma.setCurrentPageAsync(desktopPage);
const overview = await figma.getNodeByIdAsync(additions.learnSMP || screenIds.Belajar);
figma.viewport.scrollAndZoomIntoView([overview]);
