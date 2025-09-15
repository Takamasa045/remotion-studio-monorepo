import path from "path";
import fs from "fs";
import type {WebpackConfiguration} from "remotion";
import {Bundling} from "remotion";

const DIRNAME = (typeof __dirname !== 'undefined')
  ? __dirname
  : path.dirname(new URL(import.meta.url).pathname);

Bundling.overrideWebpackConfig((currentConfiguration) => {
  const config: WebpackConfiguration = currentConfiguration as WebpackConfiguration;
  const alias = (config.resolve?.alias ?? {}) as Record<string, string>;
  try {
    const packagesDir = path.resolve(DIRNAME, "../../packages");
    const entries: Record<string, string> = {};
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const pkgJson = path.join(full, "package.json");
          const srcPath = path.join(full, "src");
          if (fs.existsSync(pkgJson) && fs.existsSync(srcPath)) {
            try {
              const pkg = JSON.parse(fs.readFileSync(pkgJson, "utf8"));
              if (pkg.name) entries[pkg.name] = srcPath;
            } catch {}
          }
          walk(full);
        }
      }
    };
    walk(packagesDir);
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {...alias, ...entries};
  } catch {}
  return config;
});

