import { randomUUID } from 'node:crypto'
export function previewContent(){
 const make=(grade:string,aspect:string,kind:string,slot:string|null=null,position=0)=>({id:randomUUID(),revision:1,status:'published',kind,grade,aspect,slot,position,format:'choice',prompt:'Pilih jawaban.',options:['Pilihan A','Pilihan B'],answer:1,data:{visual:'🥭'}})
 const questions=['SD','SMP','SMA'].flatMap(grade=>['kosakata','kalimat','bacaan','akademik'].flatMap(aspect=>['first','advanced','remedial'].map(slot=>make(grade,aspect,'assessment',slot))))
 const lessons=['SD','SMP','SMA'].map(grade=>({id:randomUUID(),slug:grade.toLowerCase()+'-buah',revision:1,status:'published',kind:'lesson',grade,aspect:'kosakata',title:'Mengenal buah',data:{intro:'Mari mengenal buah.',explanation:'Mangga adalah buah.',visual:'🥭 🍊',wordEntry:{word:'Mangga',videoId:'dQw4w9WgXcQ',video:{title:'Kosakata'}}},questions:[{...make(grade,'kosakata','practice'),format:'order',options:[],answer:'Dina makan mangga',data:{words:['mangga','Dina','makan']}},...Array.from({length:5},(_,i)=>make(grade,'kosakata','quiz',null,i))]}))
 return {questions,lessons}
}
