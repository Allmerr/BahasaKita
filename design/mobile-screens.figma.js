// Continuation for the local development plugin; shared helpers come from desktop.
await Promise.all(styleJobs);
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync(state.pages.mobile));
const mobileIds = {};
links.length = 0;
const mobileNames = ['Login', 'Register', 'Beranda', 'Asesmen awal', 'Belajar', 'Kamus visual', 'Pengaturan'];
for (let i = 0; i < mobileNames.length; i++) {
 const root = frame(figma.currentPage, 'Mobile / ' + mobileNames[i], 390, 'VERTICAL', 'bg', 20, 24);
 root.x = 200 + i * 470;
 root.y = 200;
 mobileIds[mobileNames[i]] = root.id;
 const status = frame(root, 'Status perangkat', 350, 'HORIZONTAL', null, 0, 16);
 txt(status, '9:41', 'Label');
 txt(status, 'Wi-Fi · Baterai', 'Caption', 'muted');
 const header = frame(root, 'Header mobile', 350, 'HORIZONTAL', null, 0, 16);
 logo(header, 160);
 icon(header, 'sun', 24);
 icon(header, 'profile', 24);
 if (['Login', 'Register'].includes(mobileNames[i])) {
  const reg = mobileNames[i] === 'Register';
  heading(root, reg ? 'Mari kenalan dulu' : 'Selamat datang kembali', reg ? 'Buat profil, lalu kenali kemampuan awalmu.' : 'Masuk dan lanjutkan perjalanan belajarmu.', 350);
  if (reg) field(root, 'Nama panggilan', 'Nama panggilanmu', false, false, 350);
  field(root, 'Email', 'Alamat email', false, false, 350);
  field(root, 'Kata sandi', 'Minimal 8 karakter', true, false, 350);
  if (reg) {
   field(root, 'Konfirmasi kata sandi', 'Ulangi kata sandi', true, false, 350);
   field(root, 'Jenjang belajar', 'Pilih jenjang belajar', false, true, 350);
   txt(root, 'SD · SMP · SMA', 'Caption', 'primary', 350);
  }
  button(root, reg ? 'Register' : 'Masuk dan lanjutkan', reg ? 'Asesmen awal' : 'Beranda', false, 350);
  if (reg) txt(root, 'Periksa email untuk konfirmasi akun.', 'Caption', 'muted', 350);
  button(root, reg ? 'Sudah punya profil? Login' : 'Belum punya profil? Register', reg ? 'Login' : 'Register', true, 350);
 } else if (mobileNames[i] === 'Beranda') {
  heading(root, 'Halo, teman belajar!', 'Kita mulai dari langkah kecil.', 350);
  const hero = card(root, 'Caramu belajar', 350, 'purple', 20);
  txt(hero, 'Caramu belajar, cerita hebatmu.', 'Heading', 'text', 310);
  txt(hero, 'Video dengan isyarat dan visual sesuai jenjang belajarmu.', 'Body', 'muted', 310);
  video(hero, 'Tumbuhan di sekitar kita', 310);
  button(hero, 'Mulai perjalananmu', 'Asesmen awal', false, 310);
  use(root, 'Stat', { value: '4 aspek', label: 'Jalur sesuai kemampuanmu' }, 350);
  const a = card(root, 'Kenali kemampuan awalmu', 350);
  txt(a, 'Mulai dari mengenali dirimu', 'Section', 'text', 302);
  txt(a, '8 soal singkat untuk menyusun jalur belajar.', 'Body', 'muted', 302);
  button(a, 'Mulai asesmen', 'Asesmen awal');
  button(root, 'Jelajahi Kamus Visual', 'Kamus visual', true, 350);
 } else if (mobileNames[i] === 'Asesmen awal') {
  heading(root, 'Kenali kemampuan awalmu', 'Kerjakan perlahan, sesuai ritmemu.', 350);
  tag(root, 'SOAL 1 DARI 8');
  const q = card(root, 'Pertanyaan', 350);
  txt(q, 'Benda apa yang digunakan untuk membaca?', 'Section', 'text', 302);
  for (const answer of ['Buku', 'Pensil', 'Air']) button(q, answer, null, true, 302);
  button(root, 'Lanjutkan', 'Belajar', false, 350);
  txt(root, 'Nilai minimal 80 membuka fitur belajar. Nilai di bawah 80 masuk ke kelas dasar.', 'Caption', 'muted', 350);
 } else if (mobileNames[i] === 'Belajar') {
  heading(root, 'Jalur yang dibuat untukmu.', 'Materi dan kosakata sesuai jenjangmu.', 350);
  tag(root, 'Jenjang SD');
  for (const title of ['Tumbuhan di sekitar kita', 'Mengenal hewan peliharaan', 'Mengenal anggota keluarga']) {
   const lesson = use(root, 'LessonCard', { title, body: 'Lihat video isyarat, kenali kata, dan coba latihan.' }, 350);
   for (const child of lesson.children) if (child.type === 'TEXT' && child.width > 310) { child.textAutoResize = 'HEIGHT'; child.resize(310, child.height); }
  }
  button(root, 'Cari kata di kamus', 'Kamus visual', true, 350);
 } else if (mobileNames[i] === 'Kamus visual') {
  heading(root, 'Kamus visual', 'Kenali kata lewat arti dan video isyarat.', 350);
  tag(root, 'Jenjang SD');
  field(root, 'Cari kosakata', 'Cari kata yang ingin kamu kenali', false, false, 350);
  const filters = frame(root, 'Kategori', 350, 'HORIZONTAL', null, 0, 12);
  tag(filters, 'Semua'); tag(filters, 'Benda'); tag(filters, 'Kegiatan');
  for (const [title, meaning] of [['Tumbuhan', 'Makhluk hidup yang tumbuh di sekitar kita.'], ['Daun', 'Bagian tumbuhan yang biasanya berwarna hijau.'], ['Bunga', 'Bagian tumbuhan yang mekar.']]) use(root, 'WordCard', { title, meaning, category: 'Benda' }, 350);
 } else {
  heading(root, 'Pengaturan', 'Atur ruang belajar sesuai kebutuhanmu.', 350);
  const settings = card(root, 'Aksesibilitas', 350);
  txt(settings, 'Aksesibilitas', 'Section');
  for (const value of ['Ukuran teks: Normal', 'Tema: Terang / Gelap', 'Kecepatan video: 1×', 'Hemat data: Nonaktif']) txt(settings, value, 'Body', 'muted', 302);
  button(settings, 'Simpan pengaturan');
  const profile = card(root, 'Profil belajarmu', 350);
  field(profile, 'Nama panggilan', 'Dina', false, false, 302);
  field(profile, 'Jenjang', 'SD · SMP · SMA', false, true, 302);
  button(profile, 'Simpan profil');
  button(root, 'Keluar akun', 'Login', true, 350);
 }
 if (!['Login', 'Register'].includes(mobileNames[i])) {
  const nav = frame(root, 'Navigasi bawah', 350, 'HORIZONTAL', 'panel', 12, 12);
  for (const [name, label] of [['home', 'Beranda'], ['graduation', 'Belajar'], ['dictionary', 'Kamus visual'], ['settings', 'Pengaturan']]) {
   const item = frame(nav, label, 70, 'VERTICAL', null, 0, 4);
   item.counterAxisAlignItems = 'CENTER';
   icon(item, name, 22);
   txt(item, label === 'Kamus visual' ? 'Kamus' : label, 'Caption');
   links.push({ n: item, target: label });
  }
 }
}
for (const { n, target } of links) {
 const destinationId = mobileIds[target];
 if (!destinationId) continue;
 let root = n;
 while (root.parent && root.parent.type !== 'PAGE') root = root.parent;
 if (root.id === destinationId) continue;
 await n.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId, navigation: 'NAVIGATE', transition: null, preserveScrollPosition: false }] }]);
}
await Promise.all(styleJobs);
figma.currentPage.flowStartingPoints = [{ nodeId: mobileIds.Login, name: 'Mobile / Mulai' }];
figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync(mobileIds.Beranda)]);
