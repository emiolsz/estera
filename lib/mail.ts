import {mailProvider} from './services';
const mailText='W załączeniu znajdziesz wybrany zapis snu i interpretację, jeśli została wygenerowana. Zachowaj PDF w swoim dzienniku.\n\nPoznaj także Soul Decoder Estera — wybierz opracowanie dla siebie:\nhttps://soul-decoder-estera.vercel.app/\n\nEstera';
export async function sendJournalPDF(email:string,content:string,requestId:string){
 const e=process.env,provider=mailProvider();
 if(!provider)throw new Error('Wysyłka e-mail czeka na konfigurację. Możesz pobrać PDF.');
 let response:Response;
 if(provider==='brevo'){
  const match=e.MAIL_FROM!.match(/<([^<>]+)>/);const from=(match?match[1]:e.MAIL_FROM!).trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from))throw new Error('Adres nadawcy poczty wymaga sprawdzenia konfiguracji.');
  response=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':e.BREVO_API_KEY!,'Content-Type':'application/json'},body:JSON.stringify({sender:{email:from,name:'Pracownia Estery'},to:[{email}],subject:'Twój osobisty dziennik — Pracownia Estery',textContent:mailText,htmlContent:'<p>W załączeniu znajdziesz wybrany zapis snu i interpretację, jeśli została wygenerowana.</p><p>Poznaj także <a href="https://soul-decoder-estera.vercel.app/">Soul Decoder Estera</a>.</p><p>Estera</p>',attachment:[{name:'dziennik-estery.pdf',content}],headers:{IdempotencyKey:requestId}}),signal:AbortSignal.timeout(20000)});
 }else{
  response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+e.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':requestId},body:JSON.stringify({from:e.MAIL_FROM,to:[email],subject:'Twój osobisty dziennik — Pracownia Estery',text:mailText,attachments:[{filename:'dziennik-estery.pdf',content}]}),signal:AbortSignal.timeout(20000)});
 }
 if(!response.ok)throw new Error('Usługa pocztowa nie potwierdziła wysyłki. Sprawdź skrzynkę przed ponowieniem; PDF możesz pobrać.');
}
