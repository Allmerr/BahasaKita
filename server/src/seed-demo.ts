import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'node:crypto'
import { writeFileSync } from 'node:fs'
const names=['Dina','Bima','Sari','Raka','Nadia','Fajar','Ayu','Rizki','Laras','Dimas','Intan','Bagas','Putri','Arif','Maya','Rio','Nisa','Ilham','Citra','Yoga','Tari','Rafi','Wulan','Aditya']
const rows=names.map((name,i)=>({email:`demo.siswa${String(i+1).padStart(2,'0')}@bahasakita.example`,name:`${name} Demo`,grade:['SD','SMP','SMA'][i%3],goal:['Mengenal kata','Memahami cerita','Belajar matematika'][Math.floor(i/3)%3]}))
if(!process.argv.includes('--apply')){console.log(JSON.stringify({mode:'preview',accounts:rows},null,2));process.exit(0)}
const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY
if(!url||!key)throw Error('Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di server/.env terlebih dahulu.')
const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
const existing=new Map<string,string>()
for(let page=1;;page++){const {data,error}=await client.auth.admin.listUsers({page,perPage:1000});if(error)throw error;for(const user of data.users)if(user.email)existing.set(user.email,user.id);if(data.users.length<1000)break}
const credentials:{email:string,password:string}[]=[]
const output=`demo-credentials-${Date.now()}.local.json`
for(const row of rows){
 if(existing.has(row.email)){console.log('Dilewati (sudah ada): '+row.email);continue}
 const password=randomBytes(18).toString('base64url')+'!a9'
 const {data,error}=await client.auth.admin.createUser({email:row.email,password,email_confirm:true,user_metadata:{name:row.name,grade:row.grade,goal:row.goal,demo_seed:'bahasakita-v1'}})
 if(error||!data.user)throw error||Error('Akun gagal dibuat.')
 credentials.push({email:row.email,password});writeFileSync(output,JSON.stringify(credentials,null,2))
 const profile=await client.from('learner_profiles').update({name:row.name,grade:row.grade,goal:row.goal,preferences:{textSize:credentials.length%2?'normal':'large',theme:'light',speed:'1',comfortable:false,contrast:false,language:'default',dataSaver:false}}).eq('user_id',data.user.id)
 if(profile.error)throw profile.error
 console.log('Dibuat: '+row.email)
}
console.log(`${credentials.length} akun dibuat. Kredensial baru tersimpan di ${output}; jangan commit atau bagikan publik.`)
