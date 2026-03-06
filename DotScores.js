import bin from "./dot_scores_simd.wasm.js";
import { normalizeVector } from "./normalizeVector.js";
import { allocateMemory } from "./allocateMemory.js";

export class DotScores {
  static async create(emb) {
    const { instance } = await WebAssembly.instantiate(bin, {});
    return new DotScores(instance, emb);
  }
  constructor(instance, emb) {
    if (!emb || !emb.length || emb[0].length % 4 != 0) throw new Error("emb[n].length % 4 must be 0");
    const { memory, dot_scores_simd } = instance.exports;
    const n = emb.length;
    const d = emb[0].length;
    const sizeoff32 = 4;
    const emblen = n * d * sizeoff32;
    const qlen = d * sizeoff32;
    const outlen = n * sizeoff32;
    const totallen = emblen + qlen + outlen;
    allocateMemory(memory, totallen);
    const data = new Float32Array(memory.buffer);

    // emb
    for (let i = 0; i < n; i++) {
      const e = emb[i];
      if (!e || e.length != d) throw new Error("illegal length emb[" + i + "]");
      const vec = new Float32Array(d);
      for (let j = 0; j < d; j++) {
        vec[j] = e[j];
      }
      normalizeVector(vec);
      data.set(vec, i * d);
    }

    this.emb = emb;
    this.n = n;
    this.d = d;
    this.data = data;
    this.sizeoff32 = sizeoff32;
    this.emblen = emblen;
    this.qlen = qlen;
    this.outlen = outlen;
    this.totallen = totallen;
    this.dot_scores_simd = dot_scores_simd;
    this.memory = memory;
  }
  search(qvec, topk = 5) {
    const n = this.n;
    const d = this.d;
    const data = this.data;
    if (!qvec || qvec.length != d) throw new Error("qvec.length must be d");
    const vec = new Float32Array(d);
    for (let i = 0; i < d; i++) {
      vec[i] = qvec[i];
    }
    normalizeVector(vec);
    data.set(vec, n * d);

    //  (param $emb i32) (param $q i32) (param $N i32) (param $D i32) (param $out i32)
    this.dot_scores_simd(0, this.emblen, n, d, this.emblen + this.qlen);

    const res = new Array(topk);
    const off = (this.emblen + this.qlen) / this.sizeoff32;
    for (let i = 0; i < n; i++) {
      res.push({ idx: i, score: data[off + i] });
    }
    res.sort((a, b) => b.score - a.score);
    res.length = topk;
    return res;
  }
};
