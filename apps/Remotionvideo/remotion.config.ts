import {Config} from "@remotion/cli/config";
import {monorepoAliasesOverride} from "../../packages/@core/config/remotion-shared";

Config.overrideWebpackConfig(monorepoAliasesOverride);
