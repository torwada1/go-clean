import {env} from 'cloudflare:workers';

const COOKIE = 'go_clean_admin';
const SESSION_SECONDS = 12 * 60 * 60;

function password() {
  return (env as unknown as Record<string, string | undefined>).ADMIN_PASSWORD || '';
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(value: string) {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(expires: string) {
  const secret = password();
  if (secret.length < 20) throw new Error('ADMIN_PASSWORD must contain at least 20 characters.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`go-clean-admin:${expires}`)));
}

export async function createAdminSession() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expires}.${toBase64Url(await sign(expires))}`;
}

export async function verifyAdminSession(value: string) {
  try {
    const [expires, encoded, extra] = value.split('.');
    const expiresAt = Number(expires);
    if (extra || !/^\d{10}$/.test(expires) || !encoded || expiresAt <= Math.floor(Date.now() / 1000) || expiresAt > Math.floor(Date.now() / 1000) + SESSION_SECONDS + 60) return false;
    const actual = fromBase64Url(encoded);
    const expected = await sign(expires);
    if (actual.length !== expected.length) return false;
    let difference = 0;
    for (let i = 0; i < actual.length; i++) difference |= actual[i] ^ expected[i];
    return difference === 0;
  } catch {
    return false;
  }
}

export async function passwordMatches(value: unknown) {
  const expected = password();
  if (expected.length < 20 || typeof value !== 'string') return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)),
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(expected)),
  ]);
  const left = new Uint8Array(a), right = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

export function sessionCookie(value: string, secure: boolean) {
  return `${COOKIE}=${value}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

export function clearSessionCookie(secure: boolean) {
  return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

export function sessionFromCookieHeader(header: string | null) {
  return header?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) || '';
}
