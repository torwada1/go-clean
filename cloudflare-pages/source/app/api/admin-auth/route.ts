import {clearSessionCookie,createAdminSession,passwordMatches,sessionCookie} from '../../../lib/admin-auth';
import {sameOrigin} from '../../../lib/booking';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({error: 'طلب غير مسموح'}, {status: 403});
  try {
    const body = await req.json() as {password?: unknown};
    if (!await passwordMatches(body.password)) return Response.json({error: 'كلمة المرور غير صحيحة.'}, {status: 401});
    const token = await createAdminSession();
    return Response.json({ok: true}, {headers: {'Set-Cookie': sessionCookie(token, new URL(req.url).protocol === 'https:'), 'Cache-Control': 'no-store'}});
  } catch {
    return Response.json({error: 'إعداد دخول الإدارة غير مكتمل في Cloudflare.'}, {status: 503});
  }
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return Response.json({error: 'طلب غير مسموح'}, {status: 403});
  return Response.json({ok: true}, {headers: {'Set-Cookie': clearSessionCookie(new URL(req.url).protocol === 'https:'), 'Cache-Control': 'no-store'}});
}
