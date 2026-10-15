// Source-faithful details and interaction states for the existing design.
await Promise.all(styleJobs);
await figma.setCurrentPageAsync(desktopPage);
const detailedRoots = [];
const dialogIds = {};
const hashes = {};
const createdDialogs = [];
const detailLinks = [];
const dialogPlayLinks = [];
function artHash(word) {
 if (!hashes[word] && emojiAssets[word]) hashes[word] = figma.createImage(figma.base64Decode(emojiAssets[word])).hash;
 return hashes[word];
}
function wordPicture(parent, word, size = 64) {
 const n = figma.createRectangle(); parent.appendChild(n); created.push(n.id); n.name = 'Illustration / ' + word; n.resize(size, size);
 n.fills = [{ type: 'IMAGE', imageHash: artHash(word), scaleMode: 'FIT' }]; return n;
}
function detailed(key, title) {
 const name = 'UX / ' + title;
 const exists = desktopPage.children.find(n => n.name === name);
 if (exists) return { root: exists, fresh: false };
 const root = frame(desktopPage, name, 1440, 'VERTICAL', 'bg', 0, 0); detailedRoots.push(root);
 return { root, fresh: true };
}
async function navTo(n, target, overlay = false) {
 let top=n;while(top.parent && top.parent.type!=='PAGE')top=top.parent;if(!overlay && top.id===target)return;
 await n.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: target, navigation: overlay ? 'OVERLAY' : 'NAVIGATE', transition: null, resetScrollPosition: true }] }]);
}
function sourcePlayer(parent, video, grade, width) {
 const player = card(parent, 'Video / ' + video.title, width, 'text', 24);
 icon(player, 'play', 48); txt(player, video.title, 'Section', 'panel', width - 48);
 txt(player, grade + ' · ' + video.accessibility, 'Body', 'panel', width - 48);
 txt(player, '00:00 ━━━━━━━━━━━━━━━━━ CC  1×', 'Caption', 'panel', width - 48);
 txt(parent, 'Aktifkan CC jika subtitle tersedia.', 'Caption', 'muted', width);
 return player;
}
// A distinct, closable modal for every source word, instead of one generic detail.
for (const [grade, data] of Object.entries(detailContent.grades)) {
 for (const w of data.words) {
  const name = 'Dialog / ' + grade + ' / ' + w.word;
  const existing = desktopPage.children.find(n => n.name === name);
  if (existing) { dialogIds[grade + ':' + w.word] = existing.id; continue; }
  const d = card(desktopPage, name, 660, 'panel', 32); createdDialogs.push(d);
  d.x = 12000 + (createdDialogs.length % 4) * 800; d.y = 200 + Math.floor(createdDialogs.length / 4) * 1100;
  const close = button(d, 'Tutup ×', null, true); await close.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'CLOSE' }] }]);
  tag(d, grade + ' · ' + w.category); wordPicture(d, w.word); txt(d, w.word, 'Heading'); txt(d, w.meaning, 'Body', 'muted', 596);
  const example = card(d, 'Contoh kalimat', 596, 'bg', 20); txt(example, w.example, 'Body', 'text', 556);
  txt(d, 'Lihat kata dalam video', 'Section'); txt(d, w.videoTitle, 'Body', 'text', 596);
  const time = Math.floor(w.start / 60) + ':' + String(w.start % 60).padStart(2, '0');
  txt(d, 'Mulai sekitar ' + time + ' untuk melihat konteks kata dan gerakan dalam materi.', 'Caption', 'muted', 596);
  const play = button(d, 'Putar bagian video'); const video = data.videos.find(v => v.id === w.videoId);
  dialogPlayLinks.push({n:play,grade,videoId:w.videoId});
  txt(d, 'Representasi pemutar pada prototipe. Aplikasi asli memutar video YouTube di dalam halaman.', 'Caption', 'muted', 596);
  dialogIds[grade + ':' + w.word] = d.id;
 }
}
// Existing source dictionaries gain real artwork, source/time and missing words.
for (const grade of ['SD', 'SMP', 'SMA']) {
 const root = await figma.getNodeByIdAsync(additions['dict' + grade]);
 const content = root.children.find(n => n.name === 'Area konten')?.children.find(n => n.name.startsWith('Konten /'));
 if (!content) continue;
 if (!content.children.some(n => n.name === 'Source video filter')) {
  const filter = frame(content, 'Source video filter', 1132, 'HORIZONTAL', null, 0, 24);
  field(filter, 'Video sumber', 'Semua video ' + grade, false, true, 700);
  content.insertChild(4, filter);
 }
 const data = detailContent.grades[grade];
 const present = root.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.name === 'WordCard');
 const shownWords = new Set(present.map(n => n.componentProperties[P.WordCard.title]?.value));
 const remaining = data.words.filter(w => !shownWords.has(w.word));
 for (let i = 0; i < remaining.length; i += 4) {
  const row = frame(content, 'Kosakata lengkap / ' + i, 1132, 'HORIZONTAL', null, 0, 20);
  for (const w of remaining.slice(i, i + 4)) use(row, 'WordCard', { title: w.word, meaning: w.meaning, category: w.category }, 268);
 }
 for (const [i, n] of root.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.name === 'WordCard').entries()) {
  const w = data.words.find(w => w.word === n.componentProperties[P.WordCard.title]?.value); if (!w) continue;
  const visual = n.children.find(c => c.type === 'FRAME' && c.name === 'Ilustrasi kata');
  if (visual) {
   fill(visual, ['purple', 'blue', 'pink', 'yellow'][i % 4]);
   const glyph = visual.children.find(c => c.name.startsWith('Icon/'));
   if (glyph) { for (const v of glyph.children) v.visible = false; glyph.fills = [{ type: 'IMAGE', imageHash: artHash(w.word), scaleMode: 'FIT' }]; }
  }
  await navTo(n, dialogIds[grade + ':' + w.word], true);
 }
 if (!content.children.some(n => n.name === 'Video pembelajaran Tuli/tunarungu')) {
  const section = frame(content, 'Video pembelajaran Tuli/tunarungu', 1132, 'VERTICAL', null, 0, 20);
  heading(section, 'Video pembelajaran Tuli/tunarungu', 'Materi ' + grade + ' sesuai jenjang belajar. Amati isyarat dan visualnya, lalu kenali kosakatanya.');
  for (let i = 0; i < data.videos.length; i += 2) {
   const row = frame(section, 'Pilihan video ' + (i + 1), 1132, 'HORIZONTAL', null, 0, 24);
   for (const [j, v] of data.videos.slice(i, i + 2).entries()) {
    const c = card(row, v.title, 554); tag(c, grade + ' · ' + v.topic); icon(c, 'play', 40); txt(c, v.title, 'Section', 'text', 506); txt(c, v.description, 'Body', 'muted', 506);
    const b = button(c, 'Putar di aplikasi'); detailLinks.push({ n: b, grade, video: v });
   }
  }
 }
}
const playerIds = {};
for (const [grade, data] of Object.entries(detailContent.grades)) {
 for(const video of data.videos){
  const { root, fresh } = detailed('video' + video.id, 'Video · ' + grade + ' / ' + video.title);
  playerIds[video.id]=root.id;
  if (fresh) {
   const m = shell(root, 'Kamus visual'); heading(m, 'Video pembelajaran Tuli/tunarungu', 'Materi ' + grade + ' sesuai jenjang belajarmu.');
   sourcePlayer(m, video, grade, 1132); txt(m, video.description, 'Body', 'muted', 1100);
   const b = button(m, 'Tutup video', null, true); await navTo(b, additions['dict' + grade]);
  }
 }
 for(const link of detailLinks.filter(x=>x.grade===grade))await navTo(link.n,playerIds[link.video.id]);
}
for(const link of dialogPlayLinks)if(playerIds[link.videoId])await navTo(link.n,playerIds[link.videoId]);
// Full basic material text is copied directly from basicMaterials.js.
for (const material of detailContent.basicMaterials) {
 const { root, fresh } = detailed(material.id, 'Kelas dasar · ' + material.title); if (!fresh) continue;
 const m = shell(root, 'Kelas belajar dasar', true); heading(m, 'Kelas belajar dasar', 'Pelajari kembali materi asesmen awal sesuai ritmemu.');
 const row = frame(m, 'Daftar materi dan video', 1132, 'HORIZONTAL', null, 0, 24);
 const list = card(row, 'Video pembelajaran', 300); txt(list, 'Video pembelajaran', 'Section', 'text', 252);
 for (const item of detailContent.basicMaterials) button(list, item.title, null, item.id !== material.id, 252);
 const lesson = card(row, 'Materi dasar', 808); tag(lesson, 'MATERI ASESMEN AWAL · 24 DETIK'); txt(lesson, material.title, 'Heading', 'text', 760);
 const preview = card(lesson, 'Video visual dengan teks', 760, 'purple', 24); icon(preview, 'play', 48); txt(preview, material.slides[0].join('\n'), 'Section', 'text', 712);
 txt(lesson, 'Video penjelasan visual dengan teks, tanpa suara. Kamu bisa menjeda dan mengulang kapan saja.', 'Caption', 'muted', 760);
 txt(lesson, 'Teks penjelasan video', 'Section');
 for (const [title, ...lines] of material.slides) { const c = card(lesson, title, 760, 'bg', 20); txt(c, title, 'Section', 'text', 720); for (const line of lines) txt(c, line, 'Body', 'muted', 720); }
 button(m, 'Ulangi asesmen awal', 'Asesmen awal');
}
// Wire the basic-class material list to the corresponding source-based view.
for (const root of desktopPage.children.filter(n => n.name.startsWith('UX / Kelas dasar ·'))) {
 for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] })) {
  const label = n.componentProperties[P.ButtonPrimary.label]?.value || n.componentProperties[P.ButtonSecondary.label]?.value;
  const target = desktopPage.children.find(r => r.name === 'UX / Kelas dasar · ' + label);
  if (target && target.id !== root.id) await navTo(n, target.id);
 }
}

// Interactive switches are local components with both states.
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync(state.pages.ds));
let switchSet = figma.currentPage.children.find(n => n.name === 'Control / Switch');
if (!switchSet) {
 const variants = [];
 for (const on of [false, true]) {
  const c = figma.createComponent(); c.name = 'State=' + (on ? 'On' : 'Off'); c.resize(44, 26); c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.paddingLeft = 4; c.paddingRight = 4; c.counterAxisAlignItems = 'CENTER'; c.primaryAxisAlignItems = on ? 'MAX' : 'MIN'; fill(c, on ? 'primary' : 'border'); radius(c, 999);
  const dot = figma.createEllipse(); c.appendChild(dot); dot.resize(18, 18); fill(dot, 'panel'); variants.push(c);
 }
 switchSet = figma.combineAsVariants(variants, figma.currentPage); switchSet.name = 'Control / Switch'; switchSet.x = 200; switchSet.y = 1600;
 variants[0].x = 16; variants[0].y = 16; variants[1].x = 100; variants[1].y = 16; switchSet.resizeWithoutConstraints(164, 60);
 for (let i = 0; i < 2; i++) await variants[i].setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: variants[1 - i].id, navigation: 'CHANGE_TO', transition: null }] }]);
}
await figma.setCurrentPageAsync(desktopPage);
function switchRow(parent, label, description, width) {
 const row = frame(parent, label, width, 'HORIZONTAL', null, 0, 16); row.counterAxisAlignItems = 'CENTER';
 const copy = frame(row, 'Label', width - 60, 'VERTICAL', null, 0, 4); txt(copy, label, 'Label', 'text', width - 60); if (description) txt(copy, description, 'Caption', 'muted', width - 60);
 const sw = switchSet.children.find(n => n.name === 'State=Off').createInstance(); row.appendChild(sw); return sw;
}
const settingsView = detailed('settingsFull', 'Pengaturan · Kontrol lengkap');
let deleteDialog = desktopPage.children.find(n => n.name === 'Dialog / Hapus progres lokal');
if (!deleteDialog) {
 deleteDialog = card(desktopPage, 'Dialog / Hapus progres lokal', 600, 'panel', 32); createdDialogs.push(deleteDialog); deleteDialog.x = 15400; deleteDialog.y = 100;
 txt(deleteDialog, 'Hapus data belajar di perangkat?', 'Heading', 'text', 536);
 txt(deleteDialog, 'Hapus asesmen dan progres lokal? Tindakan ini tidak dapat dibatalkan.', 'Body', 'muted', 536);
 txt(deleteDialog, 'Akun online dan pengaturan akun tetap tersimpan.', 'Caption', 'muted', 536);
 const actions = frame(deleteDialog, 'Konfirmasi', 536, 'HORIZONTAL', null, 0, 16);
 for (const label of ['Batal', 'Ya, hapus data']) { const b = button(actions, label, null, label === 'Batal'); await b.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'CLOSE' }] }]); }
}
if (settingsView.fresh) {
 const m = shell(settingsView.root, 'Pengaturan'); heading(m, 'Pengaturan', 'Atur ruang belajar sesuai kebutuhanmu.');
 const columns = frame(m, 'Pengaturan & profil', 1132, 'HORIZONTAL', null, 0, 24);
 const a = card(columns, 'Aksesibilitas', 554); txt(a, 'Aksesibilitas', 'Section');
 field(a, 'Ukuran teks', 'Normal', false, true, 506); field(a, 'Tampilan', 'Terang', false, true, 506); field(a, 'Kecepatan video awal', 'Normal · 1×', false, true, 506);
 switchRow(a, 'Mode visual nyaman', 'Kurangi gerakan dan dekorasi.', 506); switchRow(a, 'Kontras tinggi', 'Perjelas batas dan warna teks.', 506); switchRow(a, 'Hemat data video', 'Video dimuat hanya ketika kamu memutarnya.', 506);
 txt(a, 'Pengaturan langsung diterapkan di perangkat. Simpan untuk sinkronisasi akun.', 'Caption', 'muted', 506); button(a, 'Simpan pengaturan akun');
 const b = card(columns, 'Profil dan video lokal', 554); txt(b, 'Profil belajarmu', 'Section');
 field(b, 'Nama panggilan', 'Dina', false, false, 506); field(b, 'Jenjang', 'SD', false, true, 506); field(b, 'Tujuan belajar', 'Mengenal kata', false, true, 506); button(b, 'Simpan profil');
 txt(b, 'Pratinjau video isyarat', 'Section'); txt(b, 'Gunakan video lokal yang sudah ditinjau. Video hanya tersedia selama sesi browser ini, untuk kata yang dipilih.', 'Body', 'muted', 506); field(b, 'Kata', 'Mangga', false, true, 506); button(b, 'Pilih berkas video', null, true); button(b, 'Pratinjau di kamus', 'Kamus visual', true);
 const privacy = card(m, 'Data & privasi', 1132); txt(privacy, 'Data & privasi', 'Section'); txt(privacy, 'Akun, profil, dan pengaturan yang disimpan tersimpan online. Asesmen dan latihan masih berupa prototipe lokal per akun.', 'Body', 'muted', 1084);
 const del = button(privacy, 'Hapus data belajar di perangkat', null, true); await navTo(del, deleteDialog.id, true); button(m, 'Keluar akun', 'Login', true);
}
const progressView = detailed('progressFull', 'Kemajuan · Profil & riwayat');
if (progressView.fresh) {
 const m = shell(progressView.root, 'Kemajuan saya'); heading(m, 'Kemajuan saya', 'Ini perjalananmu sendiri. Setiap percobaan punya arti.');
 const stats = frame(m, 'Ringkasan kemajuan', 1132, 'HORIZONTAL', null, 0, 20);
 for (const [value, label] of [['2 materi', 'Sudah kamu kuasai'], ['4 sesi', 'Usaha belajar yang tercatat'], ['12 menit', 'Waktu mengerjakan evaluasi']]) use(stats, 'Stat', { value, label }, 360);
 txt(m, 'Profil kemampuanmu', 'Section'); const aspects = frame(m, 'Empat aspek', 1132, 'HORIZONTAL', null, 0, 20);
 for (const [name, value, tone] of [['Kosakata', '100%', 'purple'], ['Kalimat', '75%', 'blue'], ['Bacaan', '50%', 'pink'], ['Soal akademik', '75%', 'yellow']]) { const c = card(aspects, name, 268, tone); txt(c, name, 'Section', 'text', 220); txt(c, value, 'Heading'); txt(c, 'Diperbarui setelah evaluasi', 'Caption', 'muted', 220); }
 const changes = card(m, 'Perubahan dari titik awal', 1132); txt(changes, 'Perubahan dari titik awal', 'Section'); for (const line of ['Kosakata    50% → 100%    Bertumbuh', 'Kalimat    50% → 75%    Bertumbuh', 'Bacaan    50% → 50%    Tetap belajar', 'Soal akademik    75% → 75%    Tetap belajar']) txt(changes, line, 'Body', 'muted', 1084);
 const history = card(m, 'Jejak belajarmu', 1132); txt(history, 'Jejak belajarmu', 'Section'); for (const [title, caption] of [['Kenali tumbuhan dan buah', '15 Oktober 2026 · Materi dikuasai · 80%'], ['Kalimat tentang hewan', '15 Oktober 2026 · Penguatan kalimat · 60%'], ['Asesmen awal', '15 Oktober 2026 · Profil awal tersimpan · 4 aspek']]) { const line = frame(history, title, 1084, 'HORIZONTAL', null, 0, 16); icon(line, 'chart'); const copy = frame(line, 'Informasi sesi', 1000, 'VERTICAL', null, 0, 4); txt(copy, title, 'Label'); txt(copy, caption, 'Caption', 'muted'); }
}
// Link the source dictionaries and full settings/progress from navigation.
for (const root of desktopPage.children.filter(n => n.type === 'FRAME' && (n.name.startsWith('UX / ') || /^\d{2} \/ /.test(n.name)))) {
 const grade = /· (SD|SMP|SMA)$/.exec(root.name)?.[1] || 'SD';
 for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] })) {
  const texts = n.findAllWithCriteria({ types: ['TEXT'] }); const label = texts[0]?.characters;
  if ((n.name === 'NavItem' || n.name.startsWith('Navigation / ')) && label === 'Kamus visual') await navTo(n, additions['dict' + grade]);
  if ((n.name === 'NavItem' || n.name.startsWith('Navigation / ')) && label === 'Kemajuan saya' && root.id !== progressView.root.id) await navTo(n, progressView.root.id);
  if (label === 'Edit profil' && root.id !== settingsView.root.id) await navTo(n, settingsView.root.id);
 }
}
// Source material choices route to their detailed page.
const baseBasic = await figma.getNodeByIdAsync(screenIds['Kelas belajar dasar']);
const firstBasic = desktopPage.children.find(n => n.name === 'UX / Kelas dasar · ' + detailContent.basicMaterials[0].title);
if (firstBasic) for (const n of baseBasic.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.name.startsWith('Action /') || n.name === 'ButtonSecondary')) { const label = n.findAllWithCriteria({ types: ['TEXT'] })[0]?.characters; if (label?.includes('Kosakata')) await navTo(n, firstBasic.id); }
await Promise.all(styleJobs);
// Reflow the overview after long dictionaries and transcripts grow.
const uxFrames = desktopPage.children.filter(n => n.type === 'FRAME' && n.name.startsWith('UX / '));
let detailY = 200;
for (let i = 0; i < uxFrames.length; i += 3) { const group = uxFrames.slice(i, i + 3); group.forEach((n, k) => { n.x = 6800 + k * 1640; n.y = detailY; }); detailY += Math.max(...group.map(n => n.height)) + 200; }
for (const root of detailedRoots) {
 for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.name === 'NavItem')) {
  const text = n.findAllWithCriteria({ types: ['TEXT'] })[0]; const label = text?.characters; const definition = navDefinitions[label]; if (!definition) continue;
  const savedFill = n.fills; const savedText = text.fills; const width = n.width;
  n.swapComponent(definition.component); if (definition.labelProperty) n.setProperties({ [definition.labelProperty]: label }); n.resize(width, n.height); n.fills = savedFill;
  for (const t of n.findAllWithCriteria({ types: ['TEXT'] })) t.fills = savedText;
 }
}
// Fit long Indonesian button labels and wrap sidebar text without clipping.
for (const page of [desktopPage, mobilePage]) {
 await figma.setCurrentPageAsync(page);
 const views = page.children.filter(n => n.type === 'FRAME' && (n.name.startsWith('UX / ') || n.name.startsWith('Dialog / ') || n.name.startsWith('Mobile') || /^\d{2} \/ /.test(n.name)));
 for (const view of views) for (const n of view.findAllWithCriteria({ types: ['INSTANCE'] })) {
  const props = n.componentProperties;
  const t = n.findAllWithCriteria({ types: ['TEXT'] })[0]; if (!t) continue;
  if (props[P.ButtonPrimary.label] || props[P.ButtonSecondary.label] || props[P.Tag.label]) {
   const padding = props[P.Tag.label] ? 20 : 40;
   const parent = n.parent; const limit = Math.max(80, (parent.width || 1000) - (parent.paddingLeft || 0) - (parent.paddingRight || 0));
   t.textAutoResize = 'WIDTH_AND_HEIGHT';
   const width = Math.min(Math.max(n.width, t.width + padding), limit);
   if (t.width + padding > limit) { t.textAutoResize = 'HEIGHT'; t.resize(limit - padding, t.height); }
   n.resize(width, n.height); n.counterAxisSizingMode = 'AUTO';
  }
  if (n.name === 'NavItem' || n.name.startsWith('Navigation / ')) {
   t.textAutoResize = 'WIDTH_AND_HEIGHT'; n.resize(204,n.height); n.primaryAxisSizingMode='FIXED'; n.counterAxisSizingMode='AUTO';
  }
 }
}
await figma.setCurrentPageAsync(desktopPage);
figma.viewport.scrollAndZoomIntoView([settingsView.root]);
