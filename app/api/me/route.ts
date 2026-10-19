import {aiProvider,mailProvider} from '@/lib/services';
import {getChatGPTUser,authReady} from '@/app/chatgpt-auth';
import {json,runtimeEnv,databaseReady} from '@/lib/server';
export const dynamic='force-dynamic';
export async function GET(){const u=await getChatGPTUser(),e=runtimeEnv();return json({user:u?{name:u.displayName,email:u.email}:null,authReady:authReady(),databaseReady:databaseReady(),aiProvider:aiProvider(),aiReady:!!(aiProvider()&&databaseReady()),emailReady:!!(mailProvider()&&databaseReady()),isAdmin:!!(u&&e.ADMIN_EMAIL&&u.email.toLowerCase()===String(e.ADMIN_EMAIL).toLowerCase())});}
