const { spawnSync } = require('node:child_process');

if (!process.env.DATABASE_URL) {
  const url = new URL('postgresql://localhost');
  url.hostname = process.env.DB_HOST || 'localhost';
  url.port = process.env.DB_PORT || '5432';
  url.username = process.env.DB_USER || 'card';
  url.password = process.env.DB_PASSWORD || '';
  url.pathname = '/' + (process.env.DB_NAME || 'card');
  process.env.DATABASE_URL = url.href;
}

for (const args of [
  [require.resolve('prisma/build/index.js'), 'migrate', 'deploy'],
  ['dist/prisma/seed.js'],
]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    console.error('Database initialization failed');
    process.exit(1);
  }
}

require('../dist/src/main.js');
