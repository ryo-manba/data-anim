# data-anim

HTMLの属性だけでアニメーションを追加できるライブラリ。

## 仕様書

すべての仕様書は `spec/` ディレクトリにある。実装前に必ず読むこと。

- `spec/data-anim-spec-v2.md` — ライブラリ本体のAPI仕様（全属性、全アニメーション、Anti-FOUC、トリガー仕様）
- `spec/docs-site-spec.md` — ドキュメントサイトの設計仕様
- `spec/sample-lp-spec.md` — サンプルLPの設計仕様
- `spec/agent-tasks.md` — エージェント間のタスク分割、依存関係、リポジトリ構造、命名規則

## 実装プロンプト

- `spec/prompts/agent-a-core.md` — Core Library 実装の詳細指示
- `spec/prompts/agent-b-docs.md` — Documentation Site 実装の詳細指示
- `spec/prompts/agent-c-lp.md` — Sample LP 実装の詳細指示

## リポジトリ構造（目標）

```
data-anim/
├── src/                    # Core Library ソース
├── dist/                   # ビルド成果物
├── docs/                   # Astro ドキュメントサイト
├── examples/               # サンプルLP (index.html)
├── tests/                  # テスト
├── spec/                   # 仕様書（読み取り専用）
├── package.json
├── README.md
├── LICENSE
└── CLAUDE.md               # 本ファイル
```
