// Generated from the BahasaKita source design scripts. No network or credentials.
async function main(){
const styleJobs=[];
const textSpecs={};
function autoLayout(direction){const node=figma.createFrame();node.layoutMode=direction;return node;}

const state={"createdNodeIds":["5:4","5:5"],"mutatedNodeIds":["0:1"],"pages":{"ds":"5:4","screens":"0:1","mobile":"5:5"},"semantic":{"Light":{"primary":"VariableID:5:24","bg":"VariableID:5:25","panel":"VariableID:5:26","text":"VariableID:5:27","muted":"VariableID:5:28","border":"VariableID:5:29","purple":"VariableID:5:30","blue":"VariableID:5:31","pink":"VariableID:5:32","yellow":"VariableID:5:33"},"Dark":{"primary":"VariableID:5:35","bg":"VariableID:5:36","panel":"VariableID:5:37","text":"VariableID:5:38","muted":"VariableID:5:39","border":"VariableID:5:40","purple":"VariableID:5:41","blue":"VariableID:5:42","pink":"VariableID:5:43","yellow":"VariableID:5:44"}},"sizes":{"space4":"VariableID:5:46","space8":"VariableID:5:47","space12":"VariableID:5:48","space16":"VariableID:5:49","space20":"VariableID:5:50","space24":"VariableID:5:51","space32":"VariableID:5:52","space40":"VariableID:5:53","radius8":"VariableID:5:54","radius14":"VariableID:5:55","radius20":"VariableID:5:56","radius32":"VariableID:5:57","radius999":"VariableID:5:58"},"styles":{"Display":"S:85d64295af72e84e9aec0e1cb3416c42a540813d,","Heading":"S:c9bda5a1a2d355bd62d3afc688c3dda0bb50683d,","Section":"S:67b7a5e73bc9088c71f473a56b65ccec6ebc38a4,","Body":"S:8f3cca09d2dc99755105c522bf6b91089e48ac00,","Label":"S:97e24f6e303471491f0a35506c9c443ee4e9f00c,","Caption":"S:748e7dfb88547f5544958d7eff3f0806e72921c0,"},"variables":49,"typography":"Noto Sans (Segoe UI unavailable)"};
const icons={"mail":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"4\"/><path d=\"m4 7 8 6 8-6\"/></svg>","eye":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>","eyeOff":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 3 18 18M10 5a12 12 0 0 1 12 7s-1 3-4 5M6 6c-3 2-4 6-4 6s3 7 10 7c2 0 4-1 5-2M9 9a4 4 0 0 0 6 6\"/></svg>","profile":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21v-2a8 8 0 0 1 16 0v2\"/></svg>","home":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z\"/><path d=\"M9 21v-8h6v8\"/></svg>","path":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"5\" cy=\"5\" r=\"2\"/><circle cx=\"19\" cy=\"19\" r=\"2\"/><path d=\"M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8\"/></svg>","graduation":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10v6M2 10l10-5 10 5-10 5z\"/><path d=\"M6 12v5c3 3 9 3 12 0v-5\"/></svg>","dictionary":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z\"/><path d=\"m9.5 13.5 2.5-6.5 2.5 6.5M10.3 11.5h3.4\"/></svg>","book":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v16M12 5C8 2 4 3 2 4v15c4-2 7-1 10 2 3-3 6-4 10-2V4c-2-1-6-2-10 1Z\"/></svg>","text":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5h16M4 10h10M4 15h16M4 20h10\"/></svg>","file":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 2H5v20h14V7Z\"/><path d=\"M14 2v5h5M8 12h8M8 16h5\"/></svg>","shapes":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 3 5 8H2Z\"/><rect x=\"13\" y=\"13\" width=\"8\" height=\"8\" rx=\"2\"/><circle cx=\"6\" cy=\"18\" r=\"4\"/></svg>","chart":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 3v18h17M8 16v-4M13 16V8M18 16V4\"/></svg>","settings":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 6h16M4 12h16M4 18h16\"/><circle cx=\"8\" cy=\"6\" r=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"2\"/><circle cx=\"10\" cy=\"18\" r=\"2\"/></svg>","arrow":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12h16m-6-6 6 6-6 6\"/></svg>","arrowLeft":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m10 18-6-6 6-6M4 12h16\"/></svg>","chevronDown":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m6 9 6 6 6-6\"/></svg>","chevron":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m9 5 7 7-7 7\"/></svg>","check":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m5 12 4 4L19 6\"/></svg>","clock":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/></svg>","lock":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"10\" width=\"14\" height=\"11\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3M12 14v3\"/></svg>","search":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"10\" cy=\"10\" r=\"7\"/><path d=\"m15 15 6 6\"/></svg>","play":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m8 4 12 8-12 8Z\"/></svg>","hand":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 13V5a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v8c0 5-3 8-7 8-3 0-5-2-7-5l-3-5a2 2 0 0 1 3-2l2 3\"/></svg>","spark":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z\"/></svg>","info":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v6M12 7v.1\"/></svg>","close":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m6 6 12 12M6 18 18 6\"/></svg>","moon":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z\"/></svg>","sun":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1 1M18 18l1 1M5 19l1-1M18 6l1-1\"/></svg>","menu":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 6h16M4 12h16M4 18h16\"/></svg>","refresh":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 7v5h-5M4 17v-5h5\"/><path d=\"M20 12a8 8 0 0 0-14-5M4 12a8 8 0 0 0 14 5\"/></svg>","expand":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5\"/></svg>","leaf":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 3C6 2 1 10 6 16s16 0 14-13Z\"/><path d=\"M3 21 15 9\"/></svg>","trophy":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 3h8v7a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4M16 5h4v3a4 4 0 0 1-4 4M12 14v6M8 21h8\"/></svg>","camera":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#4f46e5\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/></svg>"};
const created=[];
await Promise.all(['Regular','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'Noto Sans',style})));
const vv={};await Promise.all(Object.values({...state.semantic.Light,...Object.fromEntries(Object.entries(state.semantic.Dark).map(([k,v])=>['dark'+k,v])),...state.sizes}).map(async id=>{vv[id]=await figma.variables.getVariableByIdAsync(id)}));
function paint(key,theme='Light'){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',vv[state.semantic[theme][key]]);}
function fill(n,key,theme='Light'){n.fills=[paint(key,theme)];}
function gap(n,v){n.setBoundVariable('itemSpacing',vv[state.sizes['space'+v]]);}
function pad(n,v){for(const k of ['paddingLeft','paddingRight','paddingTop','paddingBottom'])n.setBoundVariable(k,vv[state.sizes['space'+v]]);}
function radius(n,v){n.setBoundVariable('cornerRadius',vv[state.sizes['radius'+v]]);}
function frame(parent,name,w,dir='VERTICAL',color=null,padding=0,g=16){const n=autoLayout(dir);created.push(n.id);n.name=name;n.resize(w,100);n.primaryAxisSizingMode=dir==='VERTICAL'?'AUTO':'FIXED';n.counterAxisSizingMode=dir==='VERTICAL'?'FIXED':'AUTO';n.fills=[];if(parent)parent.appendChild(n);if(color)fill(n,color);if(padding)pad(n,padding);gap(n,g);return n;}
function txt(parent,value,style='Body',color='text',width=null,theme='Light'){const t=figma.createText();created.push(t.id);parent.appendChild(t);t.fontName={family:'Noto Sans',style:'Regular'};const spec=textSpecs[style];t.fontName=spec.fontName;t.fontSize=spec.fontSize;t.lineHeight=spec.lineHeight;styleJobs.push(t.setTextStyleIdAsync(state.styles[style]));t.characters=value;t.name=value.slice(0,70);t.fills=[paint(color,theme)];if(width){t.textAutoResize='HEIGHT';t.resize(width,t.height);}return t;}
function icon(parent,name,size=24){const n=figma.createNodeFromSvg(icons[name]||icons.book);parent.appendChild(n);created.push(n.id,...n.findAll(()=>true).map(x=>x.id));n.name='Icon/'+name;n.resize(size,size);return n;}
function component(name,w,dir='VERTICAL',color='panel',padding=20){const c=figma.createComponent();created.push(c.id);c.name=name;c.layoutMode=dir;c.resize(w,100);c.primaryAxisSizingMode=dir==='VERTICAL'?'AUTO':'FIXED';c.counterAxisSizingMode=dir==='VERTICAL'?'FIXED':'AUTO';fill(c,color);pad(c,padding);gap(c,12);radius(c,14);c.description='Komponen BahasaKita berdasarkan tampilan aplikasi. Teks dan warna dapat diedit.';return c;}
function prop(c,node,name){const key=c.addComponentProperty(name,'TEXT',node.characters);node.componentPropertyReferences={characters:key};return key;}
function instance(parent,c,w=null,properties=null){const n=c.createInstance();created.push(n.id);parent.appendChild(n);if(properties)n.setProperties(properties);if(w)n.resize(w,n.height);return n;}
function border(n,theme='Light'){n.strokes=[paint('border',theme)];n.strokeWeight=1;}

const componentData={"createdNodeIds":["6:2","6:3","6:4","6:5","6:6","6:7","6:8","6:9","6:10","6:11","6:12","6:13","6:14","6:15","6:16","6:17","6:18","6:19","6:20","6:21","6:22","6:23","6:24","6:25","6:26","6:27","6:28","6:29","6:30","6:31","6:32","6:33","6:34","6:35","6:36","6:37","6:38","6:39","6:40","6:42","6:43","6:44","6:45","6:46","6:47","6:48","6:49","6:50","6:51","6:52","6:53","6:54"],"board":"6:2","masters":{"ButtonPrimary":"6:7","ButtonSecondary":"6:9","Tag":"6:11","Input":"6:14","NavItem":"6:21","WordCard":"6:27","LessonCard":"6:35","Stat":"6:42","VideoCard":"6:49","Brand":"6:53"},"props":{"ButtonPrimary":{"label":"Label#6:0"},"ButtonSecondary":{"label":"Label#6:1"},"Tag":{"label":"Label#6:2"},"Input":{"value":"Value#6:3"},"NavItem":{"label":"Label#6:4"},"WordCard":{"category":"Category#6:5","title":"Title#6:6","meaning":"Meaning#6:7"},"LessonCard":{"title":"Title#6:8","body":"Body#6:9"},"Stat":{"value":"Value#6:10","label":"Label#6:11"},"VideoCard":{"title":"Title#6:12"}},"components":10,"bounds":{"w":1200,"h":689}};
const screenIds={"Beranda":"7:3","Register":"7:4","Login":"7:5","Asesmen awal":"7:6","Kelas belajar dasar":"7:7","Belajar":"7:8","Materi belajar":"7:9","Kamus visual":"7:10","Kemajuan saya":"7:11","Profil saya":"7:12","Pengaturan":"7:13","Beranda · Gelap":"7:14","Detail kata":"7:15"};
const masters={};await Promise.all(Object.entries(componentData.masters).map(async([k,v])=>{masters[k]=await figma.getNodeByIdAsync(v)}));
const P=componentData.props;
const links=[];
function use(parent,name,values={},w=null){const props={};for(const [k,v]of Object.entries(values))props[P[name][k]]=v;return instance(parent,masters[name],w,props);}
function button(parent,label,target=null,secondary=false,w=null){const n=use(parent,secondary?'ButtonSecondary':'ButtonPrimary',{label},w);n.name='Action / '+label;if(target)links.push({n,target});return n;}
function tag(parent,label){return use(parent,'Tag',{label});}
function card(parent,name,w,color='panel',p=24){const n=frame(parent,name,w,'VERTICAL',color,p,16);border(n);radius(n,14);return n;}
function heading(parent,title,description,w=1100){txt(parent,title,'Heading','text',w);if(description)txt(parent,description,'Body','muted',w);}
function logo(parent,w=190){return use(parent,'Brand',{},w);}
function field(parent,label,value,password=false,select=false,w=390){const wrap=frame(parent,label,w,'VERTICAL',null,0,8);txt(wrap,label,'Caption','muted');const n=use(wrap,'Input',{value},w);if(!password){n.children.filter(c=>c.name.startsWith('Icon/')).forEach(c=>c.visible=false);if(select){const ar=icon(wrap,'chevronDown',20);ar.layoutPositioning='ABSOLUTE';ar.x=w-35;ar.y=42;}}return wrap;}
function shell(root,title,basic=false){root.resize(1440,100);root.layoutMode='HORIZONTAL';root.primaryAxisSizingMode='FIXED';root.counterAxisSizingMode='AUTO';
 const side=frame(root,'Navigasi samping',244,'VERTICAL','panel',20,16);logo(side);txt(side,'RUANG BELAJARMU','Caption','muted',204);
 for(const label of ['Beranda','Belajar','Kamus visual','Kemajuan saya',...(basic?['Kelas belajar dasar']:[])]){const n=use(side,'NavItem',{label},204);if(label!==title){fill(n,'panel');n.findAllWithCriteria({types:['TEXT']}).forEach(t=>fill(t,'muted'));}links.push({n,target:label});}
 const note=card(side,'Profil pengguna',204,'bg',16);txt(note,'Profil saya','Label');txt(note,'Dina · SD','Caption','muted');links.push({n:note,target:'Profil saya'});txt(side,'BahasaKita · Ruang untuk bertumbuh','Caption','muted',204);
 const body=frame(root,'Area konten',1196,'VERTICAL','bg',0,0);
 const top=frame(body,'Header',1196,'HORIZONTAL','panel',24,20);top.counterAxisAlignItems='CENTER';const bc=frame(top,'Breadcrumb',1000,'HORIZONTAL',null,0,12);txt(bc,'Ruang belajarmu','Caption','muted');icon(bc,'chevron',14);txt(bc,title,'Caption');const toggle=icon(top,'sun',24);links.push({n:toggle,target:'Beranda · Gelap'});icon(top,'profile',24);
 const main=frame(body,'Konten / '+title,1196,'VERTICAL',null,32,24);
 return main;
}
function video(parent,title='Tumbuhan di sekitar kita',w=310){return use(parent,'VideoCard',{title},w);}
function dashboard(root){const m=shell(root,'Beranda');heading(m,'Halo, teman belajar!','Siap menemukan hal baru hari ini? Kita mulai dari langkah kecil.');
 const hero=card(m,'Hero / Caramu belajar',1132,'purple',32);
 heading(hero,'Caramu belajar, cerita hebatmu.','Video pembelajaran untuk teman Tuli/tunarungu dengan isyarat dan visual sesuai jenjang belajarmu.',1068);
 const vr=frame(hero,'Pilihan video',1068,'HORIZONTAL',null,0,20);for(const t of ['Tumbuhan di sekitar kita','Mengenal hewan peliharaan','Mengenal anggota keluarga'])video(vr,t,310);
 button(hero,'Mulai perjalananmu','Asesmen awal');
 const stats=frame(m,'Ringkasan belajar',1132,'HORIZONTAL',null,0,20);for(const [value,label]of [['4 tahap','Dalam setiap sesi belajar'],['4 aspek','Jalur sesuai kemampuanmu'],['8–10 menit','Belajar sedikit, setiap hari']])use(stats,'Stat',{value,label},360);
 const row=frame(m,'Mulai & perjalanan',1132,'HORIZONTAL',null,0,24);
 const left=card(row,'Asesmen awal',735);txt(left,'Mulai dari mengenali dirimu','Section');txt(left,'8 soal singkat. Tidak ada nilai buruk. Hasilnya membantumu memilih materi.','Body','muted',687);button(left,'Mulai asesmen awal','Asesmen awal');const right=card(row,'Perjalananmu',373);txt(right,'Perjalananmu','Section');txt(right,'0%','Display');txt(right,'Selesaikan asesmen untuk membuka jalur belajarmu.','Body','muted',325);button(right,'Lihat kemajuan saya','Kemajuan saya',true);
 txt(m,'Empat ruang untuk bertumbuh','Section');const ar=frame(m,'Aspek belajar',1132,'HORIZONTAL',null,0,20);for(const [title,body]of [['Kosakata','Kenali kata dan artinya.'],['Kalimat','Susun kata, pahami makna.'],['Bacaan','Temukan informasi dalam cerita.'],['Soal akademik','Pahami konsep matematika.']]){const c=card(ar,title,268);txt(c,title,'Section');txt(c,body,'Body','muted',220);}
 return m;
}
function auth(root,isRegister){root.resize(1440,1100);root.primaryAxisSizingMode='FIXED';root.counterAxisAlignItems='CENTER';root.primaryAxisAlignItems='CENTER';fill(root,'purple');
 const c=card(root,isRegister?'Form register':'Form login',440,'blue',24);radius(c,32);c.counterAxisAlignItems='CENTER';logo(c,210);txt(c,isRegister?'Mari kenalan dulu':'Selamat datang kembali','Heading','text',392);
 txt(c,isRegister?'Buat profil, lalu ikuti asesmen awal untuk menentukan kelas belajarmu.':'Masukkan email dan kata sandi untuk melanjutkan.','Body','muted',392);
 if(isRegister)field(c,'Nama panggilan','Nama panggilanmu');
 field(c,'Email','Alamat email');
 field(c,'Kata sandi',isRegister?'Minimal 8 karakter':'Masukkan kata sandi',true);
 if(isRegister){field(c,'Konfirmasi kata sandi','Ulangi kata sandi',true);field(c,'Jenjang belajar','Pilih jenjang belajar',false,true);txt(c,'Pilihan: SD · SMP · SMA','Caption','primary',390);}
 else txt(c,'□  Ingat email saya','Body','muted',390);
 button(c,isRegister?'Register':'Masuk dan lanjutkan',isRegister?'Asesmen awal':'Beranda',false,390);
 txt(c,isRegister?'Periksa email untuk konfirmasi setelah mendaftar.':'ATAU','Caption','muted',390);
 const social=frame(c,'Masuk sosial belum aktif',390,'HORIZONTAL',null,0,12);button(social,'Google',null,true,185);button(social,'Apple',null,true,185);txt(c,'Google dan Apple belum terhubung.','Caption','muted',390);
 button(c,isRegister?'Sudah punya profil? Login':'Belum punya profil? Register',isRegister?'Login':'Register',true,390);
}


for(const [name,id]of Object.entries(state.styles)){
 const style=await figma.getStyleByIdAsync(id);
 if(!style || style.type!=='TEXT')throw new Error('Gaya teks tidak ditemukan. Buka file BahasaKita asli.');
 textSpecs[name]={fontName:style.fontName,fontSize:style.fontSize,lineHeight:style.lineHeight};
}
const desktopPage=await figma.getNodeByIdAsync(state.pages.screens);
const mobilePage=await figma.getNodeByIdAsync(state.pages.mobile);
if(!desktopPage || desktopPage.type!=='PAGE' || !mobilePage || mobilePage.type!=='PAGE')throw new Error('Buka file Figma BahasaKita asli sebelum menjalankan plugin.');
const pendingNames=['Asesmen awal','Kelas belajar dasar','Belajar','Materi belajar','Kamus visual','Kemajuan saya','Profil saya','Pengaturan','Beranda · Gelap','Detail kata'];
const targets=await Promise.all(pendingNames.map(name=>figma.getNodeByIdAsync(screenIds[name])));
if(targets.some(n=>!n || n.type!=='FRAME'))throw new Error('Kerangka desain berubah atau hilang. Plugin berhenti agar isi file tetap aman.');
const nonempty=targets.filter(n=>n.children.length>0).length;
if(nonempty>0 && nonempty!==targets.length)throw new Error('Sebagian kerangka sudah diisi. Minta bantuan untuk melanjutkan tanpa menimpa desain.');
await figma.setCurrentPageAsync(mobilePage);
const existingMobile=mobilePage.children.filter(n=>/^Mobile \/ (Login|Register|Beranda|Asesmen awal|Belajar|Kamus visual|Pengaturan)$/.test(n.name));
if(existingMobile.length>0 && existingMobile.length!==7)throw new Error('Halaman Mobile sudah berisi sebagian desain. Plugin berhenti untuk menghindari duplikasi.');

if(nonempty===0){
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync(state.pages.screens));
function player(parent,w=1084){const n=card(parent,'Pemutar video pembelajaran',w,'text',24);const thumb=figma.createRectangle();created.push(thumb.id);n.appendChild(thumb);thumb.resize(w-48,270);thumb.fills=[{type:'IMAGE',imageHash:'fd0d18f74cd7773c49ecd013e02290c2d49c3e4d',scaleMode:'FIT'}];const controls=frame(n,'Kontrol video',w-48,'HORIZONTAL',null,0,16);icon(controls,'play',24);txt(controls,'00:00 / Video pembelajaran · CC · Kecepatan 1×','Caption','panel',w-100);return n;}
let m=shell(await figma.getNodeByIdAsync(screenIds['Asesmen awal']),'Asesmen awal');heading(m,'Yuk, kenali kemampuan awalmu.','Kerjakan perlahan. Kamu boleh berpikir dan membaca kembali.');
let c=card(m,'Pertanyaan asesmen',1132);tag(c,'SOAL 1 DARI 8 · KOSAKATA');txt(c,'Benda apa yang digunakan untuk membaca?','Heading','text',1084);
let row=frame(c,'Pilihan jawaban',1084,'HORIZONTAL',null,0,20);for(const a of ['Buku','Pensil','Air']){const n=button(row,a,null,true,340);n.name='Jawaban / '+a;}button(c,'Lanjutkan','Belajar');txt(m,'Hasil minimal 80 membuka semua fitur belajar. Di bawah 80, lanjut ke Kelas Belajar Dasar.','Body','muted',1100);
row=frame(m,'Contoh hasil asesmen',1132,'HORIZONTAL',null,0,24);c=card(row,'Lulus asesmen',554,'purple');txt(c,'Nilai 90 / 100','Heading');txt(c,'Siap menjelajahi semua materi belajarmu.','Body','muted',506);button(c,'Lanjut belajar','Belajar');c=card(row,'Perlu penguatan',554,'yellow');txt(c,'Nilai 60 / 100','Heading');txt(c,'Pelajari materi dasar dan coba asesmen kembali.','Body','muted',506);button(c,'Masuk kelas dasar','Kelas belajar dasar');

m=shell(await figma.getNodeByIdAsync(screenIds['Kelas belajar dasar']),'Kelas belajar dasar',true);heading(m,'Kelas belajar dasar','Pelajari kembali dasar kosakata, kalimat, bacaan, dan matematika sesuai ritmemu.');tag(m,'Nilai asesmen: 60/100');
txt(m,'Nilaimu belum mencapai 80. Fitur belajar akan terbuka setelah lulus asesmen ulang.','Body','muted',1100);
row=frame(m,'Materi dasar',1132,'HORIZONTAL',null,0,24);c=card(row,'Daftar materi dasar',300);txt(c,'Video pembelajaran','Section','text',252);for(const t of ['Kosakata dasar','Menyusun kalimat','Memahami bacaan','Matematika dasar'])button(c,t,null,true,252);const pc=card(row,'Materi terpilih',808);heading(pc,'Kosakata dasar','Video penjelasan visual dengan teks, tanpa suara.',760);player(pc,760);txt(pc,'Buku digunakan untuk membaca. Pensil digunakan untuk menulis.','Body','muted',760);button(m,'Ulangi asesmen awal','Asesmen awal');

m=shell(await figma.getNodeByIdAsync(screenIds.Belajar),'Belajar');heading(m,'Jalur yang dibuat untukmu.','Materi mengikuti kosakata dan video yang sama dengan Kamus Visual.');tag(m,'Jenjang SD');
for(const pair of [['Tumbuhan di sekitar kita','Mengenal hewan peliharaan'],['Mengenal anggota keluarga','Simbol perubahan cuaca']]){row=frame(m,'Materi sesuai jenjang',1132,'HORIZONTAL',null,0,24);for(const title of pair){const n=use(row,'LessonCard',{title,body:'Lihat video isyarat, kenali kosakata, lalu coba latihan.'},554);links.push({n,target:'Materi belajar'});}}
button(m,'Buka Kamus Visual','Kamus visual',true);

m=shell(await figma.getNodeByIdAsync(screenIds['Materi belajar']),'Belajar');heading(m,'Tumbuhan di sekitar kita','SD · Kosakata · Belajar dengan visual dan isyarat');row=frame(m,'Tahapan belajar',1132,'HORIZONTAL',null,0,16);for(const t of ['1 · Kenali','2 · Amati','3 · Coba','4 · Evaluasi'])tag(row,t);player(m,1132);c=card(m,'Materi & kosakata',1132);txt(c,'Kenali tumbuhan di sekitarmu','Section');txt(c,'Amati gerakan pada video, lalu hubungkan dengan kata dan artinya. Kamu dapat menjeda dan mengulang video.','Body','muted',1084);txt(c,'Kosakata: tumbuhan · daun · bunga · akar','Body','primary',1084);button(c,'Cari arti di kamus','Kamus visual',true);button(m,'Lanjut ke latihan','Kemajuan saya');

m=shell(await figma.getNodeByIdAsync(screenIds['Kamus visual']),'Kamus visual');heading(m,'Kamus visual','Kenali kata melalui arti, contoh kalimat, dan video pembelajaran sesuai jenjangmu.');
row=frame(m,'Jenjang & pencarian',1132,'HORIZONTAL',null,0,20);tag(row,'Jenjang SD');field(row,'Cari kosakata','Cari kata yang ingin kamu kenali',false,false,600);
row=frame(m,'Filter kategori',1132,'HORIZONTAL',null,0,12);for(const t of ['Semua','Benda','Kegiatan','Tempat','Matematika'])button(row,t,null,t!=='Semua');
txt(m,'8 kata · Video pembelajaran dengan isyarat dan visual','Caption','muted',1100);
const words=[['Tumbuhan','Makhluk hidup yang tumbuh di sekitar kita.','Benda'],['Daun','Bagian tumbuhan yang biasanya berwarna hijau.','Benda'],['Bunga','Bagian tumbuhan yang mekar.','Benda'],['Akar','Bagian tumbuhan yang menyerap air.','Benda'],['Menyiram','Memberi air pada tanaman.','Kegiatan'],['Taman','Tempat dengan tanaman dan bunga.','Tempat'],['Buku','Benda berisi halaman untuk dibaca.','Benda'],['Tambah','Menggabungkan dua jumlah.','Matematika']];
for(let i=0;i<2;i++){row=frame(m,'Kosakata '+(i+1),1132,'HORIZONTAL',null,0,20);for(const [title,meaning,category]of words.slice(i*4,i*4+4)){const n=use(row,'WordCard',{title,meaning,category},268);links.push({n,target:'Detail kata'});}}
m=shell(await figma.getNodeByIdAsync(screenIds['Detail kata']),'Kamus visual');heading(m,'Tumbuhan','Kamus visual · SD · Benda');player(m,1132);c=card(m,'Arti dan contoh',1132);txt(c,'Arti kata','Section');txt(c,'Makhluk hidup yang tumbuh di sekitar kita.','Body','muted',1084);txt(c,'Contoh: Ibu menyiram tumbuhan di taman.','Body','text',1084);txt(c,'Lihat gerakan yang sesuai pada video pembelajaran.','Caption','muted',1084);button(c,'Kembali ke kamus','Kamus visual',true);

m=shell(await figma.getNodeByIdAsync(screenIds['Kemajuan saya']),'Kemajuan saya');heading(m,'Setiap langkahmu berarti.','Lihat perkembangan belajar dan temukan langkah berikutnya.');
row=frame(m,'Ringkasan progres',1132,'HORIZONTAL',null,0,20);for(const [value,label]of [['90 / 100','Nilai asesmen awal'],['2 materi','Sudah dikuasai'],['4 sesi','Sesi belajar tercatat']])use(row,'Stat',{value,label},360);
c=card(m,'Perkembangan per aspek',1132);for(const [name,n]of [['Kosakata',80],['Kalimat',60],['Bacaan',40],['Soal akademik',50]]){txt(c,name+' · '+n+'%','Label');const track=frame(c,'Progres '+name,1084,'HORIZONTAL','purple',0,4);track.resize(1084,12);track.primaryAxisSizingMode='FIXED';track.counterAxisSizingMode='FIXED';radius(track,999);const bar=figma.createRectangle();created.push(bar.id);track.appendChild(bar);bar.resize(1084*n/100,12);fill(bar,'primary');radius(bar,999);}button(m,'Lanjutkan belajar','Belajar');

m=shell(await figma.getNodeByIdAsync(screenIds['Profil saya']),'Profil saya');heading(m,'Profil saya','Kenali dirimu dan perjalanan belajarmu.');
c=card(m,'Profil belajarmu',1132);icon(c,'profile',56);txt(c,'Dina','Heading');tag(c,'SD');txt(c,'Belajar dengan caramu, bertumbuh dengan ritmemu.','Body','muted',1084);for(const t of ['Nama panggilan: Dina','Jenjang belajar: SD','Tujuan belajar: Mengenal kata'])txt(c,t,'Body','text',1084);button(c,'Edit profil','Pengaturan',true);button(m,'Lihat kemajuan','Kemajuan saya');

m=shell(await figma.getNodeByIdAsync(screenIds.Pengaturan),'Pengaturan');heading(m,'Pengaturan','Atur ruang belajar sesuai kebutuhanmu.');
row=frame(m,'Aksesibilitas & profil',1132,'HORIZONTAL',null,0,24);
c=card(row,'Aksesibilitas',554);txt(c,'Aksesibilitas','Section');for(const t of ['Ukuran teks: Normal','Tema: Terang / Gelap','Kecepatan video: 1×','Tampilan nyaman: Nonaktif','Kontras tinggi: Nonaktif','Bahasa isyarat: Default','Hemat data video: Nonaktif'])txt(c,t,'Body','muted',506);button(c,'Simpan pengaturan akun');button(c,'Lihat tema gelap','Beranda · Gelap',true);
c=card(row,'Profil belajarmu',554);txt(c,'Profil belajarmu','Section');field(c,'Nama panggilan','Dina',false,false,506);field(c,'Jenjang','SD · SMP · SMA',false,true,506);field(c,'Tujuan belajar','Mengenal kata',false,true,506);button(c,'Simpan profil');button(m,'Keluar akun','Login',true);

const dark=await figma.getNodeByIdAsync(screenIds['Beranda · Gelap']);const home=await figma.getNodeByIdAsync(screenIds.Beranda);dark.resize(1440,home.height);dark.layoutMode='HORIZONTAL';dark.primaryAxisSizingMode='FIXED';dark.counterAxisSizingMode='AUTO';fill(dark,'bg','Dark');
for(const child of home.children){const n=child.clone();dark.appendChild(n);created.push(n.id,...n.findAll(()=>true).map(x=>x.id));}
for(const n of [dark,...dark.findAll(()=>true)]){if(Array.isArray(n.fills)){n.fills=n.fills.map(f=>{if(f.type!=='SOLID')return f;const id=f.boundVariables?.color?.id;const entry=Object.entries(state.semantic.Light).find(([k,v])=>v===id);return entry?paint(entry[0],'Dark'):f;});}if(Array.isArray(n.strokes)){n.strokes=n.strokes.map(f=>f.type==='SOLID'?paint('border','Dark'):f);}}

const validLinks=links.filter(({n,target})=>{let a=n;while(a.parent?.type!=='PAGE'&&a.parent)a=a.parent;return a.id!==screenIds[target];});
await Promise.all(validLinks.map(({n,target})=>n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:screenIds[target],navigation:'NAVIGATE',transition:null,preserveScrollPosition:false}]}])));


figma.currentPage.flowStartingPoints=[{nodeId:screenIds.Login,name:'Mulai / Login & register'},{nodeId:screenIds.Beranda,name:'Jelajahi BahasaKita'}];

}
if(existingMobile.length===0){
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

}

await Promise.all(styleJobs);
await figma.setCurrentPageAsync(desktopPage);
const capture=await figma.getNodeByIdAsync('3:2');
if(capture && capture.name==='BahasaKita') capture.remove();
// Preserve the reference capture unless its identity is certain.
const frames=(await Promise.all(Object.values(screenIds).map(id=>figma.getNodeByIdAsync(id)))).filter(Boolean);
let nextY=200;
for(let row=0;row<5;row++){
 const group=frames.slice(row*3,row*3+3);
 for(let col=0;col<group.length;col++){group[col].x=1600+col*1640;group[col].y=nextY;}
 nextY+=Math.max(0,...group.map(n=>n.height))+180;
}
figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync(screenIds['Kamus visual'])]);
// BEGIN EXPANDED STATES
const projectContent={
  "SD": {
    "words": [
      {
        "word": "Mangga",
        "meaning": "Buah yang tumbuh pada pohon mangga.",
        "category": "Tumbuhan",
        "example": "Pohon mangga menghasilkan buah mangga.",
        "start": 80,
        "videoTitle": "Tumbuhan di sekitar kita"
      },
      {
        "word": "Pepaya",
        "meaning": "Buah yang tumbuh pada tanaman pepaya.",
        "category": "Tumbuhan",
        "example": "Kita menghitung buah pepaya pada gambar.",
        "start": 165,
        "videoTitle": "Tumbuhan di sekitar kita"
      },
      {
        "word": "Jeruk",
        "meaning": "Buah berkulit tebal dengan bagian dalam berupa beberapa ulas.",
        "category": "Tumbuhan",
        "example": "Ada dua buah jeruk pada gambar.",
        "start": 225,
        "videoTitle": "Tumbuhan di sekitar kita"
      },
      {
        "word": "Ayam",
        "meaning": "Hewan unggas yang memiliki paruh, sayap, dan dua kaki.",
        "category": "Hewan",
        "example": "Ayam dapat dipelihara di rumah.",
        "start": 75,
        "videoTitle": "Mengenal hewan peliharaan"
      },
      {
        "word": "Kambing",
        "meaning": "Hewan berkaki empat yang biasa dipelihara sebagai ternak.",
        "category": "Hewan",
        "example": "Kambing berada di dalam kandang.",
        "start": 110,
        "videoTitle": "Mengenal hewan peliharaan"
      },
      {
        "word": "Ikan",
        "meaning": "Hewan yang hidup di air dan bernapas dengan insang.",
        "category": "Hewan",
        "example": "Ikan berenang di kolam.",
        "start": 165,
        "videoTitle": "Mengenal hewan peliharaan"
      },
      {
        "word": "Keluarga",
        "meaning": "Unit terkecil dalam masyarakat yang terdiri atas ayah, ibu, dan anak.",
        "category": "Keluarga",
        "example": "Keluarga berkumpul bersama di rumah.",
        "start": 60,
        "videoTitle": "Mengenal anggota keluarga"
      },
      {
        "word": "Ibu",
        "meaning": "Wanita yang melahirkan atau merawat kita dengan penuh kasih.",
        "category": "Keluarga",
        "example": "Ibu membimbing belajar di rumah.",
        "start": 120,
        "videoTitle": "Mengenal anggota keluarga"
      }
    ],
    "videos": [
      {
        "title": "Tumbuhan di sekitar kita",
        "sourceLevel": "SDLB · Kelas 4"
      },
      {
        "title": "Mengenal hewan peliharaan",
        "sourceLevel": "SDLB · Kelas 4"
      },
      {
        "title": "Mengenal anggota keluarga",
        "sourceLevel": "SDLB · Kelas 2"
      },
      {
        "title": "Simbol perubahan cuaca",
        "sourceLevel": "SDLB · Kelas 6"
      }
    ]
  },
  "SMP": {
    "words": [
      {
        "word": "Sekolah",
        "meaning": "Tempat peserta didik belajar bersama guru.",
        "category": "Tempat",
        "example": "Kita bersikap sopan di lingkungan sekolah.",
        "start": 285,
        "videoTitle": "Bahasa Indonesia melalui percakapan"
      },
      {
        "word": "Sopan",
        "meaning": "Berperilaku baik dan menghargai orang lain.",
        "category": "Sikap",
        "example": "Kita berbicara dengan sopan kepada guru.",
        "start": 405,
        "videoTitle": "Bahasa Indonesia melalui percakapan"
      },
      {
        "word": "Permisi",
        "meaning": "Ungkapan untuk meminta izin atau perhatian dengan sopan.",
        "category": "Ungkapan",
        "example": "Permisi, saya ingin lewat.",
        "start": 410,
        "videoTitle": "Bahasa Indonesia melalui percakapan"
      },
      {
        "word": "Rekreasi",
        "meaning": "Kegiatan untuk menyegarkan pikiran atau bersenang-senang.",
        "category": "Kegiatan",
        "example": "Kita berekreasi bersama keluarga.",
        "start": 285,
        "videoTitle": "Memahami isi paragraf sederhana"
      },
      {
        "word": "Pelabuhan",
        "meaning": "Tempat kapal berlabuh untuk menaikkan atau menurunkan penumpang dan barang.",
        "category": "Tempat",
        "example": "Kapal berhenti di pelabuhan.",
        "start": 585,
        "videoTitle": "Memahami isi paragraf sederhana"
      },
      {
        "word": "Kalimat",
        "meaning": "Kesatuan ujar yang mengungkapkan suatu konsep pikiran dan perasaan.",
        "category": "Bahasa",
        "example": "Kita menyusun kalimat berpola subjek dan predikat.",
        "start": 85,
        "videoTitle": "Mengenal struktur kalimat"
      },
      {
        "word": "Membaca",
        "meaning": "Melihat serta memahami isi dari apa yang tertulis.",
        "category": "Kegiatan",
        "example": "Peserta didik membaca teks dengan cermat.",
        "start": 150,
        "videoTitle": "Mengenal struktur kalimat"
      },
      {
        "word": "Gunung",
        "meaning": "Bukit yang sangat besar dan tinggi.",
        "category": "Geografi",
        "example": "Masyarakat beraktivitas di daerah lereng gunung.",
        "start": 70,
        "videoTitle": "Aktivitas manusia dan kondisi geografis"
      }
    ],
    "videos": [
      {
        "title": "Bahasa Indonesia melalui percakapan",
        "sourceLevel": "SMPLB · Kelas 7"
      },
      {
        "title": "Memahami isi paragraf sederhana",
        "sourceLevel": "SMPLB · Kelas 9"
      },
      {
        "title": "Mengenal struktur kalimat",
        "sourceLevel": "SMPLB · Kelas 9"
      },
      {
        "title": "Aktivitas manusia dan kondisi geografis",
        "sourceLevel": "SMPLB · Kelas 8"
      }
    ]
  },
  "SMA": {
    "words": [
      {
        "word": "Eksplanasi",
        "meaning": "Penjelasan tentang bagaimana atau mengapa suatu peristiwa terjadi.",
        "category": "Teks",
        "example": "Teks eksplanasi menjelaskan proses terjadinya hujan.",
        "start": 75,
        "videoTitle": "Memahami teks eksplanasi"
      },
      {
        "word": "Hujan",
        "meaning": "Air yang jatuh dari awan ke permukaan bumi dalam bentuk titik-titik air.",
        "category": "Peristiwa",
        "example": "Hujan merupakan salah satu peristiwa alam.",
        "start": 165,
        "videoTitle": "Memahami teks eksplanasi"
      },
      {
        "word": "Banjir",
        "meaning": "Peristiwa meluapnya air sehingga menggenangi wilayah yang biasanya kering.",
        "category": "Peristiwa",
        "example": "Air yang meluap dapat menyebabkan banjir.",
        "start": 165,
        "videoTitle": "Memahami teks eksplanasi"
      },
      {
        "word": "Purwakarta",
        "meaning": "Nama kabupaten di Provinsi Jawa Barat.",
        "category": "Tempat",
        "example": "Purwakarta diperagakan dalam video kosakata isyarat.",
        "start": 80,
        "videoTitle": "Kosakata sehari-hari dalam bahasa isyarat"
      },
      {
        "word": "Jambu",
        "meaning": "Nama kelompok buah; pada video ditunjukkan gambar jambu air.",
        "category": "Buah",
        "example": "Gambar jambu membantu mengenali kata yang diperagakan.",
        "start": 110,
        "videoTitle": "Kosakata sehari-hari dalam bahasa isyarat"
      },
      {
        "word": "Inggris",
        "meaning": "Nama negara yang merupakan bagian dari Britania Raya.",
        "category": "Tempat",
        "example": "Kata Inggris diperagakan bersama gambar bendera dalam video.",
        "start": 170,
        "videoTitle": "Kosakata sehari-hari dalam bahasa isyarat"
      },
      {
        "word": "Iklan",
        "meaning": "Pemberitahuan kepada khalayak mengenai barang atau jasa yang ditawarkan.",
        "category": "Media",
        "example": "Iklan komersial mempromosikan produk kepada masyarakat.",
        "start": 80,
        "videoTitle": "Mengenal jenis-jenis iklan"
      },
      {
        "word": "Informasi",
        "meaning": "Pemberitahuan, kabar, atau berita tentang sesuatu hal.",
        "category": "Media",
        "example": "Iklan layanan masyarakat menyajikan informasi edukatif.",
        "start": 160,
        "videoTitle": "Mengenal jenis-jenis iklan"
      }
    ],
    "videos": [
      {
        "title": "Memahami teks eksplanasi",
        "sourceLevel": "SMALB-B"
      },
      {
        "title": "Kosakata sehari-hari dalam bahasa isyarat",
        "sourceLevel": "SMALB-B"
      },
      {
        "title": "Mengenal jenis-jenis iklan",
        "sourceLevel": "SMALB Tunarungu"
      },
      {
        "title": "Keterampilan desain menu makanan",
        "sourceLevel": "SMALB · Kelas 11"
      }
    ]
  }
};
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
 const darkTheme = /gelap/i.test(root.name);
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


// Keep the eye controls within the input width on every device.
for(const targetPage of [desktopPage,mobilePage]){
 await figma.setCurrentPageAsync(targetPage);
 for(const input of targetPage.findAllWithCriteria({types:['INSTANCE']}).filter(n=>n.name==='Input')){
  const value=input.children.find(n=>n.type==='TEXT');
  if(!value)continue;
  const visibleIcons=input.children.filter(n=>n.name.startsWith('Icon/') && n.visible).length;
  value.textAutoResize='HEIGHT';value.resize(Math.max(100,input.width-32-visibleIcons*32),value.height);
 }
}
await figma.setCurrentPageAsync(desktopPage);
figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync(additions.dictSMP || screenIds['Kamus visual'])]);

// BEGIN FIDELITY
const detailContent={
  "grades": {
    "SD": {
      "words": [
        {
          "word": "Mangga",
          "emoji": "🥭",
          "meaning": "Buah yang tumbuh pada pohon mangga.",
          "category": "Tumbuhan",
          "example": "Pohon mangga menghasilkan buah mangga.",
          "start": 80,
          "videoId": "iDDkYTki6pU",
          "videoTitle": "Tumbuhan di sekitar kita"
        },
        {
          "word": "Pepaya",
          "emoji": "🌱",
          "meaning": "Buah yang tumbuh pada tanaman pepaya.",
          "category": "Tumbuhan",
          "example": "Kita menghitung buah pepaya pada gambar.",
          "start": 165,
          "videoId": "iDDkYTki6pU",
          "videoTitle": "Tumbuhan di sekitar kita"
        },
        {
          "word": "Jeruk",
          "emoji": "🍊",
          "meaning": "Buah berkulit tebal dengan bagian dalam berupa beberapa ulas.",
          "category": "Tumbuhan",
          "example": "Ada dua buah jeruk pada gambar.",
          "start": 225,
          "videoId": "iDDkYTki6pU",
          "videoTitle": "Tumbuhan di sekitar kita"
        },
        {
          "word": "Ayam",
          "emoji": "🐔",
          "meaning": "Hewan unggas yang memiliki paruh, sayap, dan dua kaki.",
          "category": "Hewan",
          "example": "Ayam dapat dipelihara di rumah.",
          "start": 75,
          "videoId": "3KepM1ycETA",
          "videoTitle": "Mengenal hewan peliharaan"
        },
        {
          "word": "Kambing",
          "emoji": "🐐",
          "meaning": "Hewan berkaki empat yang biasa dipelihara sebagai ternak.",
          "category": "Hewan",
          "example": "Kambing berada di dalam kandang.",
          "start": 110,
          "videoId": "3KepM1ycETA",
          "videoTitle": "Mengenal hewan peliharaan"
        },
        {
          "word": "Ikan",
          "emoji": "🐟",
          "meaning": "Hewan yang hidup di air dan bernapas dengan insang.",
          "category": "Hewan",
          "example": "Ikan berenang di kolam.",
          "start": 165,
          "videoId": "3KepM1ycETA",
          "videoTitle": "Mengenal hewan peliharaan"
        },
        {
          "word": "Keluarga",
          "emoji": "👨‍👩‍👧‍👦",
          "meaning": "Unit terkecil dalam masyarakat yang terdiri atas ayah, ibu, dan anak.",
          "category": "Keluarga",
          "example": "Keluarga berkumpul bersama di rumah.",
          "start": 60,
          "videoId": "yiNe4PgcNow",
          "videoTitle": "Mengenal anggota keluarga"
        },
        {
          "word": "Ibu",
          "emoji": "👩",
          "meaning": "Wanita yang melahirkan atau merawat kita dengan penuh kasih.",
          "category": "Keluarga",
          "example": "Ibu membimbing belajar di rumah.",
          "start": 120,
          "videoId": "yiNe4PgcNow",
          "videoTitle": "Mengenal anggota keluarga"
        },
        {
          "word": "Cuaca",
          "emoji": "⛅",
          "meaning": "Keadaan udara pada suatu tempat dalam waktu tertentu.",
          "category": "Alam",
          "example": "Simbol cuaca membantu kita mengenali keadaan alam.",
          "start": 50,
          "videoId": "NGCqFchaj4g",
          "videoTitle": "Simbol perubahan cuaca"
        },
        {
          "word": "Hujan",
          "emoji": "🌧️",
          "meaning": "Titik-titik air yang jatuh dari udara karena proses pendinginan.",
          "category": "Alam",
          "example": "Simbol hujan ditandai awan mendung dan tetesan air.",
          "start": 140,
          "videoId": "NGCqFchaj4g",
          "videoTitle": "Simbol perubahan cuaca"
        },
        {
          "word": "Tangan",
          "emoji": "✋",
          "meaning": "Anggota badan dari pergelangan sampai ke ujung jari untuk memegang.",
          "category": "Tubuh",
          "example": "Kita menggunakan tangan untuk berisyarat.",
          "start": 70,
          "videoId": "KhsHyjBmGbE",
          "videoTitle": "Mengenal anggota tubuh"
        },
        {
          "word": "Mata",
          "emoji": "👁️",
          "meaning": "Indra untuk melihat rupa, warna, dan gerakan di sekitar kita.",
          "category": "Tubuh",
          "example": "Mata mengamati visual dan gerak isyarat.",
          "start": 110,
          "videoId": "KhsHyjBmGbE",
          "videoTitle": "Mengenal anggota tubuh"
        }
      ],
      "videos": [
        {
          "id": "iDDkYTki6pU",
          "title": "Tumbuhan di sekitar kita",
          "creator": "Direktorat PKPLK",
          "topic": "Kosakata tumbuhan",
          "sourceLevel": "SDLB · Kelas 4",
          "audience": "tunarungu",
          "accessibility": "Isyarat, gambar & teks",
          "description": "Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.",
          "sourceTitle": "Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""
        },
        {
          "id": "3KepM1ycETA",
          "title": "Mengenal hewan peliharaan",
          "creator": "Direktorat PKPLK",
          "topic": "Kosakata hewan",
          "sourceLevel": "SDLB · Kelas 4",
          "audience": "tunarungu",
          "accessibility": "Isyarat, gambar & teks",
          "description": "Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.",
          "sourceTitle": "Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""
        },
        {
          "id": "yiNe4PgcNow",
          "title": "Mengenal anggota keluarga",
          "creator": "Direktorat PKPLK",
          "topic": "Kosakata keluarga",
          "sourceLevel": "SDLB · Kelas 2",
          "audience": "tunarungu",
          "accessibility": "Isyarat & visual interaktif",
          "description": "Pembelajaran Bahasa Indonesia kelas 2 SDLB tunarungu mengenai sebutan anggota keluarga dengan visual dan bahasa isyarat.",
          "sourceTitle": "Pembelajaran Bahasa Indonesia Kelas II SDLB Tunarungu \" Anggota keluarga \""
        },
        {
          "id": "NGCqFchaj4g",
          "title": "Simbol perubahan cuaca",
          "creator": "Direktorat PKPLK",
          "topic": "IPA & lingkungan",
          "sourceLevel": "SDLB · Kelas 6",
          "audience": "tunarungu",
          "accessibility": "Isyarat & simbol visual",
          "description": "Pembelajaran IPA kelas 6 SDLB tunarungu mengenal simbol perubahan cuaca cerah, berawan, dan hujan dengan penjelasan visual.",
          "sourceTitle": "Pembelajaran IPA Kelas VI SDLB Tunarungu \" Mengenal Simbol Perubahan cuaca \""
        },
        {
          "id": "KhsHyjBmGbE",
          "title": "Mengenal anggota tubuh",
          "creator": "SLB Negeri 1 Pemalang",
          "topic": "Anggota tubuh & fungsi",
          "sourceLevel": "SDLB Tunarungu",
          "audience": "tunarungu",
          "accessibility": "Peragaan isyarat & visual",
          "description": "Pembelajaran interaktif mengenal nama anggota tubuh dan fungsinya untuk anak tunarungu dengan peragaan bahasa isyarat yang jelas.",
          "sourceTitle": "Pembelajaran Interaktif dengan Materi \" Anggota Tubuh\" Kelas Tunarungu di SLB N 1 Pemalang"
        }
      ],
      "lesson": {
        "id": "sd-tumbuhan",
        "aspect": "kosakata",
        "title": "Kenali tumbuhan dan buah",
        "description": "Kenali mangga, pepaya, dan jeruk lewat gambar dan isyarat.",
        "emoji": "🥭",
        "word": "Mangga",
        "words": [
          "Mangga",
          "Pepaya",
          "Jeruk"
        ],
        "time": 8,
        "intro": "Kamu akan mengenali tiga buah yang muncul pada video dan Kamus Visual SD.",
        "explanation": "Mangga tumbuh pada pohon mangga. Pepaya tumbuh pada tanaman pepaya. Jeruk memiliki kulit tebal dan bagian dalam berupa ulas.",
        "tip": "Perhatikan gambar buah, baca namanya, lalu amati bagian video yang sesuai.",
        "visual": "🥭 🌱 🍊",
        "practice": {
          "prompt": "Buah apa yang ditunjukkan gambar ini?",
          "visual": "🥭",
          "options": [
            "Mangga",
            "Ayam",
            "Ikan"
          ],
          "correct": 0
        },
        "quiz": [
          {
            "prompt": "Buah yang tumbuh pada pohon mangga adalah …",
            "options": [
              "Jeruk",
              "Mangga",
              "Pepaya"
            ],
            "correct": 1
          },
          {
            "prompt": "Kata yang sesuai gambar 🍊 adalah …",
            "options": [
              "Jeruk",
              "Kambing",
              "Ikan"
            ],
            "correct": 0
          },
          {
            "prompt": "Manakah yang merupakan nama buah?",
            "options": [
              "Ayam",
              "Kambing",
              "Pepaya"
            ],
            "correct": 2
          },
          {
            "prompt": "Mangga, pepaya, dan jeruk termasuk …",
            "options": [
              "Hewan",
              "Buah",
              "Tempat"
            ],
            "correct": 1
          },
          {
            "prompt": "Buah dengan bagian dalam berupa beberapa ulas adalah …",
            "options": [
              "Jeruk",
              "Ayam",
              "Ikan"
            ],
            "correct": 0
          }
        ],
        "grade": "SD",
        "level": "Dasar",
        "wordEntry": {
          "word": "Mangga",
          "emoji": "🥭",
          "category": "Tumbuhan",
          "meaning": "Buah yang tumbuh pada pohon mangga.",
          "example": "Pohon mangga menghasilkan buah mangga.",
          "videoId": "iDDkYTki6pU",
          "start": 80,
          "video": {
            "id": "iDDkYTki6pU",
            "title": "Tumbuhan di sekitar kita",
            "creator": "Direktorat PKPLK",
            "topic": "Kosakata tumbuhan",
            "sourceLevel": "SDLB · Kelas 4",
            "audience": "tunarungu",
            "accessibility": "Isyarat, gambar & teks",
            "description": "Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.",
            "sourceTitle": "Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""
          }
        },
        "relatedWords": [
          {
            "word": "Mangga",
            "emoji": "🥭",
            "category": "Tumbuhan",
            "meaning": "Buah yang tumbuh pada pohon mangga.",
            "example": "Pohon mangga menghasilkan buah mangga.",
            "videoId": "iDDkYTki6pU",
            "start": 80,
            "video": {
              "id": "iDDkYTki6pU",
              "title": "Tumbuhan di sekitar kita",
              "creator": "Direktorat PKPLK",
              "topic": "Kosakata tumbuhan",
              "sourceLevel": "SDLB · Kelas 4",
              "audience": "tunarungu",
              "accessibility": "Isyarat, gambar & teks",
              "description": "Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.",
              "sourceTitle": "Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""
            }
          },
          {
            "word": "Pepaya",
            "emoji": "🌱",
            "category": "Tumbuhan",
            "meaning": "Buah yang tumbuh pada tanaman pepaya.",
            "example": "Kita menghitung buah pepaya pada gambar.",
            "videoId": "iDDkYTki6pU",
            "start": 165,
            "video": {
              "id": "iDDkYTki6pU",
              "title": "Tumbuhan di sekitar kita",
              "creator": "Direktorat PKPLK",
              "topic": "Kosakata tumbuhan",
              "sourceLevel": "SDLB · Kelas 4",
              "audience": "tunarungu",
              "accessibility": "Isyarat, gambar & teks",
              "description": "Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.",
              "sourceTitle": "Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""
            }
          },
          {
            "word": "Jeruk",
            "emoji": "🍊",
            "category": "Tumbuhan",
            "meaning": "Buah berkulit tebal dengan bagian dalam berupa beberapa ulas.",
            "example": "Ada dua buah jeruk pada gambar.",
            "videoId": "iDDkYTki6pU",
            "start": 225,
            "video": {
              "id": "iDDkYTki6pU",
              "title": "Tumbuhan di sekitar kita",
              "creator": "Direktorat PKPLK",
              "topic": "Kosakata tumbuhan",
              "sourceLevel": "SDLB · Kelas 4",
              "audience": "tunarungu",
              "accessibility": "Isyarat, gambar & teks",
              "description": "Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.",
              "sourceTitle": "Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""
            }
          }
        ],
        "example": "Pohon mangga menghasilkan buah mangga.",
        "video": {
          "id": "iDDkYTki6pU",
          "title": "Tumbuhan di sekitar kita",
          "creator": "Direktorat PKPLK",
          "topic": "Kosakata tumbuhan",
          "sourceLevel": "SDLB · Kelas 4",
          "audience": "tunarungu",
          "accessibility": "Isyarat, gambar & teks",
          "description": "Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.",
          "sourceTitle": "Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""
        }
      }
    },
    "SMP": {
      "words": [
        {
          "word": "Sekolah",
          "emoji": "🏫",
          "meaning": "Tempat peserta didik belajar bersama guru.",
          "category": "Tempat",
          "example": "Kita bersikap sopan di lingkungan sekolah.",
          "start": 285,
          "videoId": "5TJG1D3OG1Y",
          "videoTitle": "Bahasa Indonesia melalui percakapan"
        },
        {
          "word": "Sopan",
          "emoji": "🤝",
          "meaning": "Berperilaku baik dan menghargai orang lain.",
          "category": "Sikap",
          "example": "Kita berbicara dengan sopan kepada guru.",
          "start": 405,
          "videoId": "5TJG1D3OG1Y",
          "videoTitle": "Bahasa Indonesia melalui percakapan"
        },
        {
          "word": "Permisi",
          "emoji": "🙋",
          "meaning": "Ungkapan untuk meminta izin atau perhatian dengan sopan.",
          "category": "Ungkapan",
          "example": "Permisi, saya ingin lewat.",
          "start": 410,
          "videoId": "5TJG1D3OG1Y",
          "videoTitle": "Bahasa Indonesia melalui percakapan"
        },
        {
          "word": "Rekreasi",
          "emoji": "🏖️",
          "meaning": "Kegiatan untuk menyegarkan pikiran atau bersenang-senang.",
          "category": "Kegiatan",
          "example": "Kita berekreasi bersama keluarga.",
          "start": 285,
          "videoId": "XmiXc0YUrXY",
          "videoTitle": "Memahami isi paragraf sederhana"
        },
        {
          "word": "Pelabuhan",
          "emoji": "🚢",
          "meaning": "Tempat kapal berlabuh untuk menaikkan atau menurunkan penumpang dan barang.",
          "category": "Tempat",
          "example": "Kapal berhenti di pelabuhan.",
          "start": 585,
          "videoId": "XmiXc0YUrXY",
          "videoTitle": "Memahami isi paragraf sederhana"
        },
        {
          "word": "Kalimat",
          "emoji": "💬",
          "meaning": "Kesatuan ujar yang mengungkapkan suatu konsep pikiran dan perasaan.",
          "category": "Bahasa",
          "example": "Kita menyusun kalimat berpola subjek dan predikat.",
          "start": 85,
          "videoId": "hGVrqkHtmzU",
          "videoTitle": "Mengenal struktur kalimat"
        },
        {
          "word": "Membaca",
          "emoji": "📖",
          "meaning": "Melihat serta memahami isi dari apa yang tertulis.",
          "category": "Kegiatan",
          "example": "Peserta didik membaca teks dengan cermat.",
          "start": 150,
          "videoId": "hGVrqkHtmzU",
          "videoTitle": "Mengenal struktur kalimat"
        },
        {
          "word": "Gunung",
          "emoji": "⛰️",
          "meaning": "Bukit yang sangat besar dan tinggi.",
          "category": "Geografi",
          "example": "Masyarakat beraktivitas di daerah lereng gunung.",
          "start": 70,
          "videoId": "aMYYehsQij0",
          "videoTitle": "Aktivitas manusia dan kondisi geografis"
        },
        {
          "word": "Pantai",
          "emoji": "🏖️",
          "meaning": "Wilayah daratan yang berbatasan langsung dengan laut.",
          "category": "Geografi",
          "example": "Nelayan mencari ikan di sekitar pantai.",
          "start": 130,
          "videoId": "aMYYehsQij0",
          "videoTitle": "Aktivitas manusia dan kondisi geografis"
        },
        {
          "word": "Tanya",
          "emoji": "❓",
          "meaning": "Permintaan penjelasan atau keterangan tentang sesuatu.",
          "category": "Bahasa",
          "example": "Gunakan kata tanya untuk menggali informasi.",
          "start": 75,
          "videoId": "RO9UZpkF-YI",
          "videoTitle": "Latihan memahami kalimat tanya"
        }
      ],
      "videos": [
        {
          "id": "5TJG1D3OG1Y",
          "title": "Bahasa Indonesia melalui percakapan",
          "creator": "Rapusa",
          "topic": "Percakapan dan bacaan",
          "sourceLevel": "SMPLB · Kelas 7",
          "audience": "tunarungu",
          "accessibility": "Komunikasi visual & teks",
          "description": "Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.",
          "sourceTitle": "Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"
        },
        {
          "id": "XmiXc0YUrXY",
          "title": "Memahami isi paragraf sederhana",
          "creator": "Melalita Anggraeni",
          "topic": "Pemahaman bacaan",
          "sourceLevel": "SMPLB · Kelas 9",
          "audience": "tunarungu",
          "accessibility": "Isyarat & media visual",
          "description": "Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.",
          "sourceTitle": "VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"
        },
        {
          "id": "hGVrqkHtmzU",
          "title": "Mengenal struktur kalimat",
          "creator": "dhiah mulya",
          "topic": "Struktur kalimat (S-P-O-K)",
          "sourceLevel": "SMPLB · Kelas 9",
          "audience": "tunarungu",
          "accessibility": "Isyarat & peragaan visual",
          "description": "Materi Bahasa Indonesia kelas 9 tunarungu mengenai penyusunan struktur kalimat berpola Subjek-Predikat-Objek menggunakan visual dan isyarat.",
          "sourceTitle": "BAHASA INDONESIA:STRUKTUR KALIMAT | KELAS IX TUNARUNGU | DHIAH MULYANI | SLB N TAMANWINANGUN KEBUMEN"
        },
        {
          "id": "aMYYehsQij0",
          "title": "Aktivitas manusia dan kondisi geografis",
          "creator": "Direktorat PKPLK",
          "topic": "IPS lingkungan hidup",
          "sourceLevel": "SMPLB · Kelas 8",
          "audience": "tunarungu",
          "accessibility": "Isyarat & materi grafis",
          "description": "Pembelajaran IPS kelas 8 SMPLB tunarungu tentang hubungan aktivitas manusia dengan kondisi geografis lingkungan sekitar.",
          "sourceTitle": "Pembelajaran IPS Kelas VIII SMPLB Tunarungu \"Hubungan AktivitasManusia denganKondisi Geografis\""
        },
        {
          "id": "RO9UZpkF-YI",
          "title": "Latihan memahami kalimat tanya",
          "creator": "dwi ernawati",
          "topic": "Kalimat tanya & dialog",
          "sourceLevel": "SMPLB · Kelas 9",
          "audience": "tunarungu",
          "accessibility": "Isyarat & teks tanya jawab",
          "description": "Praktik pembelajaran Bahasa Indonesia kelas 9 SMPLB tunarungu untuk mengidentifikasi kata tanya dan merespons pertanyaan secara komunikatif.",
          "sourceTitle": "Praktik Pembelajaran bahasa Indonesia kelas IX SMPLB Tunarungu"
        }
      ],
      "lesson": {
        "id": "smp-percakapan",
        "aspect": "kosakata",
        "title": "Kosakata percakapan sopan",
        "description": "Pahami sekolah, sopan, dan permisi dari video SMPLB.",
        "emoji": "🏫",
        "word": "Sekolah",
        "words": [
          "Sekolah",
          "Sopan",
          "Permisi"
        ],
        "time": 8,
        "intro": "Kamu akan memahami kosakata percakapan yang muncul pada video dan Kamus Visual SMP.",
        "explanation": "Sekolah adalah tempat belajar. Sopan berarti menghargai orang lain dalam perilaku dan ucapan. Permisi digunakan saat meminta izin atau perhatian dengan sopan.",
        "tip": "Perhatikan situasinya: di mana kamu berada, kepada siapa kamu berbicara, dan apa yang ingin kamu sampaikan.",
        "visual": "🏫 🤝 🙋",
        "practice": {
          "prompt": "Saat ingin melewati seseorang, ungkapan yang sesuai adalah …",
          "options": [
            "Permisi.",
            "Cepat pergi!",
            "Diam!"
          ],
          "correct": 0
        },
        "quiz": [
          {
            "prompt": "Tempat peserta didik belajar bersama guru disebut …",
            "options": [
              "Pelabuhan",
              "Sekolah",
              "Kolam"
            ],
            "correct": 1
          },
          {
            "prompt": "“Sopan” berarti …",
            "options": [
              "Menghargai orang lain",
              "Memaksa orang lain",
              "Mengabaikan orang lain"
            ],
            "correct": 0
          },
          {
            "prompt": "Ungkapan untuk meminta izin lewat adalah …",
            "options": [
              "Pindah!",
              "Diam!",
              "Permisi."
            ],
            "correct": 2
          },
          {
            "prompt": "Contoh perilaku sopan adalah …",
            "options": [
              "Memotong pembicaraan",
              "Meminta izin sebelum lewat",
              "Mendorong teman"
            ],
            "correct": 1
          },
          {
            "prompt": "Kata “sekolah” termasuk nama …",
            "options": [
              "Tempat",
              "Buah",
              "Hewan"
            ],
            "correct": 0
          }
        ],
        "grade": "SMP",
        "level": "Menengah",
        "wordEntry": {
          "word": "Sekolah",
          "emoji": "🏫",
          "category": "Tempat",
          "meaning": "Tempat peserta didik belajar bersama guru.",
          "example": "Kita bersikap sopan di lingkungan sekolah.",
          "videoId": "5TJG1D3OG1Y",
          "start": 285,
          "video": {
            "id": "5TJG1D3OG1Y",
            "title": "Bahasa Indonesia melalui percakapan",
            "creator": "Rapusa",
            "topic": "Percakapan dan bacaan",
            "sourceLevel": "SMPLB · Kelas 7",
            "audience": "tunarungu",
            "accessibility": "Komunikasi visual & teks",
            "description": "Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.",
            "sourceTitle": "Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"
          }
        },
        "relatedWords": [
          {
            "word": "Sekolah",
            "emoji": "🏫",
            "category": "Tempat",
            "meaning": "Tempat peserta didik belajar bersama guru.",
            "example": "Kita bersikap sopan di lingkungan sekolah.",
            "videoId": "5TJG1D3OG1Y",
            "start": 285,
            "video": {
              "id": "5TJG1D3OG1Y",
              "title": "Bahasa Indonesia melalui percakapan",
              "creator": "Rapusa",
              "topic": "Percakapan dan bacaan",
              "sourceLevel": "SMPLB · Kelas 7",
              "audience": "tunarungu",
              "accessibility": "Komunikasi visual & teks",
              "description": "Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.",
              "sourceTitle": "Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"
            }
          },
          {
            "word": "Sopan",
            "emoji": "🤝",
            "category": "Sikap",
            "meaning": "Berperilaku baik dan menghargai orang lain.",
            "example": "Kita berbicara dengan sopan kepada guru.",
            "videoId": "5TJG1D3OG1Y",
            "start": 405,
            "video": {
              "id": "5TJG1D3OG1Y",
              "title": "Bahasa Indonesia melalui percakapan",
              "creator": "Rapusa",
              "topic": "Percakapan dan bacaan",
              "sourceLevel": "SMPLB · Kelas 7",
              "audience": "tunarungu",
              "accessibility": "Komunikasi visual & teks",
              "description": "Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.",
              "sourceTitle": "Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"
            }
          },
          {
            "word": "Permisi",
            "emoji": "🙋",
            "category": "Ungkapan",
            "meaning": "Ungkapan untuk meminta izin atau perhatian dengan sopan.",
            "example": "Permisi, saya ingin lewat.",
            "videoId": "5TJG1D3OG1Y",
            "start": 410,
            "video": {
              "id": "5TJG1D3OG1Y",
              "title": "Bahasa Indonesia melalui percakapan",
              "creator": "Rapusa",
              "topic": "Percakapan dan bacaan",
              "sourceLevel": "SMPLB · Kelas 7",
              "audience": "tunarungu",
              "accessibility": "Komunikasi visual & teks",
              "description": "Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.",
              "sourceTitle": "Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"
            }
          }
        ],
        "example": "Kita bersikap sopan di lingkungan sekolah.",
        "video": {
          "id": "5TJG1D3OG1Y",
          "title": "Bahasa Indonesia melalui percakapan",
          "creator": "Rapusa",
          "topic": "Percakapan dan bacaan",
          "sourceLevel": "SMPLB · Kelas 7",
          "audience": "tunarungu",
          "accessibility": "Komunikasi visual & teks",
          "description": "Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.",
          "sourceTitle": "Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"
        }
      }
    },
    "SMA": {
      "words": [
        {
          "word": "Eksplanasi",
          "emoji": "📝",
          "meaning": "Penjelasan tentang bagaimana atau mengapa suatu peristiwa terjadi.",
          "category": "Teks",
          "example": "Teks eksplanasi menjelaskan proses terjadinya hujan.",
          "start": 75,
          "videoId": "cvwI6-6lfGY",
          "videoTitle": "Memahami teks eksplanasi"
        },
        {
          "word": "Hujan",
          "emoji": "🌧️",
          "meaning": "Air yang jatuh dari awan ke permukaan bumi dalam bentuk titik-titik air.",
          "category": "Peristiwa",
          "example": "Hujan merupakan salah satu peristiwa alam.",
          "start": 165,
          "videoId": "cvwI6-6lfGY",
          "videoTitle": "Memahami teks eksplanasi"
        },
        {
          "word": "Banjir",
          "emoji": "🌊",
          "meaning": "Peristiwa meluapnya air sehingga menggenangi wilayah yang biasanya kering.",
          "category": "Peristiwa",
          "example": "Air yang meluap dapat menyebabkan banjir.",
          "start": 165,
          "videoId": "cvwI6-6lfGY",
          "videoTitle": "Memahami teks eksplanasi"
        },
        {
          "word": "Purwakarta",
          "emoji": "📍",
          "meaning": "Nama kabupaten di Provinsi Jawa Barat.",
          "category": "Tempat",
          "example": "Purwakarta diperagakan dalam video kosakata isyarat.",
          "start": 80,
          "videoId": "EBTZFitRSEc",
          "videoTitle": "Kosakata sehari-hari dalam bahasa isyarat"
        },
        {
          "word": "Jambu",
          "emoji": "🍎",
          "meaning": "Nama kelompok buah; pada video ditunjukkan gambar jambu air.",
          "category": "Buah",
          "example": "Gambar jambu membantu mengenali kata yang diperagakan.",
          "start": 110,
          "videoId": "EBTZFitRSEc",
          "videoTitle": "Kosakata sehari-hari dalam bahasa isyarat"
        },
        {
          "word": "Inggris",
          "emoji": "🇬🇧",
          "meaning": "Nama negara yang merupakan bagian dari Britania Raya.",
          "category": "Tempat",
          "example": "Kata Inggris diperagakan bersama gambar bendera dalam video.",
          "start": 170,
          "videoId": "EBTZFitRSEc",
          "videoTitle": "Kosakata sehari-hari dalam bahasa isyarat"
        },
        {
          "word": "Iklan",
          "emoji": "📢",
          "meaning": "Pemberitahuan kepada khalayak mengenai barang atau jasa yang ditawarkan.",
          "category": "Media",
          "example": "Iklan komersial mempromosikan produk kepada masyarakat.",
          "start": 80,
          "videoId": "KQD3tbb7_p0",
          "videoTitle": "Mengenal jenis-jenis iklan"
        },
        {
          "word": "Informasi",
          "emoji": "💡",
          "meaning": "Pemberitahuan, kabar, atau berita tentang sesuatu hal.",
          "category": "Media",
          "example": "Iklan layanan masyarakat menyajikan informasi edukatif.",
          "start": 160,
          "videoId": "KQD3tbb7_p0",
          "videoTitle": "Mengenal jenis-jenis iklan"
        },
        {
          "word": "Desain",
          "emoji": "🎨",
          "meaning": "Kerangka bentuk atau rancangan suatu media visual.",
          "category": "Keterampilan",
          "example": "Desain menu makanan dibuat rapi dan menarik.",
          "start": 90,
          "videoId": "Prifrka21FQ",
          "videoTitle": "Keterampilan desain menu makanan"
        },
        {
          "word": "Menu",
          "emoji": "📋",
          "meaning": "Daftar jenis makanan dan minuman yang tersedia.",
          "category": "Keterampilan",
          "example": "Daftar menu memudahkan pelanggan memilih hidangan.",
          "start": 180,
          "videoId": "Prifrka21FQ",
          "videoTitle": "Keterampilan desain menu makanan"
        },
        {
          "word": "Komunikasi",
          "emoji": "🗣️",
          "meaning": "Pengiriman dan penerimaan pesan antara dua orang atau lebih.",
          "category": "Sosial",
          "example": "Bahasa isyarat menjembatani komunikasi yang inklusif.",
          "start": 60,
          "videoId": "4W_Ctu2Q0KA",
          "videoTitle": "Komunikasi bahasa isyarat kontekstual"
        }
      ],
      "videos": [
        {
          "id": "cvwI6-6lfGY",
          "title": "Memahami teks eksplanasi",
          "creator": "SMALB KM",
          "topic": "Teks eksplanasi",
          "sourceLevel": "SMALB-B",
          "audience": "tunarungu",
          "accessibility": "Isyarat & teks pada layar",
          "description": "Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.",
          "sourceTitle": "Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"
        },
        {
          "id": "EBTZFitRSEc",
          "title": "Kosakata sehari-hari dalam bahasa isyarat",
          "creator": "SLBN BOGOR",
          "topic": "Kosakata dan komunikasi",
          "sourceLevel": "SMALB-B",
          "audience": "tunarungu",
          "accessibility": "Isyarat, gambar & teks",
          "description": "Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.",
          "sourceTitle": "#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"
        },
        {
          "id": "KQD3tbb7_p0",
          "title": "Mengenal jenis-jenis iklan",
          "creator": "Novaaaaa",
          "topic": "Bahasa Indonesia & iklan",
          "sourceLevel": "SMALB Tunarungu",
          "audience": "tunarungu",
          "accessibility": "Presentasi visual & teks",
          "description": "Praktik pembelajaran daring Bahasa Indonesia jenjang SMALB tunarungu untuk mengenali berbagai jenis iklan dan tujuannya.",
          "sourceTitle": "Praktik pembelajaran di kelas SMALB Tunarungu | BAHASA INDONESIA (MENGENAL JENIS-JENIS IKLAN)"
        },
        {
          "id": "Prifrka21FQ",
          "title": "Keterampilan desain menu makanan",
          "creator": "Direktorat PKPLK",
          "topic": "Keterampilan vokasional",
          "sourceLevel": "SMALB · Kelas 11",
          "audience": "tunarungu",
          "accessibility": "Isyarat & demonstrasi grafis",
          "description": "Pembelajaran keterampilan desain grafis kelas 11 SMALB tunarungu mengenai prinsip tata letak dan pembuatan desain menu makanan promosi.",
          "sourceTitle": "Pembelajaran Keterampilan Desain grafis Kelas XI SMALB Tunarungu\"Membuat Desain Menu Makanan\""
        },
        {
          "id": "4W_Ctu2Q0KA",
          "title": "Komunikasi bahasa isyarat kontekstual",
          "creator": "Ninik Indrawati",
          "topic": "Bahasa isyarat komunikatif",
          "sourceLevel": "SMALB · Kelas 11",
          "audience": "tunarungu",
          "accessibility": "Peragaan isyarat SIBI/BISINDO",
          "description": "Pembelajaran komunikasi bahasa isyarat untuk siswa kelas 11 tunarungu di SLB Negeri Kota Magelang dengan fokus pada pemahaman konsep kontekstual.",
          "sourceTitle": "Pembelajaran SIBI/BISINDO Moda Daring Kelas XI B (Tunarungu) SLB Negeri Kota Magelang"
        }
      ],
      "lesson": {
        "id": "sma-kosakata",
        "aspect": "kosakata",
        "title": "Kosakata isyarat dalam konteks",
        "description": "Bedakan kosakata tempat dan buah pada video SMALB-B.",
        "emoji": "📍",
        "word": "Purwakarta",
        "words": [
          "Purwakarta",
          "Jambu",
          "Inggris"
        ],
        "time": 8,
        "intro": "Kamu akan mengamati kosakata isyarat dan membedakan maknanya berdasarkan konteks serta kategori.",
        "explanation": "Purwakarta adalah nama kabupaten di Jawa Barat. Inggris adalah nama negara yang merupakan bagian dari Britania Raya. Jambu adalah nama buah; gambar pada video menunjukkan jambu air.",
        "tip": "Cocokkan kata, gambar, dan kategori. Nama tempat dan nama buah memiliki konteks yang berbeda.",
        "visual": "📍 🍎 🇬🇧",
        "practice": {
          "prompt": "Kata yang termasuk nama buah adalah …",
          "options": [
            "Purwakarta",
            "Jambu",
            "Inggris"
          ],
          "correct": 1
        },
        "quiz": [
          {
            "prompt": "Purwakarta merupakan nama …",
            "options": [
              "Buah",
              "Kabupaten",
              "Peristiwa alam"
            ],
            "correct": 1
          },
          {
            "prompt": "Kata yang termasuk nama buah adalah …",
            "options": [
              "Jambu",
              "Inggris",
              "Purwakarta"
            ],
            "correct": 0
          },
          {
            "prompt": "Nama negara pada materi kosakata isyarat adalah …",
            "options": [
              "Jambu",
              "Purwakarta",
              "Inggris"
            ],
            "correct": 2
          },
          {
            "prompt": "Pasangan kata yang termasuk kategori tempat adalah …",
            "options": [
              "Jambu dan hujan",
              "Purwakarta dan Inggris",
              "Banjir dan jambu"
            ],
            "correct": 1
          },
          {
            "prompt": "Untuk memahami makna kata dalam video, kita mencocokkan …",
            "options": [
              "Kata, gambar, dan konteks",
              "Suara saja",
              "Urutan warna saja"
            ],
            "correct": 0
          }
        ],
        "grade": "SMA",
        "level": "Lanjutan",
        "wordEntry": {
          "word": "Purwakarta",
          "emoji": "📍",
          "category": "Tempat",
          "meaning": "Nama kabupaten di Provinsi Jawa Barat.",
          "example": "Purwakarta diperagakan dalam video kosakata isyarat.",
          "videoId": "EBTZFitRSEc",
          "start": 80,
          "video": {
            "id": "EBTZFitRSEc",
            "title": "Kosakata sehari-hari dalam bahasa isyarat",
            "creator": "SLBN BOGOR",
            "topic": "Kosakata dan komunikasi",
            "sourceLevel": "SMALB-B",
            "audience": "tunarungu",
            "accessibility": "Isyarat, gambar & teks",
            "description": "Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.",
            "sourceTitle": "#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"
          }
        },
        "relatedWords": [
          {
            "word": "Purwakarta",
            "emoji": "📍",
            "category": "Tempat",
            "meaning": "Nama kabupaten di Provinsi Jawa Barat.",
            "example": "Purwakarta diperagakan dalam video kosakata isyarat.",
            "videoId": "EBTZFitRSEc",
            "start": 80,
            "video": {
              "id": "EBTZFitRSEc",
              "title": "Kosakata sehari-hari dalam bahasa isyarat",
              "creator": "SLBN BOGOR",
              "topic": "Kosakata dan komunikasi",
              "sourceLevel": "SMALB-B",
              "audience": "tunarungu",
              "accessibility": "Isyarat, gambar & teks",
              "description": "Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.",
              "sourceTitle": "#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"
            }
          },
          {
            "word": "Jambu",
            "emoji": "🍎",
            "category": "Buah",
            "meaning": "Nama kelompok buah; pada video ditunjukkan gambar jambu air.",
            "example": "Gambar jambu membantu mengenali kata yang diperagakan.",
            "videoId": "EBTZFitRSEc",
            "start": 110,
            "video": {
              "id": "EBTZFitRSEc",
              "title": "Kosakata sehari-hari dalam bahasa isyarat",
              "creator": "SLBN BOGOR",
              "topic": "Kosakata dan komunikasi",
              "sourceLevel": "SMALB-B",
              "audience": "tunarungu",
              "accessibility": "Isyarat, gambar & teks",
              "description": "Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.",
              "sourceTitle": "#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"
            }
          },
          {
            "word": "Inggris",
            "emoji": "🇬🇧",
            "category": "Tempat",
            "meaning": "Nama negara yang merupakan bagian dari Britania Raya.",
            "example": "Kata Inggris diperagakan bersama gambar bendera dalam video.",
            "videoId": "EBTZFitRSEc",
            "start": 170,
            "video": {
              "id": "EBTZFitRSEc",
              "title": "Kosakata sehari-hari dalam bahasa isyarat",
              "creator": "SLBN BOGOR",
              "topic": "Kosakata dan komunikasi",
              "sourceLevel": "SMALB-B",
              "audience": "tunarungu",
              "accessibility": "Isyarat, gambar & teks",
              "description": "Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.",
              "sourceTitle": "#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"
            }
          }
        ],
        "example": "Purwakarta diperagakan dalam video kosakata isyarat.",
        "video": {
          "id": "EBTZFitRSEc",
          "title": "Kosakata sehari-hari dalam bahasa isyarat",
          "creator": "SLBN BOGOR",
          "topic": "Kosakata dan komunikasi",
          "sourceLevel": "SMALB-B",
          "audience": "tunarungu",
          "accessibility": "Isyarat, gambar & teks",
          "description": "Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.",
          "sourceTitle": "#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"
        }
      }
    }
  },
  "basicMaterials": [
    {
      "id": "kosakata",
      "title": "Mengenal kata dan arti",
      "slides": [
        [
          "Kosakata di sekitar kita",
          "Kata membantu kita mengenali benda dan kegiatan."
        ],
        [
          "Buku dan pensil",
          "Buku berisi halaman untuk dibaca.",
          "Pensil digunakan untuk menulis dan menggambar."
        ],
        [
          "Menyiram tanaman",
          "Menyiram berarti memberi air pada tanaman.",
          "Tanaman membutuhkan air agar tetap segar."
        ],
        [
          "Coba ingat kembali",
          "Kenali benda, lalu cocokkan dengan namanya.",
          "Bedakan nama benda dan kata kegiatan."
        ]
      ]
    },
    {
      "id": "kalimat",
      "title": "Memahami dan menyusun kalimat",
      "slides": [
        [
          "Kalimat sederhana",
          "Kalimat menjelaskan siapa melakukan kegiatan."
        ],
        [
          "Dina membaca buku.",
          "Siapa? Dina.",
          "Kegiatan? Membaca. Benda yang dibaca? Buku."
        ],
        [
          "Urutan kegiatan",
          "Sebelum makan, Budi mencuci tangan.",
          "Mencuci tangan dilakukan lebih dulu, lalu makan."
        ],
        [
          "Coba susun kalimat",
          "Mulai dari siapa, lalu kegiatan, lalu benda.",
          "Contoh: Ibu menyiram tanaman."
        ]
      ]
    },
    {
      "id": "bacaan",
      "title": "Menemukan informasi dalam bacaan",
      "slides": [
        [
          "Membaca cerita pendek",
          "Baca pelan-pelan. Cari siapa, tempat, dan kegiatan."
        ],
        [
          "Dina di taman",
          "Dina pergi ke taman. Ia menyiram bunga.",
          "Siapa? Dina. Di mana? Di taman."
        ],
        [
          "Memahami sebab dan tujuan",
          "Bunga layu karena tanahnya kering.",
          "Dina memberi air agar bunga kembali segar."
        ],
        [
          "Temukan jawabannya",
          "Cari informasi di dalam cerita.",
          "Mengapa memberi air? Agar bunga segar."
        ]
      ]
    },
    {
      "id": "akademik",
      "title": "Penjumlahan dan pengurangan dasar",
      "slides": [
        [
          "Ayo menghitung",
          "Hitung benda satu per satu."
        ],
        [
          "Penjumlahan: 2 + 1 = 3",
          "Ada dua apel. Tambahkan satu apel.",
          "Jumlah seluruhnya menjadi tiga apel."
        ],
        [
          "Pengurangan: 5 - 2 = 3",
          "Ada lima apel. Dua apel diberikan kepada Dina.",
          "Apel yang tersisa adalah tiga."
        ],
        [
          "Coba ingat kembali",
          "Tambah: gabungkan jumlah benda.",
          "Kurang: ambil sebagian, lalu hitung sisanya."
        ]
      ]
    }
  ]
};
const emojiAssets={"Mangga": "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", "Pepaya": "iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAIAAACSfiL2AAAF2klEQVR4nO3ce2xTVRzA8d+5vfe29LUWNsbIBgyqDDcT3i6IikETMpSIxMT4ICQogoaQ+IcEEfUP+YMQEoNiDDEmgsEQQiAibMjcYA6DDthIYHRjGcMO1nUM2vV52/sw8BcBLPTXe9bX+fy1LD333HzXx72n945c8anApI5DjGFYODz2jENi4ZBYOCQWDomFQ2LhkFg4JBYOiYVDYuGQWDgkFg6JhUPiUx2gaXK9fzluMgK8SCwi57AbpjoNVePFWhM3FgokHCF8VPWpEMfPqYA3cfrODyFSIsyZZnqjXHyJEC7PwwGASBwxzafD5EQbks8Ohc5aucqZlo/LxIWQOzB/5yJ+qr47EVKvtgbXnwluTqghyONwTr6awp6AJ36sMbAypPRDvoabICwAOkLq1T8C7waVa5CX4Yr5WSYyHuiIa/5TgbVRRY/30GwLRwiZZnodqIlq3jOhTZqW1d9bIg8CnjC9LYANqLkpn3dHf4T8Cydw1mrzB0BTZ/SHbH7B4g87Xaa3xhlmAzUqSBcj30O2IulcAhFRvI3+dyQYBjo4EF91nhA5e5LHRNUhv9wdVHolbUTWIpomIyYSOPvT5o9GLxwA+GV3U2C1AhGgY5Zlo8v05oO/jyq+3tjB64nmgHIl/Vls3JQlzkMpDUn3DNHBVy2y7xaJA+jwSnfPau8RVXz/hD4/eruuM7Zbl2p3TiKTPqkfSodT67FC9eKivQ6uCigYktvvPS7pju6r9y+7Jh3RiKLjLFauItUh+qxJWA3lix17ZpjeJxpm1SAJGcIR1QsACTXcGlh/IbJdAUnfKe6eRM5IdYhuizkcEWosH9Y5j1QaVxAQ9NrsnY8gdSCm3joZeG9AbgU6ioU5qQ5J98PhoRJqqD/RdEM6eVvujGqDkJ7Zls29sQN+pRvosHAVdc5fsyLcvSR1JK4OxyGoqI/1EuuIbL/vLV8AWwKCQE31mHVPmdekOkrnt6QHGTm7MZXPLD5y/5kc1Wo8WB96uPNIObZgrbsq8yrEsUihh3MYnpxuWokbW7jhDGCcb9vKEeQBQKGG00itbXuRwYXeQCGGIxo/37Z1ovhcOhuh/qmabXiwLrDvKBXnp72dQlIq1M61fGk2lKa/qUIJZ+emVpvXlhtf1muDeR6OB3OZuGiScUmZsJAQouuWs16pUGszPO61A0QDAzdGAOsYrsTJV9kMlZSuSsmBcJPFpZNNr0CWKcTDEV2wcEgsHBILh8TCIbFwSCwcEguHxMIhsXBILBwSC4fEwiGxcEgsHBILh8TC5fgKsKrIg72dN//t8fbdCPk5VSIgAzECMWldE/+UysVSV01RyUTIGtQv80pOTki951q6Wus9nedkKZr8wdbiMtecF2Y8v7RkynQo2HBSJHTh+P72+l+k8EiqYye4auYtX10581koqHCapl1sOvTX/l1SOK0L38qmz3xx1SfFk/DXf+RSuODwYMOuLQNdHbpsjXDcMyvWzF22iuO4fA7nudh2bOcmxGszuYqaeXUbthnNVsjLcN1nTvz+3Reqgrll6JHGVbhe27jT4iyG0TJKz/CetqaGbz6jVA0Ahj09B7eui4X8kE/hrrvbG77dAqBRncU/cO3wtg1yQv/bRzITLhK4Vb/zU1VO0J4IAHy9l0/9tCNPwjXu/ioSoHVf5oMuNR/uaWvO+XA9bc19HbTuI/o/LXt2JGKPOAnJ6nCqIrf8/DWMutAt3/mje3M4nPt0Q+jmAGRCx/H98Wg4V8O1H9sHGSKFg50tv+VkuKG+rmFPD2SOu+VoToa78ncjZJSvz+0f7M+9cJ5LZyHT+i+15Vi4RDzmu3oZMq3f3Z5j4fxej6Zm/j8j3b7el2PhAoMeyAJUd4NKuOjI6K1SJBGPhumtx9B5j4tRP+N5THFqe0JlIVNOxOX4KC3vJGc0W/W9E4nu96q8IPKCCHmNfZOPxMIhsXBILBwSC4fEwiGxcEgsHBILh8TCIbFwSCwcEguHxMIhsXCA8x9wuwqXH6P8JgAAAABJRU5ErkJggg==", "Jeruk": "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", "Ayam": "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", "Kambing": "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", "Ikan": "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", "Keluarga": "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", "Ibu": "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", "Cuaca": "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", "Hujan": "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", "Tangan": "iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAIAAACSfiL2AAAJkElEQVR4nO2cW4wbVxnHv3PmYs/4ur6sk91m222S5tq0BSVUCmp5QFQgLlUkUEDwQFUeeGgrClQqD4ibFFVICAmQeCkSQoirEEhtHiqlLwglqCSB9JK0ubVNsutk7WS93rXnej507L0kWc/YO55xxpv5KYpiz5kzJ39/5/u+cxtiTdchYu1QD/dERMJ5J7I4j0TCeSQSziORcB6JhPNIJJxHIuE8EgnnkUg4j0TCeUSEUGLOntKv/CGZ0QnUKSEo34/JT6PyEIQGEsLZkbmT373+9u/ve3S3IN3yu2LqAMs9DeEgdF114eyvykd/Xdw8fptq/Eeu/43Mvw7hIHTCzRw7RAhJjuY6XqWzvwNkEALCJZxx9YhRr0mqQkWhcwn7KtHfgbs8ODCzTlAj4gjQxWZo068BgCA5qNZGfwviu7nLs03t0p+lOJESORDSGH8EqLLOhdOn/kHqr4r0A1EWAAFjWzF9ABOPG7ULXBHm1hmJOY0AtZMvVk68XNoxkRwfBb19IcHyz2Hi4+tWuOtHn4oLp1OlEYCWZREgxllSeQm1N9Fq8O5o2m73M23m9SdvnDkyMrExMz668j0u0JlDjP4Alb3r0MfNHv9O/dzhlmq3Q+YPo/ZhSzjLpYYb775y48wRAMhtvmdVFUirvwBsW+A6Eo6ZtZmTv1EyScfWUJMXsyxk6FSmPsXFlROqrMY7XLYrpHEM1plw+tSraJhUdPQPy7kbsxx7q7HQBIB4OuFUgDT/C+tMOKtxiYvCHEVZ1tQ2uel1xNYN7ptjkuNjTG6S66urGrP8f244iiLIS8JZnd0c2ojIezERHFMWwurDHVWJfgGM04Aa0DTKO0EeR63GDaLp6LwFadGOmOEg3NKwgVACd5RghLPn6MxPiX785u8w+Rmmt4Rb0Lr6OKfA2ja3lnCOfQXbWc7wCcc0eu37xHjvtq/J/GEwptrd0Dat1WP4tQlHnC2OyjCMPo7O/na1am0kZdEWDAejo8s+zqGrAutBuIFk9X4LZ1VJ/RWni7KymHmZDZ5SrEYQRUDX4LBkceAiHHEOuKEVjjSPAThmG1JCcbc4Qkl7XoQ5RN7lYaxrcBhG4fRzLleluNx26mazS3xwtDjWPTgAHULhADv3wWWkVm9tZ/8uqZyTj+spOAxjVwXSJRWQEy3hGo4WR1upnGNUXbE4l64qDGNUldwvyyp3c5amo83cuqrTBEkvPo4MYzpCujRaWprSMBzcXLursm55HBDnlhNxHQonLwlnOvRWnpEAMNtGG11HDuvNx0nu16WWj3NxcyuDh06BFXtKgB3agDqwLrGrd3y2aqQx98H3Sg7skMq1w25rRt11kN97VDXLdO6vpPlvsKutzzFU9mD6IMZ3QB/47g5i7peJQMV4zNJ0w2HwkNpYKBmbJTUudJpxo0vpm+P6If/xVm4k80do9ZewuJzTRifNN0jjP6zwHCY/BWERjnYRru3muHDOg4fc5JjTvWo+W9gyQUUh7jz/vpyOkPphrlpH02ytTjB5EuWtEA4fF+taRG4NvFzmeN2qp6S47d786mWaVQGKLBx1VG0Rm1x/GYbI4vL338MsO7UhDwFBRGJcpJWXXFVrFdROgV0BoRAC4UinladbkZPK+Ee2Q3CgQa/9GIAvTXSBANHOYiIUwilwp6GzfwTsedkB5z0+BQZucYHTu2o8kGRCIRxSFYYJGWMPhsPiaAgsrmdY9qDnDU6+R1V1rXfwhVKb8cEpQ/6BIR8WUML/EgWXRLdPMLYL01/0fLvvwSHWsmK3fVpmQ5s6ddZq6syybNtGi7nkDYRSQZbEmCSripzgf+KZRCyV6LudKVZ4oevsoQsBzMDQBLiupc+VK40qX9JfxDXbQsYsTbc0XauthD9BltRcJlkcSY8VvZkkKzwPYhH6IADhSALATbjM2Ghzto4Wo5JARZEKlHdJQWh1Tkoo4Z2XMWTILNvSDdswLd2wdHN5pcI2zHq5Ui9Xrp65OLJpQ25yXIyvYfISU0+i+rHQbden088Sw23JxjPMZsZCo3m9Xr14+ebpPCWbum//wz1WgvIWVvrZ8ubZUFmcCsFgm1a9XJ29dNXSbtl9sgZzIworfK9/1QLycSnfq9Rq89Xzl+emK3xnSBuE+EgqVcyphayS7fWJLP8sSBt8aVIQwiV9rEyfb8yceb9eri7HEDmhZDdtSI8VJaX7hMLNYOKTmHjcr4YFIJyQ9qUa27Qq731w/f1pbl0t1VKl/Mi9GxPFDvuHu0NHWe6b4B/+C4c01f/WtXq5Wn7rnNXafAkI6bFiYetELOXVeyKw4rf9PQUROouzTevq2+drV661PyrZVGn3ZiXTl9/EzAGMexyTDtLHpT3fqtXmLx8/3c7XqCCM7pzMbtrguqDVA+I4y36trxo61up7jSB4zMjnpipT/3u3vR9JzWfHHnpgre6/Awgs/61eJvRD4OPEjR7umv2wPP3m2fa/C1smCg9M9Gto7cakPofxnRAAQVicCiS1ptnEZdUIpeOPbPdtOUIospGvwxBt10dpvPfC9XK1rRoVhIl9u31cxOH5R2Dzg8Gcc4jv6rGgVpu/cvJMe91v095dat7jRPZqUNmH6qMQGMFYXIyfJ+2KbVqXT5zm0QBh7OHtPqoGILCRb0CQBCcc7Vqsen5xkqOwdSK9seBnA5JPwFrcRWi6qpBA5aNdS8lJnsonR3OFrRN+Pp0oLPtVCJig9uBh8gnSfMO9TPaeUqqU73hSpB9Y5iAIWRjSQ3AY3we0u8/yXTUQSpj+Agzx6UEqsvSXYODwN7oM5R7gm8D0Z4HedGY+eFDZi+r+wTwryPOqRGK5p2Bg0BzLPz+4pwVaOyYeQ/UTgT5i6UnAii943ggSxhPSLP8MCKWgn4LZL2N8DwyQ4I+WU8Ue/SEf9gcGKvtY5iswWAZyJl+eYKUfBbQDDOUdrPhiP5sZQv0yA4xtY6VDQHzOSzG2h5V+EsQ8ZYjeAoGxbfbYz1Ga9K1C9TFuyAN8EdUdfWMhGqT2F1r7E4Dbe4C6IbKRpzH9ebjrXvVoXuZH9xf+1XVjeOfumX8m6MmPcL8j05yic38njX8C46/V6G0r4EFUu8+73B0vF0VG9HdI8wSY54lxAayV3Q4coYjyJMYfRGW/X9s+1otwt4HIz/jhAo+VVB3M4VMPhK9ZhPB1Mgj77vVwvVx0iIiE80gknEci4TwSCeeRSDiPRMJ5JBLOI5FwHomE80gknEci4TwSCeeRSDiPRMJ5JBLOI5FwHomEA2/8HygOa3KL/i6rAAAAAElFTkSuQmCC", "Mata": "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", "Sekolah": "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", "Sopan": "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", "Permisi": "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", "Rekreasi": "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", "Pelabuhan": "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", "Kalimat": "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", "Membaca": "iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAIAAACSfiL2AAAFZElEQVR4nO2czW8bRRTA3+yHvak/Eyexk0BxkraENC1NhSohxI0TQoJKcEHiwpkTXPgDEBf+ET6FhLj0hIRAVIiA2iRtGipa3CTGTrxp/LnenZ1BG4c0LYTKb3fSIt7vZkuemf3tzLxne98wXm4A0T8a4jMEicNDMw4JiUNC4pCQOCQkDgmJQ0LikJA4JCQOCYlDQuKQkDgkJA4JiUNC4pCQOCQkDgmJQ0LikBgQEb7wO44rhI9ugWm6ZZqmeeiQXI93XVdKge5C142BeEzTtMdCnMf9G7dLG9VNIWX41hKWVRjJFcfHTEPvveN03Vsb5cqW7bhu+PYNXT8+lj/x5ERIfSzk/6oe9y9fXWp1HIgU09BPn5gq5IZK5crK7d+FiOCWHGQok3pudiaMu7Dirv12q1SuAkAqncoXRo3DF9pDxgEghOh0nNpmrdVqA4CUMpdJ2/W94SWSieGRnGXFNU1DW+Suu7ZedtrBbZ4pHi9OjD2ypVpvBheZzqTPnT/DGAvZGgBMTj1V+aO6unJTCNGzZprmqWdODg8PhW8cAPJjhYUfFxzH3W40ioAXF3ablLuMTxQisdYjXxg9Oz/Xa9AwjXPnz0ZlLWjQ0EcL+d2RPwbpiGFEFp17ZDLpyeliMJfTyWOJgWgbj5mGDB3HworjPj45+HcmnhjTdYVpph9u5MiZwoX8rCp+qfPzbZ6NbpEeRNO0TDYDEHE87cEYW9zpfnGTv5hlL+c0xD6DuaV3PfnCgvfWdf9ueT3LPFCGFY+ra3wcnKW1yquL/sWr3Os/3cGIe/cmX2jC09B8TQ8SEXV4jHWVTLg93jY2RmT3a1t+VBLKxUkpP68G3VzQ65qaRbqPySCusodjTJzVgozn06qvXFxbQFuo9XX0bPX/XY5+HUFC4pCQOCQkDgmJQ0LikJA4JCQOCYlDQuKQkDgkJA4JiUNC4pCQOCQkDgmJQ0LikJA4JCQOCYlDQuKQkDgkJA4JiUNC4pCQOCQkDgmJQ0LikJC4Ryqu63Thv4MTxWijEXentO5GUWh1BLRbnfJGJXw70dQnOI7z0+WfB3OD6JKkHrFYLJ1OZgezDzwGHlTZ1LYbjSbnPEz7nuvVtmwhIigxwF+nuP+xZo/zamUz/IAAIJlKzJ2ZjVt7j5y3mu3lpWud3QKsyJFBFdnRLtVtaYIamo3W4pXl3rzgnr94ZVmRNQCwsVeBF/e9yLalqqDcarXX75SDIrt6o9tVFXkqwlyCZFBl03+FEv7Kd5j5IS+qc1cqrckoNqPDsKXxAZ/iuwY6nq+8XrXly8y396pp0uA9r+0Mgcuwm8WDcA6be3Unlqk7vUtiDPJ5YNHcJAFQlbEfRKbD9rb4mO+1X0qoDQ6uf9+sroN5SQxDhOzYsL7/Yn8iSEhkIBEsq8g4cKP9IyhJMqUAH39iwcPR9UPej7iy8yBa/1lO/5OfMdi2QR2JJPy9+nVgACxLXZ9W465ycTGdwdoatJqgCF2HySk4eMyAaUJxUlV3QWJlZ+1avx/qe/7HdG0mE1u5cQMyWUgkogoJ9xjKQSoFp+fAroHnQdyCocFgnTod2NmJuC8podGARmN+evAoToH48tfaG1+tgiKSSZiefnBHc11YXQVXSUJn6ey7N+fOjfYXeTAB/uLJ3MevnJpMxUAFzSasrIC9vReCguxkE1auK7L27MjApddn+7UW9twR2+EujzhHfe+bW5+s7gYfKYP97q8c+P0L4+/M40+7+EeOmXo6fkgQV31gy/8W+gUYCYlDQuKQkDgkJA4JiUNC4pCQOCQkDgmJQ0LikJA4JCQOCYlDQuKQkDgkJA4JiUNC4pCQOCQkDnD8CQBS2ln5mKXFAAAAAElFTkSuQmCC", "Gunung": "iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAIAAACSfiL2AAAEh0lEQVR4nO3bTVPbRhjA8V15ZckSxjCpeasJMBz6dshMe21P/QhJ75neem6+QO+EfIAeCD3j9NRpT51pD6XpGwmZlDZgINiYMDQULNva1dt2oIxpAw32U7Dx6vmdGGxrNH+vbMm7opEzT1DrNMBrEIaDwxEHhOGAMBwQhgPCcEAYDgjDAWE4IAwHhOGAMBwQhgPCcEAYDgjDAbHGX9VaYm+P1eqJKKI6k6lU2N8XWFYI3bLiaOTMex4tllIVRz/5cKbXy73Kk0nZiX271Gh1+35hzQ6Cfx2zTE/oBiNS+l5IpD85UbOsqHM7eRmx5YIdRUfVpJT92XTflR4jlWw8w+P+zm7lFfnMtrHdMdaolmBabnLA/EeyvyVNPTtyxa33EL5hm/yFR2PrqFrS1MdfGz5ZrSFlGdSciIjZxn279OEMUx+dzDI9ccZzKeME2x3RDFPPHVQ7Pi85s10ojaaerDS69+des9UaZGCSNY3E+vNOa7na8bgzSYy1fMkloyDw6h539+vZ/eceiaumhpvn1raWHhR++f7p4oJwnMb/zR77xq2bA1eHSfzQarX6kod3y8WFL/Ir97+V4ekXrYZt3rj14eDYCImZ08PJKCo+Xnj89ZfrD36kZ23CiGU7+ut336R6M8wwfe7yasX5Y6f826PNpUXuVJrfimEdthuPUTs69cH757IhwzKvf3xzaCJH4uHcfsgUdT43NfNsrUTi4Tx/AfZcMTc1sxWPduf807nnivzUzFahSFR3/nMOnivmbs+UVzaI0i5kssbnXn76brnwlKjroma5fO7lp2Y31R13Fzg96Avv3u27m8tqjruLnVf1xcExW1peJ8q58AnpQPj3pmdLT1Rr146Z/ED4+enZ0u9rRCFtWgIRen7+zmdFhdq1b+1I6PmfT89uLK0SJbR10U3gB199OkeU0O7VSmEYECXgMi8gDAeE4YAwHJDmez70tbGm1epVIUSnd6P7aJRQ7rqcu53ek+78jBNccDfWi2jgXw5CcM6xHehb9TAdHrOg05HDYxbbgc7jxOFB28RrY+30E+DDYxbbga4csB38kgvbwa9VsR38Ih/bwdcAC84pJYbxv5aZu4b287Xe0ntjHxEVNLtWn7tcSmqakFtDNobN+XcyD99Ke8nEoKbIHZwt3OQguEuJNMxmx13F1h69kf7hWt/miIJ3RLR2dwjnXFJivvSYdayDXg/fTK9etaR25tLrbsWqNuuptTDzJFxOJTk57nb69SeT1uLr6dUxlXs1sDufvD24WR9dd3LrznCp3v9cJCJ59rgjVGZSWwPJ8qBRHDFXxu39zCl3piuMEUq3c/Z2zv7p3aGDVehh1L8r0vueVQssx2dBxAKpRTJk1GeJQNdqPazSZ1Qyer33P29ujYMXP+NkQtvNpnazqQ7tT9fAWS4gDAeE4YAwHBCGA8JwQBgOCMMBYTggDAeE4YBYefQ6aaMEVeStYkPM6vQ+dCVF3v/2w3BAGA4IwwFhOCAMB4ThgDAcEIYDwnBAGA4IwwFhOCAMB4ThgDAcEIYDwnAE5i+jybOtnkGUUAAAAABJRU5ErkJggg==", "Pantai": "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", "Tanya": "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", "Eksplanasi": "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", "Banjir": "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", "Purwakarta": "iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAIAAACSfiL2AAAFU0lEQVR4nO2cW2wUVRiAz39mZtvtfaXbpbRcFi0KSCMkkuDlwQshRCOhpkYTjETrkw/EGEWefAGMCS88EEN8MlFEMaSNl4gvRmvEpGClpEqsDYbSBFoKpd1edmfO+U0ttqXd0s7fzuzs8n8Pm+zMnPPPfnNuc+bMgh48LRj3SEIahsXR4RJHhMURYXFEWBwRFkeExRFhcURYHBEWR4TFEWFxRFgcEVMEBtSI54f0mUH8ewS7kyKh0NZQaIqICavz5doC+Ugp3GOJYBAIcfpcQh3r0Y29ol9N24X/f+qxT5SbiuWLFUZdORRn+MwhsxOZumXA+aALm2+6S1ZiyNcrzTeqoNAQd5s4vGk77/2jPusBAcQsYpb5/mrjmSXi7hGnWxN2wwVxObXwrOQrMXN/HEIy93tVdep6asf5RbE2dg0+vmq/9AcmpjeOuSZOfddn774AyfFG3w0goCYCj1bBhqgwbqvd+POAXd+Owypnq6puGUjVtUPKpbWwab75sNFQC7HC8Q04mFIfnXMOnhYjzsRR8FSZ9clakNQWM7Di8LqdeuJ3ccV2l6yqKHRyp3wwOnOPbutJbT8h+pMTW4x3lptvLRc5VlXtdztdWyuyQo11aa2NnXpthXV029QtzqEu3TYkckmc+qkfm667TWXu2yLXld/hAOPZ+2BjbOIraOHs7RQ5Je7gJddp8gzjtdo5j5Lb41O/4m8Jdcr1FQqoONXcj60Jt6lgUwyKQ3Mftqx42hbn8GWRI+KO9RBSQWXRvI5LzRiFnE3ojhGR7eIwqfW3fZSUQ/PqSbD92syNqrFXZLs43TIAo+6Hu0Los1cQ50iISUd9k6Y30D+6nDUIYok747p1u8W1EX3yrzsfog6fFVfSjD+wdRAdytUKUonroDc39ts/YNfAbHvV9xed/b+k3QWOwEujIrtLXPfkyN41V4eTWz/XrVen56m082GrXd8k1KzFCrsWEHceeD6PCoMLqzNdg6nHP5XP1chtcVhWJEYdbOtVJy5gx405Eg6p7BaHbm/p02QhdFOHbupwlyqpRVZXVQhn6EFagbez6t7/qkhmnqpAmZnlJW5V2OsQs8TNz3Jx6wqE/0QMiM19nxtocXJLidch0gUt9TyE5wHWFIhqby/+TODJiNch/OjyZH2F8BEMgbFjSS6IM3fF0Meu1Xi+HErMXBAH1XnGCz4VOpTC2FPtQyCfRqfm3hVY6EcsY/dSGQ/njjhYGjL3rfA8TMzyI8p/+Hc/ZDRUwtYy7/JHKayja3xo3fwWBwDWkRpxv1f1yDwQ92H4NoGvd+BQaoW+WC9W5S16zmPP8F+tFD7i99QFLA2Fvq6F2lurQBYOAhoH4r6tfJggA3M+ELWsrzbIlyefwNOJWtaX680GX8vaOJmZLIN8aR261zy+VsSJcxgIKHdVhJofMh7zsMMJ7hpgtLU63quOdIuL8322goaQO8rNPVXygUWr79knbhxExF8HVGOfbu4XnekNYljKzcXy6YixMwrRzC/aD4S4qeANO9Ge6vtTy2ElHC3CpogY1ZslrMwH06dFg1nznsNUIGLhxvyh6snhnmUqWe35WhC38CtJRFgcERZHhMURYXFEWBwRFkeExRFhcURYHBEWR4TFEWFxRFgcERZHhMURYXFEWBwRFkeExRFhcURYHBEWR4TFEWFxRFhcDomTt5+UX38zlf3iwnnKkJOv6ZYUTv5lV3AIojhDipWx0cJ8J2Q65aXJaKnLv7K6O5d5ZQtBLHFZAYsjwuKIsDgiLI4IiyPC4oiwOCIsjgiLI8LiiLA4IiyOCIsjwuKIsDgiLE7Q+BdiG5VdoO6DCwAAAABJRU5ErkJggg==", "Jambu": "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", "Inggris": "iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAIAAACSfiL2AAAFOUlEQVR4nO2cfU/jRhCHf+v3JIQAp1Z3vWu//3dq/7u2qMBBwIkTv241DuLCbkJg1iZGmkcRQogY+8nuzOzsCvXnVQPh7XiM9wgijo+MOCYijomIYyLimIg4JiKOiYhjIuKYiDgmIo6JiGMi4piIOCYijomIYyLimIg4JiKOiYhjIuKYiDgmIo6JiGMi4piIOCYijomIYyLimIg4JiKOSYD+iQMkISJfhT48RS8AjYbWqBqUDcpKryuUNT4QPYqLA5wm6iSGf3hYk8u6wbLAMtfL4qVfjXz8cdG6fxGt6bOpNYoKRaWzEusSQxcXB/g0UePobe/yPZwm5Pqva+1+D0rBV/Bb0YjVBWhE32X6YY0hilMgZWdjDJDQx69TdZrg8kHXzZCSg+/h6/lArT2RhPh6pvzDc/29Rlzo47cZhX+bukFWICt0UdP3dUPzaJMlooCmUhyqUfiYNBhswtkz2ovvu17k49OJukr18cX53m5rdYPbTD+soPc8avGYSbVSGIWYjd4cGQGkOXZa8L2fCcrgNMFd5pTHuxH3+XSHtTTHdarNsbAHrR9H5c4xy+NppE8ifJ4pYwCexOTumDHuYkyDxeA2w38Pr7W2TR/V3LLA3HIUB05xzlVc6ON8bN7BfIXbZQclRYekuXk/gduju4q7mChjDqxL/FgMyxqAquuB7CQu8ChSGFylenDa2nrYoGqOJ26amCl/kT8lymERW1kwr/TRxJ3EdnQb4GgjZiPzVlO3tRe/HPGU+TE2uuOFdCeoNhBPnpeH85XrVOWLS6wSZPViV+OdQ5inKOMnIRXAtM7fYlXih3PS54sL/Y6jBptNT+WVvzxfUdJ3v1G+uMBaW9aHbsf3YEyZfSwLqvs7pNEU1O5XtF7uBKcYZ3DwUaO2sYNX8P2ug87PNp6iaauh0rXOq6OKU5aBIdZvW8QBvc5GKitwvdCOazu+OG1p8o6080Mtcmt4btpW9qcLYBzh93N1ea9X5VHEwcS9O8hjsaettMlgSYhpbHarPEX9ku+3ml2U8MVVlAueqQrI3EvTtWp2d3LigEZBH5Q1vdK1HkfU+9qOy76i+o7dzuSLK63Pym4umW+pdxdQsxHGUb/DNSuozfVl9uyvTBPcLKzu8evgh6Xcyk1RwG9/vwPLwrxntauM711cVZurFtW2VYeMvbZhd+WcEuEyN39yZjU1B0VtlQLsKeJ121aNfAocg8VTb17t7L2Uy32syx2R7pcTc1E9HOyIxl6fuNasN1aW3JRIjh39PkhCM+9rhz6Y6/OtCtoGNIh8Ks3tpusRiQN8OTXn6bJg1iLd7KtepzoJzH1V38O3c5WuabvrYHUe9rbmCDzE7crBTvea9jD5q+sOxDUa/97rb2fKOM6l2k7ZNFHrAllJC8PN+QfdTmffo4E5CtUkdt2pm8aYWPXz5pTFC9wtdeHQJulmOpU1/plTXW53NxUwijDqc2GwOdH1JmjnNxvGaaWixt/zA2cCX09/DapGU0/pxnnnt8sAXje4vNfTmI7IBayKpNF4aPu0fRyE2DSB7zJ+R2Sb7jNfmmOR60lM+wCjaO9ZK/t0zLKgAdtVN1QDTUOyqmZTb3Z5cYoPvf5XVq89vBWHFPsC77GzSGe8GirZy5pO5+b0FR+OfmutRrfnoYth99RZDK/A/yCIOCYijomIYyLimIg4JiKOiYhjIuKYiDgmIo6JiGMi4piIOCYijomIYyLimIg4JiKOiYhjIuKYiDgmIo6JiGMi4piIOCYijomIYyLimIg4JiKOiYgDj/8BHPfXHL2UqFUAAAAASUVORK5CYII=", "Iklan": "iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAIAAACSfiL2AAAFRElEQVR4nO2cXWgcRRzAZ3bv9i67d81HSdKmsRG11ZIqEq2tikpttV9+FAsBadD6UDWgkFJRaEXsQy3qixQUH6wifRFBsVgiIlh9MNpiRS1IrI3Wmlqay13udu92bz9mRi4HrUhsbv/Zy+3H/J6Sy3/2P/fL7Mzu7Mxi54KGOO4RAGU4XBwc3uKAcHFAuDggXBwQLg4IFweEiwPCxQHh4oBwcUC4OCBcHBAuDggXB4SLAxJDoYMRgv78nWUzWIyhzi68pLseWUIljhU1+sH79IthrKmXP+xcLG57FG98CMe8/LI4NM8c6JnTdN8LKJuZ+c+9N4kv7sfNrV6lC4k4ev4vMrQTl4pXCrp2ufj6mzjZ5EnGMAwOjDH66r5ZrCGExk7T9972KmkoxB0fQWdGa4mkw5+w7KQnScMgjo58VWMkJoSdGPEkaRjEobN/1B7Lzo55kjMM4lix4CJavXylEl1xhNKMnrcs00UZSiJ9AexQkjPUnKEyxHownv8KBE+cQ0lWL0yVNYZYA6sRJHE2cbJGIV9R1nhiAVI2VfbRTY7fxVnEzhmqr5T5XZxF7KxeyJeLqAFdfzDF6XZ5qqyp5VJFmS+t+UgcY8wklmbqmmWYxKp85FdlcxWnj54rfHnSzuQxorAjlB1b2roGX7fYoY5JbBQogOLGDxy+eOjo3NtE/ObuWE8LCiCQW66Jw59PeGEt0IDEHTpah5qEXRy1bWt8oj6VCbU4ZnszuxB0gj2tBGD8wvm86mb+7n+InLiffjm1evM9ew+8fDEzpw4ncuIQQpTSDz/9eMvAI9+dPAE+SBTFVSlo6o6hp779/jgCEV1xCCFCyLN7d8PO2UiLQ9Pt7uA7bwEKRl0cQuij4SOq5nq+j4tDhJBj33zNxUH4dew3t0V4i6uQybleUMLFVVBkBbmEi6uwqL0DuYSLq3DnqjXIJVwc6uleuvKGXi7ONbuefAa7X30S9Ra3ae19W9ZvBBSMtLjbb7nttZf2B/u56jwjiuKO/u3PDQ7FoJsfIicuKSUGNm19vH/g6quWzuU4kRO37q619+/eM/fjuO7jhEQcCRF/pgoSh0VR6bu+PpUJEpBRtfv57SgmomgDEaf0LV/27h6p2/X9XZgADg7pO1b2HjtojJ5zJvOIVdbkFi0jV559C0G73NIUS1R/toiNl3UJqQWWY1vENhyTMODCp/kHPqpijOUVPQj1VH8lhiaWsrOWSi3oVKSZ9+8xxgzH1Ey9YBb9b9BHlyMYYzmelOPJdqVFNUtZvWBRB/kVH4m7hICFlmS6OZHSLL2yccaXaw79KK4KxnhBQklLctEyMvqU35Zs+ldcFYxxOiGnE7JmljKlvEn9os/v4i6RTijphFKcPnnLzvTq6oYSGHFVUpKckuRS5eTNG46bTYMRF1dFkZoUqalkGZN6Xm+QvkCK+7c+3S4DJr4jLa6KHE86UhLVTjyOvCAUU+etbS6C2xZ6kjMM4vCKG+sUHHZx6zaw2nZ+sdY23LfKk6RhECf0XIM3PFBLpPjE0ziR9Capd5f4qKZ8uC7/KnFwCM32NB4/uE1Yv9mrjJ59jWRMmj2IIUn0ZlD7D1hKiK+8ge++d+a0oogf2ykO7vIyo4dv8/pbzRSs0hUCOpTWhU3NqJ6wUz/Sz46wn39gUzkkiLhjEb51tfBwP+5a4m0ij1+Dppolw55hIjcmCClJluPe9C+1wCjFQh178JC8P27+CcOo2hC4OCBcHBAuDggXB4SLA8LFAeHigHBxQLg4IFwcEC4OCBcHhIsDwsUB4eKAcHFAuDgE4x8WWMWFKQfIyAAAAABJRU5ErkJggg==", "Informasi": "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", "Desain": "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", "Menu": "iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAIAAACSfiL2AAAFOklEQVR4nO2cTW8bRRiA35lde+1dO+s4HyTB6UcqkdASWkGlhiIhISFBioLUcuHEgRu/oZy4cOQf8AdAnCpRCU4oiahCUVIESKRpkiZtDbWdOLbjj92dQU7TKFCb4De767V5n5Pt3Z2ZfTzfOzts+U8BROtwxDUEicNDOQ4JiUNC4pCQOCQkDgmJQ0LikJA4JCQOCYlDokLwcGxrc/XXXHrDqlW0qNE/fGrk5DjjwfqPWdBmR8q7haX5m5XSzuEfe3oHJqfeDoU16FZxUgqWW2aVxwx1uRBi4bf1UrkGAOGQamjhYqVs2RIA+nqM8y+ksKliMj4M5hgEUxwrPVLmP+U7a+gQ0jByR70MAMNi7Zy4zUFaUllULm/x5wDgkvWtyfLowEX/pD11HTQT3MC9isOxlNlPjmMNALZY/5NsOyEWOdQzWog5487S4aNoeOZn5YfPIGiNA0sv8OLDVq/ahsRDPlaAuGT1lOyCXr9D6ajShqelPczqJRcA1pSJNJzaO8HqgXzKWYmxYkvRKZklJ78GZj2QwIgrpVu95C6buKe89Ozvkocey5FBuf83pNnokw81Fq1BdC8y2IbB+zB2VvyUgvVW0ykDJQ72StY/YPogjw2xg8xziM1q/F5pqFlYd5SpsUjOVGtZK7JWSTQ+iSu/sFeN+NBAuNIgNVKIwqasbD1zQAS9Hxed/DB69v2Gh6SUy998XS+aTRDA71ae1mjNW2jG+Erowpk3rzSORTi7i19Ul2+AB3jVq+TmiWbWAKBQ3CmXm1priWwuY1lWw0OMK/qFj9xqRn0Sp/TsV0wNqdX26/vjwxir1ipNj3JFjT8PHuDdOIZBMJDMk3sM1gCwgyBxHSVOj9Y7uq6gqqoWjrgVWgvxtkecbky/NZMv4AeeByR7k6FQCP4/83GmmTDNJj3bToDqOCQkDgmJQ0LikJA4JCQOCYlDQuIC3wFeXV8pFP72tNQLksn+1Mi/zWh1mLhsLnPrx3kfIpJSvjd9zTBiXVJUDSNm6J7fDAAkzF5Ni3RPjotokZnpq0J4vtyC+7XExNdBPg/Ywpnj0D134jMkDgmJQ0L9OCTUj0NC/Tgk1I9DQv04JNSqIiFxgS+qW9u5QrHgdSwJs7cn3tM94vI7+Zvf3WDM8yVMnPOZ6WvRSNTziMAXFIUriuJDRKqi+jOV4FOOixnxmXeu7rq0CrMZjDFdNzRfXsDxr46LRvWoe4uU2g61qkhIHBISF+w6Tghxe3GhUMQ/HtQ07ZWXLwanlvRJXCb3eGX192MGkkz0vTh+rtWrmEuv0rRHXDLRN5o6WTzGyCEc1kZTJw6+SilrVevox2bCcXY2oXPFqar6+qU33AqtWqk+uJ+2befIM6O5OaPmyfKBjmwc/niU+S/WtOysvvmlR2noSHHVSvXIc7TsbOzBV96NjjtSnGzwhqev1jpVXNutdaE4zRdr3SZO88taV4nTfLTWPeI0f611iTjNd2vdIE5rh7WOF6e1yZqX4oQN3WvNQ3F2blk6jXe1cAEp2mvNQ3GynC3e+twpZVwPWVS2ja3v22vN22kla2MuvzFX323K1Rtkwq4/bW6rNVfF8cbPm5m0G+261D64GqyiKs0zEHhkPZ2nAyZuYFIMXoRgI8beBX0gcI2D9dp15/QVyduwmcWRSFW3xz+wz38c4F1ZHRvs4tGTjX7CmAzFWZNaODCtqqKCErgNRVxvgzt7yNVGSBwSEoeExCEhcUhIHBISh4TEISFxSEgcEhKHhMQhIXFISBwSEoeExCEhcUhIHOD4C/EksdPRzF48AAAAAElFTkSuQmCC", "Komunikasi": "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"};
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
   fill(visual, {"Mangga": "purple", "Pepaya": "blue", "Jeruk": "pink", "Ayam": "yellow", "Kambing": "purple", "Ikan": "blue", "Keluarga": "pink", "Ibu": "yellow", "Cuaca": "purple", "Hujan": "blue", "Tangan": "pink", "Mata": "yellow", "Sekolah": "purple", "Sopan": "blue", "Permisi": "pink", "Rekreasi": "yellow", "Pelabuhan": "purple", "Kalimat": "blue", "Membaca": "pink", "Gunung": "yellow", "Pantai": "purple", "Tanya": "blue", "Eksplanasi": "purple", "Banjir": "pink", "Purwakarta": "yellow", "Jambu": "purple", "Inggris": "blue", "Iklan": "pink", "Informasi": "yellow", "Desain": "purple", "Menu": "blue", "Komunikasi": "pink"}[w.word] || 'purple');
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

// END FIDELITY












// BEGIN COMPLETENESS
const curriculum = {"lessons":{"SD":[{"id":"sd-tumbuhan","aspect":"kosakata","title":"Kenali tumbuhan dan buah","description":"Kenali mangga, pepaya, dan jeruk lewat gambar dan isyarat.","emoji":"🥭","word":"Mangga","words":["Mangga","Pepaya","Jeruk"],"time":8,"intro":"Kamu akan mengenali tiga buah yang muncul pada video dan Kamus Visual SD.","explanation":"Mangga tumbuh pada pohon mangga. Pepaya tumbuh pada tanaman pepaya. Jeruk memiliki kulit tebal dan bagian dalam berupa ulas.","tip":"Perhatikan gambar buah, baca namanya, lalu amati bagian video yang sesuai.","visual":"🥭 🌱 🍊","practice":{"prompt":"Buah apa yang ditunjukkan gambar ini?","visual":"🥭","options":["Mangga","Ayam","Ikan"],"correct":0},"quiz":[{"prompt":"Buah yang tumbuh pada pohon mangga adalah …","options":["Jeruk","Mangga","Pepaya"],"correct":1},{"prompt":"Kata yang sesuai gambar 🍊 adalah …","options":["Jeruk","Kambing","Ikan"],"correct":0},{"prompt":"Manakah yang merupakan nama buah?","options":["Ayam","Kambing","Pepaya"],"correct":2},{"prompt":"Mangga, pepaya, dan jeruk termasuk …","options":["Hewan","Buah","Tempat"],"correct":1},{"prompt":"Buah dengan bagian dalam berupa beberapa ulas adalah …","options":["Jeruk","Ayam","Ikan"],"correct":0}],"grade":"SD","level":"Dasar","wordEntry":{"word":"Mangga","emoji":"🥭","category":"Tumbuhan","meaning":"Buah yang tumbuh pada pohon mangga.","example":"Pohon mangga menghasilkan buah mangga.","videoId":"iDDkYTki6pU","start":80,"video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}},"relatedWords":[{"word":"Mangga","emoji":"🥭","category":"Tumbuhan","meaning":"Buah yang tumbuh pada pohon mangga.","example":"Pohon mangga menghasilkan buah mangga.","videoId":"iDDkYTki6pU","start":80,"video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}},{"word":"Pepaya","emoji":"🌱","category":"Tumbuhan","meaning":"Buah yang tumbuh pada tanaman pepaya.","example":"Kita menghitung buah pepaya pada gambar.","videoId":"iDDkYTki6pU","start":165,"video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}},{"word":"Jeruk","emoji":"🍊","category":"Tumbuhan","meaning":"Buah berkulit tebal dengan bagian dalam berupa beberapa ulas.","example":"Ada dua buah jeruk pada gambar.","videoId":"iDDkYTki6pU","start":225,"video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}}],"example":"Pohon mangga menghasilkan buah mangga.","video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}},{"id":"sd-kalimat","aspect":"kalimat","title":"Kalimat tentang hewan","description":"Susun kalimat sederhana dengan kosakata hewan dari video.","emoji":"🐔","word":"Ayam","words":["Ayam","Kambing","Ikan"],"time":10,"intro":"Kamu akan memakai nama hewan untuk menyusun kalimat yang mudah dipahami.","explanation":"Kalimat “Ayam makan jagung.” menyebutkan hewan, kegiatan, dan makanannya. “Ikan berenang di kolam.” menjelaskan kegiatan ikan dan tempatnya.","tip":"Mulai dari hewannya, lalu kegiatannya, lalu tambahkan informasi lain.","visual":"🐔 🌽","practice":{"prompt":"Susun menjadi kalimat yang benar.","words":["jagung","Ayam","makan"],"answer":"Ayam makan jagung"},"quiz":[{"prompt":"Kalimat yang urut adalah …","options":["Jagung ayam makan.","Ayam makan jagung.","Makan ayam jagung."],"correct":1},{"prompt":"“Ikan berenang di kolam.” Hewan apa yang berenang?","options":["Ikan","Ayam","Kambing"],"correct":0},{"prompt":"“Kambing makan rumput.” Apa yang dimakan?","options":["Air","Jagung","Rumput"],"correct":2},{"prompt":"“Ayam berada di kandang.” Di mana ayam berada?","options":["Kolam","Kandang","Sekolah"],"correct":1},{"prompt":"Kalimat yang sesuai dengan ikan adalah …","options":["Ikan berenang di air.","Ikan tumbuh di pohon.","Ikan adalah buah."],"correct":0}],"grade":"SD","level":"Dasar","wordEntry":{"word":"Ayam","emoji":"🐔","category":"Hewan","meaning":"Hewan unggas yang memiliki paruh, sayap, dan dua kaki.","example":"Ayam dapat dipelihara di rumah.","videoId":"3KepM1ycETA","start":75,"video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}},"relatedWords":[{"word":"Ayam","emoji":"🐔","category":"Hewan","meaning":"Hewan unggas yang memiliki paruh, sayap, dan dua kaki.","example":"Ayam dapat dipelihara di rumah.","videoId":"3KepM1ycETA","start":75,"video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}},{"word":"Kambing","emoji":"🐐","category":"Hewan","meaning":"Hewan berkaki empat yang biasa dipelihara sebagai ternak.","example":"Kambing berada di dalam kandang.","videoId":"3KepM1ycETA","start":110,"video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}},{"word":"Ikan","emoji":"🐟","category":"Hewan","meaning":"Hewan yang hidup di air dan bernapas dengan insang.","example":"Ikan berenang di kolam.","videoId":"3KepM1ycETA","start":165,"video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}}],"example":"Ayam dapat dipelihara di rumah.","video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}},{"id":"sd-bacaan","aspect":"bacaan","title":"Cerita hewan di rumah","description":"Baca cerita pendek memakai kosakata di Kamus Visual SD.","emoji":"🐟","word":"Ikan","words":["Ikan","Ayam","Kambing"],"time":10,"intro":"Kamu akan mencari siapa, tempat, dan kegiatan dalam cerita tentang hewan peliharaan.","explanation":"Dina melihat hewan di rumah pagi hari. Ayam berada di kandang. Kambing makan rumput. Ikan berenang di kolam. Dina memberi makan ikan.","tip":"Cari satu informasi dulu: siapa, kapan, di mana, atau apa kegiatannya.","visual":"🐔 🐐 🐟","practice":{"prompt":"Di mana ikan berenang dalam cerita?","options":["Kandang","Kolam","Pohon"],"correct":1},"quiz":[{"prompt":"Siapa yang melihat hewan di rumah?","options":["Budi","Dina","Ibu"],"correct":1},{"prompt":"Kapan Dina melihat hewan?","options":["Pagi hari","Malam hari","Sore hari"],"correct":0},{"prompt":"Di mana ayam berada?","options":["Kolam","Pohon","Kandang"],"correct":2},{"prompt":"Apa makanan kambing dalam cerita?","options":["Jagung","Rumput","Buah"],"correct":1},{"prompt":"Hewan mana yang diberi makan oleh Dina?","options":["Ikan","Kambing","Ayam"],"correct":0}],"grade":"SD","level":"Dasar","wordEntry":{"word":"Ikan","emoji":"🐟","category":"Hewan","meaning":"Hewan yang hidup di air dan bernapas dengan insang.","example":"Ikan berenang di kolam.","videoId":"3KepM1ycETA","start":165,"video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}},"relatedWords":[{"word":"Ikan","emoji":"🐟","category":"Hewan","meaning":"Hewan yang hidup di air dan bernapas dengan insang.","example":"Ikan berenang di kolam.","videoId":"3KepM1ycETA","start":165,"video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}},{"word":"Ayam","emoji":"🐔","category":"Hewan","meaning":"Hewan unggas yang memiliki paruh, sayap, dan dua kaki.","example":"Ayam dapat dipelihara di rumah.","videoId":"3KepM1ycETA","start":75,"video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}},{"word":"Kambing","emoji":"🐐","category":"Hewan","meaning":"Hewan berkaki empat yang biasa dipelihara sebagai ternak.","example":"Kambing berada di dalam kandang.","videoId":"3KepM1ycETA","start":110,"video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}}],"example":"Ikan berenang di kolam.","video":{"id":"3KepM1ycETA","title":"Mengenal hewan peliharaan","creator":"Direktorat PKPLK","topic":"Kosakata hewan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Pelajari nama dan ciri hewan peliharaan melalui materi tematik kelas 4 SDLB tunarungu dengan penjelasan isyarat dan gambar.","sourceTitle":"Pembelajaran tematik kelas IV SDLB Tunarungu \"Hewan Peliharaan\""}},{"id":"sd-hitung","aspect":"akademik","title":"Menghitung buah","description":"Latih penjumlahan dan pengurangan dengan mangga dan jeruk.","emoji":"🍊","word":"Jeruk","words":["Jeruk","Mangga","Pepaya"],"time":8,"intro":"Kamu akan menghitung jumlah buah yang namanya sudah kamu kenal di Kamus Visual.","explanation":"Ada 2 jeruk dan 1 jeruk lagi. Jumlahnya 3 jeruk: 2 + 1 = 3. Jika 1 jeruk diberikan kepada teman, tersisa 2 jeruk: 3 − 1 = 2.","tip":"Hitung satu per satu. Tambah berarti digabungkan; kurang berarti diambil sebagian.","visual":"🍊🍊 + 🍊","practice":{"prompt":"Dua jeruk ditambah satu jeruk berjumlah …","options":["2 jeruk","3 jeruk","4 jeruk"],"correct":1},"quiz":[{"prompt":"1 mangga + 1 mangga = …","options":["1 mangga","2 mangga","3 mangga"],"correct":1},{"prompt":"2 jeruk + 1 jeruk = …","options":["3 jeruk","2 jeruk","4 jeruk"],"correct":0},{"prompt":"4 pepaya − 1 pepaya = …","options":["4 pepaya","2 pepaya","3 pepaya"],"correct":2},{"prompt":"2 mangga + 2 mangga = …","options":["2 mangga","4 mangga","3 mangga"],"correct":1},{"prompt":"3 jeruk − 2 jeruk = …","options":["1 jeruk","2 jeruk","5 jeruk"],"correct":0}],"grade":"SD","level":"Dasar","wordEntry":{"word":"Jeruk","emoji":"🍊","category":"Tumbuhan","meaning":"Buah berkulit tebal dengan bagian dalam berupa beberapa ulas.","example":"Ada dua buah jeruk pada gambar.","videoId":"iDDkYTki6pU","start":225,"video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}},"relatedWords":[{"word":"Jeruk","emoji":"🍊","category":"Tumbuhan","meaning":"Buah berkulit tebal dengan bagian dalam berupa beberapa ulas.","example":"Ada dua buah jeruk pada gambar.","videoId":"iDDkYTki6pU","start":225,"video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}},{"word":"Mangga","emoji":"🥭","category":"Tumbuhan","meaning":"Buah yang tumbuh pada pohon mangga.","example":"Pohon mangga menghasilkan buah mangga.","videoId":"iDDkYTki6pU","start":80,"video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}},{"word":"Pepaya","emoji":"🌱","category":"Tumbuhan","meaning":"Buah yang tumbuh pada tanaman pepaya.","example":"Kita menghitung buah pepaya pada gambar.","videoId":"iDDkYTki6pU","start":165,"video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}}],"example":"Ada dua buah jeruk pada gambar.","video":{"id":"iDDkYTki6pU","title":"Tumbuhan di sekitar kita","creator":"Direktorat PKPLK","topic":"Kosakata tumbuhan","sourceLevel":"SDLB · Kelas 4","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Kenali tumbuhan melalui pembelajaran Bahasa Indonesia kelas 4 untuk peserta didik tunarungu, dengan isyarat dan gambar.","sourceTitle":"Pembelajaran Bahasa Indonesia Kelas IV Tunarungu\"Tumbuhan Disekitar Kita\""}}],"SMP":[{"id":"smp-percakapan","aspect":"kosakata","title":"Kosakata percakapan sopan","description":"Pahami sekolah, sopan, dan permisi dari video SMPLB.","emoji":"🏫","word":"Sekolah","words":["Sekolah","Sopan","Permisi"],"time":8,"intro":"Kamu akan memahami kosakata percakapan yang muncul pada video dan Kamus Visual SMP.","explanation":"Sekolah adalah tempat belajar. Sopan berarti menghargai orang lain dalam perilaku dan ucapan. Permisi digunakan saat meminta izin atau perhatian dengan sopan.","tip":"Perhatikan situasinya: di mana kamu berada, kepada siapa kamu berbicara, dan apa yang ingin kamu sampaikan.","visual":"🏫 🤝 🙋","practice":{"prompt":"Saat ingin melewati seseorang, ungkapan yang sesuai adalah …","options":["Permisi.","Cepat pergi!","Diam!"],"correct":0},"quiz":[{"prompt":"Tempat peserta didik belajar bersama guru disebut …","options":["Pelabuhan","Sekolah","Kolam"],"correct":1},{"prompt":"“Sopan” berarti …","options":["Menghargai orang lain","Memaksa orang lain","Mengabaikan orang lain"],"correct":0},{"prompt":"Ungkapan untuk meminta izin lewat adalah …","options":["Pindah!","Diam!","Permisi."],"correct":2},{"prompt":"Contoh perilaku sopan adalah …","options":["Memotong pembicaraan","Meminta izin sebelum lewat","Mendorong teman"],"correct":1},{"prompt":"Kata “sekolah” termasuk nama …","options":["Tempat","Buah","Hewan"],"correct":0}],"grade":"SMP","level":"Menengah","wordEntry":{"word":"Sekolah","emoji":"🏫","category":"Tempat","meaning":"Tempat peserta didik belajar bersama guru.","example":"Kita bersikap sopan di lingkungan sekolah.","videoId":"5TJG1D3OG1Y","start":285,"video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}},"relatedWords":[{"word":"Sekolah","emoji":"🏫","category":"Tempat","meaning":"Tempat peserta didik belajar bersama guru.","example":"Kita bersikap sopan di lingkungan sekolah.","videoId":"5TJG1D3OG1Y","start":285,"video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}},{"word":"Sopan","emoji":"🤝","category":"Sikap","meaning":"Berperilaku baik dan menghargai orang lain.","example":"Kita berbicara dengan sopan kepada guru.","videoId":"5TJG1D3OG1Y","start":405,"video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}},{"word":"Permisi","emoji":"🙋","category":"Ungkapan","meaning":"Ungkapan untuk meminta izin atau perhatian dengan sopan.","example":"Permisi, saya ingin lewat.","videoId":"5TJG1D3OG1Y","start":410,"video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}}],"example":"Kita bersikap sopan di lingkungan sekolah.","video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}},{"id":"smp-kalimat","aspect":"kalimat","title":"Menyampaikan izin dengan santun","description":"Pilih kalimat yang tepat untuk percakapan di sekolah.","emoji":"🙋","word":"Permisi","words":["Permisi","Sopan","Sekolah"],"time":10,"intro":"Kamu akan menyusun ungkapan izin dan memilih kalimat yang sesuai dengan situasi.","explanation":"Kalimat “Permisi, saya ingin lewat.” menyampaikan tujuan dengan sopan. Saat ingin bertanya kepada guru, gunakan “Permisi, boleh saya bertanya?”","tip":"Gunakan ungkapan sopan, sebutkan dirimu, lalu sampaikan tujuanmu dengan jelas.","visual":"🙋 🏫","practice":{"prompt":"Susun ungkapan untuk meminta izin lewat.","words":["lewat.","Permisi,","saya ingin"],"answer":"Permisi, saya ingin lewat."},"quiz":[{"prompt":"Kalimat untuk meminta izin lewat adalah …","options":["Cepat minggir!","Permisi, saya ingin lewat.","Saya tidak peduli."],"correct":1},{"prompt":"Kalimat yang santun untuk bertanya kepada guru adalah …","options":["Permisi, boleh saya bertanya?","Jawab sekarang!","Diam dulu!"],"correct":0},{"prompt":"Dalam “Permisi, saya ingin lewat.”, tujuan pembicara adalah …","options":["Makan buah","Pergi berlayar","Meminta izin lewat"],"correct":2},{"prompt":"Kalimat yang tersusun jelas adalah …","options":["Saya lewat permisi ingin.","Permisi, saya ingin lewat.","Ingin permisi lewat saya."],"correct":1},{"prompt":"Mengapa ungkapan permisi digunakan?","options":["Untuk menghargai orang lain","Untuk memaksa teman","Untuk mengejek guru"],"correct":0}],"grade":"SMP","level":"Menengah","wordEntry":{"word":"Permisi","emoji":"🙋","category":"Ungkapan","meaning":"Ungkapan untuk meminta izin atau perhatian dengan sopan.","example":"Permisi, saya ingin lewat.","videoId":"5TJG1D3OG1Y","start":410,"video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}},"relatedWords":[{"word":"Permisi","emoji":"🙋","category":"Ungkapan","meaning":"Ungkapan untuk meminta izin atau perhatian dengan sopan.","example":"Permisi, saya ingin lewat.","videoId":"5TJG1D3OG1Y","start":410,"video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}},{"word":"Sopan","emoji":"🤝","category":"Sikap","meaning":"Berperilaku baik dan menghargai orang lain.","example":"Kita berbicara dengan sopan kepada guru.","videoId":"5TJG1D3OG1Y","start":405,"video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}},{"word":"Sekolah","emoji":"🏫","category":"Tempat","meaning":"Tempat peserta didik belajar bersama guru.","example":"Kita bersikap sopan di lingkungan sekolah.","videoId":"5TJG1D3OG1Y","start":285,"video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}}],"example":"Permisi, saya ingin lewat.","video":{"id":"5TJG1D3OG1Y","title":"Bahasa Indonesia melalui percakapan","creator":"Rapusa","topic":"Percakapan dan bacaan","sourceLevel":"SMPLB · Kelas 7","audience":"tunarungu","accessibility":"Komunikasi visual & teks","description":"Ikuti rekaman pembelajaran Bahasa Indonesia kelas 7 SMPLB tunarungu dengan percakapan, komunikasi visual, dan teks di papan.","sourceTitle":"Praktik Pembelajaran Bahasa Indonesia  - Kelas VII SMPLB Tunarungu"}},{"id":"smp-bacaan","aspect":"bacaan","title":"Rekreasi ke pelabuhan","description":"Temukan informasi penting dalam paragraf tentang rekreasi.","emoji":"🚢","word":"Pelabuhan","words":["Pelabuhan","Rekreasi"],"time":10,"intro":"Kamu akan membaca paragraf baru dengan kosakata dari video pemahaman bacaan SMP.","explanation":"Pada hari Minggu, Rani berekreasi bersama keluarga ke pelabuhan. Mereka melihat kapal berlabuh. Kapal menaikkan penumpang. Rani mencatat kegiatan di pelabuhan untuk diceritakan di sekolah.","tip":"Cari siapa, kapan, tempat, dan kegiatan. Gunakan informasi dalam paragraf untuk menjawab.","visual":"🚢 🏖️","practice":{"prompt":"Ke mana Rani berekreasi?","options":["Kebun","Pelabuhan","Kolam"],"correct":1},"quiz":[{"prompt":"Siapa yang berekreasi dalam paragraf?","options":["Dina","Rani","Budi"],"correct":1},{"prompt":"Kapan Rani berekreasi?","options":["Hari Minggu","Hari Senin","Hari Jumat"],"correct":0},{"prompt":"Rani berekreasi bersama …","options":["Guru","Teman sekolah","Keluarga"],"correct":2},{"prompt":"Apa kegiatan kapal dalam paragraf?","options":["Menanam buah","Menaikkan penumpang","Memberi makan ikan"],"correct":1},{"prompt":"Mengapa Rani mencatat kegiatan di pelabuhan?","options":["Untuk diceritakan di sekolah","Untuk menjual kapal","Untuk menghitung buah"],"correct":0}],"grade":"SMP","level":"Menengah","wordEntry":{"word":"Pelabuhan","emoji":"🚢","category":"Tempat","meaning":"Tempat kapal berlabuh untuk menaikkan atau menurunkan penumpang dan barang.","example":"Kapal berhenti di pelabuhan.","videoId":"XmiXc0YUrXY","start":585,"video":{"id":"XmiXc0YUrXY","title":"Memahami isi paragraf sederhana","creator":"Melalita Anggraeni","topic":"Pemahaman bacaan","sourceLevel":"SMPLB · Kelas 9","audience":"tunarungu","accessibility":"Isyarat & media visual","description":"Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.","sourceTitle":"VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"}},"relatedWords":[{"word":"Pelabuhan","emoji":"🚢","category":"Tempat","meaning":"Tempat kapal berlabuh untuk menaikkan atau menurunkan penumpang dan barang.","example":"Kapal berhenti di pelabuhan.","videoId":"XmiXc0YUrXY","start":585,"video":{"id":"XmiXc0YUrXY","title":"Memahami isi paragraf sederhana","creator":"Melalita Anggraeni","topic":"Pemahaman bacaan","sourceLevel":"SMPLB · Kelas 9","audience":"tunarungu","accessibility":"Isyarat & media visual","description":"Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.","sourceTitle":"VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"}},{"word":"Rekreasi","emoji":"🏖️","category":"Kegiatan","meaning":"Kegiatan untuk menyegarkan pikiran atau bersenang-senang.","example":"Kita berekreasi bersama keluarga.","videoId":"XmiXc0YUrXY","start":285,"video":{"id":"XmiXc0YUrXY","title":"Memahami isi paragraf sederhana","creator":"Melalita Anggraeni","topic":"Pemahaman bacaan","sourceLevel":"SMPLB · Kelas 9","audience":"tunarungu","accessibility":"Isyarat & media visual","description":"Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.","sourceTitle":"VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"}}],"example":"Kapal berhenti di pelabuhan.","video":{"id":"XmiXc0YUrXY","title":"Memahami isi paragraf sederhana","creator":"Melalita Anggraeni","topic":"Pemahaman bacaan","sourceLevel":"SMPLB · Kelas 9","audience":"tunarungu","accessibility":"Isyarat & media visual","description":"Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.","sourceTitle":"VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"}},{"id":"smp-rencana","aspect":"akademik","title":"Menghitung rencana rekreasi","description":"Gunakan waktu dan jumlah orang dalam konteks rekreasi.","emoji":"🏖️","word":"Rekreasi","words":["Rekreasi","Pelabuhan"],"time":10,"intro":"Kamu akan memakai kosakata rekreasi dan pelabuhan untuk berlatih menghitung waktu serta jumlah orang.","explanation":"Keluarga berangkat pukul 08.00 dan tiba di pelabuhan pukul 09.00. Perjalanan berlangsung 1 jam atau 60 menit. Ada 3 orang dewasa dan 2 anak; jumlahnya 5 orang.","tip":"Pisahkan informasi waktu dan jumlah orang. Tulis perhitungannya sebelum memilih jawaban.","visual":"🕗 → 🕘 🚢","practice":{"prompt":"Berangkat pukul 08.00 dan tiba pukul 09.00. Berapa lama perjalanan?","options":["30 menit","60 menit","120 menit"],"correct":1},"quiz":[{"prompt":"3 orang dewasa dan 2 anak berjumlah …","options":["4 orang","5 orang","6 orang"],"correct":1},{"prompt":"Perjalanan pukul 08.00 sampai 09.00 berlangsung …","options":["1 jam","2 jam","3 jam"],"correct":0},{"prompt":"Satu jam sama dengan …","options":["30 menit","90 menit","60 menit"],"correct":2},{"prompt":"Ada 8 orang. Dua orang pulang lebih dulu. Tersisa …","options":["10 orang","6 orang","4 orang"],"correct":1},{"prompt":"Perjalanan berlangsung 45 menit, lalu istirahat 15 menit. Total waktu …","options":["60 menit","30 menit","90 menit"],"correct":0}],"grade":"SMP","level":"Menengah","wordEntry":{"word":"Rekreasi","emoji":"🏖️","category":"Kegiatan","meaning":"Kegiatan untuk menyegarkan pikiran atau bersenang-senang.","example":"Kita berekreasi bersama keluarga.","videoId":"XmiXc0YUrXY","start":285,"video":{"id":"XmiXc0YUrXY","title":"Memahami isi paragraf sederhana","creator":"Melalita Anggraeni","topic":"Pemahaman bacaan","sourceLevel":"SMPLB · Kelas 9","audience":"tunarungu","accessibility":"Isyarat & media visual","description":"Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.","sourceTitle":"VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"}},"relatedWords":[{"word":"Rekreasi","emoji":"🏖️","category":"Kegiatan","meaning":"Kegiatan untuk menyegarkan pikiran atau bersenang-senang.","example":"Kita berekreasi bersama keluarga.","videoId":"XmiXc0YUrXY","start":285,"video":{"id":"XmiXc0YUrXY","title":"Memahami isi paragraf sederhana","creator":"Melalita Anggraeni","topic":"Pemahaman bacaan","sourceLevel":"SMPLB · Kelas 9","audience":"tunarungu","accessibility":"Isyarat & media visual","description":"Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.","sourceTitle":"VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"}},{"word":"Pelabuhan","emoji":"🚢","category":"Tempat","meaning":"Tempat kapal berlabuh untuk menaikkan atau menurunkan penumpang dan barang.","example":"Kapal berhenti di pelabuhan.","videoId":"XmiXc0YUrXY","start":585,"video":{"id":"XmiXc0YUrXY","title":"Memahami isi paragraf sederhana","creator":"Melalita Anggraeni","topic":"Pemahaman bacaan","sourceLevel":"SMPLB · Kelas 9","audience":"tunarungu","accessibility":"Isyarat & media visual","description":"Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.","sourceTitle":"VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"}}],"example":"Kita berekreasi bersama keluarga.","video":{"id":"XmiXc0YUrXY","title":"Memahami isi paragraf sederhana","creator":"Melalita Anggraeni","topic":"Pemahaman bacaan","sourceLevel":"SMPLB · Kelas 9","audience":"tunarungu","accessibility":"Isyarat & media visual","description":"Amati rekaman pembelajaran kelas 9 tunarungu untuk memahami paragraf sederhana dengan interaksi isyarat dan media visual.","sourceTitle":"VIDEO PEMBELAJARAN SISWA TUNARUNGU KELAS IX BAHASA INDONESIA"}}],"SMA":[{"id":"sma-kosakata","aspect":"kosakata","title":"Kosakata isyarat dalam konteks","description":"Bedakan kosakata tempat dan buah pada video SMALB-B.","emoji":"📍","word":"Purwakarta","words":["Purwakarta","Jambu","Inggris"],"time":8,"intro":"Kamu akan mengamati kosakata isyarat dan membedakan maknanya berdasarkan konteks serta kategori.","explanation":"Purwakarta adalah nama kabupaten di Jawa Barat. Inggris adalah nama negara yang merupakan bagian dari Britania Raya. Jambu adalah nama buah; gambar pada video menunjukkan jambu air.","tip":"Cocokkan kata, gambar, dan kategori. Nama tempat dan nama buah memiliki konteks yang berbeda.","visual":"📍 🍎 🇬🇧","practice":{"prompt":"Kata yang termasuk nama buah adalah …","options":["Purwakarta","Jambu","Inggris"],"correct":1},"quiz":[{"prompt":"Purwakarta merupakan nama …","options":["Buah","Kabupaten","Peristiwa alam"],"correct":1},{"prompt":"Kata yang termasuk nama buah adalah …","options":["Jambu","Inggris","Purwakarta"],"correct":0},{"prompt":"Nama negara pada materi kosakata isyarat adalah …","options":["Jambu","Purwakarta","Inggris"],"correct":2},{"prompt":"Pasangan kata yang termasuk kategori tempat adalah …","options":["Jambu dan hujan","Purwakarta dan Inggris","Banjir dan jambu"],"correct":1},{"prompt":"Untuk memahami makna kata dalam video, kita mencocokkan …","options":["Kata, gambar, dan konteks","Suara saja","Urutan warna saja"],"correct":0}],"grade":"SMA","level":"Lanjutan","wordEntry":{"word":"Purwakarta","emoji":"📍","category":"Tempat","meaning":"Nama kabupaten di Provinsi Jawa Barat.","example":"Purwakarta diperagakan dalam video kosakata isyarat.","videoId":"EBTZFitRSEc","start":80,"video":{"id":"EBTZFitRSEc","title":"Kosakata sehari-hari dalam bahasa isyarat","creator":"SLBN BOGOR","topic":"Kosakata dan komunikasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.","sourceTitle":"#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"}},"relatedWords":[{"word":"Purwakarta","emoji":"📍","category":"Tempat","meaning":"Nama kabupaten di Provinsi Jawa Barat.","example":"Purwakarta diperagakan dalam video kosakata isyarat.","videoId":"EBTZFitRSEc","start":80,"video":{"id":"EBTZFitRSEc","title":"Kosakata sehari-hari dalam bahasa isyarat","creator":"SLBN BOGOR","topic":"Kosakata dan komunikasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.","sourceTitle":"#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"}},{"word":"Jambu","emoji":"🍎","category":"Buah","meaning":"Nama kelompok buah; pada video ditunjukkan gambar jambu air.","example":"Gambar jambu membantu mengenali kata yang diperagakan.","videoId":"EBTZFitRSEc","start":110,"video":{"id":"EBTZFitRSEc","title":"Kosakata sehari-hari dalam bahasa isyarat","creator":"SLBN BOGOR","topic":"Kosakata dan komunikasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.","sourceTitle":"#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"}},{"word":"Inggris","emoji":"🇬🇧","category":"Tempat","meaning":"Nama negara yang merupakan bagian dari Britania Raya.","example":"Kata Inggris diperagakan bersama gambar bendera dalam video.","videoId":"EBTZFitRSEc","start":170,"video":{"id":"EBTZFitRSEc","title":"Kosakata sehari-hari dalam bahasa isyarat","creator":"SLBN BOGOR","topic":"Kosakata dan komunikasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.","sourceTitle":"#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"}}],"example":"Purwakarta diperagakan dalam video kosakata isyarat.","video":{"id":"EBTZFitRSEc","title":"Kosakata sehari-hari dalam bahasa isyarat","creator":"SLBN BOGOR","topic":"Kosakata dan komunikasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat, gambar & teks","description":"Belajar kosakata tempat dan buah melalui gambar dan peragaan isyarat bersama peserta didik SMALB-B tunarungu dari SLBN Bogor.","sourceTitle":"#05_GURLING | BELAJAR BAHASA ISYARAT ALA PESERTA DIDIK SLBN BOGOR - SMALB B (TUNARUNGU) - SLBN BOGOR"}},{"id":"sma-kalimat","aspect":"kalimat","title":"Kalimat sebab dan akibat","description":"Hubungkan hujan dan banjir dalam kalimat yang logis.","emoji":"🌧️","word":"Hujan","words":["Hujan","Banjir","Eksplanasi"],"time":10,"intro":"Kamu akan membedakan penyebab dan akibat menggunakan kosakata pada materi eksplanasi.","explanation":"“Air sulit mengalir karena saluran tersumbat.” menyatakan penyebab. “Hujan deras membuat air bertambah sehingga jalan tergenang.” menunjukkan hubungan sebab dan akibat.","tip":"Cari kata “karena” untuk penyebab dan “sehingga” untuk akibat. Baca seluruh kalimat agar hubungan informasinya jelas.","visual":"🌧️ → 🌊","practice":{"prompt":"Kata penghubung untuk melengkapi “Air sulit mengalir … saluran tersumbat.” adalah …","options":["karena","tetapi","atau"],"correct":0},"quiz":[{"prompt":"Kata penghubung yang menyatakan penyebab adalah …","options":["Dan","Karena","Atau"],"correct":1},{"prompt":"Dalam “Air sulit mengalir karena saluran tersumbat.”, penyebabnya adalah …","options":["Saluran tersumbat","Air sulit mengalir","Langit cerah"],"correct":0},{"prompt":"Dalam “Hujan deras turun sehingga jalan tergenang.”, akibatnya adalah …","options":["Hujan turun","Langit cerah","Jalan tergenang"],"correct":2},{"prompt":"Kalimat yang menunjukkan hubungan sebab dan akibat adalah …","options":["Jambu berada di meja.","Saluran tersumbat sehingga air sulit mengalir.","Rani melihat gambar."],"correct":1},{"prompt":"Kata “sehingga” pada kalimat tersebut membantu menjelaskan …","options":["Akibat","Nama tempat","Pilihan buah"],"correct":0}],"grade":"SMA","level":"Lanjutan","wordEntry":{"word":"Hujan","emoji":"🌧️","category":"Peristiwa","meaning":"Air yang jatuh dari awan ke permukaan bumi dalam bentuk titik-titik air.","example":"Hujan merupakan salah satu peristiwa alam.","videoId":"cvwI6-6lfGY","start":165,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},"relatedWords":[{"word":"Hujan","emoji":"🌧️","category":"Peristiwa","meaning":"Air yang jatuh dari awan ke permukaan bumi dalam bentuk titik-titik air.","example":"Hujan merupakan salah satu peristiwa alam.","videoId":"cvwI6-6lfGY","start":165,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},{"word":"Banjir","emoji":"🌊","category":"Peristiwa","meaning":"Peristiwa meluapnya air sehingga menggenangi wilayah yang biasanya kering.","example":"Air yang meluap dapat menyebabkan banjir.","videoId":"cvwI6-6lfGY","start":165,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},{"word":"Eksplanasi","emoji":"📝","category":"Teks","meaning":"Penjelasan tentang bagaimana atau mengapa suatu peristiwa terjadi.","example":"Teks eksplanasi menjelaskan proses terjadinya hujan.","videoId":"cvwI6-6lfGY","start":75,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}}],"example":"Hujan merupakan salah satu peristiwa alam.","video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},{"id":"sma-eksplanasi","aspect":"bacaan","title":"Memahami teks eksplanasi","description":"Temukan proses dan sebab peristiwa dalam bacaan sederhana.","emoji":"📝","word":"Eksplanasi","words":["Eksplanasi","Hujan","Banjir"],"time":12,"intro":"Kamu akan membaca contoh eksplanasi yang dibuat untuk latihan dengan kosakata dari video dan Kamus Visual SMA.","explanation":"Hujan deras menambah jumlah air di suatu wilayah. Air biasanya mengalir melalui saluran. Jika saluran tersumbat, air sulit mengalir dan dapat meluap. Luapan air menggenangi jalan yang biasanya kering. Peristiwa ini disebut banjir.","tip":"Temukan peristiwa yang dibahas, lalu urutkan prosesnya. Bedakan penyebab dengan akibat.","visual":"🌧️ 📝 🌊","practice":{"prompt":"Peristiwa yang dijelaskan pada bacaan adalah …","options":["Panen jambu","Banjir","Rekreasi"],"correct":1},"quiz":[{"prompt":"Tujuan contoh teks tersebut adalah …","options":["Menceritakan liburan","Menjelaskan proses banjir","Menjual buah"],"correct":1},{"prompt":"Apa yang menambah jumlah air menurut bacaan?","options":["Hujan deras","Panen jambu","Kapal berlabuh"],"correct":0},{"prompt":"Mengapa air sulit mengalir dalam bacaan?","options":["Udara dingin","Langit cerah","Saluran tersumbat"],"correct":2},{"prompt":"Akibat air meluap pada bacaan adalah …","options":["Buah tumbuh","Jalan tergenang","Kapal berlayar"],"correct":1},{"prompt":"Teks eksplanasi menjelaskan …","options":["Bagaimana atau mengapa peristiwa terjadi","Daftar nama buah saja","Perintah meminta izin saja"],"correct":0}],"grade":"SMA","level":"Lanjutan","wordEntry":{"word":"Eksplanasi","emoji":"📝","category":"Teks","meaning":"Penjelasan tentang bagaimana atau mengapa suatu peristiwa terjadi.","example":"Teks eksplanasi menjelaskan proses terjadinya hujan.","videoId":"cvwI6-6lfGY","start":75,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},"relatedWords":[{"word":"Eksplanasi","emoji":"📝","category":"Teks","meaning":"Penjelasan tentang bagaimana atau mengapa suatu peristiwa terjadi.","example":"Teks eksplanasi menjelaskan proses terjadinya hujan.","videoId":"cvwI6-6lfGY","start":75,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},{"word":"Hujan","emoji":"🌧️","category":"Peristiwa","meaning":"Air yang jatuh dari awan ke permukaan bumi dalam bentuk titik-titik air.","example":"Hujan merupakan salah satu peristiwa alam.","videoId":"cvwI6-6lfGY","start":165,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},{"word":"Banjir","emoji":"🌊","category":"Peristiwa","meaning":"Peristiwa meluapnya air sehingga menggenangi wilayah yang biasanya kering.","example":"Air yang meluap dapat menyebabkan banjir.","videoId":"cvwI6-6lfGY","start":165,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}}],"example":"Teks eksplanasi menjelaskan proses terjadinya hujan.","video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},{"id":"sma-data","aspect":"akademik","title":"Membaca data dalam laporan","description":"Hitung dan bandingkan data contoh dalam konteks hujan.","emoji":"📊","word":"Hujan","words":["Hujan","Banjir","Eksplanasi"],"time":12,"intro":"Kamu akan membandingkan angka pada data contoh dan menulis kesimpulan yang sesuai.","explanation":"Data latihan: Senin 10 mm, Selasa 20 mm, Rabu 30 mm. Totalnya 60 mm. Rata-rata tiga hari adalah 60 ÷ 3 = 20 mm. Data ini hanya untuk latihan dan tidak dipakai untuk memprediksi banjir.","tip":"Jumlahkan semua nilai untuk total. Bagi total dengan jumlah hari untuk rata-rata. Kesimpulan harus sesuai data.","visual":"📊 🌧️","practice":{"prompt":"Total data 10 mm, 20 mm, dan 30 mm adalah …","options":["30 mm","60 mm","90 mm"],"correct":1},"quiz":[{"prompt":"Nilai tertinggi pada data latihan terjadi pada …","options":["Senin","Rabu","Selasa"],"correct":1},{"prompt":"Selisih nilai Rabu dan Senin adalah …","options":["20 mm","10 mm","40 mm"],"correct":0},{"prompt":"Total data ketiga hari adalah …","options":["30 mm","50 mm","60 mm"],"correct":2},{"prompt":"Rata-rata data ketiga hari adalah …","options":["10 mm","20 mm","30 mm"],"correct":1},{"prompt":"Kesimpulan yang sesuai dengan data latihan adalah …","options":["Nilai Rabu lebih besar daripada Senin.","Senin memiliki nilai terbesar.","Semua hari memiliki nilai sama."],"correct":0}],"grade":"SMA","level":"Lanjutan","wordEntry":{"word":"Hujan","emoji":"🌧️","category":"Peristiwa","meaning":"Air yang jatuh dari awan ke permukaan bumi dalam bentuk titik-titik air.","example":"Hujan merupakan salah satu peristiwa alam.","videoId":"cvwI6-6lfGY","start":165,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},"relatedWords":[{"word":"Hujan","emoji":"🌧️","category":"Peristiwa","meaning":"Air yang jatuh dari awan ke permukaan bumi dalam bentuk titik-titik air.","example":"Hujan merupakan salah satu peristiwa alam.","videoId":"cvwI6-6lfGY","start":165,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},{"word":"Banjir","emoji":"🌊","category":"Peristiwa","meaning":"Peristiwa meluapnya air sehingga menggenangi wilayah yang biasanya kering.","example":"Air yang meluap dapat menyebabkan banjir.","videoId":"cvwI6-6lfGY","start":165,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}},{"word":"Eksplanasi","emoji":"📝","category":"Teks","meaning":"Penjelasan tentang bagaimana atau mengapa suatu peristiwa terjadi.","example":"Teks eksplanasi menjelaskan proses terjadinya hujan.","videoId":"cvwI6-6lfGY","start":75,"video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}}],"example":"Hujan merupakan salah satu peristiwa alam.","video":{"id":"cvwI6-6lfGY","title":"Memahami teks eksplanasi","creator":"SMALB KM","topic":"Teks eksplanasi","sourceLevel":"SMALB-B","audience":"tunarungu","accessibility":"Isyarat & teks pada layar","description":"Pelajari teks eksplanasi dari SMALB-B Karya Mulia Surabaya melalui penjelasan isyarat dan teks yang tampil di layar.","sourceTitle":"Video Bahasa Indonesia SMALB_B Karya Mulia Surabaya"}}]},"bank":{"SD":{"kosakata":[{"prompt":"Pilih kata yang sesuai dengan gambar ini.","visual":"🥭","options":["Mangga","Sepatu","Buku"],"correct":0},{"prompt":"Apa arti “menyiram”?","visual":"🪴💧","options":["Memetik bunga","Memberi air pada tanaman","Membaca buku"],"correct":1},{"prompt":"Pilih nama benda ini.","visual":"✏️","options":["Tas","Pensil","Kursi"],"correct":1}],"kalimat":[{"prompt":"“Ayam makan jagung.” Siapa yang makan?","visual":"🐔 🌽","options":["Jagung","Ayam","Kandang"],"correct":1},{"prompt":"“Sebelum makan, Budi mencuci tangan.” Apa yang dilakukan lebih dulu?","visual":"🧼 → 🍽️","options":["Makan","Tidur","Mencuci tangan"],"correct":2},{"prompt":"Pilih susunan kalimat yang benar.","visual":"🐟 🌊","options":["Ikan berenang di kolam.","Kolam ikan berenang.","Berenang di ikan kolam."],"correct":0}],"bacaan":[{"prompt":"Dina pergi ke kebun. Ia melihat pohon mangga berbuah lebat. Di mana Dina berada?","visual":"👧 🌳 🥭","options":["Pasar","Kebun","Sekolah"],"correct":1},{"prompt":"Bunga layu karena tanahnya kering. Dina memberi air agar bunga kembali segar. Mengapa Dina memberi air?","visual":"🌷 💧","options":["Agar bunga segar","Agar tanah kering","Untuk dibuang"],"correct":0},{"prompt":"Budi memelihara dua ekor kelinci di rumah. Hewan apa yang dipelihara Budi?","visual":"👦 🐰","options":["Kucing","Burung","Kelinci"],"correct":2}],"akademik":[{"prompt":"Dua jeruk ditambah satu jeruk. Berapa jumlahnya?","visual":"🍊🍊 + 🍊","options":["2","3","4"],"correct":1},{"prompt":"Ada 6 buah mangga. Tiga mangga dibagikan kepada teman. Berapa sisa mangga?","visual":"🥭🥭🥭🥭🥭🥭 − 3","options":["2","4","3"],"correct":2},{"prompt":"Satu buah apel ditambah satu buah apel. Berapa jumlahnya?","visual":"🍎 + 🍎","options":["2","3","1"],"correct":0}]},"SMP":{"kosakata":[{"prompt":"Kata yang berarti “berperilaku baik dan menghargai orang lain” adalah …","visual":"🤝 🏫","options":["Sopan","Sombong","Marah"],"correct":0},{"prompt":"Kata “pelabuhan” bermakna tempat untuk …","visual":"🚢 ⚓","options":["Membeli buku sekolah","Kapal bersandar dan menaikkan penumpang","Menanam bibit padi"],"correct":1},{"prompt":"Saat membutuhkan bantuan orang lain dengan santun, kita mengucapkan …","visual":"🙋 💬","options":["Tolong","Pergi","Awas"],"correct":0}],"kalimat":[{"prompt":"“Rani meminjam buku kamus di perpustakaan.” Benda apa yang dipinjam Rani?","visual":"👧 📚 🏛️","options":["Perpustakaan","Buku kamus","Rani"],"correct":1},{"prompt":"Manakah kalimat berpola Subjek – Predikat – Objek – Keterangan (S-P-O-K)?","visual":"📝 🏫","options":["Siswa menulis cerita di kelas.","Di kelas siswa cerita.","Menulis cerita siswa di kelas."],"correct":0},{"prompt":"Pilih kalimat tanya yang tepat untuk menanyakan tempat.","visual":"❓ 📍","options":["Di mana sekolah barumu?","Siapa namamu?","Berapa harga bukumu?"],"correct":0}],"bacaan":[{"prompt":"Pada hari Minggu, Rani berekreasi bersama keluarga ke pantai. Mereka berangkat pagi hari agar udara masih sejuk. Kapan Rani berekreasi?","visual":"🏖️ ☀️","options":["Hari Senin siang","Hari Minggu pagi","Hari Jumat malam"],"correct":1},{"prompt":"Nelayan di pesisir mencari ikan pada malam hari dan kembali ke pelabuhan saat fajar. Mengapa nelayan kembali saat fajar?","visual":"🚢 🌅 🐟","options":["Karena sudah selesai mencari ikan dan menjual hasilnya","Karena ingin berenang di pantai","Karena tersesat di tengah laut"],"correct":0},{"prompt":"Andi mencatat jadwal piket kebersihan di papan kelas. Apa tujuan Andi mencatat jadwal tersebut?","visual":"📋 🧹","options":["Agar kelas tetap bersih dan rapi","Untuk membeli makanan","Agar bisa tidur di kelas"],"correct":0}],"akademik":[{"prompt":"Perjalanan dari sekolah ke pelabuhan berangkat pukul 08.00 dan tiba pukul 09.30. Berapa lama perjalanan?","visual":"🕗 → 🕤","options":["1 jam","1 jam 30 menit","2 jam"],"correct":1},{"prompt":"Sebuah kotak berisi 12 pensil warna. Jika ada 3 kotak yang sama, berapa total pensil warna?","visual":"📦 12 × 3","options":["24 pensil","36 pensil","48 pensil"],"correct":1},{"prompt":"Ibu membeli 15 buah apel, lalu dibagikan sama rata kepada 3 anak. Berapa apel yang diterima tiap anak?","visual":"🍎 15 ÷ 3","options":["5 apel","4 apel","6 apel"],"correct":0}]},"SMA":{"kosakata":[{"prompt":"Teks yang menjelaskan proses terjadinya suatu fenomena alam atau sosial disebut …","visual":"📝 🌧️","options":["Teks narasi fiksi","Teks eksplanasi","Teks puisi"],"correct":1},{"prompt":"Dalam dunia publikasi dan bisnis, media “iklan komersial” bertujuan untuk …","visual":"📢 💼","options":["Menghibur diri sendiri","Mempromosikan produk atau jasa kepada khalayak","Menyimpan berkas pribadi"],"correct":1},{"prompt":"Kerangka bentuk atau rancangan visual suatu karya media cetak disebut …","visual":"🎨 📐","options":["Desain","Suara","Piknik"],"correct":0}],"kalimat":[{"prompt":"“Curah hujan tinggi menyebabkan air sungai meluap sehingga wilayah pemukiman tergenang banjir.” Kalimat tersebut menunjukkan hubungan …","visual":"🌧️ 🌊 🏠","options":["Sebab dan akibat","Perbandingan harga","Ungkapan salam"],"correct":0},{"prompt":"Manakah kalimat yang menyatakan fakta secara objektif?","visual":"📊 📑","options":["Pameran karya siswa berlangsung pada tanggal 10 hingga 12 November.","Menurut saya lukisan itu paling hebat di dunia.","Mungkin esok hari semua orang akan datang."],"correct":0},{"prompt":"Pilihlah kalimat ajakan yang efektif dalam poster promosi kegiatan sekolah.","visual":"📢 🎨","options":["Ayo kunjungi bazar karya siswa kreatif di aula sekolah!","Kemarin mereka tidak datang ke aula.","Buku itu tertinggal di atas meja."],"correct":0}],"bacaan":[{"prompt":"Daur air dimulai dari penguapan air permukaan karena panas matahari. Uap air naik ke atmosfer, membentuk awan, lalu turun kembali sebagai hujan. Apa faktor utama penguapan air?","visual":"☀️ 🌊 ☁️ 🌧️","options":["Tiupan angin malam","Panas sinar matahari","Tekanan air tanah"],"correct":1},{"prompt":"Desain kemasan produk harus memuat informasi komposisi, tanggal kedaluwarsa, dan identitas produsen agar konsumen terlindungi. Mengapa informasi kedaluwarsa sangat penting?","visual":"🏷️ 📅","options":["Mengetahui batas waktu keamanan konsumsi produk","Menghias tampilan warna wadah kemasan","Menambah bobot timbangan barang"],"correct":0},{"prompt":"Pelatihan bahasa isyarat di lingkungan kerja membantu menciptakan komunikasi yang inklusif dan setara bagi rekan kerja Tuli. Apa dampak positif pelatihan tersebut?","visual":"🤝 🏢","options":["Menumbuhkan lingkungan kerja yang inklusif dan saling memahami","Menghapus jam istirahat kerja","Membatasi pergaulan antarkaryawan"],"correct":0}],"akademik":[{"prompt":"Harga sebuah buku adalah Rp20.000. Toko memberikan potongan harga 10%. Berapa jumlah potongan harganya?","visual":"🏷️ Rp20.000 × 10%","options":["Rp1.000","Rp2.000","Rp5.000"],"correct":1},{"prompt":"Seorang desainer grafis membutuhkan waktu 45 menit untuk membuat 1 halaman menu. Berapa lama waktu yang dibutuhkan untuk menyelesaikan 4 halaman?","visual":"⏱️ 45 menit × 4","options":["2 jam","3 jam (180 menit)","4 jam 30 menit"],"correct":1},{"prompt":"Modal awal pembuatan suvenir adalah Rp50.000. Setelah dijual, diperoleh pendapatan Rp75.000. Berapa keuntungan yang didapat?","visual":"💰 Rp75.000 − Rp50.000","options":["Rp25.000","Rp15.000","Rp30.000"],"correct":0}]}}};
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

// END COMPLETENESS
// END EXPANDED STATES
return {dialogs:desktopPage.children.filter(n=>n.type==='FRAME' && n.name.startsWith('Dialog / ')).length,desktop:desktopPage.children.filter(n=>n.type==='FRAME' && (n.name.startsWith('UX / ') || /^\d{2} \/ /.test(n.name))).length,mobile:mobilePage.children.filter(n=>n.type==='FRAME' && n.name.startsWith('Mobile')).length};

}
main().then(result=>{figma.showUI("<div style=\"font:15px sans-serif;padding:24px;color:#0f172a\"><h2>Desain BahasaKita diperbarui</h2><p>"+result.desktop+" layar desktop · "+result.mobile+" layar mobile · "+result.dialogs+" dialog</p><p>Materi SD, SMP, dan SMA mengikuti kode aplikasi. Tutup panel ini untuk melihat dan mencoba desain.</p></div>",{width:520,height:260});}).catch(error=>{console.error(error);figma.showUI("<pre style=\"font:13px monospace;white-space:pre-wrap;padding:20px\">"+(String(error.message||error)+"\n"+String(error.stack||"")).replace(/&/g,"&amp;").replace(/</g,"&lt;")+"</pre>",{width:700,height:420});});
