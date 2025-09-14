#!/usr/bin/env -S node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

type Options = {
  mode: 'symlink' | 'copy';
  projects?: string[];
  force: boolean;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const appsDir = path.join(repoRoot, 'apps');

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = { mode: 'symlink', force: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--mode' || a === '-m') {
      const v = (args[++i] || '').toLowerCase();
      opts.mode = v === 'copy' ? 'copy' : 'symlink';
    } else if (a === '--projects' || a === '-p') {
      opts.projects = (args[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
    } else if (a === '--force' || a === '-f') {
      opts.force = true;
    }
  }
  return opts;
}

async function getApps(opts: Options): Promise<string[]> {
  const all = (await fsp.readdir(appsDir, {withFileTypes: true}))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => n !== '_template');
  if (!opts.projects || opts.projects.length === 0) return all;
  return all.filter((n) => opts.projects!.includes(n));
}

async function removeIfExists(p: string) {
  if (!fs.existsSync(p)) return;
  const st = await fsp.lstat(p);
  if (st.isSymbolicLink()) {
    await fsp.unlink(p);
  } else if (st.isDirectory()) {
    await fsp.rm(p, {recursive: true, force: true});
  } else {
    await fsp.unlink(p);
  }
}

async function copyDir(src: string, dest: string) {
  const entries = await fsp.readdir(src, {withFileTypes: true});
  await fsp.mkdir(dest, {recursive: true});
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.isSymbolicLink()) {
      const target = await fsp.readlink(s);
      await fsp.symlink(target, d);
    } else {
      await fsp.copyFile(s, d);
    }
  }
}

async function main() {
  const opts = parseArgs();
  const srcCandidates = [
    path.join(repoRoot, 'packages', 'design-assets', 'assets'),
    path.join(repoRoot, 'packages', '@design', 'assets', 'assets'),
  ];
  const src = srcCandidates.find((p) => fs.existsSync(p));
  if (!src) {
    console.error('Shared assets folder not found. Expected at:');
    srcCandidates.forEach((p) => console.error(' - ' + p));
    process.exit(1);
  }
  const apps = await getApps(opts);
  for (const app of apps) {
    const dest = path.join(appsDir, app, 'public', 'assets');
    await fsp.mkdir(path.dirname(dest), {recursive: true});
    if (fs.existsSync(dest)) {
      if (!opts.force) {
        console.log(`[skip] ${app}: public/assets exists (use --force to replace)`);
        continue;
      }
      await removeIfExists(dest);
    }
    if (opts.mode === 'symlink') {
      await fsp.symlink(src, dest, 'dir');
      console.log(`[link] ${app}: assets -> ${path.relative(path.join(appsDir, app, 'public'), src)}`);
    } else {
      await copyDir(src, dest);
      console.log(`[copy] ${app}: assets copied`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
