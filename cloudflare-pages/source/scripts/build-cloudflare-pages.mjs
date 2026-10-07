import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = resolve(root, 'pages-dist');
const run = spawnSync(process.execPath, [resolve(root, 'scripts/run-framework.mjs'), 'build'], { cwd: root, stdio: 'inherit', env: process.env });
if (run.status !== 0) process.exit(run.status || 1);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, 'dist/client'), output, { recursive: true });
await cp(resolve(root, 'dist/server'), resolve(output, 'server'), { recursive: true });
await rm(resolve(output, 'server', 'wrangler.json'), { force: true });
await cp(resolve(root, 'marketing'), output, { recursive: true, force: true });
try {
  await cp(resolve(root, '..', '..', 'assets'), resolve(output, 'assets'), { recursive: true, force: true });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const worker = `import app from './server/index.js';

const appRoute = (path) => path === '/booking' || path.startsWith('/booking/') || path === '/admin' || path.startsWith('/admin/') || path === '/reviews' || path.startsWith('/reviews/') || path === '/api' || path.startsWith('/api/');

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (!appRoute(pathname)) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404 || pathname === '/' || pathname === '/index.html' || /\\.[a-z0-9]{2,8}$/i.test(pathname)) return asset;
    }
    return app.fetch(request, env, ctx);
  },
};
`;
await writeFile(resolve(output, '_worker.js'), worker);
await writeFile(resolve(output, '.assetsignore'), ['wrangler.json', '.dev.vars', '.vite/**', '/server/**', '/_worker.js', '/.assetsignore', '/README-UPLOAD.md', '/README.md', '/vinext-client-entry-manifest.json'].join('\n') + '\n');
const instructions = await readFile(resolve(root, 'README-CLOUDFLARE-AR.md'), 'utf8');
await writeFile(resolve(output, 'README-UPLOAD.md'), instructions);
console.log(`Cloudflare Pages package ready: ${output}`);
