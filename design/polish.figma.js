// Repair source labels, navigation glyphs, and dark-theme contrast.
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync(state.pages.ds));
const navMaster = masters.NavItem;
const navDefinitions = {};
for (const [label, symbol] of [['Beranda', 'home'], ['Belajar', 'graduation'], ['Kamus visual', 'dictionary'], ['Kemajuan saya', 'chart'], ['Kelas belajar dasar', 'spark']]) {
 let component = figma.currentPage.findAllWithCriteria({ types: ['COMPONENT'] }).find(n => n.name === 'Navigation / ' + label);
 if (!component) {
  component = navMaster.clone(); figma.currentPage.appendChild(component); component.name = 'Navigation / ' + label;
  const old = component.children.find(n => n.name.startsWith('Icon/')); if (old) old.remove();
  const glyph = icon(component, symbol, 22); component.insertChild(0, glyph);
  component.x = 200 + Object.keys(navDefinitions).length * 260; component.y = 1400;
  component.description = 'Navigation BahasaKita / ' + label + '. Ikon sesuai navigasi pada kode proyek.';
 }
 const labelProperty = Object.entries(component.componentPropertyDefinitions).find(([k, p]) => p.type === 'TEXT')?.[0];
 navDefinitions[label] = { component, labelProperty };
}
const darkPrimary = vv[state.semantic.Dark.primary];
for (const modeId of Object.keys(darkPrimary.valuesByMode)) darkPrimary.setValueForMode(modeId, { r: 165 / 255, g: 180 / 255, b: 252 / 255, a: 1 });
await figma.setCurrentPageAsync(desktopPage);
for (const root of desktopPage.children.filter(n => n.type === 'FRAME' && (/^\d{2} \/ /.test(n.name) || n.name.startsWith('UX / ')))) {
 const darkTheme = root.name.includes('Gelap');
 const grade = /· (SD|SMP|SMA)$/.exec(root.name)?.[1];
 for (const t of root.findAllWithCriteria({ types: ['TEXT'] })) {
  if (grade && t.characters === 'SD · Kosakata & visual') t.characters = grade + ' · Kosakata & visual';
  if (grade && t.characters === 'Dina · SD') t.characters = 'Dina · ' + grade;
 }
 for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.name === 'NavItem' || n.name.startsWith('Navigation / '))) {
  const text = n.findAllWithCriteria({ types: ['TEXT'] })[0]; const label = text?.characters; const definition = navDefinitions[label];
  if (!definition) continue;
  const savedFills = n.fills; const savedText = text.fills; const w = n.width;
  n.swapComponent(definition.component); if (definition.labelProperty) n.setProperties({ [definition.labelProperty]: label }); n.resize(w, n.height); n.fills = savedFills;
  for (const t of n.findAllWithCriteria({ types: ['TEXT'] })) t.fills = savedText;
  for (const v of n.findAllWithCriteria({ types: ['VECTOR'] })) if (Array.isArray(v.strokes) && v.strokes.length) v.strokes = [paint(darkTheme ? 'primary' : 'muted', darkTheme ? 'Dark' : 'Light')];
 }
 if (darkTheme) {
  for (const n of root.findAllWithCriteria({ types: ['INSTANCE'] })) {
   const main = await n.getMainComponentAsync();
   if (main?.id === masters.ButtonPrimary.id) { fill(n, 'primary'); for (const t of n.findAllWithCriteria({ types: ['TEXT'] })) fill(t, 'panel'); }
  }
 }
}
// Original SD dictionary also uses the checked words from the project.
const dictionaryRoot = await figma.getNodeByIdAsync(screenIds['Kamus visual']);
const wordInstances = dictionaryRoot.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.name === 'WordCard');
for (let i = 0; i < wordInstances.length; i++) {
 const w = projectContent.SD.words[i % projectContent.SD.words.length];
 wordInstances[i].setProperties({ [P.WordCard.title]: w.word, [P.WordCard.meaning]: w.meaning, [P.WordCard.category]: w.category });
}
const originalDetail = await figma.getNodeByIdAsync(screenIds['Detail kata']);
for (const t of originalDetail.findAllWithCriteria({ types: ['TEXT'] })) {
 if (t.characters === 'Tumbuhan') t.characters = projectContent.SD.words[0].word;
 if (t.characters === 'Makhluk hidup yang tumbuh di sekitar kita.') t.characters = projectContent.SD.words[0].meaning;
 if (t.characters === 'Contoh: Ibu menyiram tumbuhan di taman.') t.characters = projectContent.SD.words[0].example;
}
figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync(additions.learnSMP || screenIds.Belajar)]);
