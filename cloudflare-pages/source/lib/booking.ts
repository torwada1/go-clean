import {env} from 'cloudflare:workers';
import {sessionFromCookieHeader,verifyAdminSession} from './admin-auth';
export const services:Record<string,{label:string,price:number}>={interior:{label:'تنظيف داخلي',price:250},exterior:{label:'غسيل خارجي',price:250},full:{label:'غسيل كامل',price:450}};
export function db(){if(!env.DB)throw Error('Database unavailable');return env.DB;}
export function cairoDay(t=Date.now()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'}).format(t)}
export function slots(day:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error('اليوم غير صحيح');const base=Date.parse(day+'T00:00:00Z');if(!Number.isFinite(base)||new Date(base).toISOString().slice(0,10)!==day||day<cairoDay()||base>Date.now()+90*86400000)throw Error('اختار يومًا خلال ٩٠ يوم');return Array.from({length:25},(_,hour)=>{let t=base+hour*3600000;for(let i=0;i<3;i++){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).formatToParts(t);const obj=Object.fromEntries(parts.map(p=>[p.type,p.value]));const local=Date.parse(`${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.minute}:${obj.second}Z`);t+=base+hour*3600000-local;}return {hour,start:t,end:t+7200000}})}
export function text(v:unknown,max:number){return typeof v==='string'?v.trim().slice(0,max):''}
export async function admin(req:Request){const value=sessionFromCookieHeader(req.headers.get('cookie'));return value?verifyAdminSession(value):false}
export function bookingEnabled(){const e=env as unknown as Record<string,string|undefined>;return e.BOOKING_ENABLED==='true'}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin}
export async function notify(raw:Record<string,any>){
 const labels:Record<string,string>={pending:'حجز جديد',confirmed:'تم تأكيد الزيارة',completed:'تمت الزيارة',cancelled:'تم إلغاء الحجز',no_show:'لم تتم الزيارة',problem:'حدثت مشكلة'};
 const status=labels[raw.status]||raw.status||'حجز جديد';const bookingId=raw.bookingId||raw.id;const adminComment=raw.adminComment||raw.comment||'';
 const date=new Date(Number(raw.start)).toLocaleDateString('ar-EG',{timeZone:'Africa/Cairo'});const time=new Date(Number(raw.start)).toLocaleTimeString('ar-EG',{timeZone:'Africa/Cairo',hour:'numeric',minute:'2-digit'});
 const price=raw.price||Object.values(services).find(s=>s.label===raw.service)?.price||'';
 const subject=`Go Clean — ${status} — ${bookingId}`;
 const body=[`الحالة: ${status}`,`رقم الحجز: ${bookingId}`,`الاسم: ${raw.name}`,`رقم واتساب: ${raw.phone}`,`الخدمة: ${raw.service}`,`السعر: ${price} جنيه`,`اليوم: ${date}`,`الساعة: ${time} بتوقيت القاهرة`,`العربية: ${raw.car}`,`العنوان: ${raw.address}`,`تعليق الإدارة: ${adminComment||'—'}`].join('\n');
 const payload={...raw,status,statusCode:raw.status,bookingId,adminComment,date,time,price,subject,body,emailBody:body,message:body,to:'go2cleanco@gmail.com'};
const e=env as unknown as Record<string,string>;const id=crypto.randomUUID();await db().prepare('INSERT INTO notifications(id,payload,created) VALUES(?,?,?)').bind(id,JSON.stringify(payload),Date.now()).run();if(!e.BOOKING_NOTIFICATION_WEBHOOK)return false;try{const r=await fetch(e.BOOKING_NOTIFICATION_WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(8000)});if(r.ok){await db().prepare('UPDATE notifications SET sent=1 WHERE id=?').bind(id).run();return true}}catch{}return false}
