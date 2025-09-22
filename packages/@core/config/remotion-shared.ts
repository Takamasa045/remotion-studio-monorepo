// packages/@core/config/remotion-shared.ts
// Shared helpers for Remotion config files used across apps
import fs from 'fs';
import path from 'path';

// WebpackConfiguration is only used structurally; avoid importing remotion types here.
type WebpackConfigurationLike = {
  resolve?: { alias?: Record<string, string> };
};

export const monorepoAliasesOverride = (currentConfiguration: unknown) => {
  const config = (currentConfiguration || {}) as WebpackConfigurationLike;
  const alias = (config.resolve?.alias ?? {}) as Record<string, string>;
  try {
    // Search for all packages under ../../packages and map {pkg.name -> <pkg>/src}
    const packagesDir = path.resolve(process.cwd(), '../../packages');
    const entries: Record<string, string> = {};
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        const full = path.join(dir, entry.name);
        if (!entry.isDirectory()) continue;
        const pkgJson = path.join(full, 'package.json');
        const srcPath = path.join(full, 'src');
        if (fs.existsSync(pkgJson) && fs.existsSync(srcPath)) {
          try {
            const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
            if (pkg?.name && typeof pkg.name === 'string') {
              entries[pkg.name] = srcPath;
            }
          } catch {}
        }
        // Recurse
        walk(full);
      }
    };
    if (fs.existsSync(packagesDir)) walk(packagesDir);
    // Apply aliases
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {...alias, ...entries};
  } catch {}
  return config as unknown as any;
};

