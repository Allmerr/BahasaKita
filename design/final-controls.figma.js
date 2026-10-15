// Mobile cards open their own lesson, rather than the first lesson in the grade.
await figma.setCurrentPageAsync(mobilePage);
for (const grade of ['SD', 'SMP', 'SMA']) {
 for (const [i, lesson] of curriculum.lessons[grade].entries()) {
  let root;
  if (i === 0) root = await figma.getNodeByIdAsync(fullMap['mobile:' + grade + ':Materi belajar']);
  else {
   const v = fullView('mobilelesson:' + lesson.id, 'Materi / ' + grade + ' / ' + lesson.title, 390, true); root = v.root;
   if (v.fresh) {
    logo(root, 160); queued(button(root, 'Kembali ke jalur belajar', null, true, 350), 'mobile:' + grade + ':Belajar');
    heading(root, lesson.title, grade + ' · ' + aspectsActual[lesson.aspect] + ' · ' + lesson.time + ' menit', 350);
    const c = card(root, 'Pengantar & visual', 350, 'panel', 20); wordPicture(c, lesson.word, 80);
    txt(c, lesson.intro, 'Section', 'text', 310); txt(c, lesson.explanation, 'Body', 'muted', 310); txt(c, lesson.tip, 'Body', 'primary', 310);
    txt(c, 'Kosakata: ' + lesson.words.join(' · '), 'Caption', 'muted', 310);
    queued(button(c, 'Lihat kata dalam kamus', null, true, 310), 'mobile:' + grade + ':Kamus visual');
   }
  }
  fullMap['mobilelesson:' + lesson.id] = root.id;
  const list = await figma.getNodeByIdAsync(fullMap['mobile:' + grade + ':Belajar']);
  const c = list.children.find(n => n.name === lesson.title); const b = c?.findOne(n => n.name === 'Action / Lihat materi'); if (b) await navTo(b, root.id);
 }
}
// Password and confirmation can each be revealed independently through component variants.
const dsPageActual = await figma.getNodeByIdAsync(state.pages.ds);
await figma.setCurrentPageAsync(dsPageActual);
let passwordSetActual = dsPageActual.children.find(n => n.name === 'Control / Password');
if (!passwordSetActual) {
 const variants = [];
 for (const visible of [false, true]) {
  const c = component('Visibility=' + (visible ? 'Visible' : 'Hidden'), 390, 'HORIZONTAL', 'panel', 16);
  c.description = 'Kontrol tampil/sembunyikan kata sandi. Teks contoh untuk prototipe, bukan kata sandi pengguna.';
  c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'AUTO'; c.counterAxisAlignItems = 'CENTER'; radius(c, 999); border(c);
  const text = txt(c, visible ? 'Belajar123!' : '••••••••••', 'Body', 'muted', 304); text.layoutGrow = 1;
  icon(c, visible ? 'eye' : 'eyeOff', 20); variants.push(c);
 }
 passwordSetActual = figma.combineAsVariants(variants, dsPageActual); passwordSetActual.name = 'Control / Password'; passwordSetActual.x = 1600; passwordSetActual.y = 600;
 for (let i = 0; i < 2; i++) await variants[i].setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:variants[1-i].id,navigation:'CHANGE_TO',transition:null}]}]);
}
for (const page of [desktopPage, mobilePage]) {
 await figma.setCurrentPageAsync(page);
 for (const root of page.children.filter(n => n.type === 'FRAME' && /Register|Login/.test(n.name))) {
  for (const f of root.findAll(n => n.type === 'FRAME' && ['Kata sandi', 'Konfirmasi kata sandi'].includes(n.name))) {
   if (f.children.some(n => n.name === 'Control / Password')) continue;
   const old = f.children.find(n => n.type === 'INSTANCE' && n.componentProperties[P.Input.value]); if (!old) continue;
   const index = f.children.indexOf(old); const control = passwordSetActual.children[0].createInstance(); control.name = 'Control / Password'; f.insertChild(index, control); control.resize(old.width, control.height); old.remove();
  }
 }
}
// Core pages have paired light/dark views, using the application's theme tokens.
await figma.setCurrentPageAsync(desktopPage);
const themeSourcesActual = [
 ...['SD','SMP','SMA'].flatMap(g => [additions['learn'+g], additions['dict'+g]]),
 settingsView.root.id, progressView.root.id, screenIds['Profil saya']
];
const themePairsActual = new Map();
for (const id of themeSourcesActual) {
 const source = await figma.getNodeByIdAsync(id); const name = 'UX / Tema gelap / ' + source.name.replace(/^UX \/ /,'');
 let dark = desktopPage.children.find(n => n.name === name);
 if (!dark) {
  dark = source.clone(); desktopPage.appendChild(dark); dark.name = name; fullRoots.push(dark);
  for (const n of [dark, ...dark.findAll(() => true)]) {
   if (Array.isArray(n.fills)) n.fills = n.fills.map(f => {
    if (f.type !== 'SOLID') return f;
    const semantic = Object.entries(state.semantic.Light).find(([key,id]) => f.boundVariables?.color?.id === id);
    return semantic ? paint(semantic[0], 'Dark') : f;
   });
   if (Array.isArray(n.strokes)) n.strokes = n.strokes.map(f => f.type === 'SOLID' ? paint('border','Dark') : f);
  }
  for (const n of dark.findAllWithCriteria({types:['INSTANCE']})) {
   if (n.componentProperties[P.ButtonPrimary.label]) { n.fills = [paint('primary','Light')]; for (const t of n.findAllWithCriteria({types:['TEXT']})) t.fills = [paint('text','Dark')]; }
  }
  for (const p of dark.findAll(n => n.type === 'FRAME' && (n.name.startsWith('Video / ') || n.name === 'Pemutar video pembelajaran'))) {
   p.fills = [paint('bg','Dark')]; for (const t of p.findAllWithCriteria({types:['TEXT']})) t.fills = [paint('text','Dark')];
  }
 }
 themePairsActual.set(source.id, dark.id); themePairsActual.set(dark.id,source.id);
}
for (const [lightKey, darkKey] of [['Login','loginDark'],['Register','registerDark']]) {
 themePairsActual.set(screenIds[lightKey],additions[darkKey]); themePairsActual.set(additions[darkKey],screenIds[lightKey]);
}
themePairsActual.set(screenIds.Beranda,screenIds['Beranda · Gelap']); themePairsActual.set(screenIds['Beranda · Gelap'],screenIds.Beranda);
// Match brightness(0) invert(1) in src/theme.css with an editable alpha mask.
await figma.setCurrentPageAsync(dsPageActual);
let whiteBrandActual = dsPageActual.children.find(n => n.type === 'COMPONENT' && n.name === 'Brand / Dark');
if (!whiteBrandActual) {
 whiteBrandActual = figma.createComponent(); dsPageActual.appendChild(whiteBrandActual); whiteBrandActual.name = 'Brand / Dark';
 whiteBrandActual.description = 'Logo putih transparan memakai alpha mask dari aset asli, sesuai filter tema gelap aplikasi.';
 whiteBrandActual.resize(masters.Brand.width,masters.Brand.height); whiteBrandActual.layoutMode='VERTICAL'; whiteBrandActual.primaryAxisSizingMode='AUTO'; whiteBrandActual.counterAxisSizingMode='FIXED'; whiteBrandActual.fills=[]; whiteBrandActual.x=1600;whiteBrandActual.y=900;
 const imageLayer=masters.Brand.findOne(n=>Array.isArray(n.fills)&&n.fills.some(f=>f.type==='IMAGE'));
 const mask=figma.createRectangle(); whiteBrandActual.appendChild(mask); mask.name='Logo alpha mask'; mask.resize(masters.Brand.width,masters.Brand.height); mask.fills=imageLayer.fills; mask.isMask=true; mask.maskType='ALPHA';
 const white=figma.createRectangle(); whiteBrandActual.appendChild(white); white.name='Logo putih'; white.resize(masters.Brand.width,masters.Brand.height);white.fills=[paint('text','Dark')];
 figma.group([mask,white],whiteBrandActual).name='Logo transparan';
}
await figma.setCurrentPageAsync(desktopPage);
for(const root of desktopPage.children.filter(n=>n.type==='FRAME'&&/gelap/i.test(n.name))){
 for(const n of root.findAllWithCriteria({types:['INSTANCE']}).filter(n=>n.name==='Brand')) {const w=n.width,h=n.height;n.swapComponent(whiteBrandActual);n.resize(w,h);}
 for(const n of root.findAllWithCriteria({types:['VECTOR']})) if(Array.isArray(n.strokes)&&n.strokes.length)n.strokes=[paint('primary','Dark')];
}
for (const [id,destination] of themePairsActual) {
 const root = await figma.getNodeByIdAsync(id); if (!root || !destination) continue;
 const toggle = root.findOne(n => n.name === 'Icon/sun' || n.name === 'Icon/moon'); if (toggle) await navTo(toggle,destination);
}
// Settings save actions have an explicit confirmation; no account data is written by the prototype.
const savedActual = dialogActual('preferencesSaved','Pengaturan disimpan',520);
if (savedActual.fresh) { icon(savedActual.root,'check',40); txt(savedActual.root,'Pengaturan tersimpan','Section','text',472); txt(savedActual.root,'Ruang belajarmu siap digunakan.','Body','muted',472); await onClick(button(savedActual.root,'Selesai'),[closeAction()]); }
for (const root of [settingsView.root, await figma.getNodeByIdAsync(themePairsActual.get(settingsView.root.id))]) {
 if (!root) continue;
 for (const b of root.findAll(n => n.name === 'Action / Simpan profil' || n.name === 'Action / Simpan pengaturan akun')) await navTo(b,savedActual.root.id,true);
}
// Make the original overview catalogue agree with the current SD lesson data as well.
const initialLearningActual = await figma.getNodeByIdAsync(screenIds.Belajar);
const initialCardsActual = initialLearningActual.findAllWithCriteria({types:['INSTANCE']}).filter(n => n.componentProperties[P.LessonCard.title]);
for (const [i,c] of initialCardsActual.entries()) { const l=curriculum.lessons.SD[i]; if (!l) continue; c.setProperties({[P.LessonCard.title]:l.title,[P.LessonCard.body]:l.description}); await navTo(c,fullMap['lesson:'+l.id+':0']); }
