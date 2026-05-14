# dotscores-simd

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

dotscores-simd is a WebAssembly SIMD library for efficiently computing cosine similarity between a query vector and a large set of embedding vectors. It is designed for use in modern browsers and Deno.

## Features

-   **High-Performance:** Accelerates dot product calculations using WebAssembly SIMD (128-bit).
-   **Cosine Similarity:** Automatically performs L2 normalization on all input vectors to compute cosine similarity.
-   **Modern & Lightweight:** A simple ES module that runs in browsers and Deno.
-   **Transparent:** Implemented directly in WAT (WebAssembly Text Format) for performance and clarity.

## Usage

```js
import { DotScores } from "~~https://code4fukui.github.io/dotscore-simd/DotScores.js~~ *(unavailable)*";

// A dataset of 10 vectors, each with 4 dimensions
const n = 10;
const d = 4;

// Generate sample embeddings
const embeddings = Array.from({ length: n }, (_, i) =>
  Array.from({ length: d }, (_, j) => i + j)
);

const dots = await DotScores.create(embeddings);

// Define a query vector
const queryVector = Array.from({ length: d }, (_, i) => 3 + i);

// Find the top 3 most similar vectors
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

Asynchronously creates and initializes a `DotScores` instance.

-   **`embeddings`**: `number[][]` - An array of embedding vectors to be searched.
-   **Constraint**: All vectors must have the same dimension (`d`), and `d` **must be a multiple of 4**.
-   **Returns**: `Promise<DotScores>`

### `instance.search(queryVector, topK = 5)`

Searches the loaded embeddings for vectors most similar to the query vector.

-   **`queryVector`**: `number[]` - The query vector. Must have the same dimension `d` as the embeddings.
-   **`topK`**: `number` (optional, default: `5`) - The number of top results to return.
-   **Returns**: `Array<{idx: number, score: number}>` - An array of result objects, sorted by score in descending order. `idx` is the original index of the vector in the `embeddings` array.

## Build

To build the WebAssembly module from the `.wat` source file:

```sh
# Convert WAT to WASM
wat2wasm dot_scores_simd.wat -o dot_scores_simd.wasm

# Convert the binary WASM to a JavaScript module
deno run -A https://code4fukui.github.io/bin2js/bin2js.js dot_scores_simd.wasm
```

## License

MIT License — see [LICENSE](LICENSE).