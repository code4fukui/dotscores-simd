export const allocateMemory = (memory, need)  => {
  const pagesNeeded = Math.ceil(need / 65536);
  const curPages = memory.buffer.byteLength / 65536;
  if (pagesNeeded > curPages) memory.grow(pagesNeeded - curPages);
};
