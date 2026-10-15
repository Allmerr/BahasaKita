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
