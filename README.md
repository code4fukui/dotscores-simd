# dotscores-simd

dotscores-simd is a library that uses WebAssembly SIMD to efficiently compute cosine similarity (dot products) between a query embedding vector and a large set of embedding vectors.

dotscores-simd は、クエリ埋め込みベクトルと多数の埋め込みベクトルのコサイン類似度（内積）を高速に計算するための WebAssembly SIMD を使ったライブラリです。

In vector search and embedding retrieval systems, it is necessary to compute dot products between a single query vector and thousands to millions of embedding vectors. When embedding vectors are L2-normalized, cosine similarity becomes equivalent to the dot product (cosine similarity = dot product). This allows similarity ranking to be computed efficiently using simple dot product calculations.

ベクトル検索や埋め込み検索システムでは、1つのクエリベクトルと数千〜数百万の埋め込みベクトルとの内積（dot product）を大量に計算する必要があります。埋め込みベクトルを L2正規化しておけば cosine similarity = dot product となるため、単純な内積計算だけで高速に類似度ランキングが計算できます。

This repository accelerates this core computation using WebAssembly SIMD (v128) and implements it in WAT (WebAssembly Text Format). It is a lightweight ES module for vector score computation that can be used in environments such as browsers and Deno.

このリポジトリでは、このコア計算を WebAssembly SIMD (v128) を使って高速化し、WAT（WebAssembly Text Format）で実装しています。ブラウザ、Denoなどの環境で利用できる、軽量なベクトルスコア計算ESモジュールです。

## usage

```js
import { DotScores } from "https://code4fukui.github.io/dotscore-simd/DotScores.js";

const n = 10;
const d = 4;

// emb
const emb = [];
for (let i = 0; i < n; i++) {
  const vec = new Array(d);
  for (let j = 0; j < d; j++) {
    vec[j] = i + j;
  }
  emb.push(vec);
}

const dots = await DotScores.create(emb);

// q
const qvec = new Array(d);
for (let i = 0; i < d; i++) {
  qvec[i] = 3 + i;
}

const res = dots.search(qvec, 3);
console.log(res);
```

## complie

```sh
wat2wasm dot_scores_simd.wat -o dot_scores_simd.wasm
deno run -A https://code4fukui.github.io/bin2js/bin2js.js dot_scores_simd.wasm
```
