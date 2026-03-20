# data-anim Inspector — Spec

## Overview

data-anim Inspector は、任意の Web ページ上で要素をクリックし、data-anim のアニメーションをインタラクティブに試せるツール。スタンドアロンスクリプトと Chrome 拡張の 2 形式で配布する。

## 配布形式

### スタンドアロンスクリプト

- `<script src="data-anim-inspector.min.js"></script>` で任意のページに追加
- 画面右下にトグルボタン（48px 円形）を表示
- クリックで Inspector の有効/無効を切り替え

### Chrome 拡張 (Manifest V3)

- ツールバーアイコンのクリックで有効/無効を切り替え
- `activeTab` + `scripting` 権限で content script を注入
- バッジで ON/OFF 状態を表示
- タブ遷移・タブ閉じで自動クリーンアップ

## 機能一覧

### 要素選択

- ページ上の要素をクリックして選択（オレンジ枠）
- ホバー中の要素をブルー枠でハイライト
- 同じ要素を再クリックで選択解除
- Inspector UI 上のクリックはページに伝播しない

### マルチセレクト

- ツールバーのグリッドアイコンで ON/OFF 切り替え
- ON 時：要素をクリックで追加/削除（グリーン枠）
- 選択中の要素数をパネルに表示
- アニメーション適用時に全選択要素へ一括適用

### アニメーションプレビュー

- パネル上部にプレビューボックス（44x44px パープルグラデーション）
- アニメーションボタンにホバーするとプレビューボックスでアニメーション再生
- 現在の Duration / Easing 設定を反映

### アニメーション適用

- ボタンクリックで選択要素に `data-anim`, `data-anim-duration`, `data-anim-easing` 属性をセット
- `requestAnimationFrame` でアニメーションを再生
- 適用済み要素は `appliedElements` で追跡

### 適用済みオーバーレイ

- 適用済み要素に紫の破線アウトラインとアニメーション名バッジを表示
- 目アイコンで表示/非表示を切り替え
- スクロール追従

### Replay All

- ツールバー上部に配置
- 適用済みの全要素のアニメーションを一括再生
- 適用数をカウント表示

### Clear All

- ゴミ箱アイコンで全要素のアニメーションを一括解除
- `data-anim` 属性とインラインスタイルを削除

### Remove from this element

- 選択中の要素からアニメーションを解除
- 未適用時は disabled 状態で常時表示

### Duration / Easing 設定

- Duration: 400ms, 600ms, 800ms (default), 1000ms, 1200ms, 1600ms, 2000ms
- Easing: ease (default), ease-out-expo, ease-out-back, spring

### HTML Attributes コード生成

- 適用中のアニメーション設定を `data-anim="..."` 形式で表示
- デフォルト値は省略（duration=800ms, easing=ease）
- Copy ボタンでクリップボードにコピー
- 未選択時はプレースホルダーを表示

### ツールバーアイコン

各アイコンボタンにホバー時 tooltip を表示:

| アイコン | 機能 | tooltip |
|---------|------|---------|
| グリッド | マルチセレクト切替 | Multi-select |
| ゴミ箱 | 全アニメーション解除 | Clear all |
| 目 | オーバーレイ表示切替 | Show/Hide overlays |

### ロゴ / ブランディング

- ヘッダーに data-anim の SVG ロゴを表示
- クリックで https://ryo-manba.github.io/data-anim/ を新規タブで開く

## 対応アニメーション (30 種)

| カテゴリ | アニメーション |
|---------|-------------|
| Fade | fadeIn, fadeOut, fadeInUp, fadeInDown, fadeInLeft, fadeInRight |
| Slide | slideInUp, slideInDown, slideInLeft, slideInRight |
| Zoom | zoomIn, zoomOut, zoomInUp, zoomInDown |
| Bounce | bounce, bounceIn, bounceInUp, bounceInDown |
| Attention | shake, pulse, wobble, flip, swing, rubberBand |
| Rotate | rotateIn, rotateInDownLeft, rotateInDownRight |
| Special | blur, clipReveal, typewriter |

## Easing プリセット

| 名前 | 値 |
|-----|---|
| ease | cubic-bezier(0.25, 0.1, 0.25, 1) |
| ease-out-expo | cubic-bezier(0.16, 1, 0.3, 1) |
| ease-out-back | cubic-bezier(0.34, 1.56, 0.64, 1) |
| spring | cubic-bezier(0.175, 0.885, 0.32, 1.275) |

## CSS カスタムプロパティ

- `--da-distance`: fade/zoom 系の移動距離 (default: 30px)

## ビルド

```bash
pnpm build          # スタンドアロン + 拡張両方
pnpm build:script   # スタンドアロンのみ
pnpm build:extension # 拡張のみ
pnpm dev            # watch モード
```

### 出力

- `dist/data-anim-inspector.min.js` — スタンドアロンスクリプト (IIFE)
- `extension/content.js` — Chrome 拡張用 content script (IIFE)

## 技術仕様

- TypeScript (ES2020, strict mode)
- Vite 8 (rolldown)
- ランタイム依存: なし
- z-index: 2147483644 〜 2147483647 (最上位レイヤー)
- `pointer-events: none` で UI オーバーレイがページ操作を妨げない
- Capture phase イベントリスナーでページのクリックイベントを制御
