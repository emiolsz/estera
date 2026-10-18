import {cookies} from 'next/headers';
import {authRequest} from '@/app/chatgpt-auth';
import {json,fail,mutation} from '@/lib/server';
export async function POST(r:Request){try{mutation(r);const jar=await cookies();const access=jar.get('estera_access')?.value;if(access)await authRequest('logout',{},access).catch(()=>null);jar.delete('estera_access');jar.delete('estera_refresh');return json({ok:true});}catch(e){return fail(e);}}
