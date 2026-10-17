import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export const runtimeEnv=()=>env as unknown as Record<string,any>;
export const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export function mutation(request:Request){if(request.headers.get('origin')!==new URL(request.url).origin||request.headers.get('content-type')?.split(';')[0]!=='application/json')throw new Error('Nieprawidłowe źródło żądania.');}
export async function user(){const u=await getChatGPTUser();if(!u)throw new Error('Zaloguj się, aby korzystać z dziennika.');return u;}
export async function admin(){const u=await user(),owner=runtimeEnv().ADMIN_EMAIL;if(!owner||u.email.toLowerCase()!==String(owner).toLowerCase())throw new Error('Panel redakcyjny wymaga dostępu administratorki.');return u;}
export function text(value:unknown,max=10000){if(typeof value!=='string')throw new Error('Uzupełnij wymagane pole.');if(value.length>max)throw new Error('Treść jest zbyt długa. Skróć wpis albo podziel go na części.');return value.trim();}
export const db=()=>{const binding=runtimeEnv().DB;if(!binding)throw new Error('Dziennik nie jest jeszcze dostępny.');return binding;};
export const fail=(error:unknown,status=400)=>json({error:error instanceof Error?error.message:'Operacja nie powiodła się.'},status);
