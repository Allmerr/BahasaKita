import fs from 'node:fs'
import { lessonsForGrade } from '../src/gradeLessons.js'

const source = fs.readFileSync('src/learning.jsx', 'utf8')
const bankLiteral = source.match(/export const questionBank = (\{[\s\S]*?\n\})\r?\nexport const questionsForGrade/)[1]
// Evaluate only the trusted, local object literal used by the application's question bank.
const bank = Function('return (' + bankLiteral + ')')()
const content = { lessons: Object.fromEntries(['SD', 'SMP', 'SMA'].map(g => [g, lessonsForGrade(g)])), bank }
fs.writeFileSync('design/lesson-content.json', JSON.stringify(content, null, 2))
let expansion = fs.readFileSync('design/completeness.figma.js', 'utf8')
expansion = expansion.replace('// Resolve links only after every target', fs.readFileSync('design/final-controls.figma.js', 'utf8') + '\n// Resolve links only after every target')
const section = '\n// BEGIN COMPLETENESS\nconst curriculum = ' + JSON.stringify(content) + ';\n' + expansion + '\n// END COMPLETENESS\n'
let plugin = fs.readFileSync('design/figma-plugin/code.js', 'utf8')
plugin = plugin.replace("const existingMobile=mobilePage.children.filter(n=>n.name.startsWith('Mobile / '));", "const existingMobile=mobilePage.children.filter(n=>/^Mobile \\/ (Login|Register|Beranda|Asesmen awal|Belajar|Kamus visual|Pengaturan)$/.test(n.name));")
plugin = plugin.replace("const darkTheme = root.name.includes('Gelap');", "const darkTheme = /gelap/i.test(root.name);")
plugin = plugin.replace(/\n\/\/ BEGIN COMPLETENESS[\s\S]*?\/\/ END COMPLETENESS\n/, '\n')
plugin = plugin.replace('// END EXPANDED STATES', section + '// END EXPANDED STATES')
plugin = plugin.replace(/main\(\)\.then\(result=>figma\.closePlugin\(`[\s\S]*?`\)\)/, 'main().then(result=>{figma.showUI("<div style=\\"font:15px sans-serif;padding:24px;color:#0f172a\\"><h2>Desain BahasaKita diperbarui</h2><p>"+result.desktop+" layar desktop · "+result.mobile+" layar mobile · "+result.dialogs+" dialog</p><p>Materi SD, SMP, dan SMA mengikuti kode aplikasi. Tutup panel ini untuk melihat dan mencoba desain.</p></div>",{width:520,height:260});})')
fs.writeFileSync('design/figma-plugin/code.js', plugin)
