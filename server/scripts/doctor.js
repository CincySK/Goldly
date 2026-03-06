const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const schemaPath = path.join(root, 'prisma', 'schema.prisma');
const pkgPath = path.join(root, 'package.json');
const envExamplePath = path.join(root, '.env.example');

let failed = false;

function ok(msg) { console.log(`✅ ${msg}`); }
function bad(msg) { console.error(`❌ ${msg}`); failed = true; }

if (fs.existsSync(envExamplePath)) ok('server/.env.example exists');
else bad('server/.env.example is missing');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
for (const script of ['setup:env', 'prisma:setup', 'prisma:seed']) {
  if (pkg.scripts && pkg.scripts[script]) ok(`script '${script}' is present`);
  else bad(`script '${script}' is missing in server/package.json`);
}

const schema = fs.readFileSync(schemaPath, 'utf8');
const requiredSnippets = [
  'conversationsAsBuyer  Conversation[]  @relation("ConversationBuyer")',
  'conversationsAsSeller Conversation[]  @relation("ConversationSeller")',
  'reports       Report[]      @relation("ReportTargetListing")',
  'targetListing   Listing?  @relation("ReportTargetListing", fields: [targetListingId], references: [id], onDelete: SetNull)'
];

for (const snippet of requiredSnippets) {
  if (schema.includes(snippet)) ok(`schema contains: ${snippet}`);
  else bad(`schema missing required relation snippet: ${snippet}`);
}

if (failed) {
  console.error('\nRepository appears to be on an older scaffold. Pull latest branch/PR before running Prisma.');
  process.exit(1);
}

console.log('\nRepository checks look good. You can continue with Prisma setup commands.');
