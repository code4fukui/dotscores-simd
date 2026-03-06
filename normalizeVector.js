export const normalizeVector = (v) => {
  let s = 0;
  for (let i = 0; i < v.length; i++) {
    s += v[i] * v[i];
  }
  const n = Math.sqrt(s)
  if (n) {
    for (let i = 0; i < v.length; i++) {
      v[i] /= n;
    }
  }
  return v;
};
