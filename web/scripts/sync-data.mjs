import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.resolve(scriptDir, '..');
const sourceDir = path.resolve(webDir, '..', 'data');
const targetDir = path.resolve(webDir, 'data');

if (!existsSync(sourceDir)) {
  console.error(`Source data directory not found: ${sourceDir}`);
  process.exit(1);
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(path.dirname(targetDir), { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Synced data from ${sourceDir} to ${targetDir}`);
