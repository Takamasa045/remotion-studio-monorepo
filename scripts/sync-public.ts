// scripts/sync-public.ts
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

// スクリプトの場所からリポジトリルートを推定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO = path.resolve(__dirname, '..');
const HUB_PUBLIC = path.join(REPO, 'apps/studio-hub/public');

async function main() {
  const patterns = [
    'apps/*/public/**',
    '!apps/studio-hub/public/**',
  ];
  const files = await fg(patterns, {cwd: REPO, dot: false});

  for (const rel of files) {
    const absSrc = path.join(REPO, rel);
    const stat = fs.statSync(absSrc);
    if (stat.isDirectory()) continue;
    if (path.basename(absSrc).toLowerCase() === 'readme.md') continue;

    // preserve path relative to each app's public/*
    const parts = rel.split(path.sep);
    const pubIdx = parts.indexOf('public');
    if (pubIdx === -1) continue;
    const relFromPublic = parts.slice(pubIdx + 1).join(path.sep);
    const absDst = path.join(HUB_PUBLIC, relFromPublic);
    try {
      fs.mkdirSync(path.dirname(absDst), {recursive: true});
      fs.copyFileSync(absSrc, absDst);
    } catch (e) {
      // Skip on permission issues during dev server watching
    }
  }

  // Known aliases for cross-app reuse
  const aliases: Array<{from: string; to: string}> = [
    {from: 'assets/video/background-loop.mp4', to: 'background-loop.mp4'},
    {from: 'assets/audio/playlist-cover.mp3', to: 'playlist-cover.mp3'},
    {from: 'プレイリスト(Cover).mp3', to: 'playlist-cover.mp3'},
  ];
  for (const {from, to} of aliases) {
    try {
      const src = path.join(HUB_PUBLIC, from);
      const dst = path.join(HUB_PUBLIC, to);
      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dst), {recursive: true});
        fs.copyFileSync(src, dst);
      }
    } catch {}
  }

  console.log(`✅ Synced public assets to ${path.relative(REPO, HUB_PUBLIC)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
