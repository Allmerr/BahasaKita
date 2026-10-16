import { useEffect, useRef, useState } from 'react'
import { useAccount } from './Account'
export default function SupportChat({ linkId, name }) {
 const { accountApi, session } = useAccount(), api = useRef(accountApi)
 api.current = accountApi
 const [messages,setMessages]=useState([]),[body,setBody]=useState(''),[error,setError]=useState(''),[sending,setSending]=useState(false),[loading,setLoading]=useState(true),[older,setOlder]=useState(false),[available,setAvailable]=useState(false)
 const request=useRef(null),pending=useRef(false),mounted=useRef(false),olderBusy=useRef(false),initialized=useRef(false)
 const merge=items=>setMessages(previous=>[...new Map([...previous,...items].map(m=>[m.id,m])).values()].sort((a,b)=>BigInt(a.id)<BigInt(b.id)?-1:1))
 useEffect(()=>{
  mounted.current=true;let active=true,timer;const controller=new AbortController()
  const poll=async()=>{
   try {const data=await api.current('/support/chat/'+linkId,undefined,{signal:controller.signal});if(active){merge(data.messages);if(!initialized.current){setOlder(data.hasOlder);initialized.current=true;}setAvailable(true);setError('')}}
   catch(e){if(active){setError(e.message);setAvailable(false);setMessages([]);initialized.current=false}}
   finally{if(active){setLoading(false);timer=setTimeout(poll,5000)}}
  }
  poll();return()=>{active=false;mounted.current=false;clearTimeout(timer);controller.abort()}
 },[linkId])
 const send=async e=>{
  e.preventDefault();if(pending.current||!body.trim()||!available)return
  const text=body.trim();if(request.current?.body!==text)request.current={body:text,requestId:crypto.randomUUID()}
  pending.current=true;setSending(true);setError('')
  try{const result=await api.current('/support/chat/'+linkId,request.current,{method:'POST'});if(mounted.current){merge([result]);setBody('');request.current=null}}
  catch(e){if(mounted.current)setError(e.message)}finally{pending.current=false;if(mounted.current)setSending(false)}
 }
 const loadOlder=async()=>{
  if(olderBusy.current||!messages.length)return;olderBusy.current=true;setLoading(true)
  try{const result=await api.current('/support/chat/'+linkId+'?before='+messages[0].id);if(mounted.current){merge(result.messages);setOlder(result.hasOlder)}}
  catch(e){if(mounted.current)setError(e.message)}finally{olderBusy.current=false;if(mounted.current)setLoading(false)}
 }
 return <section className="panel support-section support-chat"><h2>Chat dengan {name}</h2><p>Pesan teks pribadi untuk mendampingi belajar. Percakapan diperbarui otomatis setiap 5 detik.</p>{older&&available&&<button className="btn secondary" disabled={loading} onClick={loadOlder}>Muat pesan sebelumnya</button>}{loading&&<p role="status">Memuat pesan…</p>}{error&&<p role="alert">{error}</p>}<div className="chat-history" role="log" aria-label={'Percakapan dengan '+name} aria-live="polite" aria-relevant="additions">{!messages.length&&!loading&&available&&<p>Belum ada pesan. Mulai percakapanmu.</p>}{messages.map(m=><article key={m.id} className={'chat-message '+(m.sender_id===session?.user.id?'mine':'')}><strong>{m.sender_id===session?.user.id?'Anda':name}</strong><p>{m.body}</p><time dateTime={m.created_at}>{new Date(m.created_at).toLocaleString('id-ID')}</time></article>)}</div><form onSubmit={send}><label className="field">Pesan<textarea value={body} onChange={e=>setBody(e.target.value)} maxLength={2000} rows={3} disabled={sending} placeholder="Tulis pertanyaan atau bantuan belajar…"/></label><span className="muted">{body.length}/2000 karakter</span><div className="form-actions"><button className="btn" disabled={sending||!available||!body.trim()}>{sending?'Mengirim…':'Kirim pesan'}</button></div></form></section>
}
