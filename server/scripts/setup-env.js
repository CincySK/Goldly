const fs = require('fs');
const path = require('path');

const serverDir = path.resolve(__dirname, '..');
const envPath = path.join(serverDir, '.env');
const envExamplePath = path.join(serverDir, '.env.example');

const fallbackEnv = [
  'PORT=4000',
  'DATABASE_URL=postgresql://goldly:goldly@localhost:5432/goldly',
  'JWT_ACCESS_SECRET=change_me_access',
  'JWT_REFRESH_SECRET=change_me_refresh',
  'ACCESS_TOKEN_TTL=15m',
  'REFRESH_TOKEN_TTL=7d',
  'SPOT_PRICE_API_URL=https://api.metals.dev/spot',
  'SPOT_PRICE_API_KEY=demo',
  'FILE_UPLOAD_DIR=uploads'
].join('\n') + '\n';

if (fs.existsSync(envPath)) {
  console.log('server/.env already exists');
  process.exit(0);
}

if (fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('Created server/.env from server/.env.example');
  process.exit(0);
}

fs.writeFileSync(envPath, fallbackEnv, 'utf8');
console.log('server/.env.example not found; created server/.env from fallback defaults');
