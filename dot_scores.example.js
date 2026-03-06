import bin from "./dot_scores_simd.wasm.js";
import { normalizeVector } from "./normalizeVector.js";
import { allocateMemory } from "./allocateMemory.js";

const { instance } = await WebAssembly.instantiate(bin, {});
const { memory, dot_scores_simd } = instance.exports;
//  (param $emb i32) (param $q i32) (param $N i32) (param $D i32) (param $out i32)
const n = 10;
const d = 4;
const sizeoff32 = 4;
const emblen = n * d * sizeoff32;
const qlen = d * sizeoff32;
const outlen = n * sizeoff32;
const totallen = emblen + qlen + outlen;
allocateMemory(memory, totallen);

const data = new Float32Array(memory.buffer);

// emb
for (let i = 0; i < n; i++) {
  const vec = new Float32Array(d);
  for (let j = 0; j < d; j++) {
    vec[j] = i + j;
  }
  normalizeVector(vec);
  data.set(vec, i * d);
}

// q
const vec = new Float32Array(d);
for (let i = 0; i < d; i++) {
  vec[i] = 5 + i;
}
normalizeVector(vec);
data.set(vec, n * d);

for (let i = 0; i < n * d; i++) console.log(i, data[i])
dot_scores_simd(0, emblen, n, d, emblen + qlen);
console.log("result");
for (let i = 0; i < n; i++) {
  console.log(data[(emblen + qlen) / sizeoff32 + i]);
}
