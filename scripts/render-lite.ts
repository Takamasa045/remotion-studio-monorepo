#!/usr/bin/env -S node
import path from 'path';
import fs from 'fs';
import {spawn} from 'child_process';
import {fileURLToPath} from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(repoRoot, 'apps', 'studio-lite');

const browserMap: Record<string, string[]> = {
  chrome: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
  'chrome-testing': ['/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'],
  chromium: ['/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser'],
  edge: ['/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'],
  brave: ['/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'],
  vivaldi: ['/Applications/Vivaldi.app/Contents/MacOS/Vivaldi'],
  arc: ['/Applications/Arc.app/Contents/MacOS/Arc'],
};

type CliOptions = {
  browser?: string;
  executable?: string;
  out?: string;
  composition?: string;
  entry?: string;
  rest: string[];
};

function parseArgs(argv: string[]): CliOptions {
  const result: CliOptions = {rest: []};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--browser' || arg === '-b') {
      result.browser = argv[++i];
    } else if (arg.startsWith('--browser=')) {
      result.browser = arg.split('=')[1];
    } else if (arg === '--executable' || arg === '-x') {
      result.executable = argv[++i];
    } else if (arg.startsWith('--executable=')) {
      result.executable = arg.split('=')[1];
    } else if (arg === '--out' || arg === '-o') {
      result.out = argv[++i];
    } else if (arg.startsWith('--out=')) {
      result.out = arg.split('=')[1];
    } else if (arg === '--composition' || arg === '-c') {
      result.composition = argv[++i];
    } else if (arg.startsWith('--composition=')) {
      result.composition = arg.split('=')[1];
    } else if (arg === '--entry' || arg === '-e') {
      result.entry = argv[++i];
    } else if (arg.startsWith('--entry=')) {
      result.entry = arg.split('=')[1];
    } else {
      result.rest.push(arg);
    }
  }
  return result;
}

function resolveBrowserExecutable(options: CliOptions): string | undefined {
  if (options.executable) {
    const resolved = path.resolve(options.executable);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Browser executable not found: ${resolved}`);
    }
    return resolved;
  }
  const browser = options.browser ?? process.env.REMOTION_BROWSER;
  if (browser) {
    const candidates = browserMap[browser];
    if (!candidates) {
      throw new Error(`Unknown browser key: ${browser}`);
    }
    const hit = candidates.find((candidate) => fs.existsSync(candidate));
    if (!hit) {
      throw new Error(`Browser ${browser} not found. Checked: ${candidates.join(', ')}`);
    }
    return hit;
  }
  return undefined;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const executable = resolveBrowserExecutable(options);
  const outPath = options.out ?? path.join(appDir, 'out', 'intro.mp4');
  const composition = options.composition ?? 'Intro';
  const entry = options.entry ?? 'src/Root.tsx';

  const renderArgs = ['exec', 'remotion', 'render', composition, outPath, `--entry-point=${entry}`, ...options.rest];
  if (executable) {
    renderArgs.push(`--browser-executable=${executable}`);
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', renderArgs, {
      cwd: appDir,
      stdio: 'inherit',
      shell: true,
      env: {...process.env},
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Render failed with exit code ${code}`));
    });
  });
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
