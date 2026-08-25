const fs = require('fs');
const path = require('path');

function loadDotEnv(file) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (m) {
      let val = m[2];
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[m[1]] = val;
    }
  });
}

loadDotEnv(path.join(__dirname, '..', '.env'));

const { PrismaClient } = require(path.join(__dirname, '..', 'node_modules', '.prisma', 'client'));
const migrationPath = path.join(__dirname, '..', 'prisma', 'migrations', '20260825000000_add_conference_waitlist_fields', 'migration.sql');

(async () => {
  const prisma = new PrismaClient();
  try {
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration SQL not found at', migrationPath);
      process.exit(2);
    }
    const sql = fs.readFileSync(migrationPath, 'utf8');
    const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      console.log('Executing:', stmt.substring(0, 120).replace(/\r?\n/g, ' ') + '...');
      await prisma.$executeRawUnsafe(stmt);
    }
    console.log('Migration applied');
  } catch (e) {
    console.error('Error applying migration:', e && e.message ? e.message : e);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
})();
