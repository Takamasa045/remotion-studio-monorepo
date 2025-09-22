// scripts/gen-root.ts
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

type ManifestMeta = {
  file: string;
  id: string;
  tags?: string[];
};

// スクリプトの場所からリポジトリルートを推定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_FILE = path.join(REPO_ROOT, 'apps/studio-hub/src/auto-root.tsx');
const IMPORT_FROM_DIR = path.dirname(OUT_FILE);

function parseCSV(s?: string | null) {
  return (s ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

const argv = process.argv.slice(2);
const argInclude = argv.find((a) => a.startsWith('--include='))?.split('=')[1];
const argExclude = argv.find((a) => a.startsWith('--exclude='))?.split('=')[1];
const argTags = argv.find((a) => a.startsWith('--tags='))?.split('=')[1];
const argList = argv.includes('--list');

const INCLUDE = parseCSV(argInclude || process.env.HUB_INCLUDE);
const EXCLUDE = parseCSV(argExclude || process.env.HUB_EXCLUDE);
const TAGS = parseCSV(argTags || process.env.HUB_TAGS);

function matchByFilter(meta: ManifestMeta): boolean {
  if (INCLUDE.length && !INCLUDE.includes(meta.id)) return false;
  if (EXCLUDE.length && EXCLUDE.includes(meta.id)) return false;
  if (TAGS.length) {
    const t = new Set((meta.tags || []).map((x) => x.toLowerCase()));
    const ok = TAGS.some((tag) => t.has(tag.toLowerCase()));
    if (!ok) return false;
  }
  return true;
}

function loadMeta(absFile: string): ManifestMeta | null {
  try {
    const src = fs.readFileSync(absFile, 'utf8');
    const idMatch = src.match(/\bid\s*:\s*(['"])([^'"\n\r]+)\1/);
    if (!idMatch) return null;
    const id = idMatch[2].trim();
    const tagsMatch = src.match(/\btags\s*:\s*\[((.|\n|\r)*?)\]/m);
    let tags: string[] = [];
    if (tagsMatch) {
      const inner = tagsMatch[1];
      const strMatches = inner.match(/(['"])(.*?)\1/g) || [];
      tags = strMatches.map((s) => s.replace(/^['"]|['"]$/g, ''));
    }
    return {file: absFile, id, tags};
  } catch (e) {
    console.warn('⚠️ manifest parse failed:', absFile, e);
    return null;
  }
}

async function main() {
  const patterns = [
    'apps/*/src/manifest.ts',
    'apps/**/src/manifest.ts',
    'apps/*/src/manifest.tsx',
    'apps/**/src/manifest.tsx',
    'app/*/src/manifest.ts',
    'app/**/src/manifest.ts',
    'app/*/src/manifest.tsx',
    'app/**/src/manifest.tsx',
    'packages/@content/**/src/manifest.ts',
    'packages/@content/**/src/manifest.tsx',
  ];
  const manifestsAbs = await fg(patterns, {cwd: REPO_ROOT, absolute: true});
  const filteredOutSelf = manifestsAbs.filter((p) => !p.includes('/apps/studio-hub/'));

  const metas: ManifestMeta[] = [];
  for (const f of filteredOutSelf) {
    const meta = loadMeta(f);
    if (meta) metas.push(meta);
  }

  if (argList) {
    console.log('📦 Available manifests:');
    metas.forEach((m) =>
      console.log(`- ${m.id}  (${m.tags?.join(', ') || '-'})  @ ${path.relative(REPO_ROOT, m.file)}`)
    );
    return;
  }

  const chosen = metas.filter(matchByFilter);
  const final = INCLUDE.length || EXCLUDE.length || TAGS.length ? chosen : metas;

  if (final.length === 0) {
    const empty = `/* AUTO-GENERATED: zero compositions by filter */\nimport React from 'react';\nexport const AutoRoot: React.FC = () => null;\n`;
    fs.mkdirSync(path.dirname(OUT_FILE), {recursive: true});
    fs.writeFileSync(OUT_FILE, empty, 'utf8');
    console.log('⚠️ No compositions selected. Wrote empty AutoRoot.');
    return;
  }

  const imports = final
    .map((meta, i) => {
      const rel = path.relative(IMPORT_FROM_DIR, meta.file).split(path.sep).join('/');
      return `import m${i} from '${rel}'; // ${meta.id}`;
    })
    .join('\n');

  const compositions = final
    .map((_, i) => {
      return `\n      <Composition\n        id={m${i}.id}\n        component={m${i}.component}\n        width={m${i}.config.width}\n        height={m${i}.config.height}\n        fps={m${i}.config.fps}\n        durationInFrames={m${i}.config.durationInFrames}\n        defaultProps={m${i}.defaults}\n      />`;
    })
    .join('\n');

  const code = `/* AUTO-GENERATED. Do not edit. */\nimport React from 'react';\nimport {Composition} from 'remotion';\n${imports}\n\nexport const AutoRoot: React.FC = () => (\n  <>\n  ${compositions}\n  </>\n);\n`;

  fs.mkdirSync(path.dirname(OUT_FILE), {recursive: true});
  fs.writeFileSync(OUT_FILE, code, 'utf8');
  console.log('✅ Generated', path.relative(REPO_ROOT, OUT_FILE));
  console.log('🧩 Included:', final.map((m) => m.id).join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

