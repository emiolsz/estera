export function aiProvider(): 'google'|'openai'|null {
 const e=process.env;
 if(e.AI_PROVIDER==='google')return e.GEMINI_API_KEY?'google':null;
 if(e.AI_PROVIDER==='openai')return e.OPENAI_API_KEY?'openai':null;
 return e.GEMINI_API_KEY?'google':e.OPENAI_API_KEY?'openai':null;
}
export function mailProvider(): 'brevo'|'resend'|null {
 const e=process.env;if(!e.MAIL_FROM)return null;
 if(e.MAIL_PROVIDER==='brevo')return e.BREVO_API_KEY?'brevo':null;
 if(e.MAIL_PROVIDER==='resend')return e.RESEND_API_KEY?'resend':null;
 return e.BREVO_API_KEY?'brevo':e.RESEND_API_KEY?'resend':null;
}
