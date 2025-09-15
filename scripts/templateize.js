// scripts/templateize.js
// Canonicalize apps/_template by replacing concrete names with placeholders.
// Usage: node scripts/templateize.js

const fs = require('fs').promises;
const path = require('path');

const root = path.join(process.cwd(), 'apps', '_template');

const TEXT_EXTS = new Set([
  '.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.html', '.css',
  '.yml', '.yaml', '.txt', '.mdx', '.jsonc'
]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      await walk(full);
    } else {
      const ext = path.extname(e.name).toLowerCase();
      if (!TEXT_EXTS.has(ext)) continue;
      let c = await fs.readFile(full, 'utf8');

      const before = c;
      // Generic replacements
      c = c.replace(/@studio\/[a-z0-9-_]+/gi, '__PACKAGE__');
      c = c.replace(/\btoki-mv\b/gi, '__APP_NAME__');
      c = c.replace(/\btoki_mv\b/gi, '__APP_NAME__');

      // File-specific tweaks
      if (full.endsWith(path.sep + 'Root.tsx')) {
        // Replace the first Composition id value only
        c = c.replace(/id\s*=\s*(["'])([A-Za-z0-9_-]+)\1/, 'id="__COMPOSITION_ID__"');
      }

      if (c !== before) {
        await fs.writeFile(full, c, 'utf8');
        console.log('patched', path.relative(process.cwd(), full));
      }
    }
  }
}

walk(root)
  .then(() => console.log('Template placeholderization completed.'))
  .catch((err) => { console.error(err); process.exit(1); });

