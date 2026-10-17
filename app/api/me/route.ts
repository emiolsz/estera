import {getChatGPTUser} from '@/app/chatgpt-auth';
import {json,runtimeEnv} from '@/lib/server';
export const dynamic='force-dynamic';
export async function GET(){const u=await getChatGPTUser(),e=runtimeEnv();return json({user:u?{name:u.displayName,email:u.email}:null,aiReady:!!e.OPENAI_API_KEY,emailReady:!!(e.RESEND_API_KEY&&e.MAIL_FROM),isAdmin:!!(u&&e.ADMIN_EMAIL&&u.email.toLowerCase()===String(e.ADMIN_EMAIL).toLowerCase())});}
