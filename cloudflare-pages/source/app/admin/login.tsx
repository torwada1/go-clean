'use client';
import {useState} from 'react';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const password = String(new FormData(event.currentTarget).get('password') || '');
    try {
      const response = await fetch('/api/admin-auth', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({password})});
      const body = await response.json() as {error?: string};
      if (!response.ok) throw new Error(body.error || 'تعذّر تسجيل الدخول.');
      location.assign('/admin');
    } catch (e) { setError((e as Error).message); setBusy(false); }
  }
  return <main><section className="panel"><h1>دخول الإدارة</h1><p>اكتب كلمة مرور الإدارة للمتابعة.</p><form onSubmit={submit}><label>كلمة المرور<input name="password" type="password" autoComplete="current-password" required minLength={20}/></label><button className="button" disabled={busy}>{busy?'جاري الدخول…':'دخول'}</button></form>{error&&<p role="alert" className="error">{error}</p>}</section></main>;
}
