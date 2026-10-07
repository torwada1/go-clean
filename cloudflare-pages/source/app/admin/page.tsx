import {headers} from 'next/headers';
import {sessionFromCookieHeader,verifyAdminSession} from '../../lib/admin-auth';
import Admin from './ui';
import AdminLogin from './login';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const requestHeaders = await headers();
  const token = sessionFromCookieHeader(requestHeaders.get('cookie'));
  return token && await verifyAdminSession(token) ? <Admin/> : <AdminLogin/>;
}
