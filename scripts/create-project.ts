#!/usr/bin/env -S node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import {spawn} from 'child_process';
import readline from 'readline';

type Answers = {
  name: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  install: boolean;
};

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const question = (q: string) => new Promise<string>((res) => rl.question(q, (a) => res(a)));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const repoRoot = root; // scripts directory is at <repo>/scripts

const appsDir = path.resolve(repoRoot, 'apps');
const templateDir = path.join(appsDir, '_template');

async function ensureExists(p: string) {
  await fsp.mkdir(p, {recursive: true});
}

async function copyDir(src: string, dest: string) {
  const entries = await fsp.readdir(src, {withFileTypes: true});
  await ensureExists(dest);
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
  const argName = process.argv[2];
  const defaultName = argName || 'new-app';
  const nameAns = (argName) ? argName : (await question(`Project name (@studio/<name>) [${defaultName}]: `)) || defaultName;
  const normName = nameAns.trim();
  if (!/^[a-z0-9-_]+$/i.test(normName)) {
    console.error('Invalid name. Use letters, numbers, dash, underscore.');
    process.exit(1);
  }
  const width = Number((await question('Width [1920]: ')) || '1920');
  const height = Number((await question('Height [1080]: ')) || '1080');
  const fps = Number((await question('FPS [30]: ')) || '30');
  const duration = Number((await question('Duration in frames [180]: ')) || '180');
  const installAns = (await question('Run pnpm install now? [Y/n]: ')).trim().toLowerCase();
  const answers: Answers = {
    name: normName,
    width: Number.isFinite(width) ? width : 1920,
    height: Number.isFinite(height) ? height : 1080,
    fps: Number.isFinite(fps) ? fps : 30,
    duration: Number.isFinite(duration) ? duration : 180,
    install: installAns === '' || installAns === 'y' || installAns === 'yes',
  };

  rl.close();

  const destDir = path.join(appsDir, answers.name);
  if (fs.existsSync(destDir)) {
    console.error(`Directory already exists: ${destDir}`);
    process.exit(1);
  }

  console.log(`Creating project at ${destDir} ...`);
  await copyDir(templateDir, destDir);

  // Update package.json
  const pkgPath = path.join(destDir, 'package.json');
  const pkg = JSON.parse(await fsp.readFile(pkgPath, 'utf8'));
  pkg.name = `@studio/${answers.name}`;
  if (pkg.scripts?.build) {
    pkg.scripts.build = `remotion render TemplateMain out/${answers.name}.mp4`;
  }
  await fsp.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  // Replace placeholders in Root.tsx
  const rootTsxPath = path.join(destDir, 'src', 'Root.tsx');
  let rootTsx = await fsp.readFile(rootTsxPath, 'utf8');
  rootTsx = rootTsx
    .replace(/__WIDTH__/g, String(answers.width))
    .replace(/__HEIGHT__/g, String(answers.height))
    .replace(/__FPS__/g, String(answers.fps))
    .replace(/__DURATION__/g, String(answers.duration));
  await fsp.writeFile(rootTsxPath, rootTsx);

  // Replace placeholders in project.config.ts if present
  const projCfgPath = path.join(destDir, 'src', 'project.config.ts');
  if (fs.existsSync(projCfgPath)) {
    let projCfg = await fsp.readFile(projCfgPath, 'utf8');
    projCfg = projCfg
      .replace(/__WIDTH__/g, String(answers.width))
      .replace(/__HEIGHT__/g, String(answers.height))
      .replace(/__FPS__/g, String(answers.fps))
      .replace(/__DURATION__/g, String(answers.duration));
    await fsp.writeFile(projCfgPath, projCfg);
  }

  // Ensure public directory
  await ensureExists(path.join(destDir, 'public'));

  console.log('Project created successfully.');

  if (answers.install) {
    console.log('Running pnpm install (workspace)...');
    await new Promise<void>((resolve, reject) => {
      const child = spawn('pnpm', ['install'], {cwd: repoRoot, stdio: 'inherit', shell: true});
      child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`pnpm install failed with code ${code}`))));
    }).catch((e) => {
      console.warn(String(e));
      console.warn('Install failed or skipped. You can run it later: pnpm install');
    });
  }

  console.log(`Next steps:\n  - pnpm -F @studio/${answers.name} run dev\n  - pnpm -F @studio/${answers.name} run build`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
