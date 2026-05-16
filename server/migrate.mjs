import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MD_PATH = path.join(__dirname, '../career-ops-temp/data/applications.md');
const JSON_PATH = path.join(__dirname, 'data/tracker.json');

function migrate() {
  console.log('🚀 Starting migration from MD to JSON...');
  
  if (!fs.existsSync(MD_PATH)) {
    console.error('❌ MD file not found at', MD_PATH);
    return;
  }

  const content = fs.readFileSync(MD_PATH, 'utf-8');
  const lines = content.split('\n');
  const tableLines = lines.filter(l => l.trim().startsWith('|') && !l.includes('|---|') && !l.includes('| # |'));

  const applications = tableLines.map(line => {
    const parts = line.split('|').map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length < 9) return null;

    return {
      id: parts[0],
      date: parts[1],
      company: parts[2],
      role: parts[3],
      score: parts[4],
      status: parts[5],
      pdf: parts[6] === '✅',
      report: parts[7],
      notes: parts[8]
    };
  }).filter(a => a !== null);

  if (!fs.existsSync(path.dirname(JSON_PATH))) {
    fs.mkdirSync(path.dirname(JSON_PATH), { recursive: true });
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(applications, null, 2));
  console.log(`✅ Migrated ${applications.length} applications to ${JSON_PATH}`);
}

migrate();
