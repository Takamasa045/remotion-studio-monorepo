# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1](https://github.com/Takamasa045/remotion-studio-monorepo/compare/v0.2.0...v0.2.1) (2026-05-04)


### Documentation

* add multilingual readmes ([d49e8d6](https://github.com/Takamasa045/remotion-studio-monorepo/commit/d49e8d6a09d3361dcf99acaed9114c4fb5b84a8e))
* add Spanish and French readmes ([c1648da](https://github.com/Takamasa045/remotion-studio-monorepo/commit/c1648da6e0c3f7a0d67664ccd28d7e59358fa10d))

## [0.2.0](https://github.com/Takamasa045/remotion-studio-monorepo/compare/v0.1.2...v0.2.0) (2026-05-04)

### ⚠ BREAKING CHANGES

- vendorize apps (drop submodule); remove sparse script; simplify README clone/setup (no submodules)

### Features

- add browser-agnostic lite renderer ([b46ccba](https://github.com/Takamasa045/remotion-studio-monorepo/commit/b46ccba05a0c84ba104d41654f0a25c35e1a3663))
- add html-in-canvas support and release checks ([ede4181](https://github.com/Takamasa045/remotion-studio-monorepo/commit/ede4181743ba71043132bd4e724a00b9bcb26b72))
- add remotion hub and unify dependencies ([0c1486e](https://github.com/Takamasa045/remotion-studio-monorepo/commit/0c1486e533bc671eb1a5023e8fc71d2af177b6de))
- **ci:** implement comprehensive monorepo improvements ([d3990b0](https://github.com/Takamasa045/remotion-studio-monorepo/commit/d3990b043b284cbdacc36573e19db081f8c414a8))
- **create-project:** add 3D template option (-t 3d / --template 3d) with interactive prompt; docs: add usage examples (JA/EN) ([4c5b7e8](https://github.com/Takamasa045/remotion-studio-monorepo/commit/4c5b7e8e08f9adbb644fb9b6f08ec7ffd5502c14))
- **create-project:** prompt Composition ID (default Main) and update Root.tsx/build script; docs: note default Composition ID ([f890b94](https://github.com/Takamasa045/remotion-studio-monorepo/commit/f890b94dfdc84d826b949333fdbd62bb95b27c48))
- **create-project:** scaffold public/assets/{images,audio,video}; docs(template): add asset guidance ([d87d5d6](https://github.com/Takamasa045/remotion-studio-monorepo/commit/d87d5d601897015cb439eb11e0c21846a29e5536))
- **create-project:** support --dest/-o to scaffold outside workspace; docs: add outside-repo workflow (JA/EN) ([11e33c0](https://github.com/Takamasa045/remotion-studio-monorepo/commit/11e33c0d74070fec34d679ed7638ad3903e5a224))
- **examples:** refresh forge studio and use trash for deletes ([554ada0](https://github.com/Takamasa045/remotion-studio-monorepo/commit/554ada0a238da48ddc688d974828540546c22b07))
- harden remotion templates and CI checks ([a6970d6](https://github.com/Takamasa045/remotion-studio-monorepo/commit/a6970d618c68f8aedfa61c3f2afc7b2e41521a8a))
- harden templates and optimize render demo pipeline ([3080d11](https://github.com/Takamasa045/remotion-studio-monorepo/commit/3080d111be96a9a6908d4fc8fd101fe6a5f4b663))
- implement remotion forge studio workflow ([23c5371](https://github.com/Takamasa045/remotion-studio-monorepo/commit/23c53711fe836c089ad8cdcf6c1b593794822a11))
- implement remotion forge studio workflow ([2607543](https://github.com/Takamasa045/remotion-studio-monorepo/commit/260754357328b3f2d71d1a60c05f9aaab626998c))
- port studio render preview and discovery updates from itopan ([bf5c837](https://github.com/Takamasa045/remotion-studio-monorepo/commit/bf5c837ef93e96ce6fc22b3515d7b64f61a88f0e))
- port studio render preview and discovery updates from itopan ([e45c22e](https://github.com/Takamasa045/remotion-studio-monorepo/commit/e45c22e9bc66d24b63de3d2726e45627e7cf7dee))
- redesign forge studio dashboard ux ([4c335f2](https://github.com/Takamasa045/remotion-studio-monorepo/commit/4c335f2782f1ea56d5a89901c4ccd7efacc6e376))
- redesign forge studio dashboard ux ([79d45e3](https://github.com/Takamasa045/remotion-studio-monorepo/commit/79d45e32423124efec4c930ed771e1eb2152e152))
- **scripts:** add generic dev/preview/build runners; fix Remotion config imports; tidy tsconfig paths and template entry ([33aec9e](https://github.com/Takamasa045/remotion-studio-monorepo/commit/33aec9e4aa19a4d431a7a2fecc87183eeacbf596))

### Bug Fixes

- **ci:** include nested example app in workspace and render flow ([ab5a2fb](https://github.com/Takamasa045/remotion-studio-monorepo/commit/ab5a2fbc542b73d62fa19bb22760d7aafa8f19d5))
- **ci:** parse remotion composition list safely ([bf6c6ba](https://github.com/Takamasa045/remotion-studio-monorepo/commit/bf6c6ba377d18b85984cdaf6c897f805d6f22985))
- **ci:** skip studio dashboard in render workflow ([158ec65](https://github.com/Takamasa045/remotion-studio-monorepo/commit/158ec651494495947ddd22c7c84ea19ada28be50))
- **ci:** skip studio dashboard in render workflow ([ca83c6c](https://github.com/Takamasa045/remotion-studio-monorepo/commit/ca83c6c78b6834ad6232b23da7d8ab7f39387782))
- correct pnpm catalog syntax and run install ([17281d8](https://github.com/Takamasa045/remotion-studio-monorepo/commit/17281d88dd00b1b73b17d9369d62767040d966d5))
- **deps:** allow protobufjs build scripts ([4613734](https://github.com/Takamasa045/remotion-studio-monorepo/commit/4613734b40b9c1332333ae4b961bad303ce72f6a))
- **deps:** allow protobufjs build scripts ([e91891b](https://github.com/Takamasa045/remotion-studio-monorepo/commit/e91891b7321a233da25f1ca95326ffef6e5e4a91))
- remove invalid BufferAttribute.dispose() calls and unused vars ([4b213e9](https://github.com/Takamasa045/remotion-studio-monorepo/commit/4b213e97103658ed363552352fc7316446337a36))
- resolve conflicts for pr4 ([d467cf7](https://github.com/Takamasa045/remotion-studio-monorepo/commit/d467cf7dce93cfe3679faab66005c9397a29481a))

### Performance Improvements

- optimize render-demo filtering and remove any cast ([67ad08d](https://github.com/Takamasa045/remotion-studio-monorepo/commit/67ad08d4f43949a256c2f6d88b2394c3c9f5a3ba))

### Code Refactoring

- brush up shared utility packages ([c08b92e](https://github.com/Takamasa045/remotion-studio-monorepo/commit/c08b92edc34f249394c91804ea0bb435b2038f40))
- brush up shared utility packages ([8c7675c](https://github.com/Takamasa045/remotion-studio-monorepo/commit/8c7675cf1aae893a2d1449f26cc8131dabbd3688))
- introduce LinkedParticles scene manager ([e58fed3](https://github.com/Takamasa045/remotion-studio-monorepo/commit/e58fed3ac876465546e990df6450bebf2a008f0e))
- Remotion repo cleanup and docs ([fa9edcd](https://github.com/Takamasa045/remotion-studio-monorepo/commit/fa9edcd67cf24d8fc90e3a9503f1c16012fa3edd))

### Documentation

- add 3-command Quick Start with bash highlighting (JA/EN) for better visibility ([b20f408](https://github.com/Takamasa045/remotion-studio-monorepo/commit/b20f408a643d736e2f78b38dc673e241a444f8cf))
- add asset directory guidance for new apps (public/assets/images|audio|video) and sync-assets usage ([12679ff](https://github.com/Takamasa045/remotion-studio-monorepo/commit/12679ff692ff782eade21f7f4831f4ccc51847eb))
- add Japanese versions of documentation and update links in README.ja.md ([e186993](https://github.com/Takamasa045/remotion-studio-monorepo/commit/e186993c8a4e4fa28de56c716336bee34adf6706))
- add licensing and docs notes + disclaimers per request ([adfe793](https://github.com/Takamasa045/remotion-studio-monorepo/commit/adfe793a321471f4a332d77f895567f70f4c2dad))
- add module selection guide ([2233775](https://github.com/Takamasa045/remotion-studio-monorepo/commit/223377560a6603d0df454244ce739d5905b98c6d))
- add pnpm Catalog documentation to README (EN/JA) ([ed58937](https://github.com/Takamasa045/remotion-studio-monorepo/commit/ed58937d4ff7488650590a163862466b4b81dac3))
- add R3F/@remotion/three/[@drei](https://github.com/drei) installation notes and version hint ([111b41e](https://github.com/Takamasa045/remotion-studio-monorepo/commit/111b41efab15e0c917f387b7818e2cac2777477c))
- add README hero image and insert into JA/EN ([787d957](https://github.com/Takamasa045/remotion-studio-monorepo/commit/787d957ab9d96678b6f17f4616176a231ffa28dc))
- add remotion reference digest and mcp setup ([ff09512](https://github.com/Takamasa045/remotion-studio-monorepo/commit/ff09512e660cec5c5eeec0aed6dccefef47520d2))
- add top-level README with setup, scripts, and package map ([96037f2](https://github.com/Takamasa045/remotion-studio-monorepo/commit/96037f2c0b28f5c6f8b8ff21a139b5d1af01cc89))
- center Quick Start on 'pnpm create:project' (JA/EN); keep sparse as optional later step ([d995f1e](https://github.com/Takamasa045/remotion-studio-monorepo/commit/d995f1e686ef61448285c582e13778ce0db455cf))
- change language switcher label to EN | JA ([d131f78](https://github.com/Takamasa045/remotion-studio-monorepo/commit/d131f78feb397b59fb3ff99fbbafb4269121cc7f))
- **ja:** fix use-cases to match minimal template and official packages; pin @remotion/three@4.0.351 ([85008d9](https://github.com/Takamasa045/remotion-studio-monorepo/commit/85008d9a5ca51fda6edef096a0424a29be4a92ed))
- **license:** add disclaimers (EN/JA) clarifying templates-only and Remotion installation ([dcc6167](https://github.com/Takamasa045/remotion-studio-monorepo/commit/dcc616749d848461b787751f10531ed91e0864c8))
- mention 3D-template as included in public apps; update submodule pointer ([2754594](https://github.com/Takamasa045/remotion-studio-monorepo/commit/27545944fcc872b5f548a17258479dbcec2bbf9d))
- overhaul README with commands, runners, packages, and troubleshooting ([914b666](https://github.com/Takamasa045/remotion-studio-monorepo/commit/914b66608558b80eea989b531e048f0e3326f03a))
- README reflects apps-public now includes only \_template and demo-showcase; update submodule pointer ([a14f64c](https://github.com/Takamasa045/remotion-studio-monorepo/commit/a14f64cc39d44a802d87121994b64b2215fdc679))
- **readme:** add Quickstart; run pnpm dev in app dir; move scripts/docs to bottom; clarify Composition ID default ([afcf475](https://github.com/Takamasa045/remotion-studio-monorepo/commit/afcf4755cbc5c97f20a7eab72cc0ca888f237e64))
- **readme:** clarify structure vs. workspace-wide [@remotion](https://github.com/remotion) deps (JA/EN) ([5589c17](https://github.com/Takamasa045/remotion-studio-monorepo/commit/5589c17a9c5a4e6f301346b1357619c5ab78560e))
- **readme:** consolidate Quickstart + common commands into 使い方; rewrite MCP setup for Claude Code and Codex CLI ([1b17014](https://github.com/Takamasa045/remotion-studio-monorepo/commit/1b170140cc7399fcd5903d2f282e5bafbe75f67a))
- **README:** remove doc/license notes section; now centralized in docs/remotion-reference.md ([4dc7765](https://github.com/Takamasa045/remotion-studio-monorepo/commit/4dc7765e3faa330cd90665497a39605db55ba9f4))
- **README:** remove studio-lite entry from structure ([8a8f8fa](https://github.com/Takamasa045/remotion-studio-monorepo/commit/8a8f8fa63aad7aee620600150069cf4e9a0e8492))
- recommend remotion best practices skill ([af230b1](https://github.com/Takamasa045/remotion-studio-monorepo/commit/af230b17186d64857169df2f56c58f0a5b718d17))
- refactor READMEs (dedupe quickstart, tidy features, add sparse checkout guidance) ([a4681e7](https://github.com/Takamasa045/remotion-studio-monorepo/commit/a4681e77922dbe987ea604e868815beaa6877583))
- **remotion-reference:** make it link-first; replace excerpts with minimal summaries + citations (companies.remotion.dev) ([b2609eb](https://github.com/Takamasa045/remotion-studio-monorepo/commit/b2609ebc22590123a49aa78bb86dda3b57fa3682))
- **remotion-reference:** remove link-first/license notes; add disclaimers (EN/JA) as requested ([870acbd](https://github.com/Takamasa045/remotion-studio-monorepo/commit/870acbdaeaa9f1e92df6d2a5eb023b7d9337de37))
- remove forge launch from readme ([52e0845](https://github.com/Takamasa045/remotion-studio-monorepo/commit/52e0845ee8680c0a8379817b8b86b181e37088f8))
- remove README disclaimer snippet per request; keep doc/license notes only ([c513748](https://github.com/Takamasa045/remotion-studio-monorepo/commit/c513748ccbbd70c3fb563c90a7d8bb2f30c06d8d))
- remove redundant 3D caution; rely on existing 3D/R3F guide ([ea473f3](https://github.com/Takamasa045/remotion-studio-monorepo/commit/ea473f343a983a5e4f903879b0475e193b835341))
- rename Quick Start sections (JA/EN) to Shortest Guide / Full Setup with one-line purpose notes ([af17a12](https://github.com/Takamasa045/remotion-studio-monorepo/commit/af17a12be95d729c2746c2cd34bde8956419a0f9))
- simplify clone instructions (SSH only), drop demo usage; default to \_template + 3D-template; update sparse script/docs; workspace now excludes demo ([accb7d0](https://github.com/Takamasa045/remotion-studio-monorepo/commit/accb7d015f0ddd6817a3d6a3a61f8d46a991b5bd))
- simplify README and reorganize documentation ([87ae080](https://github.com/Takamasa045/remotion-studio-monorepo/commit/87ae0806b13fcecc2db9cd11b1e2e2b7be06bbdc))
- slim README (JA/EN) by moving details to docs/\*.md; link to Assets/3D/Deps/MCP/Structure ([db9edb0](https://github.com/Takamasa045/remotion-studio-monorepo/commit/db9edb084dba82198430c8187b584794ecaa74cc))
- standardize LRC placement next to audio (assets/audio/song.mp3 & song.lrc) with examples ([5c052d9](https://github.com/Takamasa045/remotion-studio-monorepo/commit/5c052d953e351078614290e1f4211fa2af91605e))
- tweak remotion-reference note wording per request ([2efaebd](https://github.com/Takamasa045/remotion-studio-monorepo/commit/2efaebd0e855b4b673fea742c75102d0ba982c60))
- クイックスタートとサブモジュール手順を追記（日本語）\n\n- clone + submodules セットアップ\n- pnpm/Node/ffmpeg 前提と確認\n- デモ起動・ビルド、新規テンプレ生成\n- サブモジュール/ffmpeg/Node などのトラブル対処 ([977523f](https://github.com/Takamasa045/remotion-studio-monorepo/commit/977523f851262a66905dc22efa3fdeedfd873437))

### Miscellaneous

- vendorize apps (drop submodule); remove sparse script; simplify README clone/setup (no submodules) ([c41b1a5](https://github.com/Takamasa045/remotion-studio-monorepo/commit/c41b1a546540d45013fa4ca0f788a44b4cd4aa25))

## [0.1.2] - 2026-04-11

Brush-up pass on the shared utility packages under `packages/@studio/*`:
deduplicate types, reuse logic across packages, fix a handful of small bugs,
and add the missing `@studio/hooks` test suite so the general-purpose utility
layer has a single source of truth.

### Added

- `@studio/timing`: optional `label?: string` field on `TimingSegment`.
- `@studio/timing`: regression test covering zero-length ranges in `getProgress`.
- `@studio/hooks`: 32 new unit tests covering every hook module, with mocked
  Remotion `useCurrentFrame` / `useVideoConfig`.
- `@studio/hooks`: `test` / `test:watch` npm scripts.
- `@studio/easings`: `Number.isFinite` validation on `cubicBezier` control
  points so `NaN` inputs fail fast instead of looping.

### Changed

- `@studio/core-types`: `EasingFunction` and `TimingSegment` are now type
  re-exports from their owning packages (`@studio/easings`, `@studio/timing`)
  instead of duplicate local definitions. Consumers see the same types.
- `@studio/hooks`: `useFrameProgress`, `useTimeProgress`, `useVideoProgress`,
  `useSegment`, `useActiveSegment`, and `useDelayedMountByTime` now delegate
  to `@studio/timing`'s `getProgress` / `isInSegment` / `getLocalFrame` /
  `secondsToFrames`. Single source of truth for the math.
- `@studio/hooks`: `SegmentConfig` is now a back-compat type alias for
  `TimingSegment` from `@studio/timing`.
- `@studio/easings`: `cubicBezier` no longer has the stale "binary search"
  comment on the Newton–Raphson loop; `sampleCurveX/Y` drop their dead
  `(1 - t)^3 * 0` and `t^3 * 1` terms.

### Fixed

- `@studio/hooks`: `useSegment` now returns `progress: 0` before the segment
  starts and `progress: 1` after it ends (previously returned `0` in both
  cases, making the value ambiguous without also checking `isActive`).
- `@studio/hooks`: `useSegment` handles zero-duration segments without
  emitting `NaN`.

### Removed / Breaking

These are breaking at the source level but do not affect any current
consumer in this repository (the only in-tree consumer is
`apps/examples/animations-showcase`, which uses neither signature).

- `@studio/timing`: `clampFrame(frame, min, max)` both positional arguments
  are required. Previously `min` had a default of `0` while `max` was still
  required, which made the default unusable.
- `@studio/hooks`: `useDelayedMountByTime(startSeconds)` no longer takes an
  `fps` argument. `fps` is read from `useVideoConfig()`, matching the style
  of `useTimeProgress`.
- `@studio/easings`: the first parameter of `steps()` was renamed from
  `steps` to `stepCount` to stop shadowing the outer function name. Callers
  that pass positionally are unaffected; named-argument callers (if any)
  must update.

### Verification

- `pnpm test` — 58 passing (32 new + 26 existing).
- `pnpm typecheck` — 10/10 turbo tasks.
- `pnpm build:packages` — all 5 packages build.
- `apps/examples/animations-showcase` compiles cleanly.

## [0.1.1] - 2026-04-08

### Changed

- Forge Studio dashboard UX refresh:
  - Reorganized project cards around one primary action.
  - Moved heavy operations into a side control panel.
  - Simplified the header and added Japanese / English toggle.
  - Added a short getting-started guide for first-time use.
  - Updated README docs for the new Studio flow.

[0.1.2]: https://github.com/Takamasa045/remotion-studio-monorepo/releases/tag/v0.1.2
[0.1.1]: https://github.com/Takamasa045/remotion-studio-monorepo/releases/tag/v0.1.1
