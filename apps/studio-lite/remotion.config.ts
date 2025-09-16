import {Config} from "@remotion/cli/config";
import fs from "fs";
import path from "path";

type BrowserKey = "chrome" | "chrome-testing" | "chromium" | "edge" | "brave" | "vivaldi" | "arc";

const knownExecutables: Record<BrowserKey, string[]> = {
  "chrome": ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"],
  "chrome-testing": [
    "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    path.join(process.cwd(), "node_modules/.remotion/chrome-for-testing/mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
  ],
  "chromium": [
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ],
  "edge": ["/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"],
  "brave": ["/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"],
  "vivaldi": ["/Applications/Vivaldi.app/Contents/MacOS/Vivaldi"],
  "arc": ["/Applications/Arc.app/Contents/MacOS/Arc"],
};

const envExecutable = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  process.env.REMOTION_CHROMIUM_EXECUTABLE,
]
  .filter((value): value is string => Boolean(value))
  .map((value) => path.resolve(value));

const envBrowser = process.env.REMOTION_BROWSER as BrowserKey | undefined;

const candidates = [
  ...envExecutable,
  ...(envBrowser ? knownExecutables[envBrowser] ?? [] : []),
  ...knownExecutables["chrome-testing"],
  ...knownExecutables["chrome"],
  ...knownExecutables["chromium"],
  ...knownExecutables["edge"],
  ...knownExecutables["brave"],
  ...knownExecutables["vivaldi"],
  ...knownExecutables["arc"],
];

const executable = candidates.find((candidate) => candidate && fs.existsSync(candidate));

if (executable) {
  Config.setBrowserExecutable(executable);
}

Config.setChromeMode("chrome-for-testing");

// Keep webpack configuration vanilla so the lite app has zero coupling to the monorepo packages.
// You can still add overrides by editing this file.
Config.overrideWebpackConfig((currentConfiguration) => currentConfiguration);

export {};
