#!/usr/bin/env tsx
/**
 * Render a Remotion app to video
 */

import { execSync } from "child_process";
import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import * as readline from "readline";

interface RenderOptions {
  app?: string;
  composition?: string;
  output?: string;
  concurrency?: number;
  quality?: number;
}

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message: string, color: keyof typeof COLORS = "reset") {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function getAvailableApps(): string[] {
  const appsDir = join(process.cwd(), "apps");
  if (!existsSync(appsDir)) return [];

  return readdirSync(appsDir).filter((name) => {
    const fullPath = join(appsDir, name);
    return (
      statSync(fullPath).isDirectory() &&
      !name.startsWith("_") &&
      !name.includes("template") &&
      existsSync(join(fullPath, "package.json"))
    );
  });
}

function getCompositions(appName: string): string[] {
  const appPath = join(process.cwd(), "apps", appName);

  try {
    // Try to get compositions using remotion compositions command
    const output = execSync("pnpm remotion compositions --quiet", {
      cwd: appPath,
      encoding: "utf-8",
    });

    // Parse composition IDs from output
    const compositions = output
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.split(/\s+/)[0])
      .filter(Boolean);

    return compositions;
  } catch {
    log("Could not auto-detect compositions", "yellow");
    return [];
  }
}

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${COLORS.cyan}${question}${COLORS.reset}`, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function selectApp(availableApps: string[]): Promise<string> {
  log("\n📋 Available apps:", "cyan");
  availableApps.forEach((app, index) => {
    log(`  ${index + 1}. ${app}`, "yellow");
  });

  const answer = await promptUser(`\nSelect app (1-${availableApps.length}): `);
  const index = parseInt(answer, 10) - 1;

  if (index >= 0 && index < availableApps.length) {
    return availableApps[index];
  } else {
    log("Invalid selection", "red");
    process.exit(1);
  }
}

async function selectComposition(compositions: string[]): Promise<string> {
  if (compositions.length === 0) {
    return await promptUser("Enter composition ID: ");
  }

  log("\n🎬 Available compositions:", "cyan");
  compositions.forEach((comp, index) => {
    log(`  ${index + 1}. ${comp}`, "yellow");
  });

  const answer = await promptUser(
    `\nSelect composition (1-${compositions.length}): `,
  );
  const index = parseInt(answer, 10) - 1;

  if (index >= 0 && index < compositions.length) {
    return compositions[index];
  } else {
    log("Invalid selection", "red");
    process.exit(1);
  }
}

async function renderApp(options: RenderOptions) {
  const availableApps = getAvailableApps();

  if (availableApps.length === 0) {
    log("No apps found in the apps/ directory", "red");
    log("Create an app using: pnpm create:project", "yellow");
    process.exit(1);
  }

  // Select app
  let appName = options.app;
  if (!appName) {
    if (availableApps.length === 1) {
      appName = availableApps[0];
      log(`Using the only available app: ${appName}`, "green");
    } else {
      appName = await selectApp(availableApps);
    }
  } else if (!availableApps.includes(appName)) {
    log(`App "${appName}" not found`, "red");
    process.exit(1);
  }

  const appPath = join(process.cwd(), "apps", appName);

  // Select composition
  let compositionId = options.composition;
  if (!compositionId) {
    log(`\n🔍 Detecting compositions in ${appName}...`, "blue");
    const compositions = getCompositions(appName);
    compositionId = await selectComposition(compositions);
  }

  // Build output path
  const outputPath =
    options.output ||
    join(appPath, "out", `${compositionId}-${Date.now()}.mp4`);

  // Build render command
  const renderArgs = ["remotion", "render", compositionId, outputPath];

  if (options.concurrency) {
    renderArgs.push("--concurrency", options.concurrency.toString());
  }

  if (options.quality) {
    renderArgs.push("--quality", options.quality.toString());
  }

  log("\n🎬 Starting render...", "blue");
  log(`  App: ${appName}`, "cyan");
  log(`  Composition: ${compositionId}`, "cyan");
  log(`  Output: ${outputPath}`, "cyan");

  try {
    execSync(renderArgs.join(" "), {
      cwd: appPath,
      stdio: "inherit",
    });

    log("\n✓ Render complete!", "green");
    log(`  Output: ${outputPath}`, "cyan");
  } catch {
    log("\n✗ Render failed", "red");
    process.exit(1);
  }
}

// Parse CLI arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  log("\n🎬 Render Script", "blue");
  log("\nUsage: pnpm render [options]", "cyan");
  log("\nOptions:", "cyan");
  log("  --app <name>           App name to render", "yellow");
  log("  --composition <id>     Composition ID to render", "yellow");
  log("  --output <path>        Output file path", "yellow");
  log("  --concurrency <num>    Number of threads to use", "yellow");
  log("  --quality <num>        Video quality (0-100)", "yellow");
  log("  -h, --help             Show this help message", "yellow");
  log("\nExamples:", "cyan");
  log("  pnpm render", "yellow");
  log("  pnpm render --app my-app", "yellow");
  log("  pnpm render --app my-app --composition Main", "yellow");
  log("  pnpm render --app my-app --composition Main --quality 80", "yellow");
  process.exit(0);
}

const options: RenderOptions = {
  app: args.includes("--app") ? args[args.indexOf("--app") + 1] : undefined,
  composition: args.includes("--composition")
    ? args[args.indexOf("--composition") + 1]
    : undefined,
  output: args.includes("--output")
    ? args[args.indexOf("--output") + 1]
    : undefined,
  concurrency: args.includes("--concurrency")
    ? parseInt(args[args.indexOf("--concurrency") + 1], 10)
    : undefined,
  quality: args.includes("--quality")
    ? parseInt(args[args.indexOf("--quality") + 1], 10)
    : undefined,
};

renderApp(options).catch((error) => {
  log(`Error: ${error.message}`, "red");
  process.exit(1);
});
