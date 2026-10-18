import {authRequest,saveSession} from '@/app/chatgpt-auth';
import {json,fail,mutation,text} from '@/lib/server';
export async function POST(r:Request){try{mutation(r);const b=await r.json();const email=text(b.email,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Podaj prawidłowy adres e-mail.');
 if(b.action==='send'){const response=await authRequest('otp',{email,create_user:true});if(!response.ok)return json({error:'Nie udało się wysłać kodu. Spróbuj później; sprawdź też konfigurację poczty Supabase.'},429);return json({ok:true});}
 if(b.action!=='verify')throw new Error('Nieprawidłowa operacja.');const token=text(b.token,10);if(!/^\d{6,10}$/.test(token))throw new Error('Wpisz kod z wiadomości.');const response=await authRequest('verify',{email,token,type:'email'});if(!response.ok)return json({error:'Kod jest nieprawidłowy lub wygasł. Poproś o nowy.'},401);const session=await response.json();if(!session.access_token||!session.refresh_token)throw new Error('Nie udało się otworzyć sesji.');await saveSession(session);return json({ok:true});
 }catch(e){return fail(e);}}
