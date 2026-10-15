// Source-specific curricula and prototype interactions. Safe to run again by name.
await figma.setCurrentPageAsync(desktopPage);
// Repair only the unfinished views made by this revision before a Starter-plan limitation was detected.
if (!desktopPage.children.some(n => n.name === 'Version / curriculum-single-action-v1')) {
 for (const n of [...desktopPage.children]) if (/^(UX \/ (Belajar|Evaluasi|Hasil evaluasi) \/ |Dialog \/ (Latihan|Evaluasi) \/ )/.test(n.name)) n.remove();
 const marker = figma.createRectangle(); desktopPage.appendChild(marker); marker.name = 'Version / curriculum-single-action-v1'; marker.visible = false;
}
const fullRoots = [];
const fullMenus = [];
const fullMap = {};
const fullJobs = [];
const stagesActual = ['Pengantar', 'Isyarat & visual', 'Latihan', 'Evaluasi'];
const aspectsActual = { kosakata: 'Kosakata', kalimat: 'Kalimat', bacaan: 'Bacaan', akademik: 'Soal akademik' };
const collectionsActual = await figma.variables.getLocalVariableCollectionsAsync();
const protoCollection = collectionsActual.find(c => c.name === 'BahasaKita / Prototype') || figma.variables.createVariableCollection('BahasaKita / Prototype');
const protoVars = await figma.variables.getLocalVariablesAsync();
function protoVar(name, type, value) {
 let v = protoVars.find(v => v.variableCollectionId === protoCollection.id && v.name === name);
 if (!v) { v = figma.variables.createVariable(name, protoCollection, type); v.setValueForMode(protoCollection.defaultModeId, value); protoVars.push(v); }
 return v;
}
function literal(type, value) { return { type, resolvedType: type, value }; }
function alias(v) { return { type: 'VARIABLE_ALIAS', resolvedType: v.resolvedType, value: { type: 'VARIABLE_ALIAS', id: v.id } }; }
function expression(fn, args, type = 'FLOAT') { return { type: 'EXPRESSION', resolvedType: type, value: { expressionFunction: fn, expressionArguments: args } }; }
function setValue(v, value) { return { type: 'SET_VARIABLE', variableId: v.id, variableValue: literal(v.resolvedType, value) }; }
function go(id, overlay = false) { return { type: 'NODE', destinationId: id, navigation: overlay ? 'OVERLAY' : 'NAVIGATE', transition: null, resetScrollPosition: true }; }
async function onClick(node, actions) {
 // The current Starter plan permits a single action. Keep navigation explicit and reviewable.
 let action = actions.find(a => a.type === 'NODE') || actions.find(a => a.type === 'CLOSE') || actions[0];
 if (action?.type === 'CONDITIONAL') action = action.conditionalBlocks[0].actions[0];
 if (!action || action.type === 'SET_VARIABLE') return;
 try { await node.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [action] }]); } catch (e) { throw new Error(node.name + ': ' + String(e)); }
}
function closeAction() { return { type: 'CLOSE' }; }
function queued(node, key, extra = []) { fullJobs.push({ node, key, extra }); }
function fullView(key, title, width = 1440, mobile = false) {
 const page = mobile ? mobilePage : desktopPage;
 const name = (mobile ? 'Mobile / ' : 'UX / ') + title;
 let root = page.children.find(n => n.name === name);
 const fresh = !root;
 if (!root) { root = frame(page, name, width, 'VERTICAL', 'bg', mobile ? 20 : 0, mobile ? 24 : 0); fullRoots.push(root); }
 fullMap[key] = root.id;
 return { root, fresh };
}
function contentOf(root) { return root.children.find(n => n.name === 'Area konten')?.children.find(n => n.name.startsWith('Konten /')); }
function fullShell(root, title, grade, basic = false) {
 const m = shell(root, title, basic);
 const user = root.findAllWithCriteria({ types: ['TEXT'] }).find(t => t.characters === 'Dina · SD');
 if (user) user.characters = 'Dina · ' + grade;
 return m;
}
function boundText(parent, variable, width, style = 'Body') {
 const value = variable.valuesByMode[protoCollection.defaultModeId];
 const t = txt(parent, String(value), style, 'text', width); t.setBoundVariable('characters', variable); return t;
}
function dialogActual(key, title, width = 560) {
 const name = 'Dialog / ' + title;
 let root = desktopPage.children.find(n => n.name === name); const fresh = !root;
 if (!root) { root = card(desktopPage, name, width, 'panel', 24); fullMenus.push(root); }
 fullMap[key] = root.id; return { root, fresh };
}
const quizScores = Array.from({ length: 5 }, (_, i) => protoVar('Evaluasi / Jawaban ' + (i + 1), 'FLOAT', 0));
const assessmentScores = Array.from({ length: 8 }, (_, i) => protoVar('Asesmen / Jawaban ' + (i + 1), 'FLOAT', 0));
const answerFeedback = protoVar('Jawaban / Umpan balik', 'STRING', 'Periksa jawabanmu sebelum melanjutkan.');
function sumVariables(vars) { return vars.map(alias).reduce((a, b) => expression('ADDITION', [a, b])); }
function outcome(vars, threshold, yes, no) {
 return { type: 'CONDITIONAL', conditionalBlocks: [
  { condition: expression('GREATER_THAN_OR_EQUAL', [sumVariables(vars), literal('FLOAT', threshold)], 'BOOLEAN'), actions: [go(yes)] },
  { actions: [go(no)] }
 ] };
}
// All twelve real lessons: introduction, visual context, practice, five evaluation questions, and both outcomes.
for (const [grade, lessons] of Object.entries(curriculum.lessons)) {
 for (const lesson of lessons) {
  const base = 'lesson:' + lesson.id;
  for (let stage = 0; stage < 3; stage++) {
   const view = fullView(base + ':' + stage, 'Belajar / ' + grade + ' / ' + lesson.title + ' / ' + stagesActual[stage]);
   if (!view.fresh) continue;
   const m = fullShell(view.root, 'Belajar', grade);
   const back = button(m, 'Kembali ke jalur belajar', null, true); queued(back, 'learn' + grade);
   heading(m, lesson.title, grade + ' · ' + aspectsActual[lesson.aspect] + ' · ' + lesson.time + ' menit');
   const steps = frame(m, 'Tahapan belajar', 1132, 'HORIZONTAL', null, 0, 12);
   for (const [i, title] of stagesActual.entries()) queued(button(steps, (i + 1) + ' · ' + title, null, i !== stage), base + ':' + i, i === 3 ? quizScores.map(v => setValue(v, 0)) : []);
   const c = card(m, 'Materi / ' + stagesActual[stage], 1132);
   if (stage === 0) {
    wordPicture(c, lesson.word, 80); txt(c, lesson.intro, 'Section', 'text', 1084); txt(c, lesson.description, 'Body', 'muted', 1084);
    tag(c, 'Kosakata: ' + lesson.words.join(' · ')); txt(c, 'Empat tahap belajar, dengan target 4 dari 5 jawaban tepat pada evaluasi.', 'Caption', 'muted', 1084);
   } else if (stage === 1) {
    sourcePlayer(c, lesson.video, grade, 1084);
    txt(c, lesson.explanation, 'Section', 'text', 1084);
    const tip = card(c, 'Petunjuk belajar', 1084, 'purple', 20); txt(tip, lesson.tip, 'Body', 'text', 1044);
    const words = frame(c, 'Kosakata terkait', 1084, 'HORIZONTAL', null, 0, 16);
    for (const word of lesson.words) { const w = button(words, word, null, true); await navTo(w, dialogIds[grade + ':' + word], true); }
   } else {
    txt(c, 'Latihan', 'Section'); txt(c, lesson.practice.prompt, 'Heading', 'text', 1084);
    if (lesson.practice.visual && emojiAssets[lesson.word]) wordPicture(c, lesson.word, 80);
    const feedback = dialogActual(base + ':practice-feedback', 'Latihan / ' + grade + ' / ' + lesson.title);
    if (feedback.fresh) {
     txt(feedback.root, 'Perhatikan contoh jawaban', 'Section', 'text', 512);
     txt(feedback.root, lesson.practice.answer || lesson.practice.options[lesson.practice.correct], 'Body', 'text', 512);
     const retry = button(feedback.root, 'Coba lagi', null, true); await onClick(retry, [closeAction()]);
     queued(button(feedback.root, 'Lanjut ke evaluasi'), base + ':3', quizScores.map(v => setValue(v, 0)));
    }
    if (lesson.practice.options) {
     for (const [i, option] of lesson.practice.options.entries()) {
      const b = button(c, option, null, true, 800);
      await onClick(b, [setValue(answerFeedback, i === lesson.practice.correct ? 'Tepat! ' + option : 'Coba perhatikan kembali. Jawaban yang sesuai: ' + lesson.practice.options[lesson.practice.correct]), go(feedback.root.id, true)]);
     }
    } else {
     const bank = frame(c, 'Kata untuk disusun', 1084, 'HORIZONTAL', null, 0, 16);
     for (const w of lesson.practice.words) tag(bank, w);
     txt(c, 'Contoh susunan kalimat', 'Caption', 'muted');
     const b = button(c, lesson.practice.answer, null, true, 850);
     await onClick(b, [setValue(answerFeedback, 'Tepat! ' + lesson.practice.answer), go(feedback.root.id, true)]);
    }
   }
   if (stage < 2) queued(button(m, 'Lanjut · ' + stagesActual[stage + 1]), base + ':' + (stage + 1));
  }
  for (const [qi, q] of lesson.quiz.entries()) {
   const view = fullView(base + ':' + (3 + qi), 'Evaluasi / ' + grade + ' / ' + lesson.title + ' / Soal ' + (qi + 1));
   if (!view.fresh) continue;
   const m = fullShell(view.root, 'Belajar', grade); heading(m, lesson.title, grade + ' · Evaluasi pemahaman');
   tag(m, 'SOAL ' + (qi + 1) + ' DARI 5'); txt(m, 'Target penguasaan: 4 dari 5 jawaban tepat.', 'Caption', 'muted', 1100);
   const c = card(m, 'Pertanyaan', 1132); txt(c, q.prompt, 'Heading', 'text', 1084);
   const feedback = dialogActual(base + ':feedback:' + qi, 'Evaluasi / ' + grade + ' / ' + lesson.title + ' / Jawaban ' + (qi + 1));
   if (feedback.fresh) {
    txt(feedback.root, 'Jawaban yang sesuai', 'Section', 'text', 512); txt(feedback.root, q.options[q.correct], 'Body', 'text', 512);
    const next = button(feedback.root, qi < 4 ? 'Soal berikutnya' : 'Contoh hasil: materi dikuasai');
    fullJobs.push({ node: next, finish: qi === 4, key: base + ':' + (4 + qi), pass: base + ':pass', fail: base + ':fail' });
    if (qi === 4) { txt(feedback.root, 'Pilih contoh hasil untuk meninjau kedua alur desain. Nilai otomatis dihitung di aplikasi asli.', 'Caption', 'muted', 512); queued(button(feedback.root, 'Contoh hasil: perlu penguatan', null, true), base + ':fail'); }
   }
   for (const [i, option] of q.options.entries()) {
    const b = button(c, String.fromCharCode(65 + i) + '. ' + option, null, true, 900);
    await onClick(b, [setValue(quizScores[qi], i === q.correct ? 1 : 0), setValue(answerFeedback, i === q.correct ? 'Tepat! Jawabanmu sesuai materi.' : 'Belum tepat. Jawaban yang sesuai: ' + q.options[q.correct]), go(feedback.root.id, true)]);
   }
  }
  for (const passed of [true, false]) {
   const view = fullView(base + (passed ? ':pass' : ':fail'), 'Hasil evaluasi / ' + grade + ' / ' + lesson.title + (passed ? ' / Dikuasai' : ' / Penguatan'));
   if (!view.fresh) continue;
   const m = fullShell(view.root, 'Belajar', grade); heading(m, passed ? 'Materi sudah kamu kuasai.' : 'Kita coba pelan-pelan lagi.', lesson.title);
   const c = card(m, 'Hasil evaluasi', 1132, passed ? 'purple' : 'yellow'); icon(c, passed ? 'trophy' : 'leaf', 56);
   txt(c, passed ? 'Target 4 dari 5 jawaban tepat tercapai' : 'Belum mencapai 4 dari 5 jawaban tepat', 'Heading', 'text', 1084);
   txt(c, passed ? 'Kamu bisa melanjutkan ke materi berikutnya atau mengulang materi ini.' : 'Baca lagi penjelasan dan coba latihan. Setelah dua percobaan yang belum berhasil, kembali ke pengantar materi.', 'Body', 'muted', 1084);
   queued(button(c, passed ? 'Lanjut belajar' : 'Pelajari kembali'), passed ? 'learn' + grade : base + ':0');
   queued(button(c, 'Ulangi evaluasi', null, true), base + ':3', quizScores.map(v => setValue(v, 0)));
  }
 }
}
// Replace only agent-created catalogue cards, retaining surrounding layout and editable component instances.
for (const grade of ['SD', 'SMP', 'SMA']) {
 fullMap['learn' + grade] = additions['learn' + grade]; fullMap['dict' + grade] = additions['dict' + grade];
 const root = await figma.getNodeByIdAsync(additions['learn' + grade]); const m = contentOf(root); if (!m) continue;
 let cards = root.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.componentProperties[P.LessonCard.title]);
 for (const [i, lesson] of curriculum.lessons[grade].entries()) {
  const c = cards[i]; if (!c) continue;
  c.setProperties({ [P.LessonCard.title]: lesson.title, [P.LessonCard.body]: aspectsActual[lesson.aspect] + ' · ' + lesson.time + ' menit\n' + lesson.description });
  await navTo(c, fullMap['lesson:' + lesson.id + ':0']);
 }
}
// Three source-authored adaptive assessments: 12 question states each, eight answers per run.
for (const grade of ['SD', 'SMP', 'SMA']) {
 const intro = fullView('assessment:' + grade, 'Asesmen / ' + grade + ' / Pengantar');
 if (intro.fresh) {
  const m = fullShell(intro.root, 'Asesmen awal', grade); heading(m, 'Kenali kemampuan awalmu', grade + ' · Belajar sesuai kemampuan dan ritmemu');
  const c = card(m, 'Sebelum mulai', 1132, 'purple'); icon(c, 'shapes', 56); txt(c, '8 soal · 4 aspek kemampuan', 'Heading', 'text', 1084);
  txt(c, 'Kosakata, kalimat, bacaan, dan soal akademik. Pertanyaan berikutnya mengikuti jawabanmu. Nilai minimal 80 membuka semua fitur belajar.', 'Body', 'muted', 1084);
  queued(button(c, 'Mulai asesmen ' + grade), 'assessment:' + grade + ':0:0', assessmentScores.map(v => setValue(v, 0)));
 }
 const groups = Object.entries(curriculum.bank[grade]);
 for (const [ai, [aspect, questions]] of groups.entries()) {
  for (const [variant, q] of questions.entries()) {
   const qi = ai * 2 + (variant === 0 ? 0 : 1);
   const view = fullView('assessment:' + grade + ':' + ai + ':' + variant, 'Asesmen / ' + grade + ' / ' + aspectsActual[aspect] + ' / ' + (variant === 0 ? 'Awal' : variant === 1 ? 'Lanjutan' : 'Penguatan'));
   if (!view.fresh) continue;
   const m = fullShell(view.root, 'Asesmen awal', grade); heading(m, 'Asesmen awal', grade + ' · ' + aspectsActual[aspect]); tag(m, 'SOAL ' + (qi + 1) + ' DARI 8');
   const c = card(m, 'Pertanyaan', 1132); if (q.visual) txt(c, q.visual, 'Heading', 'text', 1084); txt(c, q.prompt, 'Section', 'text', 1084);
   for (const [i, option] of q.options.entries()) {
    const b = button(c, option, null, true, 900); const correct = i === q.correct;
    const next = variant === 0 ? 'assessment:' + grade + ':' + ai + ':' + (correct ? 1 : 2) : 'assessment:' + grade + ':' + (ai + 1) + ':0';
    fullJobs.push({ node: b, key: next, extra: [setValue(assessmentScores[qi], correct ? 1 : 0)], assessmentFinish: variant > 0 && ai === 3, pass: 'assessment:' + grade + ':pass', fail: 'assessment:' + grade + ':fail' });
   }
  }
 }
 for (const passed of [true, false]) {
  const view = fullView('assessment:' + grade + (passed ? ':pass' : ':fail'), 'Asesmen / ' + grade + (passed ? ' / Lulus' : ' / Kelas dasar'));
  if (!view.fresh) continue;
  const m = fullShell(view.root, 'Asesmen awal', grade, !passed); heading(m, passed ? 'Semua fitur belajar terbuka' : 'Kuatkan dasar belajarmu', 'Hasil asesmen awal · ' + grade);
  const c = card(m, 'Hasil asesmen', 1132, passed ? 'purple' : 'yellow'); txt(c, passed ? 'Nilai mencapai batas minimal 80' : 'Nilai masih di bawah 80', 'Heading', 'text', 1084);
  txt(c, passed ? 'Lanjutkan belajar dengan materi dan kamus sesuai jenjangmu.' : 'Selesaikan materi kelas belajar dasar, lalu ulangi asesmen awal. Tampilan aplikasi tetap sama; kelas dasar muncul di navigasi.', 'Body', 'muted', 1084);
  queued(button(c, passed ? 'Mulai belajar ' + grade : 'Masuk kelas belajar dasar'), passed ? 'learn' + grade : 'basicFull');
 }
}
fullMap.basicFull = firstBasic?.id || screenIds['Kelas belajar dasar'];
// Single-action controls remain usable on the current Figma Starter plan.
const gradeMenu = dialogActual('gradeMenu', 'Pilih jenjang / Register', 400);
if (gradeMenu.fresh) txt(gradeMenu.root, 'Jenjang belajar', 'Section');
for (const grade of ['SD', 'SMP', 'SMA']) {
 const name = 'UX / Register / ' + grade;
 let register = desktopPage.children.find(n => n.name === name);
 if (!register) {
  register = (await figma.getNodeByIdAsync(screenIds.Register)).clone(); desktopPage.appendChild(register); register.name = name; fullRoots.push(register);
  const f = register.findOne(n => n.type === 'FRAME' && n.name === 'Jenjang belajar');
  const input = f?.findAllWithCriteria({types:['INSTANCE']}).find(n => n.componentProperties[P.Input.value]);
  if (input) input.setProperties({[P.Input.value]:grade});
 }
 fullMap['register:' + grade] = register.id;
 if (gradeMenu.fresh) await navTo(button(gradeMenu.root, grade, null, true, 352), register.id);
 for (const f of register.findAll(n => n.type === 'FRAME' && n.name === 'Jenjang belajar')) {
  const input = f.findAllWithCriteria({types:['INSTANCE']}).find(n => n.componentProperties[P.Input.value]); if (input) await navTo(input, gradeMenu.root.id, true);
 }
 for (const n of register.findAllWithCriteria({types:['INSTANCE']})) {
  const label = n.findAllWithCriteria({types:['TEXT']})[0]?.characters;
  if (/^(Buat|Daftar|Mulai perjalanan)/i.test(label || '')) await navTo(n, fullMap['assessment:' + grade]);
 }
}
if (gradeMenu.fresh) await onClick(button(gradeMenu.root, 'Tutup', null, true), [closeAction()]);
for (const key of ['Register', 'registerDark']) {
 const root = await figma.getNodeByIdAsync(screenIds[key] || additions[key]); if (!root) continue;
 for (const f of root.findAll(n => n.type === 'FRAME' && n.name === 'Jenjang belajar')) {
  const input = f.findAllWithCriteria({types:['INSTANCE']}).find(n => n.componentProperties[P.Input.value]); if (input) await navTo(input, gradeMenu.root.id, true);
 }
}
for (const grade of ['SD','SMP','SMA']) {
 const source = await figma.getNodeByIdAsync(additions['dict' + grade]);
 const options = [
  ...new Set(detailContent.grades[grade].words.map(w => w.category))
 ].map(category => ({key:'Kategori ' + category, category, title:category, test:w => w.category === category}));
 for (const v of detailContent.grades[grade].videos) options.push({key:'Video ' + v.id, title:v.title, test:w => w.videoId === v.id});
 const menu = dialogActual('videoMenu:' + grade, 'Video sumber / ' + grade, 640);
 if (menu.fresh) { txt(menu.root, 'Video sumber · ' + grade, 'Section'); await navTo(button(menu.root,'Semua video ' + grade,null,true,592), source.id); }
 const targets = {};
 for (const option of options) {
  const name = 'UX / Kamus / ' + grade + ' / ' + option.key;
  let view = desktopPage.children.find(n => n.name === name);
  if (!view) {
   view = source.clone(); desktopPage.appendChild(view); view.name = name; fullRoots.push(view);
   let count = 0;
   const rowSet = new Set();
   for (const c of view.findAllWithCriteria({types:['INSTANCE']}).filter(n => n.componentProperties[P.WordCard.title])) {
    const word = c.componentProperties[P.WordCard.title].value; const w = detailContent.grades[grade].words.find(w => w.word === word);
    c.visible = !!w && option.test(w); if (c.visible) count++; rowSet.add(c.parent);
   }
   for (const row of rowSet) row.visible = row.children.some(n => n.visible);
   const main = contentOf(view); const status = txt(main, count + ' kata ditemukan · ' + option.title, 'Caption', 'muted', 1100); main.insertChild(3,status);
  }
  targets[option.key] = view.id;
  if (!option.category && menu.fresh) await navTo(button(menu.root, option.title, null, true, 592), view.id);
 }
 for (const root of [source, ...desktopPage.children.filter(n => n.name.startsWith('UX / Kamus / ' + grade + ' / '))]) {
  const m = contentOf(root); const categories = m?.children.find(n => n.name === 'Filter kategori');
  if (categories) for (const b of categories.children) { const label = b.findAllWithCriteria({types:['TEXT']})[0]?.characters; const id = label === 'Semua' ? source.id : targets['Kategori ' + label]; if (id) await navTo(b,id); }
  const f = m?.findOne(n => n.name === 'Source video filter'); const input = f?.findAllWithCriteria({types:['INSTANCE']}).find(n => n.componentProperties[P.Input.value]); if (input) await navTo(input,menu.root.id,true);
 }
}

// Mobile grade views mirror source learning catalogues, word details, and lesson introduction.
await figma.setCurrentPageAsync(mobilePage);
for (const grade of ['SD', 'SMP', 'SMA']) {
 for (const kind of ['Belajar', 'Kamus visual', 'Materi belajar']) {
  const view = fullView('mobile:' + grade + ':' + kind, kind + ' · ' + grade, 390, true); if (!view.fresh) continue;
  const root = view.root; logo(root, 170); heading(root, kind, 'Jenjang ' + grade, 350);
  const nav = frame(root, 'Navigasi mobile', 350, 'HORIZONTAL', null, 0, 8);
  for (const label of ['Belajar', 'Kamus visual']) queued(button(nav, label, null, label !== kind, 170), 'mobile:' + grade + ':' + label);
  if (kind === 'Belajar') for (const lesson of curriculum.lessons[grade]) {
   const c = card(root, lesson.title, 350, 'panel', 20); txt(c, lesson.title, 'Section', 'text', 310); txt(c, lesson.description, 'Body', 'muted', 310); tag(c, aspectsActual[lesson.aspect] + ' · ' + lesson.time + ' menit');
   queued(button(c, 'Lihat materi', null, false, 310), 'mobilelesson:' + lesson.id);
  }
  if (kind === 'Kamus visual') {
   field(root, 'Cari kosakata', 'Cari kata', false, false, 350);
   for (const word of detailContent.grades[grade].words) {
    const c = card(root, word.word, 350, 'panel', 20); wordPicture(c, word.word); tag(c, word.category); txt(c, word.word, 'Section', 'text', 310); txt(c, word.meaning, 'Body', 'muted', 310);
    const b = button(c, 'Lihat arti & isyarat', null, true, 310); queued(b, 'mobileword:' + grade + ':' + word.word);
   }
  }
  if (kind === 'Materi belajar') {
   const lesson = curriculum.lessons[grade][0]; heading(root, lesson.title, 'Pengantar · ' + lesson.time + ' menit', 350);
   const c = card(root, 'Materi', 350, 'panel', 20); wordPicture(c, lesson.word); txt(c, lesson.intro, 'Body', 'text', 310); txt(c, lesson.explanation, 'Body', 'muted', 310);
   txt(c, lesson.tip, 'Body', 'primary', 310); queued(button(c, 'Lihat kata dalam kamus', null, true, 310), 'mobile:' + grade + ':Kamus visual');
  }
 }
 for (const word of detailContent.grades[grade].words) {
  const view = fullView('mobileword:' + grade + ':' + word.word, 'Arti kata / ' + grade + ' / ' + word.word, 390, true); if (!view.fresh) continue;
  const root = view.root; logo(root, 160); queued(button(root, 'Kembali ke kamus', null, true, 350), 'mobile:' + grade + ':Kamus visual');
  wordPicture(root, word.word, 80); tag(root, grade + ' · ' + word.category); heading(root, word.word, word.meaning, 350);
  const c = card(root, 'Contoh kalimat', 350, 'panel', 20); txt(c, word.example, 'Body', 'text', 310);
  txt(root, word.videoTitle, 'Section', 'text', 350); txt(root, 'Bagian video sekitar ' + Math.floor(word.start / 60) + ':' + String(word.start % 60).padStart(2, '0'), 'Caption', 'muted', 350);
  const preview = card(root, 'Pemutar video', 350, 'text', 20); icon(preview, 'play', 48); txt(preview, word.videoTitle, 'Section', 'panel', 310); txt(preview, 'CC  ━━━━━━━  1×', 'Caption', 'panel', 310);
 }
}
await figma.setCurrentPageAsync(desktopPage);
// Resolve links only after every target is present, including cross-page mobile links.
for (const job of fullJobs) {
 if (job.finish) await onClick(job.node, [outcome(quizScores, 4, fullMap[job.pass], fullMap[job.fail])]);
 else if (job.assessmentFinish) await onClick(job.node, [...(job.extra || []), outcome(assessmentScores, 6.4, fullMap[job.pass], fullMap[job.fail])]);
 else if (fullMap[job.key]) { let top = job.node; while (top.parent && top.parent.type !== 'PAGE') top = top.parent; if (top.id !== fullMap[job.key]) await onClick(job.node, [...(job.extra || []), go(fullMap[job.key])]); }
}
// Route every grade's main navigation consistently and connect registration to the correct assessment.
for (const root of desktopPage.children.filter(n => n.type === 'FRAME' && (n.name.startsWith('UX / ') || /^\d{2} \/ /.test(n.name)))) {
 const grade = /(?:\/ |· )(SD|SMP|SMA)(?: \/|$)/.exec(root.name)?.[1] || 'SD';
 for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] })) {
  const t = n.findAllWithCriteria({ types: ['TEXT'] })[0]; if (!t) continue; const cachedLabel = t.characters;
  if (n.name === 'NavItem' || n.name.startsWith('Navigation / ')) {
   if (t.characters === 'Belajar') await navTo(n, additions['learn' + grade]);
   if (t.characters === 'Kamus visual') await navTo(n, additions['dict' + grade]);
   if (t.characters === 'Kemajuan saya') await navTo(n, progressView.root.id);
   const definition = navDefinitions[t.characters];
   if (definition && n.name === 'NavItem') { const label = t.characters; n.swapComponent(definition.component); if (definition.labelProperty) n.setProperties({ [definition.labelProperty]: label }); }
  }
  if (/^(Mulai asesmen|Kerjakan asesmen|Ulangi asesmen)/.test(cachedLabel) && !root.name.startsWith('UX / Asesmen /')) await navTo(n, fullMap['assessment:' + grade]);
 }
}
for (const key of ['Register', 'Login']) {
 const root = await figma.getNodeByIdAsync(screenIds[key]);
 for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] })) {
  const label = n.findAllWithCriteria({ types: ['TEXT'] })[0]?.characters;
  if (key === 'Register' && /^(Buat|Daftar|Mulai perjalanan)/i.test(label || '')) await onClick(n, [{ type: 'CONDITIONAL', conditionalBlocks: [
   ...['SMP', 'SMA'].map(grade => ({ condition: expression('EQUALS', [alias(registeredGrade), literal('STRING', grade)], 'BOOLEAN'), actions: [go(fullMap['assessment:' + grade])] })),
   { actions: [go(fullMap['assessment:SD'])] }
  ] }]);
 }
}
await Promise.all(styleJobs);
// Fit long labels and new navigation consistently with the established components.
for (const page of [desktopPage, mobilePage]) {
 await figma.setCurrentPageAsync(page);
 for (const root of fullRoots.filter(n => n.parent?.id === page.id).concat(fullMenus.filter(n => n.parent?.id === page.id))) {
  for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] })) {
   const props = n.componentProperties; const t = n.findAllWithCriteria({ types: ['TEXT'] })[0]; if (!t) continue;
   if (props[P.ButtonPrimary.label] || props[P.ButtonSecondary.label] || props[P.Tag.label]) {
    const padding = props[P.Tag.label] ? 20 : 40; const parent = n.parent;
    const limit = Math.max(80, parent.width - (parent.paddingLeft || 0) - (parent.paddingRight || 0));
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; const width = Math.min(Math.max(n.width, t.width + padding), limit);
    if (t.width + padding > limit) { t.textAutoResize = 'HEIGHT'; t.resize(limit - padding, t.height); }
    n.resize(width, n.height); n.counterAxisSizingMode = 'AUTO';
   }
   if (n.name.startsWith('Navigation / ')) { t.textAutoResize = 'WIDTH_AND_HEIGHT'; n.resize(204, n.height); n.primaryAxisSizingMode = 'FIXED'; n.counterAxisSizingMode = 'AUTO'; }
   if (props[P.Input.value]) { t.textAutoResize = 'HEIGHT'; t.resize(n.width - 72, t.height); }
  }
 }
}
// Reflow in three columns with row heights derived from content to avoid overlaps.
await figma.setCurrentPageAsync(desktopPage);
const desktopActual = desktopPage.children.filter(n => n.type === 'FRAME' && n.name.startsWith('UX / '));
let rowYActual = 200;
for (let i = 0; i < desktopActual.length; i += 3) { const group = desktopActual.slice(i, i + 3); group.forEach((n, j) => { n.x = 6800 + j * 1640; n.y = rowYActual; }); rowYActual += Math.max(...group.map(n => n.height)) + 180; }
const dialogsActual = desktopPage.children.filter(n => n.type === 'FRAME' && n.name.startsWith('Dialog / '));
let dialogYActual = 200;
for (let i = 0; i < dialogsActual.length; i += 4) { const group = dialogsActual.slice(i, i + 4); group.forEach((n, j) => { n.x = 12000 + j * 800; n.y = dialogYActual; }); dialogYActual += Math.max(...group.map(n => n.height)) + 100; }
await figma.setCurrentPageAsync(mobilePage);
const mobileActual = mobilePage.children.filter(n => n.type === 'FRAME' && n.name.startsWith('Mobile'));
let mobileYActual = 200;
for (let i = 0; i < mobileActual.length; i += 5) { const group = mobileActual.slice(i, i + 5); group.forEach((n, j) => { n.x = 200 + j * 470; n.y = mobileYActual; }); mobileYActual += Math.max(...group.map(n => n.height)) + 140; }
await figma.setCurrentPageAsync(desktopPage);
const focusActual = await figma.getNodeByIdAsync(fullMap['lesson:sma-eksplanasi:1']);
figma.currentPage.selection = [focusActual]; figma.viewport.scrollAndZoomIntoView([focusActual]);
