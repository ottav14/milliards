export const lerp = (a: number, b: number, t: number) => {
    return (1-t)*a + t*b;
}

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}
