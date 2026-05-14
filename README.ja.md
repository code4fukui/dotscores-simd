# dotscores-simd

dotscores-simd は、クエリベクトルと多数の埋め込みベクトル（エンベディング）間のコサイン類似度を効率的に計算するための WebAssembly SIMD ライブラリです。モダンブラウザおよび Deno での利用を想定して設計されています。

## 特徴

- **ハイパフォーマンス:** WebAssembly SIMD (128-bit) を使用して内積計算を高速化します。
- **コサイン類似度:** すべての入力ベクトルに対して自動的に L2 正規化を行い、コサイン類似度を計算します。
- **モダン & 軽量:** ブラウザおよび Deno で動作するシンプルな ES モジュールです。
- **透明性:** パフォーマンスと可読性のため、直接 WAT (WebAssembly Text Format) で実装されています。

## 使い方

```js
import { DotScores } from "~~https://code4fukui.github.io/dotscore-simd/DotScores.js~~ *(unavailable)*";

// 10個のベクトル（各4次元）からなるデータセット
const n = 10;
const d = 4;

// サンプルの埋め込みベクトルを生成
const embeddings = Array.from({ length: n }, (_, i) =>
  Array.from({ length: d }, (_, j) => i + j)
);

const dots = await DotScores.create(embeddings);

// クエリベクトルを定義
const queryVector = Array.from({ length: d }, (_, i) => 3 + i);

// 類似度が高い上位3つのベクトルを検索
const results = dots.search(queryVector, 3);

console.log(results);
/*
[
  { idx: 3, score: 0.999043345451355 },
  { idx: 4, score: 0.9938837289810181 },
  { idx: 2, score: 0.9922778606414795 }
]
*/
```

## API

### `DotScores.create(embeddings)`

`DotScores` インスタンスを非同期で作成・初期化します。

- **`embeddings`**: `number[][]` - 検索対象となる埋め込みベクトルの配列。
- **制約**: すべてのベクトルは同じ次元数 (`d`) を持つ必要があり、`d` は **4の倍数**でなければなりません。
- **戻り値**: `Promise<DotScores>`

### `instance.search(queryVector, topK = 5)`

読み込まれた埋め込みベクトルの中から、クエリベクトルに最も類似したベクトルを検索します。

- **`queryVector`**: `number[]` - クエリベクトル。`embeddings` と同じ次元数 `d` を持つ必要があります。
- **`topK`**: `number` (オプション、デフォルト: `5`) - 取得する上位結果の件数。
- **戻り値**: `Array<{idx: number, score: number}>` - スコアの降順でソートされた結果オブジェクトの配列。`idx` は `embeddings` 配列における元のインデックスです。

## ビルド

`.wat` ソースファイルから WebAssembly モジュールをビルドする方法:

```sh
# WAT を WASM に変換
wat2wasm dot_scores_simd.wat -o dot_scores_simd.wasm

# バイナリの WASM を JavaScript モジュールに変換
deno run -A https://code4fukui.github.io/bin2js/bin2js.js dot_scores_simd.wasm
```

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
