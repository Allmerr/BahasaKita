export const preferences={textSize:'normal',theme:'light',speed:'1',comfortable:false,contrast:false,language:'default',dataSaver:false}
export const profile={name:'Dina',grade:'SD',goal:'Mengenal kata',email:'dina@example.test',avatar_path:null,avatar_url:null}
export const scores={kosakata:100,kalimat:100,bacaan:100,akademik:100}
export const question={id:'11111111-1111-4111-8111-111111111111',prompt:'Pilih buah pada gambar.',visual:'🥭',options:['Mangga','Ayam','Ikan'],aspect:'kosakata',format:'choice'}
export const entry={word:'Mangga',emoji:'🥭',category:'Buah',meaning:'Buah yang tumbuh di pohon.',example:'Dina makan mangga.',videoId:'dQw4w9WgXcQ',start:12,video:{title:'Video kosakata'}}
export const lesson={id:'sd-buah',versionId:'22222222-2222-4222-8222-222222222222',version:1,title:'Mengenal buah',grade:'SD',aspect:'kosakata',description:'Belajar nama buah.',emoji:'🥭',visual:'🥭 🍊',intro:'Mari mengenal buah.',explanation:'Mangga dan jeruk adalah buah.',tip:'Baca nama buah.',example:'Saya makan mangga.',word:'Mangga',words:['Mangga'],wordEntry:entry,relatedWords:[entry],practice:{...question},quiz:Array.from({length:5},(_,i)=>({...question,id:'quiz-'+i,visual:''})),time:8,level:'Dasar'}
export const onlineState={assessment:scores,assessmentDraft:null,activeAssessment:null,mastered:[],attempts:[],legacy:null}
