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
  compositionId: string;
};

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const question = (q: string) => new Promise<string>((res) => rl.question(q, (a) => res(a)));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const repoRoot = root; // scripts directory is at <repo>/scripts

const appsDir = path.resolve(repoRoot, 'apps');
const defaultTemplateDir = path.join(appsDir, '_template');
const threeDTemplateDir = path.join(appsDir, '3D-template');

type TemplateKey = 'default' | '3d';

function parseArgs(argv: string[]) {
  let nameArg: string | undefined;
  let templateKey: TemplateKey | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--template' || a === '-t') {
      const v = argv[i + 1];
      if (v) {
        if (/^3d$/i.test(v) || /^3D-template$/.test(v)) templateKey = '3d';
        else templateKey = 'default';
        i++;
        continue;
      }
    }
    if (!a.startsWith('-') && !nameArg) {
      nameArg = a;
      continue;
    }
  }
  return {nameArg, templateKey};
}

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

const TEXT_EXTS = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.json', '.jsonc',
  '.md', '.mdx', '.txt', '.css', '.scss', '.html', '.yml', '.yaml'
]);

async function replaceInFiles(dir: string, replacements: Record<string, string>) {
  const entries = await fsp.readdir(dir, {withFileTypes: true});
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      await replaceInFiles(full, replacements);
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (!TEXT_EXTS.has(ext)) continue;
      try {
        let content = await fsp.readFile(full, 'utf8');
        let changed = false;
        for (const [from, to] of Object.entries(replacements)) {
          const before = content;
          content = content.split(from).join(to);
          if (content !== before) changed = true;
        }
        if (changed) await fsp.writeFile(full, content, 'utf8');
      } catch {
        // ignore binary/unreadable files
      }
    }
  }
}

async function renameIfNeeded(dir: string, oldStr: string, newStr: string) {
  const entries = await fsp.readdir(dir, {withFileTypes: true});
  for (const ent of entries) {
    const oldPath = path.join(dir, ent.name);
    let newPath = oldPath;
    if (ent.name.includes(oldStr)) {
      newPath = path.join(dir, ent.name.replaceAll(oldStr, newStr));
      await fsp.rename(oldPath, newPath);
    }
    if (ent.isDirectory()) {
      await renameIfNeeded(newPath, oldStr, newStr);
    }
  }
}

async function main() {
  const {nameArg, templateKey: cliTemplate} = parseArgs(process.argv.slice(2));
  const defaultName = nameArg || 'new-app';
  const nameAns = (nameArg) ? nameArg : (await question(`Project name (@studio/<name>) [${defaultName}]: `)) || defaultName;
  const normName = nameAns.trim();
  if (!/^[a-z0-9-_]+$/i.test(normName)) {
    console.error('Invalid name. Use letters, numbers, dash, underscore.');
    process.exit(1);
  }
  const width = Number((await question('Width [1920]: ')) || '1920');
  const height = Number((await question('Height [1080]: ')) || '1080');
  const fps = Number((await question('FPS [30]: ')) || '30');
  const duration = Number((await question('Duration in frames [180]: ')) || '180');
  const compIdInput = (await question('Composition ID [Main]: ')).trim();
  const compositionId = (compIdInput === '' ? 'Main' : compIdInput);
  let templateKey: TemplateKey = cliTemplate ?? 'default';
  if (!cliTemplate) {
    const use3d = (await question('Use 3D template? [y/N]: ')).trim().toLowerCase();
    templateKey = (use3d === 'y' || use3d === 'yes') ? '3d' : 'default';
  }
  const installAns = (await question('Run pnpm install now? [Y/n]: ')).trim().toLowerCase();
  const answers: Answers = {
    name: normName,
    width: Number.isFinite(width) ? width : 1920,
    height: Number.isFinite(height) ? height : 1080,
    fps: Number.isFinite(fps) ? fps : 30,
    duration: Number.isFinite(duration) ? duration : 180,
    install: installAns === '' || installAns === 'y' || installAns === 'yes',
    compositionId,
  };

  rl.close();

  const destDir = path.join(appsDir, answers.name);
  if (fs.existsSync(destDir)) {
    console.error(`Directory already exists: ${destDir}`);
    process.exit(1);
  }

  console.log(`Creating project at ${destDir} ...`);
  const templateDir = templateKey === '3d' ? threeDTemplateDir : defaultTemplateDir;
  await copyDir(templateDir, destDir);

  // Update package.json
  const pkgPath = path.join(destDir, 'package.json');
  const pkg = JSON.parse(await fsp.readFile(pkgPath, 'utf8'));
  pkg.name = `@studio/${answers.name}`;
  if (pkg.scripts?.build) {
    pkg.scripts.build = `remotion render ${answers.compositionId} out/${answers.name}.mp4`;
  }
  await fsp.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  // Replace placeholders in Root.tsx (_template) or constants in 3D-template
  const rootTsxPath = path.join(destDir, 'src', 'Root.tsx');
  let rootTsx = await fsp.readFile(rootTsxPath, 'utf8');
  if (templateKey === 'default') {
    rootTsx = rootTsx
      .replace(/__WIDTH__/g, String(answers.width))
      .replace(/__HEIGHT__/g, String(answers.height))
      .replace(/__FPS__/g, String(answers.fps))
      .replace(/__DURATION__/g, String(answers.duration));
  } else {
    // 3D-template uses numeric constants; patch them
    rootTsx = rootTsx
      .replace(/const\s+WIDTH\s*=\s*\d+\s*;/, `const WIDTH = ${answers.width};`)
      .replace(/const\s+HEIGHT\s*=\s*\d+\s*;/, `const HEIGHT = ${answers.height};`)
      .replace(/const\s+FPS\s*=\s*\d+\s*;/, `const FPS = ${answers.fps};`)
      .replace(/const\s+DURATION\s*=\s*\d+\s*;/, `const DURATION = ${answers.duration};`);
  }
  // Update first Composition id to the chosen compositionId (default: Main)
  rootTsx = rootTsx.replace(/id\s*=\s*(["'])[A-Za-z0-9_-]+\1/, `id="${answers.compositionId}"`);
  await fsp.writeFile(rootTsxPath, rootTsx);

  // Replace placeholders in project.config.ts if present; or patch numbers for 3D-template
  const projCfgPath = path.join(destDir, 'src', 'project.config.ts');
  if (fs.existsSync(projCfgPath)) {
    let projCfg = await fsp.readFile(projCfgPath, 'utf8');
    if (templateKey === 'default') {
      projCfg = projCfg
        .replace(/__WIDTH__/g, String(answers.width))
        .replace(/__HEIGHT__/g, String(answers.height))
        .replace(/__FPS__/g, String(answers.fps))
        .replace(/__DURATION__/g, String(answers.duration));
    } else {
      projCfg = projCfg
        .replace(/width:\s*\d+\s*,/, `width: ${answers.width},`)
        .replace(/height:\s*\d+\s*,/, `height: ${answers.height},`)
        .replace(/fps:\s*\d+\s*,/, `fps: ${answers.fps},`)
        .replace(/durationInFrames:\s*\d+\s*,?/, `durationInFrames: ${answers.duration},`);
    }
    await fsp.writeFile(projCfgPath, projCfg);
  }

  // Ensure public directory
  await ensureExists(path.join(destDir, 'public'));
  // Scaffold public/assets with commonly used subfolders
  // images, audio, video, fonts, css, data(json), lottie(json)
  const assetsBase = path.join(destDir, 'public', 'assets');
  const assetDirs = [
    'images',
    'audio',
    'video',
    'fonts',
    'css',
    'data',
    'lottie',
  ].map((n) => path.join(assetsBase, n));
  for (const d of assetDirs) {
    await ensureExists(d);
    try { await fsp.writeFile(path.join(d, '.gitkeep'), ''); } catch {}
  }

  // Optional source-side styles directory for CSS imports via bundler
  const srcStyles = path.join(destDir, 'src', 'styles');
  await ensureExists(srcStyles);
  try { await fsp.writeFile(path.join(srcStyles, '.gitkeep'), ''); } catch {}

  // Post-copy placeholder replacement across the project
  await replaceInFiles(destDir, {
    '__PACKAGE__': `@studio/${answers.name}`,
    '__APP_NAME__': answers.name,
  });

  // Rename files/directories that might contain a concrete name from past templates
  await renameIfNeeded(destDir, 'toki-mv', answers.name);
  await renameIfNeeded(destDir, '__APP_NAME__', answers.name);

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

  console.log(`Next steps:\n  - pnpm -C apps/${answers.name} run dev\n  - pnpm -C apps/${answers.name} run build`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
