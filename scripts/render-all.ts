#!/usr/bin/env -S node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import {fileURLToPath} from 'url';
import {spawn} from 'child_process';

type Options = {
  projects?: string[];
  parallel: number;
  outDir: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const appsDir = path.join(repoRoot, 'apps');

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = { parallel: Math.max(1, os.cpus()?.length || 4), outDir: 'out' };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--projects' || a === '-p') {
      opts.projects = (args[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
    } else if (a === '--parallel' || a === '-j') {
      opts.parallel = Number(args[++i] || '1') || 1;
    } else if (a === '--out' || a === '-o') {
      opts.outDir = args[++i] || 'out';
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

async function getCompositions(appPath: string): Promise<string[]> {
  const rootTsx = path.join(appPath, 'src', 'Root.tsx');
  if (!fs.existsSync(rootTsx)) return [];
  const src = await fsp.readFile(rootTsx, 'utf8');
  const ids = new Set<string>();
  const regex = /<Composition[^>]*id\s*=\s*['"`]([^'"`]+)['"`]/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(src))) {
    ids.add(m[1]);
  }
  return [...ids];
}

type Task = { app: string; comp: string; };

async function runTask(task: Task, outRoot: string): Promise<void> {
  const appPath = path.join(appsDir, task.app);
  const out = path.join(outRoot, task.app, `${task.comp}.mp4`);
  await fsp.mkdir(path.dirname(out), {recursive: true});
  console.log(`[render] ${task.app}/${task.comp} -> ${path.relative(repoRoot, out)}`);
  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['-C', appPath, 'remotion', 'render', task.comp, out], {stdio: 'inherit', shell: true});
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Render failed (${task.app}/${task.comp}) code ${code}`))));
  });
}

async function poolRun<T>(items: T[], limit: number, worker: (t: T) => Promise<void>) {
  const q = items.slice();
  const running: Promise<void>[] = [];
  async function runNext() {
    const item = q.shift();
    if (!item) return;
    await worker(item).catch((e) => {
      console.error(String(e));
    });
    await runNext();
  }
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    running.push(runNext());
  }
  await Promise.all(running);
}

async function main() {
  const opts = parseArgs();
  const apps = await getApps(opts);
  if (apps.length === 0) {
    console.log('No apps to render.');
    return;
  }
  const tasks: Task[] = [];
  for (const app of apps) {
    const appPath = path.join(appsDir, app);
    const comps = await getCompositions(appPath);
    comps.forEach((comp) => tasks.push({app, comp}));
  }
  console.log(`Rendering ${tasks.length} compositions from ${apps.length} app(s) with concurrency ${opts.parallel}...`);
  const outRoot = path.resolve(opts.outDir);
  await poolRun(tasks, opts.parallel, (t) => runTask(t, outRoot));
  console.log('All renders attempted.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
