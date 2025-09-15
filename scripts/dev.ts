#!/usr/bin/env -S node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import {spawn} from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const appsDir = path.join(repoRoot, 'apps');

type Args = { app?: string; rest: string[] };

function parseArgs(argv: string[]): Args {
  const out: Args = { rest: [] };
  let i = 0;
  while (i < argv.length) {
    const a = argv[i];
    if (a === '--app' || a === '-a') {
      out.app = argv[i + 1];
      i += 2;
      continue;
    }
    if (!a.startsWith('-') && !out.app) {
      out.app = a;
      i += 1;
      continue;
    }
    out.rest.push(a);
    i += 1;
  }
  return out;
}

async function listApps(): Promise<string[]> {
  try {
    const entries = await fsp.readdir(appsDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    return [];
  }
}

function toPkgName(app: string) {
  return app.startsWith('@') ? app : `@studio/${app}`;
}

async function main() {
  const { app, rest } = parseArgs(process.argv.slice(2));
  const apps = await listApps();
  if (!app) {
    console.log('Usage: pnpm dev <app> [-- ...args]');
    console.log('       pnpm dev --app <app> [-- ...args]');
    console.log('Available apps:');
    apps.forEach((a) => console.log(`  - ${a}`));
    process.exit(1);
  }

  const slug = app.startsWith('@studio/') ? app.replace(/^@studio\//, '') : app;
  const appPath = path.join(appsDir, slug);
  if (!fs.existsSync(appPath)) {
    console.error(`App not found: ${slug} (expected at ${path.relative(repoRoot, appPath)})`);
    console.log('Available apps:');
    apps.forEach((a) => console.log(`  - ${a}`));
    process.exit(1);
  }

  const child = spawn('pnpm', ['-C', appPath, 'run', 'dev', ...(rest.length ? ['--', ...rest] : [])], {
    stdio: 'inherit',
    shell: true,
  });
  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

