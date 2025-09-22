import {Config} from "@remotion/cli/config";

// Minimal config for standalone template projects.
// Keep Webpack config vanilla unless you need overrides.
Config.overrideWebpackConfig((c) => c);

export {};
