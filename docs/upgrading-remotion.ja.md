# Remotion依存関係のアップグレード

このリポジトリ内のすべてのアプリとテンプレートは、同じ `remotion` / `@remotion/*` バージョンセットに依存しています。これらのバージョンを揃えることで、不可解なランタイムやレンダリングの問題を回避できます。

## 1つのコマンド

```bash
pnpm upgrade:remotion
```

このスクリプトは：

1. 最新の公開されている `remotion` バージョン（または指定したバージョン）を解決します。
2. `pnpm-workspace.yaml` の `catalog` にある `remotion` と `@remotion/*` を更新します。
3. 可能な場合、ワークスペース配下の `package.json` は `catalog:` を参照するように揃えます。
4. `pnpm install` を実行して `pnpm-lock.yaml` を更新します。

## オプション

| フラグ                                 | 説明                                                          |
| -------------------------------------- | ------------------------------------------------------------- |
| `pnpm upgrade:remotion --dry-run`      | ファイルに触れずに、変更されるパッケージを表示します。        |
| `pnpm upgrade:remotion 4.0.373`        | 特定のバージョンを強制します。                                |
| `pnpm upgrade:remotion --tag canary`   | dist-tag（例：`beta`、`canary`）を解決します。                |
| `pnpm upgrade:remotion --skip-install` | 最後の `pnpm install`（ロックファイル更新）をスキップします。 |

## アップグレード後

- `package.json` の変更と `pnpm-lock.yaml` をコミットします。
- 新しいアプリを構築する際は `pnpm create:project` を再実行してください — スキャフォルダーは自動的にリポジトリルートからRemotionバージョンを同期するため、すべての新しいアプリがアップグレードされたツールチェーンと一致します。

このテンプレートからスキャフォールドされた下流のリポジトリを管理している場合は、そこでも同じスクリプトを再実行して最新の状態を保ってください。
