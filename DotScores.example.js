import { DotScores } from "./DotScores.js";

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
